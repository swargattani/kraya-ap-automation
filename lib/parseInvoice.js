// Parses raw OCR / PDF text into structured Indian GST invoice fields

const GSTIN_RE = /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/g;
const IRN_RE = /\b([a-f0-9]{64})\b/i;
const INV_NO_RE = /(?:invoice\s*(?:no|number|#|num)|bill\s*no|inv\s*no|tax\s*invoice\s*no)\s*[:\-]?\s*([A-Z0-9\-\/]+)/i;
const DATE_RE = /(?:invoice\s*date|date\s*of\s*invoice|bill\s*date|dated?)\s*[:\-]?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i;
const TOTAL_RE = /(?:total\s*(?:invoice\s*)?(?:value|amount)|grand\s*total|net\s*payable|amount\s*payable|total\s*tax(?:able)?\s*value)\s*[:\-]?\s*(?:rs\.?|inr\.?|₹)?\s*([\d,]+(?:\.\d{2})?)/i;
const TAXABLE_RE = /(?:taxable\s*(?:value|amount)|subtotal|assessable\s*value)\s*[:\-]?\s*(?:rs\.?|inr\.?|₹)?\s*([\d,]+(?:\.\d{2})?)/i;
const CGST_RE = /cgst\s*(?:@\s*[\d.]+\s*%?)?\s*[:\-]?\s*(?:rs\.?|inr\.?|₹)?\s*([\d,]+(?:\.\d{2})?)/i;
const SGST_RE = /sgst\s*(?:@\s*[\d.]+\s*%?)?\s*[:\-]?\s*(?:rs\.?|inr\.?|₹)?\s*([\d,]+(?:\.\d{2})?)/i;
const IGST_RE = /igst\s*(?:@\s*[\d.]+\s*%?)?\s*[:\-]?\s*(?:rs\.?|inr\.?|₹)?\s*([\d,]+(?:\.\d{2})?)/i;
const TDS_RE = /tds\s*(?:@\s*[\d.]+\s*%?)?\s*[:\-]?\s*(?:rs\.?|inr\.?|₹)?\s*([\d,]+(?:\.\d{2})?)/i;
const HSN_LINE_RE = /(\d{4,8})\s+(.+?)\s+([\d.]+)\s+([A-Z]+)\s+([\d,.]+)\s+([\d,.]+)\s+([\d,.]+)\s+([\d,.]+)/g;
const PO_RE = /(?:po\s*(?:no|number|#)|purchase\s*order\s*(?:no|number|#))\s*[:\-]?\s*([A-Z0-9\-\/]+)/i;
const STATE_SUPPLY_RE = /place\s*of\s*supply\s*[:\-]?\s*([A-Za-z\s]+?)(?:\n|\(|\d|$)/i;

// Indian company name indicators
const COMPANY_SUFFIXES = /\b(pvt\.?\s*ltd\.?|private\s+limited|limited|llp|llc|& co\.?|and co\.?|industries|trading|enterprises|solutions|services|foods|snacks|corporation|corp\.?|associates|distributors|suppliers|manufacturers|exports|imports)\b/i;

// Lines that are definitely NOT company names
const ADDRESS_LINE_RE = /\b(\d{3,6}|pin\s*[:–-]?\s*\d{6}|ph\.?|tel\.?|mob\.?|fax\.?|email|www\.|@|road|street|nagar|colony|sector|phase|plot|block|flat|floor|building|near|opp\.?|dist\.?|state\s*[:–]|country\s*[:–])\b/i;
const NOISE_RE = /^(gstin|gst\s*no|cin|pan|tax\s*invoice|invoice|bill|e-invoice|receipt|delivery|purchase|original|duplicate|subject|dear|attention|to\s*:?|from\s*:?|seller|supplier|buyer|consignee|ship\s*to|bill\s*to)\s*[:\-]?\s*$/i;

function extractVendorName(text, gstins) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Strategy 1: explicit label before company name on same or next line
  const labelRe = /(?:supplier|seller|vendor|sold\s*by|bill\s*from|from|consignor)\s*[:\-]\s*(.+)/i;
  for (const line of lines) {
    const m = line.match(labelRe);
    if (m && m[1].trim().length > 3 && !m[1].match(GSTIN_RE)) {
      return m[1].trim();
    }
  }

  // Strategy 2: find lines with known Indian company suffixes
  // Prefer the one closest to (and before) the first GSTIN
  if (gstins.length > 0) {
    const firstGstinIdx = lines.findIndex(l => l.toUpperCase().includes(gstins[0]));
    const searchLines = firstGstinIdx > 0 ? lines.slice(0, firstGstinIdx) : lines.slice(0, 10);

    // Look for company suffix match, from bottom up (closest to GSTIN wins)
    for (let i = searchLines.length - 1; i >= 0; i--) {
      const line = searchLines[i];
      if (COMPANY_SUFFIXES.test(line) && !ADDRESS_LINE_RE.test(line) && line.length > 4) {
        return cleanCompanyName(line);
      }
    }

    // Strategy 3: first non-address, non-noise line before the GSTIN
    for (let i = Math.min(firstGstinIdx - 1, searchLines.length - 1); i >= 0; i--) {
      const line = searchLines[i];
      if (
        line.length > 4 &&
        line.length < 100 &&
        !ADDRESS_LINE_RE.test(line) &&
        !NOISE_RE.test(line) &&
        !/^\d/.test(line) &&
        !line.match(GSTIN_RE)
      ) {
        return cleanCompanyName(line);
      }
    }
  }

  // Strategy 4: fallback — first prominent line in document (often the company letterhead)
  for (const line of lines.slice(0, 8)) {
    if (
      line.length > 4 &&
      line.length < 100 &&
      !ADDRESS_LINE_RE.test(line) &&
      !NOISE_RE.test(line) &&
      !/^\d/.test(line) &&
      !line.match(GSTIN_RE)
    ) {
      return cleanCompanyName(line);
    }
  }

  return null;
}

function cleanCompanyName(name) {
  // Remove trailing punctuation, GSTIN fragments, extra spaces
  return name
    .replace(/\s*[,|:–\-]\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseNum(str) {
  if (!str) return null;
  const n = parseFloat(str.replace(/,/g, ''));
  return isNaN(n) ? null : n;
}

function parseDate(str) {
  if (!str) return null;
  const parts = str.split(/[\/\-\.]/);
  if (parts.length === 3) {
    let [d, m, y] = parts;
    if (y.length === 2) y = '20' + y;
    return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
  }
  return null;
}

export function parseInvoiceText(rawText) {
  const text = rawText || '';
  const upper = text.toUpperCase();

  const gstins = [...new Set(upper.match(GSTIN_RE) || [])];
  const irnMatch = upper.match(IRN_RE);
  const invNoMatch = text.match(INV_NO_RE);
  const dateMatch = text.match(DATE_RE);
  const totalMatch = text.match(TOTAL_RE);
  const taxableMatch = text.match(TAXABLE_RE);
  const cgstMatch = text.match(CGST_RE);
  const sgstMatch = text.match(SGST_RE);
  const igstMatch = text.match(IGST_RE);
  const tdsMatch = text.match(TDS_RE);
  const poMatch = text.match(PO_RE);
  const stateMatch = text.match(STATE_SUPPLY_RE);

  const totalCGST = parseNum(cgstMatch?.[1]);
  const totalSGST = parseNum(sgstMatch?.[1]);
  const totalIGST = parseNum(igstMatch?.[1]);
  const tds = parseNum(tdsMatch?.[1]);
  const totalAmount = parseNum(totalMatch?.[1]);
  const subtotal = parseNum(taxableMatch?.[1]);

  const vendorName = extractVendorName(text, gstins);

  // Extract line items from HSN pattern
  const items = [];
  let m;
  const hsnRe = new RegExp(HSN_LINE_RE.source, 'g');
  while ((m = hsnRe.exec(text)) !== null) {
    items.push({
      hsnCode: m[1],
      description: m[2].trim(),
      qty: parseNum(m[3]),
      unit: m[4],
      rate: parseNum(m[5]),
      amount: parseNum(m[6]),
      taxRate: null,
      cgst: null,
      sgst: null,
      igst: null,
    });
  }

  return {
    irn: irnMatch?.[1]?.toLowerCase() || null,
    invoiceNo: invNoMatch?.[1]?.trim() || null,
    invoiceDate: parseDate(dateMatch?.[1]) || null,
    vendorGSTIN: gstins[0] || null,
    buyerGSTIN: gstins[1] || null,
    vendorName,
    placeOfSupply: stateMatch?.[1]?.trim() || null,
    poRef: poMatch?.[1]?.trim() || null,
    subtotal,
    totalCGST,
    totalSGST,
    totalIGST,
    tds,
    totalAmount,
    netPayable: tds ? (totalAmount || 0) - tds : totalAmount,
    items: items.length > 0 ? items : [],
    confidence: computeConfidence({ irn: irnMatch, invoiceNo: invNoMatch, totalAmount, gstins, vendorName }),
  };
}

function computeConfidence({ irn, invoiceNo, totalAmount, gstins, vendorName }) {
  let score = 0;
  if (irn) score += 30;
  if (invoiceNo) score += 20;
  if (totalAmount) score += 20;
  if (gstins.length >= 1) score += 10;
  if (gstins.length >= 2) score += 10;
  if (vendorName) score += 10;
  return score;
}
