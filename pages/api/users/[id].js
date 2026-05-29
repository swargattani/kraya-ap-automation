import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  await dbConnect();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const updates = { ...req.body };
    if (!updates.password) delete updates.password;
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  }

  if (req.method === 'DELETE') {
    if (id === session.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
    await User.findByIdAndUpdate(id, { active: false });
    return res.json({ ok: true });
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  res.status(405).end();
}
