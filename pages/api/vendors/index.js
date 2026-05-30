import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import Vendor from '../../../models/Vendor';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const companyId = session.user.companyId;

  await dbConnect();

  if (req.method === 'GET') {
    const filter = { active: true };
    if (companyId) filter.companyId = companyId;
    const vendors = await Vendor.find(filter).sort({ name: 1 });
    return res.json(vendors);
  }

  if (req.method === 'POST') {
    const vendor = await Vendor.create({ ...req.body, companyId });
    return res.status(201).json(vendor);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
