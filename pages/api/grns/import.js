import formidable from 'formidable';
import fs from 'fs';
import * as XLSX from 'xlsx';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import GRN from '../../../models/GRN';
import PO from '../../../models/PO';
import Invoice from '../../../models/Invoice';
import Vendor from '../../../models/Vendor';

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
      grnNo: findCol(headers, 'GRN No', 'GRNNo', 'GRN Number'),
      poNo: findCol(headers, 'PO No', 'PONo', 'PO Number'),
      invoiceNo: findCol(headers, 'Invoice No', 'InvoiceNo'),
      vendorName: findCol(headers, 'Vendor Name', 'VendorName', 'Vendor'),
      receivedDate: findCol(headers, 'Received Date', 'ReceivedDate', 'GRN Date', 'Date'),
      description: findCol(headers, 'Description', 'Item Description'),
      hsnCode: findCol(headers, 'HSN Code', 'HSN'),
      orderedQty: findCol(headers, 'Ordered Qty', 'OrderedQty', 'PO Qty'),
      receivedQty: findCol(headers, 'Received Qty', 'ReceivedQty'),
      acceptedQty: findCol(headers, 'Accepted Qty', 'AcceptedQty'),
      condition: findCol(headers, 'Condition'),
      remarks: findCol(headers, 'Remarks', 'Notes'),
    };

    // Group by GRN No
    const groups = {};
    for (const row of rows) {
      const grnNo = String(row[col.grnNo] || '').trim();
      if (!grnNo) continue;
      if (!groups[grnNo]) groups[grnNo] = [];
      groups[grnNo].push(row);
    }

    let imported = 0;
    const errors = [];

    for (const [grnNo, grnRows] of Object.entries(groups)) {
      try {
        const firstRow = grnRows[0];
        const poNo = String(firstRow[col.poNo] || '').trim();
        const invoiceNo = String(firstRow[col.invoiceNo] || '').trim();
        const vendorName = String(firstRow[col.vendorName] || '').trim();

        // Find linked PO & Invoice
        const companyFilter = companyId ? { companyId } : {};
        let poId = null;
        let vendorId = null;
        if (poNo) {
          const po = await PO.findOne({ poNo, ...companyFilter });
          if (po) { poId = po._id; vendorId = po.vendorId; }
        }
        let invoiceId = null;
        if (invoiceNo) {
          const inv = await Invoice.findOne({ invoiceNo, ...companyFilter });
          if (inv) invoiceId = inv._id;
        }

        // Find vendor if not from PO
        if (!vendorId && vendorName) {
          const vendor = await Vendor.findOne({
            name: new RegExp(`^${vendorName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
            ...companyFilter,
          });
          vendorId = vendor?._id;
        }

        // Parse received date
        let grnDate = null;
        const rawDate = firstRow[col.receivedDate];
        if (rawDate) {
          if (typeof rawDate === 'number') {
            const d = XLSX.SSF.parse_date_code(rawDate);
            grnDate = new Date(d.y, d.m - 1, d.d);
          } else {
            const d = new Date(rawDate);
            if (!isNaN(d)) grnDate = d;
          }
        }

        const items = grnRows.map(r => ({
          description: String(r[col.description] || '').trim(),
          hsnCode: String(r[col.hsnCode] || '').trim(),
          orderedQty: Number(r[col.orderedQty]) || 0,
          receivedQty: Number(r[col.receivedQty]) || 0,
          acceptedQty: Number(r[col.acceptedQty]) || 0,
          condition: String(r[col.condition] || 'good').toLowerCase(),
          remarks: String(r[col.remarks] || '').trim(),
        })).filter(i => i.description || i.receivedQty);

        await GRN.create({
          companyId,
          grnNo,
          grnDate,
          poId,
          invoiceId,
          vendorId,
          vendorName,
          items,
          status: 'draft',
        });
        imported++;
      } catch (e) {
        errors.push(`GRN ${grnNo}: ${e.message}`);
      }
    }

    return res.json({ imported, errors });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Import failed' });
  }
}
