import formidable from 'formidable';
import fs from 'fs';
import { dbConnect } from '../../../lib/mongodb';
import Invoice from '../../../models/Invoice';
import Vendor from '../../../models/Vendor';
import { parseInvoiceText } from '../../../lib/parseInvoice';

export const config = { api: { bodyParser: false } };

async function extractText(filePath, mimeType) {
  if (mimeType === 'application/pdf') {
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

async function findOrCreateVendor(parsed) {
  if (!parsed.vendorGSTIN && !parsed.vendorName) return null;

  const filter = parsed.vendorGSTIN
    ? { gstin: parsed.vendorGSTIN }
    : { name: new RegExp('^' + parsed.vendorName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') };

  let vendor = await Vendor.findOne(filter);
  if (!vendor) {
    vendor = await Vendor.create({
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

  try {
    await dbConnect();

    const form = formidable({ maxFileSize: 20 * 1024 * 1024, keepExtensions: true });
    const [, files] = await form.parse(req);

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    let rawText = '';
    try {
      rawText = await extractText(file.filepath, file.mimetype);
    } catch (e) {
      fs.unlinkSync(file.filepath);
      return res.status(422).json({ error: `Text extraction failed: ${e.message}` });
    }

    const parsed = parseInvoiceText(rawText);

    if (!parsed.invoiceNo && !parsed.irn && !parsed.totalAmount) {
      fs.unlinkSync(file.filepath);
      return res.status(422).json({
        error: 'Could not extract invoice data — try a cleaner scan or enter manually',
        raw: rawText.slice(0, 500),
      });
    }

    const vendor = await findOrCreateVendor(parsed);

    const invoice = await Invoice.create({
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
      source: 'ocr',
      ocrRaw: rawText,
      ocrConfidence: parsed.confidence,
      fileName: file.originalFilename,
      status: 'pending',
      matchStatus: 'unmatched',
    });

    fs.unlinkSync(file.filepath);

    return res.status(201).json({ invoice, parsed });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Upload failed' });
  }
}
