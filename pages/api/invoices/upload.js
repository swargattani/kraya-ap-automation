import formidable from 'formidable';
import fs from 'fs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import Invoice from '../../../models/Invoice';
import Vendor from '../../../models/Vendor';
import { parseInvoiceText } from '../../../lib/parseInvoice';
import { autoMatchPO } from '../../../lib/autoMatch';

export const config = { api: { bodyParser: false } };

// Parse NIC / IRP e-invoice JSON directly into invoice fields — no OCR needed
function parseEInvoiceJSON(raw) {
  let obj;
  try { obj = JSON.parse(raw); } catch { return null; }

  // Handle both raw JSON and the signed payload wrapper { SignedInvoice: '...' }
  const data = obj.SignedInvoice ? (() => {
    try {
      const parts = obj.SignedInvoice.split('.');
      const payload = Buffer.from(parts[1], 'base64url').toString('utf8');
      return JSON.parse(payload);
    } catch { return null; }
  })() : obj;
  if (!data) return null;

  const doc    = data.DocDtls   || {};
  const seller = data.SellerDtls || {};
  const buyer  = data.BuyerDtls  || {};
  const val    = data.ValDtls    || {};
  const items  = (data.ItemList  || []).map(it => ({
    hsnCode:     String(it.HsnCd || ''),
    description: it.PrdDesc || '',
    qty:         Number(it.Qty)       || 0,
    unit:        it.Unit              || 'NOS',
    rate:        Number(it.UnitPrice) || 0,
    amount:      Number(it.TotAmt)    || 0,
  }));

  // Parse DD/MM/YYYY date
  let invoiceDate = null;
  if (doc.Dt) {
    const [d, m, y] = doc.Dt.split('/');
    const dt = new Date(`${y}-${m}-${d}`);
    if (!isNaN(dt)) invoiceDate = dt;
  }

  return {
    irn:           (obj.Irn || data.Irn || '').toLowerCase() || null,
    invoiceNo:     doc.No   || null,
    invoiceDate,
    vendorName:    seller.LglNm  || seller.TrdNm || null,
    vendorGSTIN:   seller.Gstin  || null,
    buyerGSTIN:    buyer.Gstin   || null,
    placeOfSupply: data.TranDtls?.Pos || null,
    poRef:         data.RefDtls?.InvRm || null,
    subtotal:      Number(val.AssVal)    || null,
    totalCGST:     Number(val.CgstVal)   || null,
    totalSGST:     Number(val.SgstVal)   || null,
    totalIGST:     Number(val.IgstVal)   || null,
    tds:           Number(val.TdsTcsVal) || null,
    totalAmount:   Number(val.TotInvVal) || null,
    netPayable:    Number(val.TotInvVal) || null,
    items,
    confidence:    90, // structured data — high confidence
    _source:       'json',
  };
}

async function extractText(filePath, mimeType, originalName) {
  const ext = (originalName || '').split('.').pop().toLowerCase();

  // Plain text
  if (mimeType === 'text/plain' || ext === 'txt') {
    return fs.readFileSync(filePath, 'utf8');
  }

  // HTML — strip tags
  if (mimeType === 'text/html' || ext === 'html' || ext === 'htm') {
    const html = fs.readFileSync(filePath, 'utf8');
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  // PDF
  if (mimeType === 'application/pdf' || ext === 'pdf') {
    // Use lib/pdf-parse.js directly to bypass the buggy index.js
    // that tries to read a test file from disk on serverless cold starts
    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  // Image: use Tesseract
  const Tesseract = await import('tesseract.js');
  const worker = await Tesseract.createWorker('eng');
  const { data } = await worker.recognize(filePath);
  await worker.terminate();
  return data.text;
}

async function findOrCreateVendor(parsed, companyId) {
  if (!parsed.vendorGSTIN && !parsed.vendorName) return null;

  const filter = { ...(companyId ? { companyId } : {}) };
  if (parsed.vendorGSTIN) {
    filter.gstin = parsed.vendorGSTIN;
  } else {
    filter.name = new RegExp('^' + parsed.vendorName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
  }

  let vendor = await Vendor.findOne(filter);
  if (!vendor) {
    vendor = await Vendor.create({
      companyId,
      name: parsed.vendorName || 'Unknown Vendor',
      gstin: parsed.vendorGSTIN || '',
    });
  }
  return vendor;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const companyId = session.user.companyId;

  try {
    await dbConnect();

    const form = formidable({ maxFileSize: 20 * 1024 * 1024, keepExtensions: true });
    const [, files] = await form.parse(req);

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const ext = (file.originalFilename || '').split('.').pop().toLowerCase();
    const isJSON = file.mimetype === 'application/json' || ext === 'json';

    let parsed;
    let rawText = '';

    if (isJSON) {
      const raw = fs.readFileSync(file.filepath, 'utf8');
      parsed = parseEInvoiceJSON(raw);
      if (!parsed) {
        fs.unlinkSync(file.filepath);
        return res.status(422).json({ error: 'Could not parse e-invoice JSON — expected NIC/IRP format' });
      }
      rawText = raw;
    } else {
      try {
        rawText = await extractText(file.filepath, file.mimetype, file.originalFilename);
      } catch (e) {
        fs.unlinkSync(file.filepath);
        return res.status(422).json({ error: `Text extraction failed: ${e.message}` });
      }

      parsed = parseInvoiceText(rawText);

      if (!parsed.invoiceNo && !parsed.irn && !parsed.totalAmount) {
        fs.unlinkSync(file.filepath);
        return res.status(422).json({
          error: 'Could not extract invoice data — try a cleaner scan or enter manually',
          raw: rawText.slice(0, 500),
        });
      }
    }

    const vendor = await findOrCreateVendor(parsed, companyId);

    const invoiceData = {
      companyId,
      irn: parsed.irn,
      invoiceNo: parsed.invoiceNo || `OCR-${Date.now()}`,
      invoiceDate: parsed.invoiceDate,
      vendorId: vendor?._id,
      vendorName: parsed.vendorName || vendor?.name,
      vendorGSTIN: parsed.vendorGSTIN,
      buyerGSTIN: parsed.buyerGSTIN,
      placeOfSupply: parsed.placeOfSupply,
      items: parsed.items,
      subtotal: parsed.subtotal,
      totalCGST: parsed.totalCGST,
      totalSGST: parsed.totalSGST,
      totalIGST: parsed.totalIGST,
      tds: parsed.tds,
      totalAmount: parsed.totalAmount,
      netPayable: parsed.netPayable,
      source: parsed._source === 'json' ? 'json' : 'ocr',
      ocrRaw: rawText,
      ocrConfidence: parsed.confidence,
      fileName: file.originalFilename,
      poRef: parsed.poRef,
      status: 'pending',
      matchStatus: 'unmatched',
    };

    const invoice = await Invoice.create(invoiceData);

    // Auto-match against open POs immediately after save
    let matchResult = null;
    try {
      matchResult = await autoMatchPO({ ...invoiceData, _id: invoice._id }, companyId);
    } catch (_) { /* non-fatal — invoice still saved */ }

    fs.unlinkSync(file.filepath);

    return res.status(201).json({
      invoice,
      parsed,
      autoMatch: matchResult ? {
        poNo: matchResult.po.poNo,
        hasMismatch: matchResult.hasMismatch,
        allExact: matchResult.allExact,
        lineCount: matchResult.lineMatches.length,
      } : null,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Upload failed' });
  }
}
