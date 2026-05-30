import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import GRN from '../../../models/GRN';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const companyId = session.user.companyId;

  await dbConnect();
  const { id } = req.query;

  if (req.method === 'GET') {
    const grn = await GRN.findOne({ _id: id, ...(companyId ? { companyId } : {}) })
      .populate('poId')
      .populate('invoiceId')
      .populate('vendorId');
    if (!grn) return res.status(404).json({ error: 'GRN not found' });
    return res.json(grn);
  }

  if (req.method === 'PUT') {
    const grn = await GRN.findOneAndUpdate(
      { _id: id, ...(companyId ? { companyId } : {}) },
      req.body,
      { new: true }
    );
    if (!grn) return res.status(404).json({ error: 'GRN not found' });

    // When GRN is approved, update linked invoice
    if (req.body.status === 'approved' && grn.invoiceId) {
      await Invoice.findByIdAndUpdate(grn.invoiceId, {
        grnId: grn._id,
        matchStatus: 'three_way_matched',
        status: 'grn_matched',
      });
    }

    return res.json(grn);
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end();
}
