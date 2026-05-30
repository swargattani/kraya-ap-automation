import * as XLSX from 'xlsx';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const TEMPLATES = {
  po: {
    filename: 'po_import_template.xlsx',
    headers: ['PO No', 'Vendor Name', 'Vendor GSTIN', 'PO Date', 'Description', 'HSN Code', 'Qty', 'Unit', 'Rate', 'Amount'],
    examples: [
      ['PO-2425-0001', 'Bharat Steel Works', '27AABCB1234F1Z5', '2025-01-15', 'MS Flat Bar 50x6mm', '72112990', 500, 'KG', 62, 31000],
      ['PO-2425-0001', 'Bharat Steel Works', '27AABCB1234F1Z5', '2025-01-15', 'MS Angle 50x50x5mm', '72162100', 300, 'KG', 68, 20400],
    ],
  },
  invoice: {
    filename: 'invoice_import_template.xlsx',
    headers: ['Invoice No', 'Invoice Date', 'Vendor Name', 'Vendor GSTIN', 'PO Ref', 'Description', 'HSN Code', 'Qty', 'Unit', 'Rate', 'Amount', 'Total Amount'],
    examples: [
      ['BSW/24-25/1847', '2025-01-13', 'Bharat Steel Works', '27AABCB1234F1Z5', 'PO-2425-0001', 'MS Flat Bar 50x6mm', '72112990', 500, 'KG', 62, 31000, 60652],
      ['BSW/24-25/1847', '2025-01-13', 'Bharat Steel Works', '27AABCB1234F1Z5', 'PO-2425-0001', 'MS Angle 50x50x5mm', '72162100', 300, 'KG', 68, 20400, ''],
    ],
  },
  grn: {
    filename: 'grn_import_template.xlsx',
    headers: ['GRN No', 'PO No', 'Invoice No', 'Vendor Name', 'Received Date', 'Description', 'HSN Code', 'Ordered Qty', 'Received Qty', 'Accepted Qty', 'Condition', 'Remarks'],
    examples: [
      ['GRN-2425-0001', 'PO-2425-0001', 'BSW/24-25/1847', 'Bharat Steel Works', '2025-01-14', 'MS Flat Bar 50x6mm', '72112990', 500, 500, 500, 'good', ''],
      ['GRN-2425-0001', 'PO-2425-0001', 'BSW/24-25/1847', 'Bharat Steel Works', '2025-01-14', 'MS Angle 50x50x5mm', '72162100', 300, 298, 298, 'good', '2 pcs short shipped'],
    ],
  },
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { type } = req.query;
  const template = TEMPLATES[type];
  if (!template) return res.status(400).json({ error: 'Invalid template type. Use: po | invoice | grn' });

  const wb = XLSX.utils.book_new();
  const data = [template.headers, ...template.examples];
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Style header row
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let c = range.s.c; c <= range.e.c; c++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c });
    if (!ws[cellRef]) continue;
    ws[cellRef].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'D8261C' } },
    };
  }

  // Auto-width
  ws['!cols'] = template.headers.map(h => ({ wch: Math.max(h.length + 4, 14) }));

  XLSX.utils.book_append_sheet(wb, ws, 'Template');

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${template.filename}"`);
  res.send(buf);
}
