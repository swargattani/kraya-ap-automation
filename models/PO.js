import mongoose from 'mongoose';

const LineItemSchema = new mongoose.Schema({
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

const POSchema = new mongoose.Schema({
  poNo: { type: String, required: true, unique: true },
  poDate: Date,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  vendorName: String,
  vendorGSTIN: String,
  deliveryDate: Date,
  deliveryAddress: String,
  items: [LineItemSchema],
  subtotal: Number,
  totalTax: Number,
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['open', 'partial', 'fulfilled', 'cancelled'], default: 'open' },
  notes: String,
}, { timestamps: true });

export default mongoose.models.PO || mongoose.model('PO', POSchema);
