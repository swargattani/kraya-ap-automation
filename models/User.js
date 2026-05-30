import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String },
  password: { type: String },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', index: true },
  role: {
    type: String,
    enum: ['admin', 'user', 'accounts', 'purchase', 'stores'],
    default: 'admin',
  },
  active: { type: Boolean, default: true },
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
