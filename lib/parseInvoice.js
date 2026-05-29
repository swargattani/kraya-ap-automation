// Parses raw OCR / PDF text into structured Indian GST invoice fields

const GSTIN_RE = /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/g;
const IRN_RE = /\b([a-f0-9]{64})\b/i;
const INV_NO_RE = /(?:invoice\s*(?:no|number|#|num)|bill\s*no|inv\s*no)\s*[:\-]?\s*([A-Z0-9\-\/]+)/i;
const DATE_RE = /(?:invoice\s*date|date\s*of\s*invoice|bill\s*date|dated?)\s*[:\-]?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i;
const TOTAL_RE = /(?:total\s*(?:invoice\s*)?(?:value|amount)|grand\s*total|net\s*payable|amount\s*payable)\s*[:\-]?\s*(?:rs\.?|inr\.?|₹)?\s*([\d,]+(?:\.\d{2})?)/i;
const TAXABLE_RE = /(?:taxable\s*(?:value|amount)|subtotal)\s*[:\-]?\s*(?:rs\.?|inr\.?|₹)?\s*([\d,]+(?:\.\d{2})?)/i;
const CGST_RE = /cgst\s*(?:@\s*[\d.]+\s*%?)?\s*[:\-]?\s*(?:rs\.?|inr\.?|₹)?\s*([\d,]+(?:\.\d{2})?)/i;
const SGST_RE = /sgst\s*(?:@\s*[\d.]+\s*%?)?\s*[:\-]?\s*(?:rs\.?|inr\.?|₹)?\s*([\d,]+(?:\.\d{2})?)/i;
const IGST_RE = /igst\s*(?:@\s*[\d.]+\s*%?)?\s*[:\-]?\s*(?:rs\.?|inr\.?|₹)?\s*([\d,]+(?:\.\d{2})?)/i;
const TDS_RE = /tds\s*(?:@\s*[\d.]+\s*%?)?\s*[:\-]?\s*(?:rs\.?|inr\.?|₹)?\s*([\d,]+(?:\.\d{2})?)/i;
const HSN_LINE_RE = /(\d{4,8})\s+(.+?)\s+([\d.]+)\s+([A-Z]+)\s+([\d,.]+)\s+([\d,.]+)\s+([\d,.]+)\s+([\d,.]+)/g;
const PO_RE = /(?:po\s*(?:no|number|#)|purchase\s*order\s*(?:no|number|#))\s*[:\-]?\s*([A-Z0-9\-\/]+)/i;
const VENDOR_NAME_RE = /(?:from|sold\s*by|vendor|supplier)\s*[:\-]?\s*([A-Z][A-Za-z\s&.,]+?)(?:\n|GSTIN|GST)/i;
const STATE_SUPPLY_RE = /place\s*of\s*supply\s*[:\-]?\s*([A-Za-z\s]+?)(?:\n|\(|$)/i;

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
  const vendorMatch = text.match(VENDOR_NAME_RE);
  const stateMatch = text.match(STATE_SUPPLY_RE);

  const totalCGST = parseNum(cgstMatch?.[1]);
  const totalSGST = parseNum(sgstMatch?.[1]);
  const totalIGST = parseNum(igstMatch?.[1]);
  const tds = parseNum(tdsMatch?.[1]);
  const totalAmount = parseNum(totalMatch?.[1]);
  const subtotal = parseNum(taxableMatch?.[1]);

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
    vendorName: vendorMatch?.[1]?.trim() || null,
    placeOfSupply: stateMatch?.[1]?.trim() || null,
    poRef: poMatch?.[1]?.trim() || null,
    subtotal: subtotal,
    totalCGST,
    totalSGST,
    totalIGST,
    tds,
    totalAmount,
    netPayable: tds ? (totalAmount || 0) - tds : totalAmount,
    items: items.length > 0 ? items : [],
    confidence: computeConfidence({ irn: irnMatch, invoiceNo: invNoMatch, totalAmount, gstins }),
  };
}

function computeConfidence({ irn, invoiceNo, totalAmount, gstins }) {
  let score = 0;
  if (irn) score += 30;
  if (invoiceNo) score += 20;
  if (totalAmount) score += 20;
  if (gstins.length >= 1) score += 15;
  if (gstins.length >= 2) score += 15;
  return score;
}
