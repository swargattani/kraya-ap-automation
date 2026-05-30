import formidable from 'formidable';
import fs from 'fs';
import * as XLSX from 'xlsx';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import PO from '../../../models/PO';
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
      poNo: findCol(headers, 'PO No', 'PO Number', 'PONo', 'PO_No'),
      vendorName: findCol(headers, 'Vendor Name', 'VendorName', 'Vendor'),
      vendorGSTIN: findCol(headers, 'Vendor GSTIN', 'VendorGSTIN', 'GSTIN'),
      poDate: findCol(headers, 'PO Date', 'PODate', 'Date'),
      description: findCol(headers, 'Description', 'Item Description', 'Desc'),
      hsnCode: findCol(headers, 'HSN Code', 'HSN', 'HSNCode'),
      qty: findCol(headers, 'Qty', 'Quantity'),
      unit: findCol(headers, 'Unit', 'UOM'),
      rate: findCol(headers, 'Rate', 'Unit Rate', 'Price'),
      amount: findCol(headers, 'Amount', 'Total'),
    };

    // Group rows by PO No
    const groups = {};
    for (const row of rows) {
      const poNo = String(row[col.poNo] || '').trim();
      if (!poNo) continue;
      if (!groups[poNo]) groups[poNo] = [];
      groups[poNo].push(row);
    }

    let imported = 0;
    let skipped = 0;
    const errors = [];

    for (const [poNo, poRows] of Object.entries(groups)) {
      try {
        const firstRow = poRows[0];
        const vendorName = String(firstRow[col.vendorName] || '').trim();
        const vendorGSTIN = String(firstRow[col.vendorGSTIN] || '').trim().toUpperCase();

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

        const items = poRows.map(r => {
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

        const subtotal = items.reduce((s, i) => s + i.amount, 0);
        const totalTax = subtotal * 0.18;

        // Parse date — handle Excel serial numbers or string
        let poDate = null;
        const rawDate = firstRow[col.poDate];
        if (rawDate) {
          if (typeof rawDate === 'number') {
            poDate = XLSX.SSF.parse_date_code(rawDate);
            poDate = new Date(poDate.y, poDate.m - 1, poDate.d);
          } else {
            const d = new Date(rawDate);
            if (!isNaN(d)) poDate = d;
          }
        }

        // Upsert PO (filter by poNo + companyId)
        await PO.findOneAndUpdate(
          { poNo, ...(companyId ? { companyId } : {}) },
          {
            $set: {
              companyId,
              poNo,
              poDate,
              vendorId: vendor?._id,
              vendorName,
              vendorGSTIN,
              items,
              subtotal,
              totalTax,
              totalAmount: subtotal + totalTax,
              status: 'open',
            },
          },
          { upsert: true, new: true }
        );
        imported++;
      } catch (e) {
        errors.push(`PO ${poNo}: ${e.message}`);
        skipped++;
      }
    }

    return res.json({ imported, skipped, errors });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Import failed' });
  }
}
