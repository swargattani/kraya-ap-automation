/* Kraya · Accounts Payable — shared shell & data.
   AP automation flow:
   1. E-invoices auto-fetched from GST portal by company GSTIN (api)
   2. OCR fallback for invoices when GST OTP isn't shared
   3. Side-by-side PO ↔ Invoice line-item match per vendor GSTIN
   4. 3-way match: PO ↔ Invoice ↔ GRN, with diffs flagged
   5. Accounts team establishes payable; e-way bills tracked separately. */

const LOGO = (window.__resources && window.__resources.logo) || "assets/kraya-logo-black.png";

/* ── Icons (Lucide-style) ────────────────────────────────────────────── */
function Icon({ name, size = 16, stroke = 1.8 }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "search":   return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>;
    case "bell":     return <svg {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case "grid":     return <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
    case "inbox":    return <svg {...p}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
    case "scan":     return <svg {...p}><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/></svg>;
    case "link":     return <svg {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
    case "layers":   return <svg {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
    case "wallet":   return <svg {...p}><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h16v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7"/><path d="M18 12h.01"/></svg>;
    case "truck":    return <svg {...p}><path d="M16 16V6a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v10h15zM16 8h4l3 4v4h-7M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>;
    case "vendor":   return <svg {...p}><path d="M3 21h18M5 21V7l8-4v18M19 21v-9l-6-3"/></svg>;
    case "doc":      return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    case "check":    return <svg {...p}><path d="M20 6 9 17l-5-5"/></svg>;
    case "check-c":  return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/></svg>;
    case "x":        return <svg {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case "x-c":      return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/></svg>;
    case "alert":    return <svg {...p}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case "plus":     return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case "arrow":    return <svg {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case "arrow-l":  return <svg {...p}><path d="M19 12H5M12 5l-7 7 7 7"/></svg>;
    case "arrow-down":return <svg {...p}><path d="M12 5v14M5 12l7 7 7-7"/></svg>;
    case "chev-d":   return <svg {...p}><path d="m6 9 6 6 6-6"/></svg>;
    case "chev-r":   return <svg {...p}><path d="m9 18 6-6-6-6"/></svg>;
    case "chev-l":   return <svg {...p}><path d="m15 18-6-6 6-6"/></svg>;
    case "download": return <svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
    case "upload":   return <svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>;
    case "filter":   return <svg {...p}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>;
    case "refresh":  return <svg {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></svg>;
    case "rupee":    return <svg {...p}><path d="M6 3h12M6 8h12M6 13l9 8M6 13a6 6 0 0 0 12 0"/></svg>;
    case "rss":      return <svg {...p}><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5"/></svg>;
    case "package":  return <svg {...p}><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/></svg>;
    case "shield":   return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "settings": return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15 1.65 1.65 0 0 0 3.09 14H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9 1.65 1.65 0 0 0 4.27 7.18l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case "barcode":  return <svg {...p}><path d="M3 5v14M7 5v14M11 5v14M15 5v14M19 5v14"/></svg>;
    case "key":      return <svg {...p}><circle cx="7.5" cy="15.5" r="4.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/></svg>;
    case "eye":      return <svg {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "map":      return <svg {...p}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
    case "pin":      return <svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "clock":    return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "calendar": return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    case "more":     return <svg {...p}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
    case "open":     return <svg {...p}><path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>;
    case "split":    return <svg {...p}><path d="M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>;
    case "warehouse":return <svg {...p}><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35a2 2 0 0 1 1.26-1.86l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35z"/><path d="M6 18h12V14H6zM6 14V10h12v4"/></svg>;
    case "send":     return <svg {...p}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
    case "list":     return <svg {...p}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
    case "info":     return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>;
    case "lock":     return <svg {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    default: return null;
  }
}

/* ── Top bar ─────────────────────────────────────────────────────────── */
function AppTopbar({ role = "Accounts", roleStyle = "accounts", business = "Haldiram Snacks Pvt Ltd", gstin = "27AAACH1234D1Z5", initials = "RS", search = true }) {
  return (
    <header className="ka-topbar">
      <img className="logo" src={LOGO} alt="kraya"/>
      <span style={{ color: "var(--fg-3)", font: "500 12px/1 var(--font-mono)" }}>/ Accounts Payable</span>
      <span className={`role ${roleStyle}`}>{role}</span>
      {search && (
        <div className="search">
          <Icon name="search" size={15} stroke={2}/>
          <input placeholder="Search invoices, POs, GRNs, IRN, vendors…"/>
        </div>
      )}
      <div className="right">
        <button className="ka-btn ka-btn-ghost ka-btn-sm" title="Notifications"><Icon name="bell" size={15}/></button>
        <div className="org">
          <div className="n">{business}</div>
          <div className="s">{gstin}</div>
        </div>
        <div className="avatar">{initials}</div>
      </div>
    </header>
  );
}

/* ── Sidebar nav ────────────────────────────────────────────────────── */
function Sidebar({ active = "inbox" }) {
  const groups = [
    {
      label: "Ingestion",
      items: [
        { id: "dashboard", icon: "grid",     label: "Dashboard" },
        { id: "inbox",     icon: "inbox",    label: "E-invoice inbox", badge: "24" },
        { id: "ocr",       icon: "scan",     label: "OCR upload",     badge: "3" },
        { id: "sources",   icon: "rss",      label: "GST sources" },
      ],
    },
    {
      label: "Match & verify",
      items: [
        { id: "po-match",  icon: "link",     label: "PO matching",    badge: "12" },
        { id: "threeway",  icon: "layers",   label: "3-way match",    badge: "8" },
        { id: "grn",       icon: "warehouse",label: "GRN · stores" },
      ],
    },
    {
      label: "Payables",
      items: [
        { id: "register",  icon: "wallet",   label: "AP register",    badge: "16" },
        { id: "schedule",  icon: "calendar", label: "Payment runs" },
        { id: "eway",      icon: "truck",    label: "E-way bills",    badgeLive: "live" },
      ],
    },
    {
      label: "Master",
      items: [
        { id: "vendors",   icon: "vendor",   label: "Vendors" },
        { id: "settings",  icon: "settings", label: "Settings" },
      ],
    },
  ];
  return (
    <aside className="ka-sidebar">
      {groups.map((g, gi) => (
        <React.Fragment key={gi}>
          <div className="ka-nav-sec">{g.label}</div>
          {g.items.map((it, ii) => (
            <div key={ii} className={`ka-nav-item ${it.id === active ? "active" : ""}`}>
              <Icon name={it.icon}/>
              <span>{it.label}</span>
              {it.badge && <span className="badge">{it.badge}</span>}
              {it.badgeLive && <span className="badge live">LIVE</span>}
            </div>
          ))}
        </React.Fragment>
      ))}
      <div style={{ marginTop: 22, padding: "12px 12px 4px" }}>
        <div className="ka-card" style={{ background: "var(--kraya-ink)", color: "white", border: "none", boxShadow: "none" }}>
          <div style={{ padding: 14 }}>
            <div style={{ font: "600 10.5px/1 var(--font-sans)", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>This period</div>
            <div style={{ font: "700 22px/1 var(--font-sans)", letterSpacing: "-0.02em" }}>₹ 4.82 Cr</div>
            <div style={{ font: "500 11px/1.3 var(--font-mono)", color: "rgba(255,255,255,0.55)", marginTop: 6 }}>payables · 168 invoices</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ── Page head ───────────────────────────────────────────────────────── */
function PageHead({ crumbs, title, sub, actions }) {
  return (
    <div className="ka-pagehead">
      <div>
        {crumbs && (
          <div className="breadcrumb">
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Icon name="chev-r" size={12}/>}
                <span className={`crumb ${i === crumbs.length - 1 ? "active" : ""}`}>{c}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {actions && <div className="btns">{actions}</div>}
    </div>
  );
}

/* ── Card / Badge / Stat ────────────────────────────────────────────── */
function Card({ title, meta, action, children, style, bodyStyle, noBody }) {
  const head = (title || meta || action) && (
    <div className="ka-card-h">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {title && <h3>{title}</h3>}{meta && <span className="meta">{meta}</span>}
      </div>{action}
    </div>
  );
  return (
    <div className="ka-card" style={style}>
      {head}
      {noBody ? children : <div className="ka-card-b" style={bodyStyle}>{children}</div>}
    </div>
  );
}

function Badge({ kind = "mute", dot, children, style }) {
  return (
    <span className={`ka-badge ka-b-${kind}`} style={style}>
      {dot && <span className="dot"/>}{children}
    </span>
  );
}

function Stat({ label, value, unit, sub, delta, deltaDown, brand, currency }) {
  return (
    <div className={`ka-stat ${brand ? "brand" : ""}`}>
      <div className="lbl">{label}</div>
      <div className="v">
        {currency && <span className="cur">{currency}</span>}
        <span>{value}</span>
        {unit && <span className="u">{unit}</span>}
      </div>
      {sub && <div style={{ font: "500 11px/1.3 var(--font-mono)", color: brand ? "rgba(255,255,255,0.55)" : "var(--fg-3)", marginTop: 6 }}>{sub}</div>}
      {delta && <div className={`delta ${deltaDown ? "down" : ""}`}>{deltaDown ? "↓" : "↑"} {delta}</div>}
    </div>
  );
}

/* ── Source tag ─────────────────────────────────────────────────────── */
function SourceTag({ source, conf }) {
  // source: "api" | "ocr" | "manual"
  if (source === "api") return <span className="src-tag api"><Icon name="rss" size={10} stroke={2.2}/> GST API</span>;
  if (source === "ocr") return <span className="src-tag ocr"><Icon name="scan" size={10} stroke={2.2}/> OCR {conf ? `· ${conf}%` : ""}</span>;
  return <span className="src-tag manual">Manual</span>;
}

/* ── Confidence meter ───────────────────────────────────────────────── */
function Meter({ pct }) {
  const lvl = pct >= 92 ? "ok" : pct >= 78 ? "warn" : "bad";
  return (
    <span className={`ka-meter ${lvl}`}>
      <span className="bar"><span className="fill" style={{ width: `${pct}%` }}/></span>
      {pct}%
    </span>
  );
}

/* ── Diff chip ──────────────────────────────────────────────────────── */
function Diff({ kind = "ok", children }) {
  return <span className={`ka-diff ${kind}`}>{children}</span>;
}

/* ── Steps chain ────────────────────────────────────────────────────── */
function Steps({ items }) {
  // items: [{ label, state: "done"|"live"|"todo" }]
  return (
    <div className="ka-steps">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <div className={`ka-step ${it.state}`}>
            <span className="num">{it.state === "done" ? "✓" : i + 1}</span>
            <span>{it.label}</span>
          </div>
          {i < items.length - 1 && <Icon name="chev-r" size={12} stroke={2.2}/>}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Formatters ─────────────────────────────────────────────────────── */
const fmtINR = (n) => "₹ " + n.toLocaleString("en-IN");
const fmtN   = (n) => n.toLocaleString("en-IN");
const fmtAmt = (n) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ── Sample data: vendors, POs, invoices, GRNs ───────────────────────── */

const BUYER_ORG = {
  name: "Haldiram Snacks Pvt Ltd",
  gstin: "27AAACH1234D1Z5",
  branch: "Nagpur · Plant 03",
  state: "Maharashtra",
};

const VENDORS = [
  { id: "v1", name: "Bharat Steel Co.",        short: "BS", gstin: "27AABCB2891C1ZP", city: "Pune",     state: "MH" },
  { id: "v2", name: "OM Bearings Pvt Ltd",     short: "OM", gstin: "27AAACO5612N1ZD", city: "Mumbai",   state: "MH" },
  { id: "v3", name: "Tata Components",         short: "TC", gstin: "24AABCT1322L1ZR", city: "Vadodara", state: "GJ" },
  { id: "v4", name: "Pragati Engineering",     short: "PE", gstin: "27AAGCP9921B1ZF", city: "Nashik",   state: "MH" },
  { id: "v5", name: "Vidarbha Steel Tools",    short: "VS", gstin: "27AAACV2210R1Z1", city: "Nagpur",   state: "MH" },
  { id: "v6", name: "Ananya Polymers",         short: "AP", gstin: "29AAACA8821J1ZN", city: "Bengaluru",state: "KA" },
];

/* Invoice inbox — mix of API-fetched and OCR */
const INBOX = [
  { id: "INV-2026-00428", vendor: "Bharat Steel Co.",     gstin: "27AABCB2891C1ZP", date: "26 May 26",  irn: "8a3f…7d2c", amount: 1248400, items: 14, src: "api",                status: "matched",       step: "3way" },
  { id: "INV-2026-00427", vendor: "OM Bearings Pvt Ltd",  gstin: "27AAACO5612N1ZD", date: "26 May 26",  irn: "b6c2…44e1", amount:  246800, items:  6, src: "api",                status: "po-pending",    step: "po" },
  { id: "INV-2026-00426", vendor: "Tata Components",      gstin: "24AABCT1322L1ZR", date: "25 May 26",  irn: "—",          amount:  482400, items: 11, src: "ocr", conf: 94,     status: "ocr-review",    step: "review" },
  { id: "INV-2026-00425", vendor: "Pragati Engineering",  gstin: "27AAGCP9921B1ZF", date: "25 May 26",  irn: "f02a…a9b3", amount:  168200, items:  8, src: "api",                status: "grn-pending",   step: "grn" },
  { id: "INV-2026-00424", vendor: "Vidarbha Steel Tools", gstin: "27AAACV2210R1Z1", date: "25 May 26",  irn: "—",          amount:   96800, items:  4, src: "ocr", conf: 78,     status: "ocr-review",    step: "review" },
  { id: "INV-2026-00423", vendor: "Bharat Steel Co.",     gstin: "27AABCB2891C1ZP", date: "24 May 26",  irn: "1f48…c200", amount:  892200, items: 18, src: "api",                status: "ready",         step: "ready" },
  { id: "INV-2026-00422", vendor: "Ananya Polymers",      gstin: "29AAACA8821J1ZN", date: "24 May 26",  irn: "44d2…ff10", amount:  324500, items:  9, src: "api",                status: "exception",     step: "ex" },
  { id: "INV-2026-00421", vendor: "OM Bearings Pvt Ltd",  gstin: "27AAACO5612N1ZD", date: "24 May 26",  irn: "9ee1…b833", amount:  142000, items:  5, src: "api",                status: "ready",         step: "ready" },
  { id: "INV-2026-00420", vendor: "Tata Components",      gstin: "24AABCT1322L1ZR", date: "23 May 26",  irn: "5b87…2dde", amount:  228800, items:  7, src: "api",                status: "paid",          step: "paid" },
  { id: "INV-2026-00419", vendor: "Pragati Engineering",  gstin: "27AAGCP9921B1ZF", date: "23 May 26",  irn: "—",          amount:   72400, items:  3, src: "ocr", conf: 88,     status: "ocr-review",    step: "review" },
];

const STATUS_LABEL = {
  "matched":     { kind: "ok",    txt: "3-way matched" },
  "po-pending":  { kind: "warn",  txt: "PO link pending" },
  "ocr-review":  { kind: "info",  txt: "OCR · review" },
  "grn-pending": { kind: "warn",  txt: "Awaiting GRN" },
  "ready":       { kind: "brand", txt: "Ready to pay" },
  "exception":   { kind: "bad",   txt: "Exception" },
  "paid":        { kind: "mute",  txt: "Paid" },
};

/* PO line items (open, per vendor / GSTIN) — for Bharat Steel · INV-00428 */
const PO_LINES = [
  { sr: 1, po: "PO-26-0418", item: "HSS Cutting Disc 12in",    desc: "Box of 25, Norton brand",        hsn: "8202",  gst: 18, qty: 20,  rate:  3120, uom: "box" },
  { sr: 2, po: "PO-26-0418", item: "M8 304L Hex Bolt",         desc: "DIN 933, 30mm length",            hsn: "7318",  gst: 18, qty: 200, rate:    14, uom: "pc"  },
  { sr: 3, po: "PO-26-0421", item: "GI Pipe 25mm Class B",     desc: "ISI marked, 6m length",           hsn: "7306",  gst: 18, qty: 120, rate:   142, uom: "m"   },
  { sr: 4, po: "PO-26-0421", item: "MS Angle 50×50×6",         desc: "6m length, mill finish",          hsn: "7216",  gst: 18, qty: 80,  rate:   188, uom: "pc"  },
  { sr: 5, po: "PO-26-0425", item: "Welding Rod E7018",        desc: "3.15mm, 5kg pack",                hsn: "8311",  gst: 18, qty: 40,  rate:   620, uom: "pack"},
  { sr: 6, po: "PO-26-0425", item: "Hex Nut M12 Galvanized",   desc: "DIN 934, zinc plated",            hsn: "7318",  gst: 18, qty: 500, rate:     8, uom: "pc"  },
];

/* Invoice line items (vendor's submission) */
const INV_LINES = [
  { sr: 1, inv: "INV-00428", item: "HSS Cutting Disc 12\"",     desc: "Norton, box 25 nos",              hsn: "8202",  gst: 18, qty: 20,  rate:  3120 },
  { sr: 2, inv: "INV-00428", item: "M8 SS 304L Hex Bolt",       desc: "DIN 933, 30 mm",                  hsn: "7318",  gst: 18, qty: 200, rate:    14 },
  { sr: 3, inv: "INV-00428", item: "GI Pipe 25 mm Cl-B",        desc: "ISI · 6 m",                       hsn: "7306",  gst: 18, qty: 120, rate:   148 }, // rate diff
  { sr: 4, inv: "INV-00428", item: "MS Angle 50×50×6",          desc: "6 m length",                      hsn: "7216",  gst: 18, qty: 80,  rate:   188 },
  { sr: 5, inv: "INV-00428", item: "Welding Rod E7018",         desc: "3.15 mm · 5 kg pkt",              hsn: "8311",  gst: 18, qty: 40,  rate:   620 },
  { sr: 6, inv: "INV-00428", item: "Hex Nut M12 GI",            desc: "DIN 934",                         hsn: "7318",  gst: 18, qty: 520, rate:     8 }, // qty diff
  { sr: 7, inv: "INV-00428", item: "Freight & handling",        desc: "—",                               hsn: "9965",  gst: 18, qty:  1,  rate:  4800 }, // unmatched
];

/* GRN data — what stores received */
const GRN_LINES = [
  { sr: 1, grn: "GRN-2841", item: "HSS Cutting Disc 12in",   recvQty: 20,  date: "25 May 26", remarks: "OK" },
  { sr: 2, grn: "GRN-2841", item: "M8 304L Hex Bolt",        recvQty: 200, date: "25 May 26", remarks: "OK" },
  { sr: 3, grn: "GRN-2842", item: "GI Pipe 25mm Class B",    recvQty: 120, date: "25 May 26", remarks: "OK" },
  { sr: 4, grn: "GRN-2842", item: "MS Angle 50×50×6",        recvQty: 78,  date: "25 May 26", remarks: "2 pcs short" }, // grn qty diff
  { sr: 5, grn: "GRN-2843", item: "Welding Rod E7018",       recvQty: 40,  date: "26 May 26", remarks: "OK" },
  { sr: 6, grn: "GRN-2843", item: "Hex Nut M12 Galvanized",  recvQty: 500, date: "26 May 26", remarks: "Excess in invoice" },
];

/* Activity feed */
const ACTIVITY = [
  { t: "10:42", icon: "rss",     iconBg: "var(--ap-info-bg)", iconColor: "var(--ap-info)",
    who: "GST e-invoice API", what: "Fetched 4 invoices for GSTIN 27AAACH1234D1Z5 · ₹ 18.4 L total" },
  { t: "10:38", icon: "scan",    iconBg: "var(--ap-warn-bg)", iconColor: "var(--ap-warn)",
    who: "OCR · Google Vision",  what: "Processed INV-2026-00426 from Tata Components · confidence 94%" },
  { t: "10:30", icon: "warehouse", iconBg: "var(--ap-info-bg)", iconColor: "var(--ap-info)",
    who: "Sandeep K · Stores",   what: "Recorded GRN-2842 against PO-26-0421 (Pragati Engg) · 4 lines" },
  { t: "10:22", icon: "check-c", iconBg: "var(--ap-ok-bg)",   iconColor: "var(--ap-ok)",
    who: "Rohit S · Purchase",   what: "Matched INV-2026-00425 line items to PO-26-0421 (1 quantity flag)" },
  { t: "09:58", icon: "wallet",  iconBg: "var(--kraya-red-soft)", iconColor: "var(--kraya-red)",
    who: "Asha M · Accounts",    what: "Released payment ₹ 8.92 L · INV-2026-00423 (Bharat Steel) via NEFT" },
  { t: "09:41", icon: "alert",   iconBg: "var(--ap-bad-bg)",  iconColor: "var(--ap-bad)",
    who: "Compliance check",     what: "Vendor Ananya Polymers · INV-2026-00422 flagged — HSN mismatch on 2 lines" },
];

/* GST API connections */
const SOURCES = [
  { gstin: "27AAACH1234D1Z5", branch: "Plant 03 · Nagpur",        state: "Maharashtra", health: "ok",   lastPull: "2 min ago",  invMonth: 142, otp: "active" },
  { gstin: "29AAACH1234D2Z3", branch: "DC · Bengaluru",           state: "Karnataka",   health: "ok",   lastPull: "5 min ago",  invMonth:  68, otp: "active" },
  { gstin: "07AAACH1234D3Z1", branch: "HO · Delhi",               state: "Delhi",       health: "warn", lastPull: "2 hr ago",   invMonth: 102, otp: "expiring" },
  { gstin: "33AAACH1234D4Z8", branch: "South Plant · Chennai",    state: "Tamil Nadu",  health: "bad",  lastPull: "Yesterday",  invMonth:  44, otp: "needs OTP" },
  { gstin: "06AAACH1234D5Z6", branch: "Warehouse · Gurugram",     state: "Haryana",     health: "ok",   lastPull: "8 min ago",  invMonth:  29, otp: "active" },
];

/* E-way bills tracking */
const EWAYS = [
  { id: "EWB-271-9482", inv: "INV-2026-00428", vendor: "Bharat Steel Co.", from: "Pune",    to: "Nagpur",    distance: "718 km", vehicle: "MH-12-AB-3421", driver: "Vikram T.",   valid: "27 May, 22:00", status: "in-transit", progress: 62 },
  { id: "EWB-271-9481", inv: "INV-2026-00427", vendor: "OM Bearings",      from: "Mumbai",  to: "Nagpur",    distance: "832 km", vehicle: "MH-04-PQ-1212", driver: "Bhushan R.",  valid: "28 May, 06:00", status: "in-transit", progress: 28 },
  { id: "EWB-271-9479", inv: "INV-2026-00425", vendor: "Pragati Engg",     from: "Nashik",  to: "Nagpur",    distance: "612 km", vehicle: "MH-15-CD-8821", driver: "Manoj P.",    valid: "26 May, 18:00", status: "delivered", progress: 100 },
  { id: "EWB-271-9478", inv: "INV-2026-00423", vendor: "Bharat Steel Co.", from: "Pune",    to: "Nagpur",    distance: "718 km", vehicle: "MH-12-XY-4490", driver: "Sandeep G.",  valid: "24 May, 22:00", status: "delivered", progress: 100 },
  { id: "EWB-271-9477", inv: "INV-2026-00422", vendor: "Ananya Polymers",  from: "Bengaluru",to:"Nagpur",    distance: "1080 km",vehicle: "KA-05-MN-7711", driver: "Suresh K.",   valid: "26 May, 18:00", status: "expiring",   progress: 84 },
];

const EWAY_STATUS = {
  "in-transit": { kind: "info",  txt: "In transit" },
  "delivered":  { kind: "ok",    txt: "Delivered" },
  "expiring":   { kind: "warn",  txt: "Expiring soon" },
  "expired":    { kind: "bad",   txt: "Expired" },
};

/* AP register entries (ready to pay) */
const PAYABLES = [
  { id: "INV-2026-00423", vendor: "Bharat Steel Co.",    gstin: "27AABCB2891C1ZP", amount:  892200, dueIn: 3,  approvers: ["RS", "AM"], holds: [],                  paymentMode: "NEFT" },
  { id: "INV-2026-00421", vendor: "OM Bearings",         gstin: "27AAACO5612N1ZD", amount:  142000, dueIn: 5,  approvers: ["RS"],       holds: [],                  paymentMode: "NEFT" },
  { id: "INV-2026-00417", vendor: "Pragati Engineering", gstin: "27AAGCP9921B1ZF", amount:  328400, dueIn: 1,  approvers: ["RS", "AM"], holds: ["Quality NCR open"],paymentMode: "RTGS" },
  { id: "INV-2026-00414", vendor: "Vidarbha Steel Tools",gstin: "27AAACV2210R1Z1", amount:   62800, dueIn: 7,  approvers: ["RS"],       holds: [],                  paymentMode: "UPI"  },
  { id: "INV-2026-00412", vendor: "Tata Components",     gstin: "24AABCT1322L1ZR", amount:  448600, dueIn: -2, approvers: ["RS", "AM"], holds: [],                  paymentMode: "RTGS" },
  { id: "INV-2026-00408", vendor: "Ananya Polymers",     gstin: "29AAACA8821J1ZN", amount:  216200, dueIn: 9,  approvers: ["RS"],       holds: [],                  paymentMode: "NEFT" },
];

Object.assign(window, {
  Icon, AppTopbar, Sidebar, PageHead, Card, Badge, Stat, SourceTag, Meter, Diff, Steps,
  fmtINR, fmtN, fmtAmt,
  LOGO, BUYER_ORG, VENDORS, INBOX, STATUS_LABEL,
  PO_LINES, INV_LINES, GRN_LINES, ACTIVITY, SOURCES, EWAYS, EWAY_STATUS, PAYABLES,
});
