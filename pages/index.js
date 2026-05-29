import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

// ─── Icons (inline SVG) ────────────────────────────────────────────────────
function Icon({ n, size = 16 }) {
  const icons = {
    dashboard: <path d="M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    inbox: <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 0l8 8 8-8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    upload: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    match: <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    check3: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    register: <path d="M9 17H7A5 5 0 013 12V9a9 9 0 0118 0v3a5 5 0 01-5 5h-2m-3 0v4m3-4v4m-3 0h3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    eway: <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    po: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    vendors: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    search: <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    x: <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    check: <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    arrow_r: <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    arrow_l: <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    chevron_d: <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    plus: <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    file: <><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    warn: <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    info: <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    dot: <circle cx="12" cy="12" r="4" fill="currentColor"/>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
    refresh: <path d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    download: <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    edit: <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    trash: <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    link: <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    grn: <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block', flexShrink: 0 }}>
      {icons[n] || null}
    </svg>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────
const fmt = (n) => n == null ? '—' : new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);
const fmtAmt = (n) => n == null ? '—' : '₹' + fmt(n);
const fmtDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
const statusBadge = (s) => {
  const map = {
    pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected',
    paid: 'badge-paid', po_matched: 'badge-po_matched', grn_matched: 'badge-grn_matched',
    scheduled: 'badge-scheduled', on_hold: 'badge-on_hold',
    unmatched: 'badge-unmatched', three_way_matched: 'badge-three_way_matched',
    open: 'badge-open', partial: 'badge-pending', fulfilled: 'badge-approved',
    draft: 'badge-pending', ocr: 'badge-ocr', manual: 'badge-manual',
  };
  return map[s] || 'badge-pending';
};
const statusLabel = (s) => ({
  pending: 'Pending', approved: 'Approved', rejected: 'Rejected', paid: 'Paid',
  po_matched: 'PO Matched', grn_matched: 'GRN Matched', scheduled: 'Scheduled',
  on_hold: 'On Hold', unmatched: 'Unmatched', three_way_matched: '3-Way Matched',
  open: 'Open', partial: 'Partial', fulfilled: 'Fulfilled', draft: 'Draft',
  ocr: 'OCR', manual: 'Manual',
}[s] || s);

function Badge({ status, label }) {
  return <span className={`badge ${statusBadge(status)}`}>{label || statusLabel(status)}</span>;
}

async function api(path, opts = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(path, {
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      ...opts,
      body: opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)
        ? JSON.stringify(opts.body)
        : opts.body,
      signal: controller.signal,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Toast ─────────────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => { if (!msg) return; const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [msg]);
  if (!msg) return null;
  return <div className={`toast ${type}`}>{msg}</div>;
}

// ─── Confirm Modal ──────────────────────────────────────────────────────────
function Confirm({ open, title, body, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header"><span className="modal-title">{title}</span></div>
        <div className="modal-body"><p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{body}</p></div>
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', section: 'Overview' },
  { id: 'inbox', label: 'E-Invoice Inbox', icon: 'inbox', section: 'Capture' },
  { id: 'ocr', label: 'OCR Upload', icon: 'upload' },
  { id: 'pos', label: 'Purchase Orders', icon: 'po', section: 'Procurement' },
  { id: 'grns', label: 'Goods Receipts', icon: 'grn' },
  { id: 'vendors', label: 'Vendors', icon: 'vendors' },
  { id: 'match', label: 'PO Matching', icon: 'match', section: 'Verification' },
  { id: 'threeway', label: '3-Way Match', icon: 'check3' },
  { id: 'register', label: 'AP Register', icon: 'register', section: 'Payables' },
];

function Sidebar({ screen, setScreen, counts }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-text">Kraya</div>
        <div className="sidebar-logo-sub">AP Automation</div>
      </div>
      <div className="sidebar-org">
        <div className="sidebar-org-name">Haldiram Snacks Pvt Ltd</div>
        <div className="sidebar-org-gstin">27AAACH1234I1Z0</div>
      </div>
      <nav className="sidebar-nav">
        {NAV.map(item => (
          <div key={item.id}>
            {item.section && <div className="nav-section">{item.section}</div>}
            <div
              className={`nav-item ${screen === item.id ? 'active' : ''}`}
              onClick={() => setScreen(item.id)}
            >
              <Icon n={item.icon} size={15} />
              {item.label}
              {item.id === 'inbox' && counts.pendingInvoices > 0 && (
                <span className="nav-badge">{counts.pendingInvoices}</span>
              )}
            </div>
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">v1.0 · Kraya AP</div>
    </div>
  );
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
function ScreenDashboard({ setScreen, toast }) {
  const [data, setData] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    try {
      const [invoices, payables, pos, grns] = await Promise.all([
        api('/api/invoices'),
        api('/api/payables'),
        api('/api/pos'),
        api('/api/grns'),
      ]);
      setData({ invoices, payables, pos, grns });
    } catch (e) {
      toast(e.message || 'Failed to load data', 'error');
      setData({ invoices: [], payables: [], pos: [], grns: [] });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const seed = async () => {
    setSeeding(true);
    try {
      await api('/api/seed', { method: 'POST', body: {} });
      toast('Sample data seeded!', 'success');
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
    setSeeding(false);
  };

  if (!data) return <div className="loading"><div className="spinner" /> Loading…</div>;

  const { invoices, payables, pos } = data;
  const pending = invoices.filter(i => i.status === 'pending').length;
  const approved = invoices.filter(i => i.status === 'approved').length;
  const unmatched = invoices.filter(i => i.matchStatus === 'unmatched').length;
  const totalPayable = payables.filter(p => p.status !== 'paid').reduce((s, p) => s + (p.netPayable || 0), 0);
  const overdue = payables.filter(p => p.status !== 'paid' && new Date(p.dueDate) < new Date()).length;
  const openPOs = pos.filter(p => p.status === 'open').length;

  const recent = invoices.slice(0, 5);

  return (
    <div>
      <div className="page-head">
        <h1>Dashboard</h1>
        <p>AP automation overview — Haldiram Snacks Pvt Ltd</p>
      </div>

      {invoices.length === 0 && (
        <div className="alert alert-info" style={{ marginBottom: 24 }}>
          <Icon n="info" size={16} />
          <div>
            No data yet.{' '}
            <button className="btn btn-sm btn-secondary" style={{ marginLeft: 8 }} onClick={seed} disabled={seeding}>
              {seeding ? 'Seeding…' : 'Load sample data'}
            </button>
            {' '}or use OCR Upload to add real invoices.
          </div>
        </div>
      )}

      <div className="cards-row cards-4">
        <div className="card">
          <div className="stat-val stat-mono">{invoices.length}</div>
          <div className="stat-label">Total Invoices</div>
        </div>
        <div className="card">
          <div className="stat-val stat-mono" style={{ color: 'var(--amber)' }}>{pending}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="card">
          <div className="stat-val stat-mono" style={{ color: 'var(--red)', fontSize: 18 }}>{fmtAmt(totalPayable)}</div>
          <div className="stat-label">Outstanding Payable{overdue > 0 && <span style={{ color: 'var(--red)', marginLeft: 6, fontSize: 11 }}>• {overdue} overdue</span>}</div>
        </div>
        <div className="card">
          <div className="stat-val stat-mono" style={{ color: 'var(--amber)' }}>{unmatched}</div>
          <div className="stat-label">Unmatched Invoices</div>
        </div>
      </div>

      <div className="two-col" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="section-head">
            <span className="section-title">Invoice Status Breakdown</span>
          </div>
          {[
            { s: 'pending', label: 'Pending' },
            { s: 'po_matched', label: 'PO Matched' },
            { s: 'grn_matched', label: 'GRN Matched' },
            { s: 'approved', label: 'Approved' },
            { s: 'rejected', label: 'Rejected' },
            { s: 'paid', label: 'Paid' },
          ].map(({ s, label }) => {
            const cnt = invoices.filter(i => i.status === s).length;
            const pct = invoices.length ? Math.round(cnt / invoices.length * 100) : 0;
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <Badge status={s} label={label} />
                <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: pct + '%', background: 'var(--kraya-red)', borderRadius: 3 }} />
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, width: 24, textAlign: 'right' }}>{cnt}</span>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="section-head">
            <span className="section-title">Open Purchase Orders</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setScreen('pos')}>View all</button>
          </div>
          {pos.filter(p => p.status === 'open').slice(0, 5).map(po => (
            <div key={po._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600 }}>{po.poNo}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{po.vendorName}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{fmtAmt(po.totalAmount)}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fmtDate(po.poDate)}</div>
              </div>
            </div>
          ))}
          {openPOs === 0 && <div className="empty-state" style={{ padding: '20px 0' }}>No open POs</div>}
        </div>
      </div>

      <div className="card">
        <div className="section-head">
          <span className="section-title">Recent Invoices</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setScreen('inbox')}>View all</button>
        </div>
        {recent.length === 0 ? (
          <div className="empty-state"><p>No invoices yet. <button className="btn btn-sm btn-secondary" onClick={() => setScreen('ocr')}>Upload invoice</button></p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Invoice No</th><th>Vendor</th><th>Date</th><th>Amount</th>
                <th>Status</th><th>Match</th>
              </tr></thead>
              <tbody>
                {recent.map(inv => (
                  <tr key={inv._id}>
                    <td><span className="mono">{inv.invoiceNo}</span></td>
                    <td>{inv.vendorName || '—'}</td>
                    <td>{fmtDate(inv.invoiceDate)}</td>
                    <td className="text-right amount">{fmtAmt(inv.totalAmount)}</td>
                    <td><Badge status={inv.status} /></td>
                    <td><Badge status={inv.matchStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Invoice Inbox ──────────────────────────────────────────────────────────
function ScreenInbox({ setScreen, setSelectedInvoice, toast }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api('/api/invoices');
      setInvoices(data);
    } catch (e) { toast(e.message, 'error'); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = invoices.filter(inv => {
    const q = filter.toLowerCase();
    const matchQ = !q || inv.invoiceNo?.toLowerCase().includes(q) || inv.vendorName?.toLowerCase().includes(q);
    const matchS = !statusFilter || inv.status === statusFilter;
    return matchQ && matchS;
  });

  if (loading) return <div className="loading"><div className="spinner" /> Loading…</div>;

  return (
    <div>
      <div className="page-head">
        <h1>E-Invoice Inbox</h1>
        <p>{invoices.length} invoices · {invoices.filter(i => i.status === 'pending').length} pending review</p>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <Icon n="search" size={14} />
          <input
            className="search-input"
            placeholder="Search invoice no, vendor…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <select className="form-control" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="po_matched">PO Matched</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="paid">Paid</option>
        </select>
        <div className="toolbar-right">
          <button className="btn btn-primary btn-sm" onClick={() => setScreen('ocr')}>
            <Icon n="upload" size={13} /> Upload Invoice
          </button>
          <button className="btn btn-secondary btn-sm" onClick={load}>
            <Icon n="refresh" size={13} />
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Invoice No</th><th>Vendor</th><th>Invoice Date</th>
              <th>GSTIN</th><th className="text-right">Amount</th>
              <th>Status</th><th>Match</th><th>Source</th><th></th>
            </tr></thead>
            <tbody>
              {visible.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
                  No invoices found.{' '}
                  <button className="btn btn-sm btn-secondary" onClick={() => setScreen('ocr')}>Upload one</button>
                </td></tr>
              )}
              {visible.map(inv => (
                <tr key={inv._id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedInvoice(inv); setScreen('invoice_detail'); }}>
                  <td><span className="mono" style={{ fontWeight: 600 }}>{inv.invoiceNo}</span></td>
                  <td>{inv.vendorName || '—'}</td>
                  <td>{fmtDate(inv.invoiceDate)}</td>
                  <td><span className="mono" style={{ fontSize: 11 }}>{inv.vendorGSTIN || '—'}</span></td>
                  <td className="text-right amount">{fmtAmt(inv.totalAmount)}</td>
                  <td><Badge status={inv.status} /></td>
                  <td><Badge status={inv.matchStatus} /></td>
                  <td><Badge status={inv.source} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedInvoice(inv); setScreen('invoice_detail'); }}>
                      <Icon n="eye" size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── OCR Upload ─────────────────────────────────────────────────────────────
function ScreenOCR({ setScreen, setSelectedInvoice, toast }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const doUpload = async (file) => {
    setUploading(true);
    setError(null);
    setResult(null);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/invoices/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setResult(data);
      if (data.autoMatch) {
        const { poNo, hasMismatch, allExact } = data.autoMatch;
        if (allExact) toast(`Auto-matched to ${poNo} — exact match ✓`, 'success');
        else if (hasMismatch) toast(`Auto-matched to ${poNo} — rate/qty differences found`, 'warning');
        else toast(`Auto-matched to ${poNo}`, 'success');
      } else {
        toast('Invoice saved — no matching PO found', 'info');
      }
    } catch (e) {
      setError(e.message);
    }
    setUploading(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) doUpload(file);
  };

  return (
    <div>
      <div className="page-head">
        <h1>OCR Upload</h1>
        <p>Upload invoice PDF or image — fields extracted automatically</p>
      </div>

      {!result && (
        <div
          className={`upload-zone ${dragging ? 'drag-over' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.tiff,.webp" style={{ display: 'none' }}
            onChange={e => e.target.files[0] && doUpload(e.target.files[0])} />
          <div className="upload-icon">
            <Icon n="upload" size={24} />
          </div>
          {uploading ? (
            <>
              <h3>Processing invoice…</h3>
              <p>Running OCR extraction — this may take 10–30 seconds</p>
              <div style={{ marginTop: 16 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
            </>
          ) : (
            <>
              <h3>Drop invoice here or click to browse</h3>
              <p>PDF, JPG, PNG · Max 20 MB</p>
              <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                Extracts: Invoice No, GSTIN, Date, HSN codes, CGST/SGST/IGST, Total Amount
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ marginTop: 16 }}>
          <Icon n="warn" size={16} /> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 24 }}>
          <div className="alert alert-success" style={{ marginBottom: 16 }}>
            <Icon n="check" size={16} /> Invoice extracted and saved to inbox
          </div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="section-title">Extracted Fields</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Confidence:</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600,
                  color: result.parsed?.confidence > 60 ? 'var(--green)' : 'var(--amber)' }}>
                  {result.parsed?.confidence || 0}%
                </span>
              </div>
            </div>
            <div>
              {[
                ['Invoice No', result.invoice.invoiceNo, true],
                ['Invoice Date', fmtDate(result.invoice.invoiceDate), false],
                ['Vendor GSTIN', result.invoice.vendorGSTIN, true],
                ['Buyer GSTIN', result.invoice.buyerGSTIN, true],
                ['IRN', result.invoice.irn, true],
                ['Place of Supply', result.invoice.placeOfSupply, false],
                ['Total Amount', fmtAmt(result.invoice.totalAmount), false],
                ['CGST', fmtAmt(result.invoice.totalCGST), false],
                ['SGST', fmtAmt(result.invoice.totalSGST), false],
                ['IGST', fmtAmt(result.invoice.totalIGST), false],
                ['TDS (2%)', fmtAmt(result.invoice.tds), false],
                ['Net Payable', fmtAmt(result.invoice.netPayable), false],
              ].map(([label, val, mono]) => (
                <div key={label} className="ocr-field">
                  <span className="ocr-label">{label}</span>
                  <span className={`ocr-val ${mono ? 'mono' : ''}`}>{val || '—'}</span>
                </div>
              ))}
            </div>

            {result.invoice.items?.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div className="section-title" style={{ marginBottom: 10 }}>Line Items ({result.invoice.items.length})</div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>HSN</th><th>Description</th><th>Qty</th><th>Rate</th><th className="text-right">Amount</th></tr></thead>
                    <tbody>
                      {result.invoice.items.map((item, i) => (
                        <tr key={i}>
                          <td className="mono">{item.hsnCode || '—'}</td>
                          <td>{item.description || '—'}</td>
                          <td>{item.qty} {item.unit}</td>
                          <td className="amount">{fmtAmt(item.rate)}</td>
                          <td className="text-right amount">{fmtAmt(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" onClick={() => { setSelectedInvoice(result.invoice); setScreen('invoice_detail'); }}>
                <Icon n="eye" size={14} /> View Invoice
              </button>
              <button className="btn btn-secondary" onClick={() => { setResult(null); setError(null); }}>
                <Icon n="upload" size={14} /> Upload Another
              </button>
              <button className="btn btn-secondary" onClick={() => setScreen('inbox')}>
                Go to Inbox
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Invoice Detail ──────────────────────────────────────────────────────────
function ScreenInvoiceDetail({ invoice: initInvoice, setScreen, setMatchInvoice, toast }) {
  const [invoice, setInvoice] = useState(initInvoice);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const refresh = async () => {
    const data = await api(`/api/invoices/${invoice._id}`);
    setInvoice(data);
  };

  const updateStatus = async (status, extra = {}) => {
    setSaving(true);
    try {
      const updated = await api(`/api/invoices/${invoice._id}`, {
        method: 'PUT',
        body: { status, ...extra },
      });
      setInvoice(updated);
      toast(`Invoice ${status}`, 'success');
    } catch (e) { toast(e.message, 'error'); }
    setSaving(false);
  };

  if (!invoice) return null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setScreen('inbox')}>
          <Icon n="arrow_l" size={14} /> Back to Inbox
        </button>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{invoice.invoiceNo}</span>
        <Badge status={invoice.status} />
        <Badge status={invoice.matchStatus} />
      </div>

      {invoice.rejectionReason && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          <Icon n="warn" size={16} /> <strong>Rejected:</strong> {invoice.rejectionReason}
        </div>
      )}

      <div className="two-col" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-title">Invoice Details</div>
          {[
            ['Invoice No', invoice.invoiceNo, true],
            ['Invoice Date', fmtDate(invoice.invoiceDate)],
            ['IRN', invoice.irn, true],
            ['Source', invoice.source],
            ['File', invoice.fileName],
          ].map(([l, v, m]) => v ? (
            <div key={l} className="ocr-field">
              <span className="ocr-label">{l}</span>
              <span className={`ocr-val ${m ? 'mono' : ''}`}>{v}</span>
            </div>
          ) : null)}
        </div>
        <div className="card">
          <div className="card-title">Parties</div>
          {[
            ['Vendor Name', invoice.vendorName],
            ['Vendor GSTIN', invoice.vendorGSTIN, true],
            ['Buyer GSTIN', invoice.buyerGSTIN, true],
            ['Place of Supply', invoice.placeOfSupply],
            ['Linked PO', invoice.poId?.poNo || invoice.poId, true],
          ].map(([l, v, m]) => v ? (
            <div key={l} className="ocr-field">
              <span className="ocr-label">{l}</span>
              <span className={`ocr-val ${m ? 'mono' : ''}`}>{typeof v === 'object' ? JSON.stringify(v) : v}</span>
            </div>
          ) : null)}
        </div>
      </div>

      {invoice.items?.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title">Line Items</div>
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>HSN Code</th><th>Description</th><th>Qty</th><th>Unit</th>
                <th className="text-right">Rate</th><th className="text-right">Amount</th>
                <th className="text-right">CGST</th><th className="text-right">SGST</th><th className="text-right">IGST</th>
              </tr></thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="mono">{item.hsnCode || '—'}</td>
                    <td>{item.description || '—'}</td>
                    <td className="mono">{item.qty}</td>
                    <td>{item.unit}</td>
                    <td className="text-right amount">{fmtAmt(item.rate)}</td>
                    <td className="text-right amount">{fmtAmt(item.amount)}</td>
                    <td className="text-right amount">{fmtAmt(item.cgst)}</td>
                    <td className="text-right amount">{fmtAmt(item.sgst)}</td>
                    <td className="text-right amount">{fmtAmt(item.igst)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Amount Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            ['Subtotal', invoice.subtotal],
            ['Total CGST', invoice.totalCGST],
            ['Total SGST', invoice.totalSGST],
            ['Total IGST', invoice.totalIGST],
            ['Invoice Total', invoice.totalAmount],
            ['TDS Deducted', invoice.tds],
            ['Net Payable', invoice.netPayable],
          ].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 2 }}>{l}</div>
              <div style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{fmtAmt(v)}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {invoice.matchStatus === 'unmatched' && (
          <button className="btn btn-primary" onClick={() => { setMatchInvoice(invoice); setScreen('match'); }}>
            <Icon n="link" size={14} /> Match to PO
          </button>
        )}
        {invoice.matchStatus === 'po_matched' && (
          <button className="btn btn-primary" onClick={() => { setMatchInvoice(invoice); setScreen('threeway'); }}>
            <Icon n="check3" size={14} /> Run 3-Way Match
          </button>
        )}
        {invoice.status !== 'approved' && invoice.status !== 'paid' && invoice.status !== 'rejected' && (
          <button className="btn btn-success" disabled={saving}
            onClick={() => setConfirm({ action: () => updateStatus('approved'), title: 'Approve Invoice?', body: `Approve ${invoice.invoiceNo} for payment? A payable entry will be created.` })}>
            <Icon n="check" size={14} /> Approve
          </button>
        )}
        {invoice.status !== 'rejected' && invoice.status !== 'paid' && (
          <button className="btn btn-danger" disabled={saving}
            onClick={() => setConfirm({ action: () => updateStatus('rejected', { rejectionReason: 'Manual rejection' }), title: 'Reject Invoice?', body: `Reject ${invoice.invoiceNo}?` })}>
            <Icon n="x" size={14} /> Reject
          </button>
        )}
      </div>

      <Confirm
        open={!!confirm}
        title={confirm?.title}
        body={confirm?.body}
        onConfirm={() => { confirm?.action(); setConfirm(null); }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

// ─── PO Match ───────────────────────────────────────────────────────────────
function ScreenMatch({ invoice: initInvoice, setScreen, toast }) {
  const [pos, setPos] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
  const [preview, setPreview] = useState(null);
  const [matching, setMatching] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api('/api/pos?status=open').then(setPos).catch(e => toast(e.message, 'error'));
  }, []);

  const previewMatch = (po) => {
    setSelectedPO(po);
    // Simple client-side preview
    const invItems = initInvoice.items || [];
    const poItems = po.items || [];
    const lines = invItems.map((inv, i) => {
      const po_line = poItems[i] || poItems.find(p => p.hsnCode === inv.hsnCode) || null;
      if (!po_line) return { inv, po: null, status: 'missing' };
      const qDiff = Math.abs((inv.qty || 0) - (po_line.qty || 0));
      const rDiff = Math.abs((inv.rate || 0) - (po_line.rate || 0));
      const rPct = po_line.rate ? rDiff / po_line.rate * 100 : 0;
      return {
        inv, po: po_line,
        status: rPct > 5 || qDiff / (po_line.qty || 1) > 0.05 ? 'mismatch' : rDiff > 0 || qDiff > 0 ? 'tolerance' : 'exact',
        qDiff, rDiff, rPct,
      };
    });
    setPreview({ po, lines });
  };

  const doMatch = async () => {
    if (!selectedPO) return;
    setMatching(true);
    try {
      await api('/api/match', {
        method: 'POST',
        body: { action: 'link_po', invoiceId: initInvoice._id, poId: selectedPO._id },
      });
      setDone(true);
      toast('Invoice linked to PO!', 'success');
    } catch (e) { toast(e.message, 'error'); }
    setMatching(false);
  };

  if (done) return (
    <div>
      <div className="alert alert-success" style={{ marginBottom: 16 }}>
        <Icon n="check" size={16} /> Invoice matched to {selectedPO.poNo}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-primary" onClick={() => setScreen('threeway')}>Run 3-Way Match</button>
        <button className="btn btn-secondary" onClick={() => setScreen('inbox')}>Back to Inbox</button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setScreen('invoice_detail')}>
          <Icon n="arrow_l" size={14} /> Back
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Match to PO — {initInvoice.invoiceNo}</h2>
      </div>

      <div className="two-col">
        <div>
          <div className="card-title" style={{ marginBottom: 12 }}>Open Purchase Orders</div>
          {pos.length === 0 && <div className="empty-state"><p>No open POs. <button className="btn btn-sm btn-secondary" onClick={() => setScreen('pos')}>Create one</button></p></div>}
          {pos.map(po => (
            <div
              key={po._id}
              className="card card-sm"
              style={{ marginBottom: 8, cursor: 'pointer', border: selectedPO?._id === po._id ? '2px solid var(--kraya-red)' : '1px solid var(--border)' }}
              onClick={() => previewMatch(po)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 13 }}>{po.poNo}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{po.vendorName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{fmtAmt(po.totalAmount)}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fmtDate(po.poDate)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          {preview ? (
            <div className="card">
              <div className="card-title">Line Comparison — {preview.po.poNo}</div>
              {preview.lines.map((line, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Line {i + 1}</div>
                  <div className="match-row">
                    <div className={`match-cell ${line.status === 'mismatch' ? 'diff' : line.status === 'exact' ? 'ok' : ''}`}>
                      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 2 }}>INVOICE</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{fmtAmt(line.inv.rate)} × {line.inv.qty} {line.inv.unit}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{line.inv.description}</div>
                    </div>
                    <div className="match-connector">
                      {line.status === 'exact' ? <Icon n="check" size={14} /> : line.status === 'missing' ? <Icon n="x" size={14} /> : '≈'}
                    </div>
                    <div className={`match-cell ${line.status === 'mismatch' ? 'diff' : line.status === 'missing' ? 'miss' : line.status === 'exact' ? 'ok' : ''}`}>
                      {line.po ? (
                        <>
                          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 2 }}>PO</div>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{fmtAmt(line.po.rate)} × {line.po.qty} {line.po.unit}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{line.po.description}</div>
                          {line.rPct > 0 && (
                            <span className={`diff-chip ${line.rPct > 5 ? 'red' : ''}`} style={{ marginTop: 4 }}>
                              {line.rPct > 0 ? '+' : ''}{line.rPct.toFixed(1)}% rate
                            </span>
                          )}
                        </>
                      ) : <span style={{ color: 'var(--red)', fontSize: 12 }}>No matching PO line</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                {preview.lines.some(l => l.status === 'mismatch') && (
                  <div className="alert alert-warning" style={{ marginBottom: 12 }}>
                    <Icon n="warn" size={14} /> Rate/qty differences detected — will be flagged for approval
                  </div>
                )}
                <button className="btn btn-primary" onClick={doMatch} disabled={matching}>
                  {matching ? 'Matching…' : <><Icon n="link" size={14} /> Confirm Match</>}
                </button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
              <div className="empty-state"><p>Select a PO on the left to preview the match</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 3-Way Match ─────────────────────────────────────────────────────────────
function ScreenThreeWay({ invoice: initInvoice, setScreen, toast, setGrnPrefill }) {
  const [grns, setGrns] = useState([]);
  const [selectedGRN, setSelectedGRN] = useState(null);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (initInvoice?.poId) {
      api(`/api/grns?poId=${initInvoice.poId._id || initInvoice.poId}`).then(setGrns);
    }
  }, [initInvoice]);

  const runMatch = async () => {
    setRunning(true);
    try {
      const r = await api('/api/match', {
        method: 'POST',
        body: { action: 'three_way', invoiceId: initInvoice._id, grnId: selectedGRN?._id },
      });
      setResult(r);
      toast(r.allPassed ? '3-way match passed — invoice approved!' : 'Match failed — differences detected', r.allPassed ? 'success' : 'error');
    } catch (e) { toast(e.message, 'error'); }
    setRunning(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setScreen('invoice_detail')}>
          <Icon n="arrow_l" size={14} /> Back
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>3-Way Match — {initInvoice?.invoiceNo}</h2>
      </div>

      <div className="steps" style={{ marginBottom: 24 }}>
        {['PO Created', 'Invoice Received', 'GRN Done', '3-Way Match'].map((label, i) => (
          <div key={i} className="step">
            <div className={`step-num ${i < 2 ? 'done' : i === 2 && (initInvoice?.grnId || selectedGRN) ? 'done' : i === 3 && result?.allPassed ? 'done' : i === 2 ? 'active' : 'idle'}`}>
              {i < 2 || (i === 2 && (initInvoice?.grnId || selectedGRN)) || (i === 3 && result?.allPassed) ? <Icon n="check" size={10} /> : i + 1}
            </div>
            <span className="step-label">{label}</span>
            {i < 3 && <div className="step-connector" />}
          </div>
        ))}
      </div>

      <div className="two-col" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-title">Invoice</div>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{initInvoice?.invoiceNo}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{initInvoice?.vendorName}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 700, marginTop: 8 }}>{fmtAmt(initInvoice?.totalAmount)}</div>
        </div>
        <div className="card">
          <div className="card-title">Linked PO</div>
          {initInvoice?.poId ? (
            <>
              <div style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{initInvoice.poId.poNo || initInvoice.poId}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>PO linked</div>
            </>
          ) : (
            <div className="alert alert-warning" style={{ marginTop: 4 }}>
              <Icon n="warn" size={14} /> No PO linked. <button className="btn btn-sm btn-secondary" onClick={() => setScreen('match')}>Match PO first</button>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Select GRN (optional)</div>
        {grns.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>No GRN found for this PO.</span>
            <button className="btn btn-sm btn-secondary" onClick={() => {
              setGrnPrefill({
                poId: initInvoice.poId?._id || initInvoice.poId,
                poNo: initInvoice.poId?.poNo,
                invoiceId: initInvoice._id,
                vendorId: initInvoice.vendorId,
                vendorName: initInvoice.vendorName,
                items: initInvoice.poId?.items || [],
              });
              setScreen('grns');
            }}>Create GRN</button>
          </div>
        ) : (
          grns.map(grn => (
            <div
              key={grn._id}
              className="card card-sm"
              style={{ marginBottom: 8, cursor: 'pointer', border: selectedGRN?._id === grn._id ? '2px solid var(--kraya-red)' : '1px solid var(--border)' }}
              onClick={() => setSelectedGRN(grn)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{grn.grnNo}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{grn.vendorName} · {fmtDate(grn.grnDate)}</div>
                </div>
                <Badge status={grn.status} />
              </div>
            </div>
          ))
        )}
      </div>

      {!result && (
        <button className="btn btn-primary btn-lg" onClick={runMatch} disabled={running || !initInvoice?.poId}>
          {running ? 'Running match…' : <><Icon n="check3" size={16} /> Run 3-Way Match</>}
        </button>
      )}

      {result && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div className={`check-icon ${result.allPassed ? 'check-pass' : 'check-fail'}`} style={{ width: 32, height: 32 }}>
              <Icon n={result.allPassed ? 'check' : 'x'} size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{result.allPassed ? '3-Way Match Passed' : 'Match Failed'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {result.allPassed ? 'Invoice approved and payable created' : 'Discrepancies found — manual review required'}
              </div>
            </div>
          </div>

          {result.checks?.map((check, i) => (
            <div key={i} className="check-item">
              <div className={`check-icon ${check.passed ? 'check-pass' : 'check-fail'}`}>
                <Icon n={check.passed ? 'check' : 'x'} size={12} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{check.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {check.po && <span>PO: <span style={{ fontFamily: 'var(--mono)' }}>{fmtAmt(check.po)}</span></span>}
                  {check.inv && <span> · Invoice: <span style={{ fontFamily: 'var(--mono)' }}>{fmtAmt(check.inv)}</span></span>}
                  {check.grn && <span> · GRN: <span style={{ fontFamily: 'var(--mono)' }}>{check.grn}</span></span>}
                  {check.pct && <span> · <strong>{check.pct}%</strong> diff</span>}
                </div>
              </div>
              {!check.passed && <span className="diff-chip red">{check.pct}%</span>}
            </div>
          ))}

          {result.lineMatches?.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div className="card-title" style={{ marginBottom: 10 }}>Item-Level Comparison</div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>HSN</th>
                      <th className="text-right">PO Qty</th>
                      <th className="text-right">Inv Qty</th>
                      <th className="text-right">GRN Recd</th>
                      <th className="text-right">GRN Accptd</th>
                      <th className="text-right">PO Rate</th>
                      <th className="text-right">Inv Rate</th>
                      <th className="text-right">Inv Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.lineMatches.map((lm, i) => {
                      const grnItem = result.grn?.items?.[i];
                      const rateOk = !lm.diffs?.find(d => d.field === 'rate');
                      const qtyOk  = !lm.diffs?.find(d => d.field === 'qty');
                      const grnOk  = !grnItem || (grnItem.acceptedQty >= lm.poLine?.qty * 0.95);
                      return (
                        <tr key={i}>
                          <td style={{ fontWeight: 500 }}>{lm.invLine?.description || lm.poLine?.description}</td>
                          <td><span className="mono">{lm.invLine?.hsnCode || lm.poLine?.hsnCode}</span></td>
                          <td className="text-right amount">{lm.poLine?.qty} {lm.poLine?.unit}</td>
                          <td className="text-right amount" style={{ color: qtyOk ? undefined : 'var(--red)' }}>{lm.invLine?.qty} {lm.invLine?.unit}</td>
                          <td className="text-right amount">{grnItem?.receivedQty ?? '—'}</td>
                          <td className="text-right amount" style={{ color: grnItem && !grnOk ? 'var(--red)' : undefined }}>{grnItem?.acceptedQty ?? '—'}</td>
                          <td className="text-right amount">{fmtAmt(lm.poLine?.rate)}</td>
                          <td className="text-right amount" style={{ color: rateOk ? undefined : 'var(--amber)' }}>{fmtAmt(lm.invLine?.rate)}</td>
                          <td className="text-right amount" style={{ fontWeight: 600 }}>{fmtAmt(lm.invLine?.amount || (lm.invLine?.qty * lm.invLine?.rate))}</td>
                          <td>
                            {lm.match === 'exact' ? <span style={{ color: 'var(--green)', fontSize: 11, fontWeight: 600 }}>✓ Exact</span>
                              : lm.match === 'mismatch' ? <span style={{ color: 'var(--red)', fontSize: 11, fontWeight: 600 }}>✗ Mismatch</span>
                              : lm.match === 'missing' ? <span style={{ color: 'var(--red)', fontSize: 11, fontWeight: 600 }}>Missing</span>
                              : <span style={{ color: 'var(--amber)', fontSize: 11, fontWeight: 600 }}>~ Tolerance</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result.allPassed && (
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" onClick={() => setScreen('register')}>
                <Icon n="register" size={14} /> View AP Register
              </button>
              <button className="btn btn-secondary" onClick={() => setScreen('inbox')}>Back to Inbox</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Purchase Orders ─────────────────────────────────────────────────────────
function ScreenPOs({ toast }) {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({ poNo: '', vendorId: '', vendorName: '', deliveryDate: '', items: [{ description: '', hsnCode: '', qty: '', unit: 'NOS', rate: '' }] });

  const load = async () => {
    setLoading(true);
    const [p, v] = await Promise.all([api('/api/pos'), api('/api/vendors')]);
    setPos(p); setVendors(v);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addLine = () => setForm(f => ({ ...f, items: [...f.items, { description: '', hsnCode: '', qty: '', unit: 'NOS', rate: '' }] }));
  const updLine = (i, k, v) => setForm(f => { const items = [...f.items]; items[i] = { ...items[i], [k]: v }; return { ...f, items }; });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const vendor = vendors.find(v => v._id === form.vendorId);
      const items = form.items.map(it => ({
        ...it, qty: Number(it.qty), rate: Number(it.rate),
        amount: Number(it.qty) * Number(it.rate),
        taxRate: 18, cgst: Number(it.qty) * Number(it.rate) * 0.09,
        sgst: Number(it.qty) * Number(it.rate) * 0.09,
      }));
      const subtotal = items.reduce((s, i) => s + i.amount, 0);
      const totalTax = items.reduce((s, i) => s + (i.cgst || 0) + (i.sgst || 0), 0);
      await api('/api/pos', {
        method: 'POST',
        body: { ...form, vendorName: vendor?.name, vendorGSTIN: vendor?.gstin, items, subtotal, totalTax, totalAmount: subtotal + totalTax },
      });
      toast('PO created!', 'success');
      setShowForm(false);
      load();
    } catch (e) { toast(e.message, 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-head">
        <h1>Purchase Orders</h1>
        <p>{pos.length} orders · {pos.filter(p => p.status === 'open').length} open</p>
      </div>
      <div className="toolbar">
        <div className="toolbar-right">
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
            <Icon n="plus" size={13} /> New PO
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">New Purchase Order</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><Icon n="x" size={14} /></button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">PO Number *</label>
                    <input className="form-control" required value={form.poNo} onChange={e => setForm(f => ({ ...f, poNo: e.target.value }))} placeholder="PO-2425-0085" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vendor *</label>
                    <select className="form-control" required value={form.vendorId} onChange={e => setForm(f => ({ ...f, vendorId: e.target.value }))}>
                      <option value="">Select vendor…</option>
                      {vendors.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Delivery Date</label>
                    <input className="form-control" type="date" value={form.deliveryDate} onChange={e => setForm(f => ({ ...f, deliveryDate: e.target.value }))} />
                  </div>
                </div>
                <div className="divider" />
                <div className="section-title" style={{ marginBottom: 10 }}>Line Items</div>
                {form.items.map((item, i) => (
                  <div key={i} className="form-grid-3" style={{ marginBottom: 8 }}>
                    <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / 3' }}>
                      <label className="form-label">Description</label>
                      <input className="form-control" value={item.description} onChange={e => updLine(i, 'description', e.target.value)} placeholder="Item description" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">HSN Code</label>
                      <input className="form-control" value={item.hsnCode} onChange={e => updLine(i, 'hsnCode', e.target.value)} placeholder="72112990" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Qty</label>
                      <input className="form-control" type="number" value={item.qty} onChange={e => updLine(i, 'qty', e.target.value)} placeholder="100" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Unit</label>
                      <select className="form-control" value={item.unit} onChange={e => updLine(i, 'unit', e.target.value)}>
                        {['NOS', 'KG', 'MTR', 'LTR', 'SET', 'BOX'].map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Rate (₹)</label>
                      <input className="form-control" type="number" value={item.rate} onChange={e => updLine(i, 'rate', e.target.value)} placeholder="500" />
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-ghost btn-sm" onClick={addLine} style={{ marginTop: 4 }}>
                  <Icon n="plus" size={12} /> Add Line
                </button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create PO</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>PO Number</th><th>Vendor</th><th>Date</th><th>Delivery</th>
              <th className="text-right">Amount</th><th>Status</th><th>Items</th>
            </tr></thead>
            <tbody>
              {pos.map(po => (
                <tr key={po._id}>
                  <td><span className="mono" style={{ fontWeight: 600 }}>{po.poNo}</span></td>
                  <td>{po.vendorName}</td>
                  <td>{fmtDate(po.poDate)}</td>
                  <td>{fmtDate(po.deliveryDate)}</td>
                  <td className="text-right amount">{fmtAmt(po.totalAmount)}</td>
                  <td><Badge status={po.status} /></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{po.items?.length || 0} lines</td>
                </tr>
              ))}
              {pos.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No POs yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── GRNs ────────────────────────────────────────────────────────────────────
function ScreenGRNs({ toast, prefill, setPrefill }) {
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [pos, setPos] = useState([]);
  const emptyForm = { grnNo: '', poId: '', grnDate: new Date().toISOString().slice(0,10), receivedBy: '', items: [] };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const [g, p] = await Promise.all([api('/api/grns'), api('/api/pos?status=open')]);
    setGrns(g); setPos(p);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Auto-open form when prefill is passed from invoice/3-way match
  useEffect(() => {
    if (!prefill || pos.length === 0) return;
    const nextNo = 'GRN-2425-' + String(grns.length + 113).padStart(4, '0');
    setForm({
      grnNo: nextNo,
      poId: prefill.poId || '',
      grnDate: new Date().toISOString().slice(0, 10),
      receivedBy: '',
      invoiceId: prefill.invoiceId || '',
      items: (prefill.items || []).map(it => ({
        description: it.description,
        hsnCode: it.hsnCode || '',
        unit: it.unit || 'NOS',
        rate: it.rate || 0,
        orderedQty: it.qty,
        receivedQty: it.qty,   // default to full qty — user adjusts if short
        acceptedQty: it.qty,
        condition: 'good',
        remarks: '',
      })),
    });
    setShowForm(true);
    setPrefill(null);
  }, [prefill, pos]);

  const onPoSelect = (poId) => {
    const po = pos.find(p => p._id === poId);
    setForm(f => ({
      ...f,
      poId,
      items: po?.items?.length ? po.items.map(it => ({
        description: it.description,
        hsnCode: it.hsnCode || '',
        unit: it.unit || 'NOS',
        rate: it.rate || 0,
        orderedQty: it.qty,
        receivedQty: '',
        acceptedQty: '',
        condition: 'good',
        remarks: '',
      })) : f.items,
    }));
  };

  const updLine = (i, k, v) => setForm(f => {
    const items = [...f.items];
    items[i] = { ...items[i], [k]: v };
    // Auto-set acceptedQty = receivedQty when receivedQty changes (user adjusts if needed)
    if (k === 'receivedQty' && items[i].acceptedQty === items[i].orderedQty) {
      items[i].acceptedQty = v;
    }
    return { ...f, items };
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const po = pos.find(p => p._id === form.poId);
      await api('/api/grns', {
        method: 'POST',
        body: {
          ...form,
          vendorId: po?.vendorId,
          vendorName: po?.vendorName,
          items: form.items.map(it => ({
            ...it,
            orderedQty: Number(it.orderedQty),
            receivedQty: Number(it.receivedQty),
            acceptedQty: Number(it.acceptedQty),
          })),
        },
      });
      toast('GRN created!', 'success');
      setShowForm(false);
      setForm(emptyForm);
      load();
    } catch (e) { toast(e.message, 'error'); }
  };

  const approve = async (id) => {
    try {
      await api(`/api/grns/${id}`, { method: 'PUT', body: { status: 'approved' } });
      toast('GRN approved!', 'success');
      load();
    } catch (e) { toast(e.message, 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-head">
        <h1>Goods Receipt Notes</h1>
        <p>{grns.length} GRNs recorded</p>
      </div>
      <div className="toolbar">
        <div className="toolbar-right">
          <button className="btn btn-primary btn-sm" onClick={() => { setForm(emptyForm); setShowForm(true); }}>
            <Icon n="plus" size={13} /> New GRN
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" style={{ maxWidth: 820 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">New Goods Receipt Note</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><Icon n="x" size={14} /></button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">GRN Number *</label>
                    <input className="form-control" required value={form.grnNo} onChange={e => setForm(f => ({ ...f, grnNo: e.target.value }))} placeholder="GRN-2425-0113" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Link to PO *</label>
                    <select className="form-control" required value={form.poId} onChange={e => onPoSelect(e.target.value)}>
                      <option value="">Select PO to load items…</option>
                      {pos.map(p => <option key={p._id} value={p._id}>{p.poNo} — {p.vendorName}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Receipt Date</label>
                    <input className="form-control" type="date" value={form.grnDate} onChange={e => setForm(f => ({ ...f, grnDate: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Received By (Stores)</label>
                    <input className="form-control" value={form.receivedBy} onChange={e => setForm(f => ({ ...f, receivedBy: e.target.value }))} placeholder="Stores — Name" />
                  </div>
                </div>

                {form.items.length > 0 ? (
                  <>
                    <div className="divider" />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div className="section-title">Items from PO</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Description & rate pre-filled from PO — enter received quantities only</div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: 'var(--bg-secondary)' }}>
                            <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 11 }}>Description</th>
                            <th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 11 }}>HSN</th>
                            <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 11 }}>PO Qty</th>
                            <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 11 }}>Unit</th>
                            <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 11 }}>Rate</th>
                            <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600, color: 'var(--kraya-red)', fontSize: 11 }}>Received Qty *</th>
                            <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600, color: 'var(--kraya-red)', fontSize: 11 }}>Accepted Qty *</th>
                            <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 11 }}>Condition</th>
                            <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 11 }}>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.items.map((item, i) => {
                            const receivedNum = Number(item.receivedQty) || 0;
                            const acceptedNum = Number(item.acceptedQty) || 0;
                            const isShort = receivedNum < item.orderedQty;
                            const hasRejected = acceptedNum < receivedNum;
                            return (
                              <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'var(--bg-secondary)' }}>
                                <td style={{ padding: '6px 8px', fontWeight: 500 }}>{item.description}</td>
                                <td style={{ padding: '6px 8px', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 11 }}>{item.hsnCode}</td>
                                <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: 'var(--mono)' }}>{item.orderedQty}</td>
                                <td style={{ padding: '6px 8px', textAlign: 'right', color: 'var(--text-secondary)' }}>{item.unit}</td>
                                <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: 'var(--mono)' }}>{fmtAmt(item.rate)}</td>
                                <td style={{ padding: '4px 8px', textAlign: 'right' }}>
                                  <input
                                    type="number" required min="0" max={item.orderedQty * 1.05}
                                    value={item.receivedQty}
                                    onChange={e => updLine(i, 'receivedQty', e.target.value)}
                                    style={{ width: 70, padding: '4px 6px', border: `1px solid ${isShort && receivedNum > 0 ? 'var(--amber)' : 'var(--border)'}`, borderRadius: 4, textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12, background: isShort && receivedNum > 0 ? '#FFFBF0' : '#fff' }}
                                  />
                                  {isShort && receivedNum > 0 && <div style={{ fontSize: 9, color: 'var(--amber)', marginTop: 2 }}>Short by {item.orderedQty - receivedNum}</div>}
                                </td>
                                <td style={{ padding: '4px 8px', textAlign: 'right' }}>
                                  <input
                                    type="number" required min="0" max={item.receivedQty || item.orderedQty}
                                    value={item.acceptedQty}
                                    onChange={e => updLine(i, 'acceptedQty', e.target.value)}
                                    style={{ width: 70, padding: '4px 6px', border: `1px solid ${hasRejected ? 'var(--red)' : 'var(--border)'}`, borderRadius: 4, textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12, background: hasRejected ? '#FFF0F0' : '#fff' }}
                                  />
                                  {hasRejected && <div style={{ fontSize: 9, color: 'var(--red)', marginTop: 2 }}>{receivedNum - acceptedNum} rejected</div>}
                                </td>
                                <td style={{ padding: '4px 8px' }}>
                                  <select value={item.condition} onChange={e => updLine(i, 'condition', e.target.value)}
                                    style={{ padding: '4px 6px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 12, width: 90 }}>
                                    <option value="good">Good</option>
                                    <option value="damaged">Damaged</option>
                                    <option value="short">Short</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                </td>
                                <td style={{ padding: '4px 8px' }}>
                                  <input value={item.remarks || ''} onChange={e => updLine(i, 'remarks', e.target.value)}
                                    placeholder="Optional"
                                    style={{ width: 120, padding: '4px 6px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 11 }} />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                      Total PO Value: <strong>{fmtAmt(form.items.reduce((s, it) => s + (it.orderedQty * it.rate), 0))}</strong>
                      &nbsp;·&nbsp;
                      Received Value: <strong>{fmtAmt(form.items.reduce((s, it) => s + ((Number(it.acceptedQty) || 0) * it.rate), 0))}</strong>
                    </div>
                  </>
                ) : (
                  <div className="alert alert-info" style={{ marginTop: 16 }}>
                    <Icon n="info" size={14} /> Select a PO above — items will be loaded automatically from the purchase order.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={form.items.length === 0}>Create GRN</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>GRN No</th><th>PO No</th><th>Vendor</th><th>Date</th>
              <th className="text-right">Items</th><th>Status</th><th></th>
            </tr></thead>
            <tbody>
              {grns.map(grn => (
                <tr key={grn._id}>
                  <td><span className="mono">{grn.grnNo}</span></td>
                  <td><span className="mono">{grn.poId?.poNo || '—'}</span></td>
                  <td style={{ fontWeight: 500 }}>{grn.vendorName}</td>
                  <td>{fmtDate(grn.grnDate)}</td>
                  <td className="text-right">{grn.items?.length || 0}</td>
                  <td><Badge status={grn.status} /></td>
                  <td>
                    {grn.status === 'pending' && (
                      <button className="btn btn-success btn-sm" onClick={() => approve(grn._id)}>Approve</button>
                    )}
                  </td>
                </tr>
              ))}
              {grns.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No GRNs yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Vendors ─────────────────────────────────────────────────────────────────
function ScreenVendors({ toast }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', gstin: '', pan: '', city: '', state: 'Maharashtra', contactName: '', contactEmail: '', contactPhone: '', bankAccount: '', ifsc: '', bankName: '', tdsRate: 2 });

  const load = async () => {
    setLoading(true);
    try { setVendors(await api('/api/vendors')); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api('/api/vendors', { method: 'POST', body: form });
      toast('Vendor created!', 'success');
      setShowForm(false);
      load();
    } catch (e) { toast(e.message, 'error'); }
  };

  const upd = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-head">
        <h1>Vendors</h1>
        <p>{vendors.length} registered vendors</p>
      </div>
      <div className="toolbar">
        <div className="toolbar-right">
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
            <Icon n="plus" size={13} /> Add Vendor
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Add Vendor</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><Icon n="x" size={14} /></button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group"><label className="form-label">Company Name *</label><input className="form-control" required value={form.name} onChange={upd('name')} /></div>
                  <div className="form-group"><label className="form-label">GSTIN</label><input className="form-control" value={form.gstin} onChange={upd('gstin')} placeholder="27AAAAA0000A1Z5" /></div>
                  <div className="form-group"><label className="form-label">PAN</label><input className="form-control" value={form.pan} onChange={upd('pan')} /></div>
                  <div className="form-group"><label className="form-label">City</label><input className="form-control" value={form.city} onChange={upd('city')} /></div>
                  <div className="form-group"><label className="form-label">Contact Name</label><input className="form-control" value={form.contactName} onChange={upd('contactName')} /></div>
                  <div className="form-group"><label className="form-label">Contact Email</label><input className="form-control" type="email" value={form.contactEmail} onChange={upd('contactEmail')} /></div>
                  <div className="form-group"><label className="form-label">Bank Account</label><input className="form-control" value={form.bankAccount} onChange={upd('bankAccount')} /></div>
                  <div className="form-group"><label className="form-label">IFSC</label><input className="form-control" value={form.ifsc} onChange={upd('ifsc')} /></div>
                  <div className="form-group"><label className="form-label">TDS Rate (%)</label><input className="form-control" type="number" value={form.tdsRate} onChange={upd('tdsRate')} /></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Vendor Name</th><th>GSTIN</th><th>City</th><th>Contact</th>
              <th>Bank Account</th><th>IFSC</th><th>TDS %</th>
            </tr></thead>
            <tbody>
              {vendors.map(v => (
                <tr key={v._id}>
                  <td style={{ fontWeight: 600 }}>{v.name}</td>
                  <td><span className="mono" style={{ fontSize: 11 }}>{v.gstin || '—'}</span></td>
                  <td>{v.city || '—'}</td>
                  <td style={{ fontSize: 12 }}>{v.contactName || '—'}<br /><span style={{ color: 'var(--text-muted)' }}>{v.contactEmail}</span></td>
                  <td><span className="mono" style={{ fontSize: 11 }}>{v.bankAccount || '—'}</span></td>
                  <td><span className="mono" style={{ fontSize: 11 }}>{v.ifsc || '—'}</span></td>
                  <td>{v.tdsRate}%</td>
                </tr>
              ))}
              {vendors.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No vendors yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── AP Register ─────────────────────────────────────────────────────────────
function ScreenRegister({ toast }) {
  const [payables, setPayables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState([]);
  const [payModal, setPayModal] = useState(null);
  const [payForm, setPayForm] = useState({ paymentRef: '', paymentMode: 'neft', paymentDate: new Date().toISOString().split('T')[0] });

  const load = async () => {
    setLoading(true);
    try { setPayables(await api('/api/payables')); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const total = (arr) => arr.reduce((s, p) => s + (p.netPayable || 0), 0);
  const pending = payables.filter(p => p.status !== 'paid');
  const overdue = pending.filter(p => new Date(p.dueDate) < new Date());

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const markPaid = async () => {
    const ids = payModal ? [payModal._id] : selected;
    try {
      await Promise.all(ids.map(id => api(`/api/payables/${id}`, {
        method: 'PUT',
        body: { status: 'paid', ...payForm },
      })));
      toast(`${ids.length} payment(s) recorded!`, 'success');
      setSelected([]);
      setPayModal(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
  };

  const visible = payables.filter(p => {
    const q = filter.toLowerCase();
    return !q || p.vendorName?.toLowerCase().includes(q) || p.invoiceNo?.toLowerCase().includes(q);
  });

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-head">
        <h1>AP Register</h1>
        <p>{pending.length} outstanding · {overdue.length} overdue</p>
      </div>

      <div className="cards-row cards-4" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="stat-val stat-mono" style={{ fontSize: 20 }}>{fmtAmt(total(pending))}</div>
          <div className="stat-label">Total Outstanding</div>
        </div>
        <div className="card">
          <div className="stat-val stat-mono" style={{ fontSize: 20, color: 'var(--red)' }}>{fmtAmt(total(overdue))}</div>
          <div className="stat-label">Overdue</div>
        </div>
        <div className="card">
          <div className="stat-val stat-mono" style={{ fontSize: 20 }}>{fmtAmt(total(payables.filter(p => p.status === 'scheduled')))}</div>
          <div className="stat-label">Scheduled</div>
        </div>
        <div className="card">
          <div className="stat-val stat-mono" style={{ fontSize: 20, color: 'var(--green)' }}>{fmtAmt(total(payables.filter(p => p.status === 'paid')))}</div>
          <div className="stat-label">Paid (All Time)</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <Icon n="search" size={14} />
          <input className="search-input" placeholder="Search vendor, invoice…" value={filter} onChange={e => setFilter(e.target.value)} />
        </div>
        <div className="toolbar-right">
          {selected.length > 0 && (
            <button className="btn btn-primary btn-sm" onClick={() => setPayModal(null)}>
              <Icon n="check" size={13} /> Mark {selected.length} Paid
            </button>
          )}
          <button className="btn btn-secondary btn-sm" onClick={load}><Icon n="refresh" size={13} /></button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th><input type="checkbox" onChange={e => setSelected(e.target.checked ? visible.map(p => p._id) : [])} /></th>
              <th>Vendor</th><th>Invoice No</th><th>Invoice Date</th>
              <th>Due Date</th><th className="text-right">Gross</th>
              <th className="text-right">TDS</th><th className="text-right">Net Payable</th>
              <th>Status</th><th></th>
            </tr></thead>
            <tbody>
              {visible.map(p => {
                const isOverdue = p.status !== 'paid' && new Date(p.dueDate) < new Date();
                return (
                  <tr key={p._id} style={{ background: isOverdue ? 'rgba(216,38,28,0.02)' : undefined }}>
                    <td><input type="checkbox" checked={selected.includes(p._id)} onChange={() => toggleSelect(p._id)} /></td>
                    <td style={{ fontWeight: 500 }}>{p.vendorName}</td>
                    <td><span className="mono">{p.invoiceNo}</span></td>
                    <td>{fmtDate(p.invoiceDate)}</td>
                    <td style={{ color: isOverdue ? 'var(--red)' : undefined }}>
                      {fmtDate(p.dueDate)}
                      {isOverdue && <span className="diff-chip red" style={{ marginLeft: 4 }}>Overdue</span>}
                    </td>
                    <td className="text-right amount">{fmtAmt(p.grossAmount)}</td>
                    <td className="text-right amount" style={{ color: 'var(--amber)' }}>{fmtAmt(p.tdsDeducted)}</td>
                    <td className="text-right amount" style={{ fontWeight: 700 }}>{fmtAmt(p.netPayable)}</td>
                    <td><Badge status={p.status} /></td>
                    <td>
                      {p.status !== 'paid' && (
                        <button className="btn btn-success btn-sm" onClick={() => setPayModal(p)}>Pay</button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && <tr><td colSpan={10} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No payables found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {(payModal !== null || selected.length > 0) && (
        <div className="modal-overlay" onClick={() => { setPayModal(null); }}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Record Payment</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setPayModal(null)}><Icon n="x" size={14} /></button>
            </div>
            <div className="modal-body">
              {payModal && (
                <div className="alert alert-info" style={{ marginBottom: 16 }}>
                  <Icon n="info" size={14} />
                  <div>
                    <strong>{payModal.vendorName}</strong> · {payModal.invoiceNo}
                    <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 15, marginTop: 2 }}>{fmtAmt(payModal.netPayable)}</div>
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Payment Date *</label>
                <input className="form-control" type="date" value={payForm.paymentDate} onChange={e => setPayForm(f => ({ ...f, paymentDate: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select className="form-control" value={payForm.paymentMode} onChange={e => setPayForm(f => ({ ...f, paymentMode: e.target.value }))}>
                  <option value="neft">NEFT</option>
                  <option value="rtgs">RTGS</option>
                  <option value="imps">IMPS</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Payment Reference / UTR</label>
                <input className="form-control" value={payForm.paymentRef} onChange={e => setPayForm(f => ({ ...f, paymentRef: e.target.value }))} placeholder="UTR123456789012" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setPayModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={markPaid}><Icon n="check" size={14} /> Confirm Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Team / User Management ──────────────────────────────────────────────────
function ScreenUsers({ toast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'accounts' });

  const load = async () => {
    setLoading(true);
    try { setUsers(await api('/api/users')); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api('/api/users', { method: 'POST', body: form });
      toast('Team member added!', 'success');
      setShowForm(false);
      setForm({ name: '', email: '', password: '', role: 'accounts' });
      load();
    } catch (e) { toast(e.message, 'error'); }
  };

  const deactivate = async (id) => {
    try {
      await api(`/api/users/${id}`, { method: 'DELETE' });
      toast('User deactivated', 'success');
      load();
    } catch (e) { toast(e.message, 'error'); }
  };

  const roleColors = { admin: 'var(--purple)', accounts: 'var(--green)', purchase: 'var(--blue)', stores: 'var(--amber)' };
  const roleLabels = { admin: 'Admin', accounts: 'Accounts', purchase: 'Purchase', stores: 'Stores' };
  const roleAccess = {
    admin: 'Full access + user management',
    accounts: 'Invoice inbox, OCR, matching, AP register',
    purchase: 'View/create POs, view invoices',
    stores: 'Create/approve GRNs, view invoices',
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-head">
        <h1>Team</h1>
        <p>{users.length} active members</p>
      </div>
      <div className="toolbar">
        <div className="toolbar-right">
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
            <Icon n="plus" size={13} /> Add Member
          </button>
        </div>
      </div>

      <div className="two-col" style={{ marginBottom: 24 }}>
        {['accounts', 'purchase', 'stores', 'admin'].map(role => (
          <div key={role} className="card card-sm">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: roleColors[role] }} />
              <span style={{ fontWeight: 600, fontSize: 13 }}>{roleLabels[role]}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 12 }}>
                {users.filter(u => u.role === role).length}
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{roleAccess[role]}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Add Team Member</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><Icon n="x" size={14} /></button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">Full Name *</label><input className="form-control" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Email *</label><input className="form-control" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Password *</label><input className="form-control" type="password" required minLength={8} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 8 characters" /></div>
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select className="form-control" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                    <option value="accounts">Accounts</option>
                    <option value="purchase">Purchase</option>
                    <option value="stores">Stores</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{roleAccess[form.role]}</div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Added</th><th></th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: roleColors[u.role] }} />
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{fmtDate(u.createdAt)}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => deactivate(u._id)}>
                      <Icon n="trash" size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No team members yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [matchInvoice, setMatchInvoice] = useState(null);
  const [counts, setCounts] = useState({ pendingInvoices: 0 });
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [grnPrefill, setGrnPrefill] = useState(null);

  const showToast = (msg, type = 'info') => setToast({ msg, type });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const invs = await api('/api/invoices?status=pending');
        setCounts({ pendingInvoices: invs.length });
      } catch {}
    };
    loadCounts();
    const t = setInterval(loadCounts, 30000);
    return () => clearInterval(t);
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard': return <ScreenDashboard setScreen={setScreen} toast={showToast} />;
      case 'inbox': return <ScreenInbox setScreen={setScreen} setSelectedInvoice={setSelectedInvoice} toast={showToast} />;
      case 'ocr': return <ScreenOCR setScreen={setScreen} setSelectedInvoice={setSelectedInvoice} toast={showToast} />;
      case 'invoice_detail':
        if (!selectedInvoice) { setScreen('inbox'); return null; }
        return <ScreenInvoiceDetail invoice={selectedInvoice} setScreen={setScreen} setMatchInvoice={setMatchInvoice} toast={showToast} />;
      case 'match':
        if (!matchInvoice) { setScreen('inbox'); return null; }
        return <ScreenMatch invoice={matchInvoice} setScreen={setScreen} toast={showToast} />;
      case 'threeway':
        if (!matchInvoice && !selectedInvoice) { setScreen('inbox'); return null; }
        return <ScreenThreeWay invoice={matchInvoice || selectedInvoice} setScreen={setScreen} toast={showToast} setGrnPrefill={setGrnPrefill} />;
      case 'pos': return <ScreenPOs toast={showToast} />;
      case 'grns': return <ScreenGRNs toast={showToast} prefill={grnPrefill} setPrefill={setGrnPrefill} />;
      case 'vendors': return <ScreenVendors toast={showToast} />;
      case 'register': return <ScreenRegister toast={showToast} />;
      default: return <ScreenDashboard setScreen={setScreen} toast={showToast} />;
    }
  };

  const screenTitles = {
    dashboard: 'Dashboard', inbox: 'E-Invoice Inbox', ocr: 'OCR Upload',
    invoice_detail: 'Invoice Detail', match: 'PO Matching', threeway: '3-Way Match',
    pos: 'Purchase Orders', grns: 'Goods Receipts', vendors: 'Vendors',
    register: 'AP Register',
  };

  return (
    <>
      <Head>
        <title>Kraya AP Automation</title>
        <meta name="description" content="Accounts Payable Automation for Indian businesses" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='26' font-size='28'>K</text></svg>" />
      </Head>
      <div className="app-shell">
        <Sidebar screen={screen} setScreen={(s) => { setScreen(s); }} counts={counts} />
        <div className="main-area">
          <div className="topbar">
            <span className="topbar-title">{screenTitles[screen] || 'AP Automation'}</span>
            <div className="topbar-actions">
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>FY 2024–25</span>
            </div>
          </div>
          <div className="content">
            {renderScreen()}
          </div>
        </div>
      </div>
      <Toast msg={toast.msg} type={toast.type} onDone={() => setToast({ msg: '', type: '' })} />
    </>
  );
}
