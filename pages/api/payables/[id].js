import { dbConnect } from '../../../lib/mongodb';
import Payable from '../../../models/Payable';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'GET') {
    const payable = await Payable.findById(id).populate('invoiceId').populate('vendorId');
    if (!payable) return res.status(404).json({ error: 'Payable not found' });
    return res.json(payable);
  }

  if (req.method === 'PUT') {
    const payable = await Payable.findByIdAndUpdate(id, req.body, { new: true });
    if (!payable) return res.status(404).json({ error: 'Payable not found' });

    // Sync invoice status
    if (req.body.status === 'paid') {
      await Invoice.findByIdAndUpdate(payable.invoiceId, { status: 'paid' });
    }

    return res.json(payable);
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end();
}
