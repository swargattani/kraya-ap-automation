import { dbConnect } from '../../../lib/mongodb';
import PO from '../../../models/PO';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { status, vendorId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (vendorId) filter.vendorId = vendorId;
    const pos = await PO.find(filter).sort({ createdAt: -1 });
    return res.json(pos);
  }

  if (req.method === 'POST') {
    const po = await PO.create(req.body);
    return res.status(201).json(po);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
