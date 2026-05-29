import { dbConnect } from '../../../lib/mongodb';
import GRN from '../../../models/GRN';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { status, poId, invoiceId } = req.query;
    const filter = {};
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
    const grn = await GRN.create(req.body);
    return res.status(201).json(grn);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
