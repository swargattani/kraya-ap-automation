import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import Vendor from '../../../models/Vendor';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const companyId = session.user.companyId;

  await dbConnect();
  const { id } = req.query;

  if (req.method === 'GET') {
    const vendor = await Vendor.findOne({ _id: id, ...(companyId ? { companyId } : {}) });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    return res.json(vendor);
  }

  if (req.method === 'PUT') {
    const vendor = await Vendor.findOneAndUpdate(
      { _id: id, ...(companyId ? { companyId } : {}) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    return res.json(vendor);
  }

  if (req.method === 'DELETE') {
    await Vendor.findOneAndUpdate(
      { _id: id, ...(companyId ? { companyId } : {}) },
      { active: false }
    );
    return res.json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end();
}
