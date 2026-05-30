import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import Payable from '../../../models/Payable';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const companyId = session.user.companyId;

  await dbConnect();

  if (req.method === 'GET') {
    const { status } = req.query;
    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (status) filter.status = status;
    const payables = await Payable.find(filter)
      .populate('invoiceId', 'invoiceNo invoiceDate totalAmount')
      .populate('vendorId', 'name gstin bankAccount ifsc')
      .sort({ dueDate: 1 });
    return res.json(payables);
  }

  if (req.method === 'POST') {
    const payable = await Payable.create({ ...req.body, companyId });
    return res.status(201).json(payable);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
