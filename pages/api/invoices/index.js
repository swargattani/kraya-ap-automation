import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const companyId = session.user.companyId;

  await dbConnect();

  if (req.method === 'GET') {
    const { status, matchStatus, vendorId } = req.query;
    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (status) filter.status = status;
    if (matchStatus) filter.matchStatus = matchStatus;
    if (vendorId) filter.vendorId = vendorId;

    const invoices = await Invoice.find(filter)
      .populate('vendorId', 'name gstin')
      .populate('poId', 'poNo')
      .populate('grnId', 'grnNo')
      .sort({ createdAt: -1 });

    return res.json(invoices);
  }

  if (req.method === 'POST') {
    const invoice = await Invoice.create({ ...req.body, companyId });
    return res.status(201).json(invoice);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
