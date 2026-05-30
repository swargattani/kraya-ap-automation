import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import Invoice from '../../../models/Invoice';
import Payable from '../../../models/Payable';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const companyId = session.user.companyId;

  await dbConnect();
  const { id } = req.query;

  if (req.method === 'GET') {
    const invoice = await Invoice.findOne({ _id: id, ...(companyId ? { companyId } : {}) })
      .populate('vendorId')
      .populate('poId')
      .populate('grnId');
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    return res.json(invoice);
  }

  if (req.method === 'PUT') {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: id, ...(companyId ? { companyId } : {}) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    // Auto-create payable when invoice is approved
    if (req.body.status === 'approved') {
      const existing = await Payable.findOne({ invoiceId: id });
      if (!existing) {
        const dueDate = new Date(invoice.invoiceDate || Date.now());
        dueDate.setDate(dueDate.getDate() + 30);
        await Payable.create({
          companyId,
          invoiceId: invoice._id,
          vendorId: invoice.vendorId,
          vendorName: invoice.vendorName,
          vendorGSTIN: invoice.vendorGSTIN,
          invoiceNo: invoice.invoiceNo,
          invoiceDate: invoice.invoiceDate,
          dueDate,
          grossAmount: invoice.totalAmount,
          tdsDeducted: invoice.tds || 0,
          netPayable: invoice.netPayable || invoice.totalAmount,
        });
      }
    }

    return res.json(invoice);
  }

  if (req.method === 'DELETE') {
    await Invoice.findOneAndDelete({ _id: id, ...(companyId ? { companyId } : {}) });
    return res.json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end();
}
