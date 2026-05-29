// Parses raw OCR / PDF text into structured Indian GST invoice fields

const GSTIN_RE = /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/g;
const IRN_RE   = /\b([a-f0-9]{64})\b/i;

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseNum(str) {
  if (!str) return null;
  const n = parseFloat(String(str).replace(/,/g, ''));
  return isNaN(n) ? null : n;
}

function parseDate(str) {
  if (!str) return null;
  const parts = str.split(/[\/\-\.]/);
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = '20' + y;
  const dt = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
  return isNaN(dt) ? null : dt;
}

// Find amount after a label. Looks at same line + next line (~200 chars).
// Handles ₹, ¹ (₹ rendered via Helvetica), Rs., INR prefixes.
function findAmount(text, labelRe) {
  const m = text.match(labelRe);
  if (!m) return null;
  const after = text.slice(m.index + m[0].length, m.index + m[0].length + 250);
  // Match first decimal number (currency amounts always have 2 dp)
  const num = after.match(/[\d,]+\.\d{2}/);
  return num ? parseNum(num[0]) : null;
}

// Find text after a label — same line or next line
function findText(text, labelRe) {
  const m = text.match(labelRe);
  if (!m) return null;
  const after = text.slice(m.index + m[0].length, m.index + m[0].length + 200).trim();
  // Take up to next newline, strip leading punctuation/spaces
  const line = after.replace(/^[\s:\-]+/, '').split('\n')[0].trim();
  return line || null;
}

// ── Label regexes ─────────────────────────────────────────────────────────────

const LABEL = {
  invoiceNo:    /(?:invoice\s*(?:no|number|#|num)|bill\s*no|inv\s*no|tax\s*invoice\s*no)\s*[:\-]?\s*/i,
  invoiceDate:  /(?:invoice\s*date|date\s*of\s*invoice|bill\s*date|dated?)\s*[:\-]?\s*/i,
  poRef:        /(?:po\s*(?:no|number|#|ref(?:erence)?)|purchase\s*order\s*(?:no|number|#))\s*[:\-]?\s*/i,
  state:        /place\s*of\s*supply\s*[:\-]?\s*/i,
  grandTotal:   /(?:grand\s*total|total\s*(?:invoice\s*)?(?:value|amount)|amount\s*payable|total\s*taxable\s*value)\s*[:\-]?\s*/i,
  subtotal:     /(?:subtotal|taxable\s*(?:value|amount)|assessable\s*value)\s*[:\-]?\s*/i,
  // Require "Total" prefix to avoid matching standalone "CGST" in table headers
  cgst:         /total\s*cgst\s*[:\-]?\s*/i,
  sgst:         /total\s*sgst\s*[:\-]?\s*/i,
  igst:         /total\s*igst\s*[:\-]?\s*/i,
  tds:          /tds\s*(?:@\s*[\d.]+\s*%?)?\s*(?:\([^)]+\))?\s*[:\-]?\s*/i,
  netPayable:   /net\s*(?:amount\s*)?payable\s*[:\-]?\s*/i,
};

// ── Vendor name extraction ─────────────────────────────────────────────────────

const COMPANY_SUFFIXES = /\b(pvt\.?\s*ltd\.?|ltd\.?|private\s+limited|limited|llp|llc|& co\.?|and co\.?|industries|trading|enterprises|solutions|services|foods|snacks|corporation|associates|distributors|manufacturers|exports|imports)\b/i;
const ADDRESS_LINE_RE  = /\b(\d{3,6}|pin\s*[:–-]?\s*\d{6}|ph\.?|tel\.?|mob\.?|fax\.?|email|www\.|@|road|street|nagar|colony|sector|phase|plot|block|flat|floor|building|near|opp\.?|dist\.?)\b/i;
const NOISE_RE = /^(gstin|gst\s*no|cin|pan|tax\s*invoice|e-invoice|receipt|delivery|original|duplicate|supplier|seller|buyer|consignee|ship\s*to|bill\s*to|recipient|irn)\s*[:\-\/]?\s*$/i;

function extractVendorName(text, gstins) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Strategy 1: explicit label on same line
  for (const line of lines) {
    const m = line.match(/(?:supplier|seller|vendor|sold\s*by|bill\s*from|consignor)\s*[:\-]\s*(.+)/i);
    if (m && m[1].trim().length > 3 && !m[1].match(GSTIN_RE)) return m[1].trim();
  }

  // Strategy 2: company suffix near first GSTIN
  if (gstins.length > 0) {
    const gIdx = lines.findIndex(l => l.toUpperCase().includes(gstins[0]));
    const search = gIdx > 0 ? lines.slice(0, gIdx) : lines.slice(0, 12);
    for (let i = search.length - 1; i >= 0; i--) {
      const l = search[i];
      if (COMPANY_SUFFIXES.test(l) && !ADDRESS_LINE_RE.test(l) && l.length > 4)
        return clean(l);
    }
    // Strategy 3: first clean line before GSTIN
    for (let i = Math.min(gIdx - 1, search.length - 1); i >= 0; i--) {
      const l = search[i];
      if (l.length > 4 && l.length < 100 && !ADDRESS_LINE_RE.test(l) &&
          !NOISE_RE.test(l) && !/^\d/.test(l) && !l.match(GSTIN_RE))
        return clean(l);
    }
  }

  // Strategy 4: first prominent line in doc
  for (const l of lines.slice(0, 10)) {
    if (l.length > 4 && l.length < 100 && !ADDRESS_LINE_RE.test(l) &&
        !NOISE_RE.test(l) && !/^\d/.test(l) && !l.match(GSTIN_RE))
      return clean(l);
  }
  return null;
}

function clean(n) {
  return n.replace(/\s*[,|:–\-]\s*$/, '').replace(/\s+/g, ' ').trim();
}

// ── Line item extraction ───────────────────────────────────────────────────────

function extractLineItems(text) {
  const items = [];

  // Pattern 1: spaced columns (most PDFs from accounting software)
  const spaced = /(\d{4,8})\s+(.+?)\s+([\d.]+)\s+([A-Z]{2,5})\s+([\d,.]+)\s+([\d,.]+)/g;
  let m;
  while ((m = spaced.exec(text)) !== null) {
    const qty = parseNum(m[3]), rate = parseNum(m[5]), amount = parseNum(m[6]);
    if (qty && rate && amount) {
      items.push({ hsnCode: m[1], description: m[2].trim(), qty, unit: m[4], rate, amount });
    }
  }
  if (items.length > 0) return items;

  // Pattern 2: concatenated cells (pdfkit / some generators)
  const concat = /\d+([A-Za-z][^0-9\n]{3,60?})(\d{4,8})(\d{1,5})([A-Z]{2,5})([\d,.]+)([\d,.]+)/g;
  while ((m = concat.exec(text)) !== null) {
    const qty = parseNum(m[3]), rate = parseNum(m[5]), amount = parseNum(m[6]);
    if (qty && rate && amount) {
      items.push({ hsnCode: m[2], description: m[1].trim(), qty, unit: m[4], rate, amount });
    }
  }
  return items;
}

// ── Main parser ────────────────────────────────────────────────────────────────

export function parseInvoiceText(rawText) {
  const text = rawText || '';
  const upper = text.toUpperCase();

  const gstins      = [...new Set(upper.match(GSTIN_RE) || [])];
  const irnMatch    = upper.match(IRN_RE);

  const invoiceNo   = findText(text, LABEL.invoiceNo);
  const dateStr     = findText(text, LABEL.invoiceDate);
  const poRef       = findText(text, LABEL.poRef);
  const stateStr    = findText(text, LABEL.state);

  let totalAmount   = findAmount(text, LABEL.grandTotal);
  const netPayable  = findAmount(text, LABEL.netPayable);
  let subtotal      = findAmount(text, LABEL.subtotal);
  const totalCGST   = findAmount(text, LABEL.cgst);
  const totalSGST   = findAmount(text, LABEL.sgst);
  const totalIGST   = findAmount(text, LABEL.igst);
  const tds         = findAmount(text, LABEL.tds);

  // Fallback: derive grand total from components if label not found
  if (!totalAmount && subtotal && (totalCGST || totalSGST || totalIGST)) {
    totalAmount = subtotal + (totalCGST || 0) + (totalSGST || 0) + (totalIGST || 0);
  }
  // Fallback: derive subtotal from grand total and taxes
  if (!subtotal && totalAmount && (totalCGST || totalSGST)) {
    subtotal = totalAmount - (totalCGST || 0) - (totalSGST || 0) - (totalIGST || 0);
  }
  // Fallback: derive CGST/SGST from subtotal when "Total CGST" label not in doc
  // (e.g. invoices that only show per-line GST without a summary row)
  if (!totalCGST && !totalSGST && subtotal && totalAmount) {
    const totalTax = totalAmount - subtotal;
    // Assume CGST = SGST = half of total tax (intra-state supply)
    if (totalTax > 0) {
      const half = Math.round(totalTax / 2 * 100) / 100;
      // Only assign if no IGST (inter-state would use IGST not CGST+SGST)
      if (!totalIGST) { /* leave null — user can verify */ }
    }
  }

  const vendorName  = extractVendorName(text, gstins);
  const items       = extractLineItems(text);

  return {
    irn:           irnMatch?.[1]?.toLowerCase() || null,
    invoiceNo:     invoiceNo || null,
    invoiceDate:   parseDate(dateStr) || null,
    vendorGSTIN:   gstins[0] || null,
    buyerGSTIN:    gstins[1] || null,
    vendorName,
    placeOfSupply: stateStr ? stateStr.replace(/\(.*\)/, '').trim() : null,
    poRef:         poRef || null,
    subtotal,
    totalCGST,
    totalSGST,
    totalIGST,
    tds,
    totalAmount,
    netPayable:    netPayable || (tds ? (totalAmount || 0) - tds : totalAmount),
    items,
    confidence:    computeConfidence({ irnMatch, invoiceNo, totalAmount, gstins, vendorName }),
  };
}

function computeConfidence({ irnMatch, invoiceNo, totalAmount, gstins, vendorName }) {
  let s = 0;
  if (irnMatch)   s += 30;
  if (invoiceNo)  s += 20;
  if (totalAmount) s += 20;
  if (gstins.length >= 1) s += 10;
  if (gstins.length >= 2) s += 10;
  if (vendorName) s += 10;
  return s;
}
