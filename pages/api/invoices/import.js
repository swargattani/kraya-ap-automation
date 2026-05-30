import formidable from 'formidable';
import fs from 'fs';
import * as XLSX from 'xlsx';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import Invoice from '../../../models/Invoice';
import Vendor from '../../../models/Vendor';
import { autoMatchPO } from '../../../lib/autoMatch';

export const config = { api: { bodyParser: false } };

function normalize(key) {
  return String(key || '').toLowerCase().replace(/[\s_\-\/]/g, '');
}

function findCol(headers, ...candidates) {
  for (const c of candidates) {
    const norm = normalize(c);
    const h = headers.find(h => normalize(h) === norm);
    if (h) return h;
  }
  return null;
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

    const form = formidable({ maxFileSize: 10 * 1024 * 1024, keepExtensions: true });
    const [, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = XLSX.readFile(file.filepath);
    fs.unlinkSync(file.filepath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (!rows.length) return res.status(400).json({ error: 'Empty spreadsheet' });

    const headers = Object.keys(rows[0]);
    const col = {
      invoiceNo: findCol(headers, 'Invoice No', 'InvoiceNo', 'Invoice Number'),
      invoiceDate: findCol(headers, 'Invoice Date', 'InvoiceDate', 'Date'),
      vendorName: findCol(headers, 'Vendor Name', 'VendorName', 'Vendor'),
      vendorGSTIN: findCol(headers, 'Vendor GSTIN', 'VendorGSTIN', 'GSTIN'),
      poRef: findCol(headers, 'PO Ref', 'PORef', 'PO No', 'PO Number'),
      description: findCol(headers, 'Description', 'Item Description'),
      hsnCode: findCol(headers, 'HSN Code', 'HSN'),
      qty: findCol(headers, 'Qty', 'Quantity'),
      unit: findCol(headers, 'Unit'),
      rate: findCol(headers, 'Rate', 'Unit Rate'),
      amount: findCol(headers, 'Amount'),
      totalAmount: findCol(headers, 'Total Amount', 'TotalAmount', 'Invoice Total'),
    };

    // Group rows by Invoice No
    const groups = {};
    for (const row of rows) {
      const invNo = String(row[col.invoiceNo] || '').trim();
      if (!invNo) continue;
      if (!groups[invNo]) groups[invNo] = [];
      groups[invNo].push(row);
    }

    let imported = 0;
    let matched = 0;
    const errors = [];

    for (const [invoiceNo, invRows] of Object.entries(groups)) {
      try {
        const firstRow = invRows[0];
        const vendorName = String(firstRow[col.vendorName] || '').trim();
        const vendorGSTIN = String(firstRow[col.vendorGSTIN] || '').trim().toUpperCase();
        const poRef = String(firstRow[col.poRef] || '').trim();

        // Find or create vendor
        let vendor = null;
        if (vendorGSTIN || vendorName) {
          const vFilter = companyId ? { companyId } : {};
          if (vendorGSTIN) vFilter.gstin = vendorGSTIN;
          else vFilter.name = new RegExp(`^${vendorName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
          vendor = await Vendor.findOne(vFilter);
          if (!vendor) {
            vendor = await Vendor.create({ companyId, name: vendorName || 'Unknown', gstin: vendorGSTIN });
          }
        }

        const items = invRows.map(r => {
          const qty = Number(r[col.qty]) || 0;
          const rate = Number(r[col.rate]) || 0;
          return {
            description: String(r[col.description] || '').trim(),
            hsnCode: String(r[col.hsnCode] || '').trim(),
            qty,
            unit: String(r[col.unit] || 'NOS').trim(),
            rate,
            amount: Number(r[col.amount]) || qty * rate,
          };
        }).filter(i => i.description || i.qty);

        // Parse date
        let invoiceDate = null;
        const rawDate = firstRow[col.invoiceDate];
        if (rawDate) {
          if (typeof rawDate === 'number') {
            const d = XLSX.SSF.parse_date_code(rawDate);
            invoiceDate = new Date(d.y, d.m - 1, d.d);
          } else {
            const d = new Date(rawDate);
            if (!isNaN(d)) invoiceDate = d;
          }
        }

        const subtotal = items.reduce((s, i) => s + i.amount, 0);
        const totalAmount = Number(firstRow[col.totalAmount]) || subtotal * 1.18;

        const invoiceData = {
          companyId,
          invoiceNo,
          invoiceDate,
          vendorId: vendor?._id,
          vendorName,
          vendorGSTIN,
          poRef,
          items,
          subtotal,
          totalAmount,
          netPayable: totalAmount,
          source: 'manual',
          status: 'pending',
          matchStatus: 'unmatched',
        };

        const invoice = await Invoice.create(invoiceData);
        imported++;

        // Try auto-match
        try {
          const matchResult = await autoMatchPO({ ...invoiceData, _id: invoice._id }, companyId);
          if (matchResult) matched++;
        } catch (_) { /* non-fatal */ }
      } catch (e) {
        errors.push(`Invoice ${invoiceNo}: ${e.message}`);
      }
    }

    return res.json({ imported, matched, errors });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Import failed' });
  }
}
