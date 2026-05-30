import Invoice from '../models/Invoice';
import PO from '../models/PO';

export function matchLines(poItems = [], invItems = []) {
  return invItems.map((invLine) => {
    const poLine =
      poItems.find(p => p.hsnCode && p.hsnCode === invLine.hsnCode) ||
      poItems.find(p => p.description?.toLowerCase().includes(
        invLine.description?.toLowerCase()?.split(' ')[0] || ''
      ));

    if (!poLine) return { invLine, poLine: null, match: 'missing', diffs: [] };

    const diffs = [];
    const qtyDiff  = invLine.qty - poLine.qty;
    const rateDiff = invLine.rate - poLine.rate;
    const ratePct  = poLine.rate ? Math.abs(rateDiff / poLine.rate * 100) : 0;
    const qtyPct   = poLine.qty  ? Math.abs(qtyDiff  / poLine.qty  * 100) : 0;

    if (Math.abs(qtyDiff) > 0.001)
      diffs.push({ field: 'qty',  po: poLine.qty,  inv: invLine.qty,  delta: qtyDiff,  pct: qtyPct.toFixed(1) });
    if (ratePct > 1)
      diffs.push({ field: 'rate', po: poLine.rate, inv: invLine.rate, delta: rateDiff, pct: ratePct.toFixed(1) });

    const isMismatch = ratePct > 5 || qtyPct > 5;
    return { invLine, poLine, match: diffs.length === 0 ? 'exact' : isMismatch ? 'mismatch' : 'tolerance', diffs };
  });
}

// Find the best open PO for an invoice and link it automatically.
// Returns { po, lineMatches, hasMismatch } or null if no match found.
export async function autoMatchPO(invoice, companyId) {
  const candidates = [];
  const companyFilter = companyId ? { companyId } : {};

  // Priority 1: explicit PO reference on invoice
  if (invoice.poRef) {
    const byRef = await PO.findOne({ poNo: invoice.poRef, status: 'open', ...companyFilter });
    if (byRef) candidates.push({ po: byRef, score: 100 });
  }

  // Priority 2: same vendor GSTIN + open status
  if (invoice.vendorGSTIN) {
    const byGstin = await PO.find({ vendorGSTIN: invoice.vendorGSTIN, status: 'open', ...companyFilter });
    byGstin.forEach(po => {
      if (candidates.find(c => c.po._id.equals(po._id))) return;
      // Score by amount proximity (within 20%)
      const amtDiff = invoice.totalAmount && po.totalAmount
        ? Math.abs(invoice.totalAmount - po.totalAmount) / po.totalAmount
        : 1;
      if (amtDiff <= 0.20) candidates.push({ po, score: Math.round((1 - amtDiff) * 80) });
    });
  }

  // Priority 3: vendor name fuzzy match
  if (!candidates.length && invoice.vendorName) {
    const nameRe = new RegExp(invoice.vendorName.split(' ')[0], 'i');
    const byName = await PO.find({ vendorName: nameRe, status: 'open', ...companyFilter });
    byName.forEach(po => {
      const amtDiff = invoice.totalAmount && po.totalAmount
        ? Math.abs(invoice.totalAmount - po.totalAmount) / po.totalAmount
        : 1;
      if (amtDiff <= 0.20) candidates.push({ po, score: Math.round((1 - amtDiff) * 60) });
    });
  }

  if (!candidates.length) return null;

  // Pick highest-scoring candidate
  candidates.sort((a, b) => b.score - a.score);
  const { po } = candidates[0];

  const lineMatches = matchLines(po.items || [], invoice.items || []);
  const hasMismatch = lineMatches.some(l => l.match === 'mismatch');
  const allExact    = lineMatches.length > 0 && lineMatches.every(l => l.match === 'exact');

  const matchStatus = allExact ? 'po_matched' : hasMismatch ? 'po_matched' : 'po_matched';
  const status      = hasMismatch ? 'pending' : 'po_matched';

  await Invoice.findByIdAndUpdate(invoice._id, {
    poId: po._id,
    matchStatus,
    status,
    autoMatched: true,
    matchDiffs: hasMismatch ? lineMatches.filter(l => l.diffs.length > 0).map(l => l.diffs).flat() : [],
  });

  return { po, lineMatches, hasMismatch, allExact };
}
