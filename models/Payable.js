import mongoose from 'mongoose';

const PayableSchema = new mongoose.Schema({
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  vendorName: String,
  vendorGSTIN: String,
  invoiceNo: String,
  invoiceDate: Date,
  poNo: String,
  dueDate: Date,
  grossAmount: Number,
  tdsDeducted: Number,
  netPayable: Number,
  status: { type: String, enum: ['pending', 'scheduled', 'paid', 'on_hold'], default: 'pending' },
  paymentDate: Date,
  paymentRef: String,
  paymentMode: { type: String, enum: ['neft', 'rtgs', 'imps', 'cheque', ''], default: '' },
  remarks: String,
}, { timestamps: true });

export default mongoose.models.Payable || mongoose.model('Payable', PayableSchema);
