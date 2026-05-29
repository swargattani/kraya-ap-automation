import { dbConnect } from '../../../lib/mongodb';
import Invoice from '../../../models/Invoice';
import PO from '../../../models/PO';
import GRN from '../../../models/GRN';
import { matchLines } from '../../../lib/autoMatch';

function threeWayCheck(po, invoice, grn) {
  const checks = [];

  // Amount check
  const amtDiff = Math.abs(invoice.totalAmount - po.totalAmount);
  const amtPct = po.totalAmount ? amtDiff / po.totalAmount * 100 : 0;
  checks.push({
    label: 'Invoice vs PO amount',
    po: po.totalAmount,
    inv: invoice.totalAmount,
    passed: amtPct <= 5,
    delta: amtDiff,
    pct: amtPct.toFixed(1),
  });

  if (grn) {
    // Quantity received
    const totalOrdered = po.items.reduce((s, i) => s + (i.qty || 0), 0);
    const totalReceived = grn.items.reduce((s, i) => s + (i.acceptedQty || i.receivedQty || 0), 0);
    const qtyPct = totalOrdered ? Math.abs(totalOrdered - totalReceived) / totalOrdered * 100 : 0;
    checks.push({
      label: 'GRN received vs PO ordered',
      po: totalOrdered,
      grn: totalReceived,
      passed: qtyPct <= 5,
      pct: qtyPct.toFixed(1),
    });
  }

  const allPassed = checks.every(c => c.passed);

  return { checks, allPassed };
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { action, invoiceId, poId, grnId } = req.body;

  if (action === 'link_po') {
    // Link invoice to a PO
    const [invoice, po] = await Promise.all([
      Invoice.findById(invoiceId),
      PO.findById(poId),
    ]);

    if (!invoice || !po) return res.status(404).json({ error: 'Invoice or PO not found' });

    const lineMatches = matchLines(po.items || [], invoice.items || []);
    const hasMismatch = lineMatches.some(l => l.match === 'mismatch');

    await Invoice.findByIdAndUpdate(invoiceId, {
      poId: po._id,
      matchStatus: 'po_matched',
      status: hasMismatch ? 'pending' : 'po_matched',
    });

    return res.json({ lineMatches, hasMismatch });
  }

  if (action === 'three_way') {
    const [invoice, grn] = await Promise.all([
      Invoice.findById(invoiceId).populate('poId'),
      grnId ? GRN.findById(grnId) : Promise.resolve(null),
    ]);

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    if (!invoice.poId) return res.status(400).json({ error: 'Invoice has no linked PO' });

    const result = threeWayCheck(invoice.poId, invoice, grn);
    const lineMatches = matchLines(invoice.poId.items || [], invoice.items || []);

    if (result.allPassed) {
      const updates = { matchStatus: 'three_way_matched', status: 'approved' };
      if (grn) updates.grnId = grn._id;
      await Invoice.findByIdAndUpdate(invoiceId, updates);
    }

    return res.json({ ...result, lineMatches, invoice, po: invoice.poId, grn });
  }

  return res.status(400).json({ error: 'Unknown action' });
}
