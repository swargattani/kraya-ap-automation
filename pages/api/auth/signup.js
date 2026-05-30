import bcrypt from 'bcryptjs';
import { dbConnect } from '../../../lib/mongodb';
import User from '../../../models/User';
import Company from '../../../models/Company';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { email, password, companyName, gstin, address } = req.body || {};

  // Validate
  if (!email || !password || !companyName) {
    return res.status(400).json({ error: 'Email, password, and company name are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  if (gstin && !/^[A-Z0-9]{15}$/i.test(gstin)) {
    return res.status(400).json({ error: 'GSTIN must be exactly 15 alphanumeric characters' });
  }

  try {
    await dbConnect();

    // Check if email already in use
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Create company
    const company = await Company.create({
      name: companyName,
      gstin: gstin ? gstin.toUpperCase() : '',
      address: address || '',
    });

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      email: email.toLowerCase(),
      passwordHash,
      companyId: company._id,
      role: 'admin',
      active: true,
    });

    return res.status(201).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Signup failed' });
  }
}
