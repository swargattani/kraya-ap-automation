import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { dbConnect } from '../../lib/mongodb';
import Vendor from '../../models/Vendor';
import PO from '../../models/PO';
import Invoice from '../../models/Invoice';
import GRN from '../../models/GRN';
import Payable from '../../models/Payable';

const SEED_VENDORS = [
  { name: 'Bharat Steel Works', gstin: '27AABCB1234F1Z5', pan: 'AABCB1234F', city: 'Nagpur', state: 'Maharashtra', contactName: 'Rajesh Sharma', bankAccount: '1234567890', ifsc: 'SBIN0001234', tdsRate: 2 },
  { name: 'OM Bearings Pvt Ltd', gstin: '27AADCO5678G1Z3', pan: 'AADCO5678G', city: 'Pune', state: 'Maharashtra', contactName: 'Sunil Patil', bankAccount: '9876543210', ifsc: 'HDFC0009876', tdsRate: 2 },
  { name: 'Tata Components Ltd', gstin: '27AAACT2345H1Z1', pan: 'AAACT2345H', city: 'Mumbai', state: 'Maharashtra', contactName: 'Amit Tiwari', bankAccount: '1122334455', ifsc: 'ICIC0001122', tdsRate: 2 },
  { name: 'Pragati Engineering', gstin: '27AABCP9876J1Z7', pan: 'AABCP9876J', city: 'Nashik', state: 'Maharashtra', contactName: 'Priya Kulkarni', bankAccount: '5566778899', ifsc: 'AXIS0005566', tdsRate: 2 },
  { name: 'Vidarbha Steel Tools', gstin: '27AACVS3456K1Z9', pan: 'AACVS3456K', city: 'Amravati', state: 'Maharashtra', contactName: 'Kiran Deshmukh', bankAccount: '6677889900', ifsc: 'BKID0006677', tdsRate: 2 },
  { name: 'Ananya Polymers', gstin: '27AAAAN7890L1Z2', pan: 'AAAAN7890L', city: 'Aurangabad', state: 'Maharashtra', contactName: 'Ananya Singh', bankAccount: '7788990011', ifsc: 'UBIN0007788', tdsRate: 2 },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const companyId = session.user.companyId;

  const { force } = req.body || {};
  await dbConnect();

  const existingVendors = await Vendor.countDocuments(companyId ? { companyId } : {});
  if (existingVendors > 0 && !force) {
    return res.json({ message: 'Already seeded. Pass force:true to re-seed.', vendors: existingVendors });
  }

  // Clear existing company data
  const filter = companyId ? { companyId } : {};
  await Promise.all([
    Vendor.deleteMany(filter),
    PO.deleteMany(filter),
    Invoice.deleteMany(filter),
    GRN.deleteMany(filter),
    Payable.deleteMany(filter),
  ]);

  const vendors = await Vendor.insertMany(SEED_VENDORS.map(v => ({ ...v, companyId })));
  const [v0, v1, v2, v3, v4] = vendors;

  const now = new Date();
  const d = (days) => new Date(now.getTime() + days * 86400000);

  const pos = await PO.insertMany([
    {
      companyId,
      poNo: 'PO-2425-0081',
      poDate: d(-20),
      vendorId: v0._id, vendorName: v0.name, vendorGSTIN: v0.gstin,
      deliveryDate: d(-5),
      items: [
        { description: 'MS Flat Bar 50x6mm', hsnCode: '72112990', qty: 500, unit: 'KG', rate: 62, amount: 31000, taxRate: 18, cgst: 2790, sgst: 2790 },
        { description: 'MS Angle 50x50x5mm', hsnCode: '72162100', qty: 300, unit: 'KG', rate: 68, amount: 20400, taxRate: 18, cgst: 1836, sgst: 1836 },
      ],
      subtotal: 51400, totalTax: 9252, totalAmount: 60652, status: 'open',
    },
    {
      companyId,
      poNo: 'PO-2425-0082',
      poDate: d(-15),
      vendorId: v1._id, vendorName: v1.name, vendorGSTIN: v1.gstin,
      deliveryDate: d(-2),
      items: [
        { description: 'Deep Groove Ball Bearing 6205', hsnCode: '84821010', qty: 50, unit: 'NOS', rate: 380, amount: 19000, taxRate: 18, cgst: 1710, sgst: 1710 },
        { description: 'Cylindrical Roller Bearing NU205', hsnCode: '84821020', qty: 30, unit: 'NOS', rate: 650, amount: 19500, taxRate: 18, cgst: 1755, sgst: 1755 },
      ],
      subtotal: 38500, totalTax: 6930, totalAmount: 45430, status: 'open',
    },
    {
      companyId,
      poNo: 'PO-2425-0083',
      poDate: d(-10),
      vendorId: v2._id, vendorName: v2.name, vendorGSTIN: v2.gstin,
      deliveryDate: d(5),
      items: [
        { description: 'Conveyor Chain 08B-1', hsnCode: '73151200', qty: 10, unit: 'MTR', rate: 4200, amount: 42000, taxRate: 18, cgst: 3780, sgst: 3780 },
      ],
      subtotal: 42000, totalTax: 7560, totalAmount: 49560, status: 'open',
    },
    {
      companyId,
      poNo: 'PO-2425-0084',
      poDate: d(-8),
      vendorId: v3._id, vendorName: v3.name, vendorGSTIN: v3.gstin,
      deliveryDate: d(10),
      items: [
        { description: 'Hydraulic Seal Kit 100mm', hsnCode: '84842000', qty: 20, unit: 'SET', rate: 1850, amount: 37000, taxRate: 12, cgst: 2220, sgst: 2220 },
        { description: 'O-Ring HNBR 50mm', hsnCode: '40169300', qty: 200, unit: 'NOS', rate: 45, amount: 9000, taxRate: 12, cgst: 540, sgst: 540 },
      ],
      subtotal: 46000, totalTax: 5520, totalAmount: 51520, status: 'open',
    },
  ]);

  const invoices = await Invoice.insertMany([
    {
      companyId,
      invoiceNo: 'BSW/24-25/1847',
      invoiceDate: d(-18),
      vendorId: v0._id, vendorName: v0.name, vendorGSTIN: v0.gstin,
      buyerGSTIN: '27AAACH1234I1Z0',
      placeOfSupply: 'Maharashtra',
      poId: pos[0]._id,
      items: [
        { description: 'MS Flat Bar 50x6mm', hsnCode: '72112990', qty: 500, unit: 'KG', rate: 62, amount: 31000, taxRate: 18, cgst: 2790, sgst: 2790 },
        { description: 'MS Angle 50x50x5mm', hsnCode: '72162100', qty: 300, unit: 'KG', rate: 68, amount: 20400, taxRate: 18, cgst: 1836, sgst: 1836 },
      ],
      subtotal: 51400, totalCGST: 4626, totalSGST: 4626, totalAmount: 60652,
      tds: 1013, netPayable: 59639,
      source: 'ocr', status: 'po_matched', matchStatus: 'po_matched',
      irn: 'a5f8c3d2e1b4a7f6c9d0e3b2a1f4c7d0e3b2a1f4c7d0e3b2a1f4c7d0e3b2a1f4',
    },
    {
      companyId,
      invoiceNo: 'OM/2425/0334',
      invoiceDate: d(-12),
      vendorId: v1._id, vendorName: v1.name, vendorGSTIN: v1.gstin,
      buyerGSTIN: '27AAACH1234I1Z0',
      placeOfSupply: 'Maharashtra',
      poId: pos[1]._id,
      items: [
        { description: 'Deep Groove Ball Bearing 6205', hsnCode: '84821010', qty: 50, unit: 'NOS', rate: 380, amount: 19000, taxRate: 18, cgst: 1710, sgst: 1710 },
        { description: 'Cylindrical Roller Bearing NU205', hsnCode: '84821020', qty: 30, unit: 'NOS', rate: 650, amount: 19500, taxRate: 18, cgst: 1755, sgst: 1755 },
      ],
      subtotal: 38500, totalCGST: 3465, totalSGST: 3465, totalAmount: 45430,
      tds: 770, netPayable: 44660,
      source: 'ocr', status: 'pending', matchStatus: 'unmatched',
    },
    {
      companyId,
      invoiceNo: 'TCL/25/00892',
      invoiceDate: d(-8),
      vendorId: v2._id, vendorName: v2.name, vendorGSTIN: v2.gstin,
      buyerGSTIN: '27AAACH1234I1Z0',
      placeOfSupply: 'Maharashtra',
      items: [
        { description: 'Conveyor Chain 08B-1', hsnCode: '73151200', qty: 10, unit: 'MTR', rate: 4350, amount: 43500, taxRate: 18, cgst: 3915, sgst: 3915 },
      ],
      subtotal: 43500, totalCGST: 3915, totalSGST: 3915, totalAmount: 51330,
      tds: 870, netPayable: 50460,
      source: 'ocr', status: 'pending', matchStatus: 'unmatched',
    },
    {
      companyId,
      invoiceNo: 'PE/2425/0567',
      invoiceDate: d(-5),
      vendorId: v3._id, vendorName: v3.name, vendorGSTIN: v3.gstin,
      buyerGSTIN: '27AAACH1234I1Z0',
      placeOfSupply: 'Maharashtra',
      poId: pos[3]._id,
      items: [
        { description: 'Hydraulic Seal Kit 100mm', hsnCode: '84842000', qty: 20, unit: 'SET', rate: 1850, amount: 37000, taxRate: 12, cgst: 2220, sgst: 2220 },
        { description: 'O-Ring HNBR 50mm', hsnCode: '40169300', qty: 200, unit: 'NOS', rate: 45, amount: 9000, taxRate: 12, cgst: 540, sgst: 540 },
      ],
      subtotal: 46000, totalCGST: 2760, totalSGST: 2760, totalAmount: 51520,
      tds: 920, netPayable: 50600,
      source: 'ocr', status: 'approved', matchStatus: 'three_way_matched',
    },
    {
      companyId,
      invoiceNo: 'VST/2425/0289',
      invoiceDate: d(-3),
      vendorId: v4._id, vendorName: v4.name, vendorGSTIN: v4.gstin,
      buyerGSTIN: '27AAACH1234I1Z0',
      placeOfSupply: 'Maharashtra',
      items: [
        { description: 'HSS Drill Bit Set 13pc', hsnCode: '82071300', qty: 25, unit: 'SET', rate: 1200, amount: 30000, taxRate: 18, cgst: 2700, sgst: 2700 },
      ],
      subtotal: 30000, totalCGST: 2700, totalSGST: 2700, totalAmount: 35400,
      tds: 600, netPayable: 34800,
      source: 'ocr', status: 'rejected', matchStatus: 'unmatched',
      rejectionReason: 'Rate higher than PO by 8.3% — beyond 5% tolerance',
    },
  ]);

  const grn = await GRN.create({
    companyId,
    grnNo: 'GRN-2425-0112',
    grnDate: d(-4),
    poId: pos[3]._id,
    invoiceId: invoices[3]._id,
    vendorId: v3._id, vendorName: v3.name,
    items: [
      { description: 'Hydraulic Seal Kit 100mm', orderedQty: 20, receivedQty: 20, acceptedQty: 20, unit: 'SET', condition: 'good' },
      { description: 'O-Ring HNBR 50mm', orderedQty: 200, receivedQty: 200, acceptedQty: 198, unit: 'NOS', condition: 'good', remarks: '2 nos defective, returned' },
    ],
    status: 'approved',
    receivedBy: 'Stores - Ravi Kumar',
  });

  await Invoice.findByIdAndUpdate(invoices[3]._id, { grnId: grn._id });

  await Payable.insertMany([
    {
      companyId,
      invoiceId: invoices[3]._id,
      vendorId: v3._id, vendorName: v3.name, vendorGSTIN: v3.gstin,
      invoiceNo: 'PE/2425/0567',
      invoiceDate: invoices[3].invoiceDate,
      poNo: 'PO-2425-0084',
      dueDate: d(25),
      grossAmount: 51520, tdsDeducted: 920, netPayable: 50600,
      status: 'scheduled',
    },
    {
      companyId,
      invoiceId: invoices[0]._id,
      vendorId: v0._id, vendorName: v0.name, vendorGSTIN: v0.gstin,
      invoiceNo: 'BSW/24-25/1847',
      invoiceDate: invoices[0].invoiceDate,
      poNo: 'PO-2425-0081',
      dueDate: d(12),
      grossAmount: 60652, tdsDeducted: 1013, netPayable: 59639,
      status: 'pending',
    },
  ]);

  return res.json({ message: 'Seeded successfully', vendors: vendors.length, pos: pos.length, invoices: invoices.length, grns: 1, payables: 2 });
}
