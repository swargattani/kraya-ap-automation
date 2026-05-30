import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', index: true },
  name: { type: String, required: true },
  gstin: String,
  pan: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  bankAccount: String,
  ifsc: String,
  bankName: String,
  contactName: String,
  contactEmail: String,
  contactPhone: String,
  tdsCategory: { type: String, default: '194C' },
  tdsRate: { type: Number, default: 2 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
