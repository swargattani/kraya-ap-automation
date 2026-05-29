import { dbConnect } from '../../../lib/mongodb';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { status, matchStatus, vendorId } = req.query;
    const filter = {};
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
    const invoice = await Invoice.create(req.body);
    return res.status(201).json(invoice);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
