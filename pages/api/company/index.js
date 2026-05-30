import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import Company from '../../../models/Company';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  await dbConnect();
  const companyId = session.user.companyId;
  if (!companyId) return res.status(400).json({ error: 'No company associated with account' });

  if (req.method === 'GET') {
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    return res.json(company);
  }

  if (req.method === 'PUT') {
    const { name, gstin, address } = req.body || {};
    if (gstin && !/^[A-Z0-9]{15}$/i.test(gstin)) {
      return res.status(400).json({ error: 'GSTIN must be exactly 15 alphanumeric characters' });
    }
    const updates = {};
    if (name) updates.name = name;
    if (gstin !== undefined) updates.gstin = gstin.toUpperCase();
    if (address !== undefined) updates.address = address;
    const company = await Company.findByIdAndUpdate(companyId, updates, { new: true });
    if (!company) return res.status(404).json({ error: 'Company not found' });
    return res.json(company);
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end();
}
