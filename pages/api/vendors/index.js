import { dbConnect } from '../../../lib/mongodb';
import Vendor from '../../../models/Vendor';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const vendors = await Vendor.find({ active: true }).sort({ name: 1 });
    return res.json(vendors);
  }

  if (req.method === 'POST') {
    const vendor = await Vendor.create(req.body);
    return res.status(201).json(vendor);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
