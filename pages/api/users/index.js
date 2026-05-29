import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (e) {
    return res.status(500).json({ error: 'Database connection failed. Check MongoDB Atlas IP whitelist.' });
  }

  // Setup route: allow creating first admin with no session
  if (req.method === 'POST' && req.body?.setup) {
    try {
      const count = await User.countDocuments();
      if (count > 0) return res.status(403).json({ error: 'Setup already done' });
      const user = await User.create({ ...req.body, role: 'admin', setup: undefined });
      return res.status(201).json({ email: user.email, role: user.role });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    if (session.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const users = await User.find({}, '-password').sort({ name: 1 });
    return res.json(users);
  }

  if (req.method === 'POST') {
    if (session.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const user = await User.create(req.body);
    return res.status(201).json({ email: user.email, role: user.role, name: user.name });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
