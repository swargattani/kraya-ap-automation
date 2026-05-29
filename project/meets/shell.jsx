/* Kraya Live Meets — shared components.
   New flow: in-room buyer-seller meet. Buyers + sellers in the same hall.
   When logged into the event, special prices unlock. The big screen in the
   room rotates product cards with QR codes — buyers scan to book or buy
   instantly via payment gateway. Vendor accounts are linked to their
   bank account for direct settlement. */

const LOGO = "assets/kraya-logo-black.png";

/* ── Icons ───────────────────────────────────────────────────────────── */
function Icon({ name, size = 18, stroke = 1.8 }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "search":   return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>;
    case "bell":     return <svg {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case "cog":      return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15 1.65 1.65 0 0 0 3.09 14H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9 1.65 1.65 0 0 0 4.27 7.18l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case "grid":     return <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
    case "calendar": return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    case "users":    return <svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "mappin":   return <svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "clock":    return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "po":       return <svg {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>;
    case "catalog":  return <svg {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
    case "arrow":    return <svg {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case "check":    return <svg {...p}><path d="M20 6 9 17l-5-5"/></svg>;
    case "x":        return <svg {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case "plus":     return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case "minus":    return <svg {...p}><path d="M5 12h14"/></svg>;
    case "qr":       return <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3M20 14v3M14 17v4M17 17v4M20 20v1"/></svg>;
    case "scan":     return <svg {...p}><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/></svg>;
    case "rupee":    return <svg {...p}><path d="M6 3h12M6 8h12M6 13l9 8M6 13a6 6 0 0 0 12 0"/></svg>;
    case "bolt":     return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case "bookmark": return <svg {...p}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>;
    case "tag":      return <svg {...p}><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
    case "tv":       return <svg {...p}><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M7 22h10M12 18v4"/></svg>;
    case "wallet":   return <svg {...p}><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h16v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7"/><path d="M18 12h.01"/></svg>;
    case "phone":    return <svg {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
    case "chev-d":   return <svg {...p}><path d="m6 9 6 6 6-6"/></svg>;
    case "chev-r":   return <svg {...p}><path d="m9 18 6-6-6-6"/></svg>;
    case "chev-l":   return <svg {...p}><path d="m15 18-6-6 6-6"/></svg>;
    case "play":     return <svg {...p}><polygon points="5 3 19 12 5 21 5 3"/></svg>;
    case "pause":    return <svg {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
    case "filter":   return <svg {...p}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>;
    case "upload":   return <svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>;
    case "image":    return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>;
    case "package":  return <svg {...p}><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/></svg>;
    case "trend":    return <svg {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
    case "broadcast": return <svg {...p}><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M20.49 4a12 12 0 0 1 0 16M3.51 20a12 12 0 0 1 0-16"/></svg>;
    default: return null;
  }
}

/* ── Marketing nav (kraya.io) — black & white ────────────────────────── */
function MkNav({ active = "meets" }) {
  const links = ["Product", "Vendors", "Meets", "Auctions", "Pricing", "About"];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(14px)", borderBottom: "1px solid #e5e5e5" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px", display: "flex",
        alignItems: "center", gap: 40, height: 76 }}>
        <a href="#" style={{ flexShrink: 0 }}><img src={LOGO} alt="kraya" style={{ height: 22, display: "block" }}/></a>
        <nav style={{ display: "flex", gap: 32, marginLeft: 12 }}>
          {links.map((l) => (
            <a key={l} href="#" style={{
              color: l.toLowerCase() === active ? "#0a0a0a" : "#555",
              borderBottom: l.toLowerCase() === active ? "1px solid #0a0a0a" : "1px solid transparent",
              paddingBottom: 4, textDecoration: "none", font: "500 13px/1 var(--font-sans)",
            }}>{l}</a>
          ))}
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <a className="km-btn km-btn-ghost km-btn-lg" href="#">Sign in</a>
          <a className="km-btn km-btn-dark km-btn-lg" href="#" style={{ borderRadius: 999, padding: "12px 22px" }}>Request demo</a>
        </div>
      </div>
    </header>
  );
}

/* ── App topbar ──────────────────────────────────────────────────────── */
function AppTopbar({ role, business, gstin, initials, eventBanner, showSearch = true }) {
  return (
    <header className="km-topbar">
      <img className="logo" src={LOGO} alt="kraya"/>
      <span className={`role-tag ${role === "Vendor" ? "" : role === "Admin" ? "admin" : "buyer"}`}>{role}</span>
      {eventBanner}
      {showSearch && !eventBanner && (
        <div className="search">
          <Icon name="search" size={16} stroke={2}/>
          <input placeholder="Search products, vendors, meets…"/>
        </div>
      )}
      <div className="right">
        <button className="km-btn km-btn-ghost km-btn-sm"><Icon name="bell" size={16}/></button>
        <div className="business"><div className="n">{business}</div><div className="s">{gstin}</div></div>
        <div className="avatar">{initials}</div>
      </div>
    </header>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────────────── */
function Sidebar({ groups }) {
  return (
    <aside className="km-sidebar">
      {groups.map((g, gi) => (
        <React.Fragment key={gi}>
          <div className="km-nav-sec">{g.label}</div>
          {g.items.map((it, ii) => (
            <div key={ii} className={`km-nav-item ${it.active ? "active" : ""}`}>
              <Icon name={it.icon}/>
              <span>{it.label}</span>
              {it.badge && <span className="badge">{it.badge}</span>}
            </div>
          ))}
        </React.Fragment>
      ))}
    </aside>
  );
}

/* ── Page head, card, badge ──────────────────────────────────────────── */
function PageHead({ title, sub, actions }) {
  return (
    <div className="km-pagehead">
      <div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>
      {actions && <div className="btns">{actions}</div>}
    </div>
  );
}

function Card({ title, meta, action, children, style, bodyStyle, noBody }) {
  const head = (title || meta || action) && (
    <div className="km-card-h">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {title && <h3>{title}</h3>}{meta && <span className="meta">{meta}</span>}
      </div>{action}
    </div>
  );
  return (
    <div className="km-card" style={style}>
      {head}
      {noBody ? children : <div className="km-card-b" style={bodyStyle}>{children}</div>}
    </div>
  );
}

function Badge({ kind = "neutral", dot, children, style }) {
  return (
    <span className={`km-badge km-b-${kind}`} style={style}>
      {dot && <span className="dot"/>}{children}
    </span>
  );
}

/* ── QR code (decorative SVG; deterministic from seed string) ────────── */
function QR({ size = 220, value = "kraya", color = "#0a0a0a", bg = "#ffffff" }) {
  // Deterministic pseudo-random pattern from value. Not a real QR.
  const cells = 25;
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  const rng = () => { h = (h * 1664525 + 1013904223) >>> 0; return (h & 0xffff) / 0xffff; };

  const cellSize = size / cells;
  const cellsArr = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const inFinder = (x < 7 && y < 7) || (x >= cells - 7 && y < 7) || (x < 7 && y >= cells - 7);
      const inAlign  = x >= cells - 9 && x < cells - 4 && y >= cells - 9 && y < cells - 4;
      if (inFinder || inAlign) continue;
      if (rng() < 0.48) cellsArr.push([x, y]);
    }
  }
  const finder = (cx, cy) => (
    <g key={`f-${cx}-${cy}`}>
      <rect x={cx * cellSize} y={cy * cellSize} width={cellSize * 7} height={cellSize * 7} fill={color}/>
      <rect x={(cx + 1) * cellSize} y={(cy + 1) * cellSize} width={cellSize * 5} height={cellSize * 5} fill={bg}/>
      <rect x={(cx + 2) * cellSize} y={(cy + 2) * cellSize} width={cellSize * 3} height={cellSize * 3} fill={color}/>
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <rect width={size} height={size} fill={bg}/>
      {cellsArr.map(([x, y], i) => (
        <rect key={i} x={x * cellSize} y={y * cellSize} width={cellSize} height={cellSize} fill={color}/>
      ))}
      {finder(0, 0)}
      {finder(cells - 7, 0)}
      {finder(0, cells - 7)}
      {/* alignment block bottom-right */}
      <rect x={(cells - 9) * cellSize} y={(cells - 9) * cellSize} width={cellSize * 5} height={cellSize * 5} fill={color}/>
      <rect x={(cells - 8) * cellSize} y={(cells - 8) * cellSize} width={cellSize * 3} height={cellSize * 3} fill={bg}/>
      <rect x={(cells - 7) * cellSize} y={(cells - 7) * cellSize} width={cellSize} height={cellSize} fill={color}/>
    </svg>
  );
}

/* ── Sample data ─────────────────────────────────────────────────────── */
const EVENT = {
  id: "via-spring-26",
  name: "VIA Spring Live Meet",
  hostFull: "Vidarbha Industries Association",
  hostShort: "VIA",
  dateStr: "Fri, 13 Mar 2026",
  venue: "VIA Hall, Udyog Bhavan · Nagpur",
  code: "VIA-26-SPRING",
  startsAt: "10:00 IST",
  endsAt: "17:00 IST",
  status: "live", // upcoming | live | closed
  liveSince: "10:04",
  vendorsConfirmed: 34,
  buyersInRoom: 86,
  itemsLive: 142,
};

/* Live deals at the event */
const ITEMS = [
  { id: "i1", vendor: "Bharat Steel Co.",       vlogo: "BS", sku: "BS-HBM8-304L",      name: "M8 304L Stainless Hex Bolt",          unit: "per 100u box", regular: 16800, special: 12400, stock: 48,  category: "Fasteners",     featured: true },
  { id: "i2", vendor: "OM Bearings",            vlogo: "OM", sku: "OM-6205-2RS",       name: "SKF-equiv 6205-2RS Bearing",          unit: "per piece",    regular:  1280, special:   920, stock: 120, category: "Bearings",      featured: true },
  { id: "i3", vendor: "Tata Components",        vlogo: "TC", sku: "TC-MNX32",          name: "MNX-32 Contactor 32A",                unit: "per piece",    regular:  1820, special:  1480, stock: 60,  category: "Electricals",   featured: false },
  { id: "i4", vendor: "Jay Industrial Supplies",vlogo: "JS", sku: "JS-BB-6204",        name: "Ball bearing 6204",                   unit: "per piece",    regular:   620, special:   460, stock: 220, category: "Bearings",      featured: false },
  { id: "i5", vendor: "Pragati Engineering",    vlogo: "PE", sku: "PE-GIPIPE-25",      name: "GI Pipe · 25mm Class B",              unit: "per metre",    regular:   178, special:   142, stock: 1200,category: "MRO",           featured: false },
  { id: "i6", vendor: "Vidarbha Steel Tools",   vlogo: "VS", sku: "VS-CUT-12",         name: "HSS Cutting Disc · 12in",             unit: "per box of 25",regular:  4200, special:  3120, stock: 22,  category: "Cutting tools", featured: false },
  { id: "i7", vendor: "Bharat Steel Co.",       vlogo: "BS", sku: "BS-DIN933-SET",     name: "DIN 933 Hex bolt assortment",         unit: "per set",      regular:  2400, special:  1820, stock: 14,  category: "Fasteners",     featured: false },
  { id: "i8", vendor: "Ananya Polymers",        vlogo: "AP", sku: "AP-XLPE-25",        name: "XLPE insulation sheet 25mm",          unit: "per sq.m",     regular:   840, special:   660, stock: 180, category: "Insulation",    featured: false },
];

/* Live activity feed */
const ACTIVITY = [
  { t: "14:24", who: "Acme Mfg",         act: "bought",   sku: "BS-HBM8-304L", qty: 12 },
  { t: "14:22", who: "Mahindra Logistics", act: "booked",  sku: "OM-6205-2RS",   qty: 80 },
  { t: "14:19", who: "Larsen Industrial",act: "bought",   sku: "TC-MNX32",      qty: 6  },
  { t: "14:14", who: "Godrej Inds.",     act: "bought",   sku: "JS-BB-6204",    qty: 24 },
  { t: "14:08", who: "Hindalco",         act: "booked",   sku: "PE-GIPIPE-25",  qty: 240},
];

const fmtINR = (n) => "₹ " + n.toLocaleString("en-IN");

Object.assign(window, {
  Icon, MkNav, AppTopbar, Sidebar, PageHead, Card, Badge, QR,
  EVENT, ITEMS, ACTIVITY, fmtINR, LOGO,
});
