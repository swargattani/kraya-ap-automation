import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { dbConnect } from '../../../lib/mongodb';
import Invoice from '../../../models/Invoice';
import Vendor from '../../../models/Vendor';
import { parseInvoiceText } from '../../../lib/parseInvoice';

export const config = { api: { bodyParser: false } };

async function extractText(filePath, mimeType) {
  if (mimeType === 'application/pdf') {
    try {
      const pdfParse = (await import('pdf-parse')).default;
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      return data.text;
    } catch {
      return '';
    }
  }

  // Image: use Tesseract
  try {
    const Tesseract = await import('tesseract.js');
    const worker = await Tesseract.createWorker('eng');
    const { data } = await worker.recognize(filePath);
    await worker.terminate();
    return data.text;
  } catch {
    return '';
  }
}

async function findOrCreateVendor(parsed) {
  if (!parsed.vendorGSTIN && !parsed.vendorName) return null;

  const filter = parsed.vendorGSTIN
    ? { gstin: parsed.vendorGSTIN }
    : { name: new RegExp('^' + parsed.vendorName + '$', 'i') };

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

  await dbConnect();

  const form = formidable({ maxFileSize: 20 * 1024 * 1024, keepExtensions: true });
  const [, files] = await form.parse(req);

  const file = Array.isArray(files.file) ? files.file[0] : files.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const rawText = await extractText(file.filepath, file.mimetype);
  const parsed = parseInvoiceText(rawText);

  // Reject obvious failures
  if (!parsed.invoiceNo && !parsed.irn && !parsed.totalAmount) {
    fs.unlinkSync(file.filepath);
    return res.status(422).json({
      error: 'Could not extract invoice data — try a cleaner scan or enter manually',
      raw: rawText.slice(0, 500),
    });
  }

  const vendor = await findOrCreateVendor(parsed);

  const invoiceData = {
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
  };

  const invoice = await Invoice.create(invoiceData);

  fs.unlinkSync(file.filepath);

  return res.status(201).json({ invoice, parsed });
}
