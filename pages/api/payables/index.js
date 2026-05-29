import { dbConnect } from '../../../lib/mongodb';
import Payable from '../../../models/Payable';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const payables = await Payable.find(filter)
      .populate('invoiceId', 'invoiceNo invoiceDate totalAmount')
      .populate('vendorId', 'name gstin bankAccount ifsc')
      .sort({ dueDate: 1 });
    return res.json(payables);
  }

  if (req.method === 'POST') {
    const payable = await Payable.create(req.body);
    return res.status(201).json(payable);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
