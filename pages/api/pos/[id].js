import { dbConnect } from '../../../lib/mongodb';
import PO from '../../../models/PO';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'GET') {
    const po = await PO.findById(id).populate('vendorId');
    if (!po) return res.status(404).json({ error: 'PO not found' });
    return res.json(po);
  }

  if (req.method === 'PUT') {
    const po = await PO.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!po) return res.status(404).json({ error: 'PO not found' });
    return res.json(po);
  }

  if (req.method === 'DELETE') {
    await PO.findByIdAndDelete(id);
    return res.json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end();
}
