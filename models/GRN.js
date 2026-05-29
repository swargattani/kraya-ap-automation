import mongoose from 'mongoose';

const GRNLineSchema = new mongoose.Schema({
  description: String,
  hsnCode: String,
  orderedQty: Number,
  receivedQty: Number,
  acceptedQty: Number,
  unit: { type: String, default: 'NOS' },
  rate: Number,
  condition: { type: String, enum: ['good', 'damaged', 'short'], default: 'good' },
  remarks: String,
}, { _id: false });

const GRNSchema = new mongoose.Schema({
  grnNo: { type: String, required: true, unique: true },
  grnDate: Date,
  poId: { type: mongoose.Schema.Types.ObjectId, ref: 'PO' },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  vendorName: String,
  items: [GRNLineSchema],
  status: { type: String, enum: ['draft', 'approved', 'rejected'], default: 'draft' },
  receivedBy: String,
  storeLocation: String,
  remarks: String,
}, { timestamps: true });

export default mongoose.models.GRN || mongoose.model('GRN', GRNSchema);
