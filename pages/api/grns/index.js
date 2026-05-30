import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import GRN from '../../../models/GRN';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const companyId = session.user.companyId;

  await dbConnect();

  if (req.method === 'GET') {
    const { status, poId, invoiceId } = req.query;
    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (status) filter.status = status;
    if (poId) filter.poId = poId;
    if (invoiceId) filter.invoiceId = invoiceId;
    const grns = await GRN.find(filter)
      .populate('poId', 'poNo')
      .populate('invoiceId', 'invoiceNo')
      .sort({ createdAt: -1 });
    return res.json(grns);
  }

  if (req.method === 'POST') {
    const grn = await GRN.create({ ...req.body, companyId });
    return res.status(201).json(grn);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
