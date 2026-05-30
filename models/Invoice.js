import mongoose from 'mongoose';

const InvLineSchema = new mongoose.Schema({
  description: String,
  hsnCode: String,
  qty: Number,
  unit: { type: String, default: 'NOS' },
  rate: Number,
  amount: Number,
  taxRate: Number,
  cgst: Number,
  sgst: Number,
  igst: Number,
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', index: true },
  irn: String,
  invoiceNo: { type: String, required: true },
  invoiceDate: Date,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  vendorName: String,
  vendorGSTIN: String,
  buyerGSTIN: String,
  placeOfSupply: String,
  items: [InvLineSchema],
  subtotal: Number,
  totalCGST: Number,
  totalSGST: Number,
  totalIGST: Number,
  tds: Number,
  totalAmount: Number,
  netPayable: Number,
  status: {
    type: String,
    enum: ['pending', 'po_matched', 'grn_matched', 'approved', 'rejected', 'paid'],
    default: 'pending',
  },
  matchStatus: {
    type: String,
    enum: ['unmatched', 'po_matched', 'three_way_matched'],
    default: 'unmatched',
  },
  poId: { type: mongoose.Schema.Types.ObjectId, ref: 'PO' },
  grnId: { type: mongoose.Schema.Types.ObjectId, ref: 'GRN' },
  source: { type: String, enum: ['ocr', 'gst_portal', 'manual'], default: 'ocr' },
  ocrRaw: String,
  ocrConfidence: Number,
  fileName: String,
  rejectionReason: String,
  approvedBy: String,
  approvedAt: Date,
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
