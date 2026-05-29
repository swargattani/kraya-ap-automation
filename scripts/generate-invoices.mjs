// Generates 6 sample Indian GST invoices as PDFs
// Run: node scripts/generate-invoices.mjs
// 3 matching POs exactly, 3 with mismatches

import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'sample-invoices');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

const BUYER = {
  name: 'Haldiram Snacks Pvt Ltd',
  gstin: '27AAACH1234I1Z0',
  address: 'Plot No. 12, MIDC Industrial Area',
  city: 'Nagpur, Maharashtra - 440019',
};

const randomIRN = () => crypto.randomBytes(32).toString('hex');

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

function calcGST(subtotal, rate) {
  const tax = Math.round(subtotal * rate / 100);
  return { cgst: tax / 2, sgst: tax / 2, total: tax };
}

const INVOICES = [
  // ── 1. EXACT MATCH — Bharat Steel Works / PO-2425-0081 ─────────────────────
  {
    filename: '01_BharatSteelWorks_MATCH.pdf',
    label: 'EXACT MATCH — PO-2425-0081',
    vendor: { name: 'Bharat Steel Works', gstin: '27AABCB1234F1Z5', pan: 'AABCB1234F', address: 'Plot 45, MIDC Butibori', city: 'Nagpur, Maharashtra - 441108' },
    invoiceNo: 'BSW/24-25/2251',
    invoiceDate: '15/01/2025',
    poRef: 'PO-2425-0081',
    irn: randomIRN(),
    items: [
      { description: 'MS Flat Bar 50x6mm', hsn: '72112990', qty: 500, unit: 'KG', rate: 62, taxRate: 18 },
      { description: 'MS Angle 50x50x5mm', hsn: '72162100', qty: 300, unit: 'KG', rate: 68, taxRate: 18 },
    ],
    note: 'Rates and qty match PO exactly',
  },
  // ── 2. EXACT MATCH — OM Bearings / PO-2425-0082 ───────────────────────────
  {
    filename: '02_OMBearings_MATCH.pdf',
    label: 'EXACT MATCH — PO-2425-0082',
    vendor: { name: 'OM Bearings Pvt Ltd', gstin: '27AADCO5678G1Z3', pan: 'AADCO5678G', address: 'Gat No. 234, Chakan Industrial Area', city: 'Pune, Maharashtra - 410501' },
    invoiceNo: 'OMB/2425/0891',
    invoiceDate: '18/01/2025',
    poRef: 'PO-2425-0082',
    irn: randomIRN(),
    items: [
      { description: 'Deep Groove Ball Bearing 6205', hsn: '84821010', qty: 50, unit: 'NOS', rate: 380, taxRate: 18 },
      { description: 'Cylindrical Roller Bearing NU205', hsn: '84821020', qty: 30, unit: 'NOS', rate: 650, taxRate: 18 },
    ],
    note: 'Rates and qty match PO exactly',
  },
  // ── 3. EXACT MATCH — Pragati Engineering / PO-2425-0084 ───────────────────
  {
    filename: '03_PragatiEngineering_MATCH.pdf',
    label: 'EXACT MATCH — PO-2425-0084',
    vendor: { name: 'Pragati Engineering', gstin: '27AABCP9876J1Z7', pan: 'AABCP9876J', address: 'S.No. 78, Satpur MIDC', city: 'Nashik, Maharashtra - 422007' },
    invoiceNo: 'PE/2425/0701',
    invoiceDate: '22/01/2025',
    poRef: 'PO-2425-0084',
    irn: randomIRN(),
    items: [
      { description: 'Hydraulic Seal Kit 100mm', hsn: '84842000', qty: 20, unit: 'SET', rate: 1850, taxRate: 12 },
      { description: 'O-Ring HNBR 50mm', hsn: '40169300', qty: 200, unit: 'NOS', rate: 45, taxRate: 12 },
    ],
    note: 'Rates and qty match PO exactly',
  },
  // ── 4. RATE MISMATCH — Tata Components / PO-2425-0083 ─────────────────────
  {
    filename: '04_TataComponents_RATE_MISMATCH.pdf',
    label: 'RATE MISMATCH — PO rate ₹4,200 vs Invoice ₹4,350 (+3.6%)',
    vendor: { name: 'Tata Components Ltd', gstin: '27AAACT2345H1Z1', pan: 'AAACT2345H', address: 'Unit 7, Bhiwandi Industrial Estate', city: 'Mumbai, Maharashtra - 421302' },
    invoiceNo: 'TCL/25/01341',
    invoiceDate: '20/01/2025',
    poRef: 'PO-2425-0083',
    irn: randomIRN(),
    items: [
      { description: 'Conveyor Chain 08B-1', hsn: '73151200', qty: 10, unit: 'MTR', rate: 4350, taxRate: 18 },  // PO was 4200
    ],
    note: 'Rate mismatch: PO ₹4,200 vs Invoice ₹4,350 per MTR',
  },
  // ── 5. QTY MISMATCH — Bharat Steel Works short supply ────────────────────
  {
    filename: '05_BharatSteelWorks_QTY_MISMATCH.pdf',
    label: 'QTY MISMATCH — PO qty 500 KG vs Invoice 420 KG',
    vendor: { name: 'Bharat Steel Works', gstin: '27AABCB1234F1Z5', pan: 'AABCB1234F', address: 'Plot 45, MIDC Butibori', city: 'Nagpur, Maharashtra - 441108' },
    invoiceNo: 'BSW/24-25/2298',
    invoiceDate: '25/01/2025',
    poRef: 'PO-2425-0081',
    irn: randomIRN(),
    items: [
      { description: 'MS Flat Bar 50x6mm', hsn: '72112990', qty: 420, unit: 'KG', rate: 62, taxRate: 18 },  // PO was 500 KG
      { description: 'MS Angle 50x50x5mm', hsn: '72162100', qty: 300, unit: 'KG', rate: 68, taxRate: 18 },
    ],
    note: 'Qty mismatch: MS Flat Bar PO 500 KG vs Invoice 420 KG (partial supply)',
  },
  // ── 6. NO PO — Vidarbha Steel Tools (no matching PO in system) ────────────
  {
    filename: '06_VidarbhaSteelTools_NO_PO.pdf',
    label: 'NO PO — No purchase order exists for this invoice',
    vendor: { name: 'Vidarbha Steel Tools', gstin: '27AACVS3456K1Z9', pan: 'AACVS3456K', address: 'Plot B-12, Amravati Industrial Area', city: 'Amravati, Maharashtra - 444602' },
    invoiceNo: 'VST/2425/0521',
    invoiceDate: '27/01/2025',
    poRef: null,
    irn: randomIRN(),
    items: [
      { description: 'HSS Drill Bit Set 13pc', hsn: '82071300', qty: 25, unit: 'SET', rate: 1200, taxRate: 18 },
    ],
    note: 'No PO reference — urgent purchase without prior PO',
  },
];

async function generateInvoice(inv) {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const stream = fs.createWriteStream(path.join(OUT_DIR, inv.filename));
  doc.pipe(stream);

  // ── Calculate amounts ─────────────────────────────────────────────────────
  const lines = inv.items.map(item => {
    const amount = item.qty * item.rate;
    const gst = calcGST(amount, item.taxRate);
    return { ...item, amount, ...gst };
  });
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const totalCGST = lines.reduce((s, l) => s + l.cgst, 0);
  const totalSGST = lines.reduce((s, l) => s + l.sgst, 0);
  const totalTax = totalCGST + totalSGST;
  const grandTotal = subtotal + totalTax;
  const tds = Math.round(subtotal * 0.02);
  const netPayable = grandTotal - tds;

  // ── QR code data (simulates IRP QR payload) ──────────────────────────────
  const qrData = JSON.stringify({
    SellerGSTIN: inv.vendor.gstin,
    BuyerGSTIN: BUYER.gstin,
    DocNo: inv.invoiceNo,
    DocDate: inv.invoiceDate,
    TotInvVal: grandTotal.toFixed(2),
    ItemCnt: lines.length,
    IRN: inv.irn,
  });
  const qrDataUrl = await QRCode.toDataURL(qrData, { width: 90, margin: 1 });
  const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

  const W = 515; // usable width
  const RED = '#C0392B';
  const DARK = '#1A1A1A';
  const GRAY = '#555555';
  const LGRAY = '#888888';
  const BORDER = '#CCCCCC';

  let y = 40;

  // ── Header ────────────────────────────────────────────────────────────────
  doc.rect(40, y, W, 28).fill(DARK);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(13)
    .text('TAX INVOICE', 40, y + 8, { width: W, align: 'center' });

  // e-Invoice badge
  doc.rect(40, y + 29, W, 14).fill('#2C3E50');
  doc.fillColor('#F0F0F0').font('Helvetica').fontSize(7.5)
    .text('e-Invoice | IRN: ' + inv.irn, 45, y + 33, { width: W - 10 });

  y += 50;

  // ── Vendor + Buyer columns ────────────────────────────────────────────────
  const col = W / 2 - 5;
  doc.rect(40, y, col, 90).stroke(BORDER);
  doc.rect(40 + col + 10, y, col, 90).stroke(BORDER);

  // Vendor block
  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(9)
    .text('SUPPLIER', 46, y + 5);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(RED)
    .text(inv.vendor.name, 46, y + 16, { width: col - 12 });
  doc.font('Helvetica').fontSize(8).fillColor(GRAY)
    .text(inv.vendor.address, 46, y + 28, { width: col - 12 })
    .text(inv.vendor.city, 46, y + 38, { width: col - 12 })
    .text('GSTIN: ' + inv.vendor.gstin, 46, y + 50)
    .text('PAN: ' + inv.vendor.pan, 46, y + 60)
    .text('State: Maharashtra | Code: 27', 46, y + 70);

  // Buyer block
  const bx = 40 + col + 16;
  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(9)
    .text('RECIPIENT / BILL TO', bx, y + 5);
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#1A4FA0')
    .text(BUYER.name, bx, y + 16, { width: col - 12 });
  doc.font('Helvetica').fontSize(8).fillColor(GRAY)
    .text(BUYER.address, bx, y + 28, { width: col - 12 })
    .text(BUYER.city, bx, y + 38, { width: col - 12 })
    .text('GSTIN: ' + BUYER.gstin, bx, y + 50)
    .text('State: Maharashtra | Code: 27', bx, y + 60);

  y += 98;

  // ── Invoice details bar ───────────────────────────────────────────────────
  doc.rect(40, y, W, 22).fill('#F5F5F5').stroke(BORDER);
  const fields = [
    ['Invoice No', inv.invoiceNo],
    ['Invoice Date', inv.invoiceDate],
    ['PO Reference', inv.poRef || 'N/A'],
    ['Place of Supply', 'Maharashtra (27)'],
  ];
  const fw = W / fields.length;
  fields.forEach(([label, val], i) => {
    const fx = 40 + i * fw + 5;
    doc.fillColor(LGRAY).font('Helvetica').fontSize(7).text(label, fx, y + 3);
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(8).text(val, fx, y + 11);
  });

  y += 30;

  // ── Items table ───────────────────────────────────────────────────────────
  const cols = { sno: 25, desc: 145, hsn: 60, qty: 45, unit: 35, rate: 55, amount: 65, cgst: 45, sgst: 45 };
  const headers = ['#', 'Description', 'HSN/SAC', 'Qty', 'Unit', 'Rate', 'Amount', 'CGST', 'SGST'];
  const keys = Object.keys(cols);

  // Header row
  doc.rect(40, y, W, 16).fill('#2C3E50');
  let cx = 40;
  headers.forEach((h, i) => {
    const key = keys[i];
    const align = i > 2 ? 'right' : 'left';
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(7.5)
      .text(h, cx + 3, y + 4, { width: cols[key] - 6, align });
    cx += cols[key];
  });

  y += 16;

  // Item rows
  lines.forEach((line, idx) => {
    const rowH = 18;
    const bg = idx % 2 === 0 ? '#FFFFFF' : '#F9F9F9';
    doc.rect(40, y, W, rowH).fill(bg).stroke(BORDER);

    const cells = [
      String(idx + 1),
      line.description,
      line.hsn,
      line.qty.toString(),
      line.unit,
      line.rate.toLocaleString('en-IN'),
      line.amount.toLocaleString('en-IN'),
      line.cgst.toLocaleString('en-IN'),
      line.sgst.toLocaleString('en-IN'),
    ];
    cx = 40;
    cells.forEach((cell, i) => {
      const key = keys[i];
      const align = i > 2 ? 'right' : 'left';
      doc.fillColor(DARK).font('Helvetica').fontSize(8)
        .text(cell, cx + 3, y + 5, { width: cols[key] - 6, align });
      cx += cols[key];
    });

    y += rowH;
  });

  y += 6;

  // ── Totals ─────────────────────────────────────────────────────────────────
  const totX = 340;
  const totW = W - (totX - 40);
  const totals = [
    ['Subtotal (Taxable Value)', subtotal],
    ['Total CGST', totalCGST],
    ['Total SGST', totalSGST],
    ['Total Tax', totalTax],
  ];

  totals.forEach(([label, val]) => {
    doc.rect(totX, y, totW, 14).fill('#F9F9F9').stroke(BORDER);
    doc.fillColor(GRAY).font('Helvetica').fontSize(8).text(label, totX + 5, y + 3);
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(8)
      .text(fmt(val), totX + 5, y + 3, { width: totW - 10, align: 'right' });
    y += 14;
  });

  doc.rect(totX, y, totW, 18).fill(DARK).stroke(BORDER);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9).text('Grand Total', totX + 5, y + 4);
  doc.fillColor('#F5C518').font('Helvetica-Bold').fontSize(10)
    .text(fmt(grandTotal), totX + 5, y + 4, { width: totW - 10, align: 'right' });
  y += 18;

  doc.rect(totX, y, totW, 14).fill('#FFF8E1').stroke(BORDER);
  doc.fillColor('#C47A0A').font('Helvetica').fontSize(8).text(`TDS @ 2% (u/s 194C)`, totX + 5, y + 3);
  doc.fillColor('#C47A0A').font('Helvetica-Bold').fontSize(8)
    .text('- ' + fmt(tds), totX + 5, y + 3, { width: totW - 10, align: 'right' });
  y += 14;

  doc.rect(totX, y, totW, 18).fill('#1A4FA0').stroke(BORDER);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9).text('Net Payable', totX + 5, y + 4);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(10)
    .text(fmt(netPayable), totX + 5, y + 4, { width: totW - 10, align: 'right' });
  y += 24;

  // ── QR Code ───────────────────────────────────────────────────────────────
  const qrY = y - 110;
  doc.rect(40, qrY, 100, 100).stroke(BORDER);
  doc.image(qrBuffer, 42, qrY + 2, { width: 96 });
  doc.fillColor(LGRAY).font('Helvetica').fontSize(6.5)
    .text('Scan to verify e-Invoice', 40, qrY + 104, { width: 100, align: 'center' });

  // ── Bank details ──────────────────────────────────────────────────────────
  y += 6;
  doc.rect(40, y, W / 2 - 5, 44).stroke(BORDER);
  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(8).text('Bank Details', 45, y + 4);
  doc.font('Helvetica').fontSize(7.5).fillColor(GRAY)
    .text(`Bank: State Bank of India`, 45, y + 14)
    .text(`A/C: 1234567890  |  IFSC: SBIN0001234`, 45, y + 23)
    .text(`Branch: Nagpur Main`, 45, y + 32);

  // ── Declaration ───────────────────────────────────────────────────────────
  const declX = 40 + W / 2 + 5;
  doc.rect(declX, y, W / 2 - 5, 44).stroke(BORDER);
  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(8).text('Declaration', declX + 5, y + 4);
  doc.font('Helvetica').fontSize(7).fillColor(GRAY)
    .text('Goods dispatched as per order. E&OE.', declX + 5, y + 14, { width: W / 2 - 15 })
    .text('Subject to Nagpur jurisdiction.', declX + 5, y + 22, { width: W / 2 - 15 });

  y += 52;

  // ── Signature ─────────────────────────────────────────────────────────────
  doc.rect(40 + W - 140, y, 140, 36).stroke(BORDER);
  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(7.5)
    .text('Authorised Signatory', 40 + W - 135, y + 3)
    .text('for ' + inv.vendor.name, 40 + W - 135, y + 12, { width: 130 });
  doc.fillColor(LGRAY).font('Helvetica').fontSize(7)
    .text('(Digitally Signed)', 40 + W - 135, y + 24);

  doc.end();
  await new Promise(resolve => stream.on('finish', resolve));
  console.log(`✓ ${inv.filename}  [${inv.label}]`);
}

console.log('\nGenerating 6 sample GST invoices...\n');
for (const inv of INVOICES) {
  await generateInvoice(inv);
}
console.log(`\nAll PDFs saved to: sample-invoices/\n`);
console.log('Summary:');
console.log('  01 - Bharat Steel Works    → EXACT MATCH with PO-2425-0081');
console.log('  02 - OM Bearings Pvt Ltd   → EXACT MATCH with PO-2425-0082');
console.log('  03 - Pragati Engineering   → EXACT MATCH with PO-2425-0084');
console.log('  04 - Tata Components Ltd   → RATE MISMATCH (+3.6%) vs PO-2425-0083');
console.log('  05 - Bharat Steel Works    → QTY MISMATCH (420 KG vs PO 500 KG)');
console.log('  06 - Vidarbha Steel Tools  → NO PO (no matching PO in system)\n');
