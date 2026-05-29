/* Vendor + Admin (organizer) desktop screens for the in-room live meet.

   - VendorItemSetup  — pre-event: pick items, set special prices, link bank
   - VendorLiveBooth  — during event: live orders, stock, settlements
   - AdminControlRoom — during event: master KPI + big-screen control + room ops
*/

function VendorShell({ activeNav, eventBanner, children }) {
  const groups = [
    { label: "Vendor portal", items: [
      { icon: "po",       label: "Open tenders", badge: "12" },
      { icon: "catalog",  label: "Catalog" },
      { icon: "calendar", label: "Live meets", badge: "1 live", active: activeNav === "meets" },
      { icon: "wallet",   label: "Payouts" },
      { icon: "trend",    label: "Performance" },
    ]},
    { label: "Settings", items: [
      { icon: "wallet", label: "Bank &amp; payment" },
      { icon: "cog",    label: "Account" },
    ]},
  ];
  return (
    <div className="km">
      <div className="km-app">
        <AppTopbar role="Vendor" business="Bharat Steel Co." gstin="GSTIN 27AAA…782J" initials="BS"
          eventBanner={eventBanner} showSearch={!eventBanner}/>
        <Sidebar groups={groups}/>
        <main className="km-canvas">{children}</main>
      </div>
    </div>
  );
}

/* Reusable live-event topbar pill */
function LiveEventPill({ subtle }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "6px 14px", borderRadius: 999,
      background: subtle ? "var(--kraya-red-soft)" : "var(--kraya-red)",
      color: subtle ? "var(--kraya-red)" : "white",
      flex: 1, maxWidth: 540, marginLeft: 4,
    }}>
      <span style={{ width: 8, height: 8, background: subtle ? "var(--kraya-red)" : "white", borderRadius: 999,
        boxShadow: "0 0 0 0 currentColor", animation: "km-pulse 1.6s ease-out infinite" }}/>
      <span style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Live now</span>
      <span style={{ width: 1, height: 14, background: subtle ? "var(--kraya-red-tint)" : "rgba(255,255,255,0.3)" }}/>
      <span style={{ font: "500 12px/1 var(--font-sans)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {EVENT.name} · {EVENT.venue.split("·")[1].trim()}
      </span>
      <span style={{ marginLeft: "auto", font: "500 11px/1 var(--font-mono)", opacity: 0.85 }}>ends 17:00</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   07 · VENDOR DESKTOP — pre-event item setup
   ════════════════════════════════════════════════════════════════════ */
function VendorItemSetup() {
  const [items, setItems] = React.useState([
    { id: "i1", sku: "BS-HBM8-304L",   name: "M8 304L Stainless Hex Bolt",   unit: "per 100u box", regular: 16800, special: 12400, stock: 48, active: true },
    { id: "i2", sku: "BS-DIN933-SET",  name: "DIN 933 Hex bolt assortment",  unit: "per set",      regular:  2400, special:  1820, stock: 14, active: true },
    { id: "i3", sku: "BS-CBM6",        name: "M6 Carriage Bolt",             unit: "per 100u box", regular:  4200, special:  3380, stock: 30, active: true },
    { id: "i4", sku: "BS-UB12-GI",     name: "U-bolt 1/2\" GI",              unit: "per piece",    regular:    96, special:    74, stock: 800, active: false },
  ]);
  return (
    <VendorShell activeNav="meets">
      <div style={{ display: "flex", alignItems: "center", gap: 8, font: "400 12px/1 var(--font-sans)", color: "var(--fg-3)", marginBottom: 16 }}>
        <a href="#" style={{ color: "var(--fg-3)", textDecoration: "none" }}>Live meets</a>
        <Icon name="chev-r" size={12}/>
        <span style={{ color: "var(--fg-1)" }}>{EVENT.name} · prepare booth</span>
      </div>
      <PageHead
        title="Set your event-only prices"
        sub="Pick items to take live during VIA Spring on 13 Mar. These prices unlock for buyers only when they're inside the event."
        actions={
          <>
            <button className="km-btn km-btn-outline"><Icon name="catalog" size={14}/> Import from catalog</button>
            <button className="km-btn km-btn-primary"><Icon name="check" size={14}/> Save &amp; publish to event</button>
          </>
        }
      />

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          ["Items going live",      "3 of 142",    "from your catalog"],
          ["Avg. discount",         "23%",         "vs. regular price"],
          ["Avg. stock per item",   "30 units",    "across 3 SKUs"],
          ["Est. event revenue",    "₹ 2.8 L",     "based on past meets"],
        ].map(([l, v, s], i) => (
          <div key={l} className="km-card" style={{ padding: 16, ...(i === 3 ? { background: "var(--kraya-ink)", color: "white", borderColor: "var(--kraya-ink-2)" } : {}) }}>
            <div style={{ font: "600 10px/1 var(--font-sans)", letterSpacing: "0.08em", textTransform: "uppercase", color: i === 3 ? "rgba(255,255,255,0.7)" : "var(--fg-3)", marginBottom: 10 }}>{l}</div>
            <div style={{ font: "700 22px/1 var(--font-sans)", letterSpacing: "-0.02em" }}>{v}</div>
            <div style={{ font: "500 11px/1 var(--font-mono)", color: i === 3 ? "rgba(255,255,255,0.55)" : "var(--fg-3)", marginTop: 6 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Items table */}
          <Card title="Items going live · special prices" meta="Toggle off to keep out of this meet" action={<button className="km-btn km-btn-outline km-btn-sm"><Icon name="plus" size={12}/> Add item</button>}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Item</th>
                  <th style={th}>Unit</th>
                  <th style={{ ...th, textAlign: "right" }}>Regular</th>
                  <th style={{ ...th, textAlign: "right" }}>Special</th>
                  <th style={{ ...th, textAlign: "right" }}>Disc.</th>
                  <th style={{ ...th, textAlign: "right" }}>Event stock</th>
                  <th style={{ ...th, width: 80 }}>Live</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} style={{ borderTop: "1px solid var(--border-subtle)" }}>
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 6, background: "var(--neutral-100)", display: "grid", placeItems: "center", color: "var(--fg-3)", flexShrink: 0 }}>
                          <Icon name="image" size={16}/>
                        </div>
                        <div>
                          <div style={{ font: "500 13px/1.25 var(--font-sans)" }}>{it.name}</div>
                          <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 4 }}>{it.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...td, color: "var(--fg-3)", fontFamily: "var(--font-mono)", fontSize: 11 }}>{it.unit}</td>
                    <td style={{ ...tdNum, color: "var(--fg-3)" }}>{fmtINR(it.regular)}</td>
                    <td style={{ ...tdNum, color: "var(--kraya-red)", fontWeight: 600 }}>{fmtINR(it.special)}</td>
                    <td style={tdNum}><Badge kind="confirmed" style={{ fontSize: 10 }}>−{Math.round((1 - it.special/it.regular) * 100)}%</Badge></td>
                    <td style={{ ...tdNum, fontWeight: 600 }}>{it.stock}</td>
                    <td style={{ ...td, textAlign: "center" }}>
                      <label style={{ display: "inline-block", width: 36, height: 20, position: "relative", cursor: "pointer" }}>
                        <input type="checkbox" defaultChecked={it.active} style={{ opacity: 0 }}/>
                        <span style={{ position: "absolute", inset: 0, background: it.active ? "var(--kraya-red)" : "var(--neutral-300)", borderRadius: 999 }}/>
                        <span style={{ position: "absolute", top: 2, left: it.active ? 18 : 2, width: 16, height: 16, background: "white", borderRadius: 999, transition: "left 150ms" }}/>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Editor for one item */}
          <Card title="Edit special price · M8 304L Stainless Hex Bolt" meta="SKU BS-HBM8-304L" action={<Badge kind="brand">Live in 2d</Badge>}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
              <div className="km-field" style={{ margin: 0 }}>
                <label>Regular price (per 100u box)</label>
                <input defaultValue="16,800" disabled style={{ background: "var(--bg-canvas)", color: "var(--fg-3)" }}/>
                <div className="helper">From your live catalog. Read-only.</div>
              </div>
              <div className="km-field" style={{ margin: 0 }}>
                <label>Event special price <span style={{ color: "var(--kraya-red)" }}>·</span></label>
                <input defaultValue="12,400"/>
                <div className="helper">Buyers see this only after they enter the event.</div>
              </div>
              <div className="km-field" style={{ margin: 0 }}>
                <label>Event stock</label>
                <input defaultValue="48 boxes"/>
                <div className="helper">Held aside from your main catalog stock during the meet.</div>
              </div>
              <div className="km-field" style={{ margin: 0 }}>
                <label>Pickup window</label>
                <input defaultValue="16:30 – 17:00 today at booth B-12"/>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, padding: "16px 18px", background: "var(--bg-canvas)", borderRadius: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ font: "500 10px/1 var(--font-sans)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Discount</div>
                <div style={{ font: "700 22px/1 var(--font-sans)" }}>26%</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "500 10px/1 var(--font-sans)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Margin (est.)</div>
                <div style={{ font: "700 22px/1 var(--font-sans)" }}>18%</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "500 10px/1 var(--font-sans)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>If full sell-through</div>
                <div style={{ font: "700 22px/1 var(--font-sans)" }}>₹ 5.95 L</div>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT: bank link + preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Settlement account" meta="Payments settle here" action={<Badge kind="success" dot>Verified</Badge>}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", background: "var(--bg-canvas)", borderRadius: 10 }}>
              <div style={{ width: 40, height: 40, background: "#0a4d8c", color: "white", borderRadius: 8, display: "grid", placeItems: "center", font: "700 12px/1 var(--font-sans)", flexShrink: 0 }}>HDFC</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "600 13px/1.2 var(--font-sans)" }}>HDFC Bank · Current a/c</div>
                <div style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 4 }}>•• 4408 · IFSC HDFC0001234</div>
              </div>
              <button className="km-btn km-btn-ghost km-btn-sm">Change</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
              {[
                ["Account holder", "Bharat Steel Co. Pvt. Ltd."],
                ["GSTIN",          "27AAA…782J"],
                ["PAN",            "AAACB1234M"],
                ["Linked via",     "Razorpay Route · since Aug 2024"],
                ["Settlement",     "T+0 instant (UPI) · T+1 (card)"],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", font: "400 12px/1.4 var(--font-sans)", color: "var(--fg-2)" }}>
                  <span style={{ color: "var(--fg-3)" }}>{l}</span>
                  <span className="km-mono" style={{ color: "var(--fg-1)" }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="QR preview" meta="Buyer scans this on big screen">
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0" }}>
              <div style={{ background: "white", padding: 12, border: "1px solid var(--border-subtle)", borderRadius: 12 }}>
                <QR size={180} value="BS-HBM8-304L" color="#0a0a0a" bg="#ffffff"/>
              </div>
            </div>
            <div style={{ textAlign: "center", font: "500 12px/1 var(--font-mono)", color: "var(--fg-2)", marginTop: 8 }}>
              kraya.io/m/{EVENT.code}/BS-HBM8-304L
            </div>
            <div style={{ marginTop: 14, padding: 12, background: "var(--meet-pending-bg)", border: "1px solid var(--warning-soft)", borderRadius: 8, font: "500 11px/1.5 var(--font-sans)", color: "var(--meet-pending)" }}>
              Each item gets its own QR. Buyers scanning before they've entered the event see only the regular price.
            </div>
          </Card>
        </div>
      </div>
    </VendorShell>
  );
}

const th    = { textAlign: "left", font: "600 10px/1.4 var(--font-sans)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-3)", padding: "12px 16px", background: "var(--bg-canvas)" };
const td    = { font: "400 13px/1.4 var(--font-sans)", color: "var(--fg-1)", padding: "13px 16px" };
const tdNum = { ...td, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", textAlign: "right" };

/* ════════════════════════════════════════════════════════════════════
   08 · VENDOR DESKTOP — Live booth (during event)
   ════════════════════════════════════════════════════════════════════ */
function VendorLiveBooth() {
  const orders = [
    { ord: "#KR-26-104822", t: "14:24", buyer: "Acme Manufacturing",  item: "M8 304L Hex Bolt",      qty: 12,  amount: 148800, status: "paid",   pickup: "16:30" },
    { ord: "#KR-26-104791", t: "14:18", buyer: "Larsen Industrial",   item: "DIN 933 set",            qty:  6,  amount:  10920, status: "paid",   pickup: "16:30" },
    { ord: "#KR-26-104772", t: "14:08", buyer: "Mahindra Logistics",  item: "M8 304L Hex Bolt",      qty:  8,  amount:  99200, status: "booked", pickup: "—"     },
    { ord: "#KR-26-104755", t: "13:56", buyer: "Godrej Industries",   item: "M6 Carriage Bolt",      qty: 24,  amount:  81120, status: "paid",   pickup: "picked"},
    { ord: "#KR-26-104732", t: "13:42", buyer: "Hindalco Extrusions", item: "DIN 933 set",           qty:  4,  amount:   7280, status: "paid",   pickup: "picked"},
  ];

  return (
    <VendorShell activeNav="meets" eventBanner={<LiveEventPill subtle/>}>
      <PageHead
        title="Booth B-12 · live"
        sub="Orders and settlements update in real time. Buyers walk up at 16:30 to collect against their order QR."
        actions={
          <>
            <button className="km-btn km-btn-outline"><Icon name="qr" size={14}/> Scanner</button>
            <button className="km-btn km-btn-primary"><Icon name="bolt" size={14} stroke={2.4}/> Flash deal</button>
          </>
        }
      />

      {/* Live KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          ["Live orders",    "23",        "↑ 6 in last 30m", false],
          ["Bookings",       "11",        "₹ 1.84 L pipeline", false],
          ["Stock left",     "84 / 142",  "across 3 SKUs",   false],
          ["Settled today",  "₹ 4.42 L",  "T+0 instant",     false],
          ["Top buyer",      "Acme Mfg",  "₹ 1.48 L · 1 order", true],
        ].map(([l, v, s, dark], i) => (
          <div key={l} className="km-card" style={{ padding: 16, ...(dark ? { background: "var(--kraya-ink)", color: "white", borderColor: "var(--kraya-ink-2)" } : {}) }}>
            <div style={{ font: "600 10px/1 var(--font-sans)", letterSpacing: "0.08em", textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.7)" : "var(--fg-3)", marginBottom: 10 }}>{l}</div>
            <div style={{ font: "700 22px/1 var(--font-sans)", letterSpacing: "-0.02em" }}>{v}</div>
            <div style={{ font: "500 11px/1 var(--font-mono)", color: dark ? "#6FD1A4" : "var(--fg-2)", marginTop: 6 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Orders · today" meta="Auto-refreshed" action={<button className="km-btn km-btn-ghost km-btn-sm"><Icon name="filter" size={12}/> Filter</button>}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Order</th>
                  <th style={th}>Buyer</th>
                  <th style={th}>Item · qty</th>
                  <th style={{ ...th, textAlign: "right" }}>Amount</th>
                  <th style={th}>Status</th>
                  <th style={th}>Pickup</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.ord} style={{ borderTop: "1px solid var(--border-subtle)" }}>
                    <td style={td}>
                      <div style={{ font: "500 12px/1.2 var(--font-mono)", color: "var(--fg-1)" }}>{o.ord}</div>
                      <div style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 3 }}>{o.t} IST</div>
                    </td>
                    <td style={{ ...td, fontWeight: 500 }}>{o.buyer}</td>
                    <td style={td}>
                      <div>{o.item}</div>
                      <div style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 3 }}>qty {o.qty}</div>
                    </td>
                    <td style={{ ...tdNum, fontWeight: 600 }}>{fmtINR(o.amount)}</td>
                    <td style={td}>
                      {o.status === "paid"   && <Badge kind="success" dot>Paid · settled</Badge>}
                      {o.status === "booked" && <Badge kind="warning" dot>Booked</Badge>}
                    </td>
                    <td style={td}>
                      {o.pickup === "picked" && <Badge kind="neutral">Picked up</Badge>}
                      {o.pickup === "—"      && <span style={{ color: "var(--fg-3)" }}>—</span>}
                      {o.pickup !== "picked" && o.pickup !== "—" && <span style={{ font: "500 12px/1 var(--font-mono)" }}>{o.pickup}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title="Stock · live items" meta="Updates as orders come in">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { name: "M8 304L Hex Bolt",       sku: "BS-HBM8-304L",  total: 48, sold: 22, booked: 8 },
                { name: "DIN 933 Hex bolt set",   sku: "BS-DIN933-SET", total: 14, sold: 10, booked: 0 },
                { name: "M6 Carriage Bolt",       sku: "BS-CBM6",       total: 30, sold: 24, booked: 0 },
              ].map((s) => {
                const left = s.total - s.sold - s.booked;
                const pct  = (s.sold / s.total) * 100;
                const bpct = (s.booked / s.total) * 100;
                return (
                  <div key={s.sku} style={{ padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <div style={{ font: "600 13px/1.2 var(--font-sans)" }}>{s.name}</div>
                        <div style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 3 }}>{s.sku}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="km-mono" style={{ font: "700 14px/1 var(--font-mono)" }}>{left} <span style={{ color: "var(--fg-3)", fontWeight: 400 }}>/ {s.total}</span></div>
                        <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 4 }}>left at this price</div>
                      </div>
                    </div>
                    <div style={{ position: "relative", height: 8, background: "var(--bg-canvas)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: "var(--kraya-red)" }}/>
                      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pct}%`, width: `${bpct}%`, background: "var(--warning)" }}/>
                    </div>
                    <div style={{ display: "flex", gap: 16, marginTop: 8, font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)" }}>
                      <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--kraya-red)", borderRadius: 2, marginRight: 4 }}/>Sold {s.sold}</span>
                      <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--warning)", borderRadius: 2, marginRight: 4 }}/>Booked {s.booked}</span>
                      <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--bg-canvas)", border: "1px solid var(--border-default)", borderRadius: 2, marginRight: 4 }}/>Left {left}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT: settlements + activity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Settlements" meta="Direct to HDFC •• 4408">
            <div style={{ padding: "18px 18px 20px", background: "var(--kraya-ink)", color: "white", borderRadius: 12, marginBottom: 14 }}>
              <div style={{ font: "500 11px/1 var(--font-sans)", color: "rgba(255,255,255,0.65)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Settled to your bank today</div>
              <div style={{ font: "700 32px/1 var(--font-sans)", letterSpacing: "-0.025em" }}>₹ 4,42,140</div>
              <div style={{ font: "500 11px/1 var(--font-mono)", color: "#6FD1A4", marginTop: 8 }}>↑ ₹ 1.48 L in last hour</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                ["UPI · instant", "₹ 3,12,400", "21 orders"],
                ["Card · T+1",    "₹ 1,02,840", "5 orders"],
                ["Net banking",   "₹   26,900", "1 order"],
              ].map(([l, v, s]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--border-subtle)" }}>
                  <div>
                    <div style={{ font: "500 12px/1.2 var(--font-sans)" }}>{l}</div>
                    <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 3 }}>{s}</div>
                  </div>
                  <div className="km-mono" style={{ font: "600 13px/1 var(--font-mono)" }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="On big screen" meta="Now showing">
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "center", padding: "10px 12px", background: "var(--bg-canvas)", borderRadius: 10 }}>
              <div style={{ width: 44, height: 44, background: "var(--neutral-100)", borderRadius: 8, display: "grid", placeItems: "center", color: "var(--fg-3)" }}>
                <Icon name="image" size={18}/>
              </div>
              <div>
                <div style={{ font: "600 13px/1.2 var(--font-sans)" }}>M8 304L Stainless Hex Bolt</div>
                <div style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 4 }}>{fmtINR(12400)} · 48 left</div>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: 12, background: "var(--meet-confirmed-bg)", border: "1px solid var(--success-soft)", borderRadius: 10, font: "500 12px/1.5 var(--font-sans)", color: "var(--meet-confirmed)" }}>
              Your item is on screen now — 6 scans in last 2 minutes.
            </div>
          </Card>
        </div>
      </div>
    </VendorShell>
  );
}

/* ════════════════════════════════════════════════════════════════════
   09 · ADMIN / ORGANIZER — Event control room (during live event)
   ════════════════════════════════════════════════════════════════════ */
function AdminControlRoom() {
  const groups = [
    { label: "Organizer", items: [
      { icon: "calendar", label: "Live meets", badge: "1", active: true },
      { icon: "users",    label: "Vendors" },
      { icon: "users",    label: "Buyers" },
      { icon: "tv",       label: "Big-screen control" },
      { icon: "wallet",   label: "Payouts &amp; GMV" },
    ]},
    { label: "Association", items: [
      { icon: "cog", label: "VIA profile" },
      { icon: "cog", label: "Team" },
    ]},
  ];

  return (
    <div className="km">
      <div className="km-app">
        <AppTopbar role="Admin" business="VIA Secretariat · organizer" gstin="Association: VIA · Nagpur" initials="PJ"
          eventBanner={<LiveEventPill/>}/>
        <Sidebar groups={groups}/>
        <main className="km-canvas">
          <PageHead
            title="Event control room"
            sub={`${EVENT.name} · ${EVENT.dateStr} · live since 10:04 IST`}
            actions={
              <>
                <button className="km-btn km-btn-outline"><Icon name="broadcast" size={14}/> Announce</button>
                <button className="km-btn km-btn-dark"><Icon name="pause" size={14}/> Pause event</button>
                <button className="km-btn km-btn-primary"><Icon name="tv" size={14}/> Big-screen control</button>
              </>
            }
          />

          {/* Master KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginBottom: 24 }}>
            {[
              { l: "GMV today",       v: "₹ 18.4 L", s: "↑ ₹ 2.1 L in last hour", dark: true },
              { l: "Orders paid",     v: "62",        s: "₹ 14.2 L settled" },
              { l: "Bookings",        v: "104",       s: "₹ 4.2 L pipeline" },
              { l: "Buyers in room",  v: "86 / 128",  s: "67% check-in rate" },
              { l: "Items on screen", v: "1 of 142",  s: "rotating · 12s" },
              { l: "QR scans",        v: "412",       s: "↑ 28% vs last meet" },
            ].map((k) => (
              <div key={k.l} className="km-card" style={{ padding: 16, ...(k.dark ? { background: "var(--kraya-ink)", color: "white", borderColor: "var(--kraya-ink-2)" } : {}) }}>
                <div style={{ font: "600 10px/1 var(--font-sans)", letterSpacing: "0.08em", textTransform: "uppercase", color: k.dark ? "rgba(255,255,255,0.7)" : "var(--fg-3)", marginBottom: 10 }}>{k.l}</div>
                <div style={{ font: "700 22px/1 var(--font-sans)", letterSpacing: "-0.02em" }}>{k.v}</div>
                <div style={{ font: "500 11px/1 var(--font-mono)", color: k.dark ? "#6FD1A4" : "var(--fg-2)", marginTop: 6 }}>{k.s}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Big screen preview */}
              <Card
                title={<span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Icon name="tv" size={14}/> Big screen · live preview</span>}
                meta="Hall A · 65″ display"
                action={<>
                  <button className="km-btn km-btn-outline km-btn-sm"><Icon name="chev-l" size={12}/> Prev</button>
                  <button className="km-btn km-btn-outline km-btn-sm"><Icon name="pause" size={12}/></button>
                  <button className="km-btn km-btn-primary km-btn-sm">Next <Icon name="chev-r" size={12}/></button>
                </>}
              >
                <div style={{ position: "relative", aspectRatio: "16/9", background: "#0a0a0a", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ position: "absolute", inset: 0, padding: 20, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, color: "white" }}>
                    <div>
                      <Badge style={{ background: "#ff5a4d", color: "white", padding: "3px 8px", fontSize: 9, borderRadius: 999, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Featured</Badge>
                      <div style={{ font: "600 9px/1 var(--font-mono)", color: "rgba(255,255,255,0.4)", marginTop: 16, marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>Bharat Steel Co.</div>
                      <div style={{ font: "700 22px/1.05 var(--font-sans)", letterSpacing: "-0.015em", marginBottom: 14 }}>M8 304L Stainless Hex Bolt</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                        <span style={{ font: "700 30px/1 var(--font-sans)", color: "#ff5a4d", letterSpacing: "-0.025em" }}>{fmtINR(12400)}</span>
                        <span style={{ font: "400 11px/1 var(--font-mono)", color: "rgba(255,255,255,0.4)", textDecoration: "line-through" }}>{fmtINR(16800)}</span>
                      </div>
                    </div>
                    <div style={{ display: "grid", placeItems: "center" }}>
                      <div style={{ background: "white", padding: 8, borderRadius: 6 }}>
                        <QR size={104} value="BS-HBM8-304L" color="#0a0a0a" bg="#ffffff"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center" }}>
                  <span style={{ font: "500 11px/1 var(--font-mono)", color: "var(--fg-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Up next</span>
                  <div style={{ display: "flex", gap: 6, flex: 1, overflowX: "auto" }}>
                    {ITEMS.slice(1, 6).map((it) => (
                      <div key={it.id} style={{ display: "flex", gap: 6, alignItems: "center", padding: "5px 10px", background: "var(--bg-canvas)", border: "1px solid var(--border-subtle)", borderRadius: 999, font: "500 11px/1 var(--font-sans)", whiteSpace: "nowrap", flexShrink: 0 }}>
                        <span style={{ color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>{it.sku}</span>
                        <span style={{ color: "var(--kraya-red)", fontWeight: 600 }}>{fmtINR(it.special)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Vendor leaderboard */}
              <Card title="Top vendors · today" meta="Sorted by GMV">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={th}>#</th>
                      <th style={th}>Vendor</th>
                      <th style={{ ...th, textAlign: "right" }}>Orders</th>
                      <th style={{ ...th, textAlign: "right" }}>GMV</th>
                      <th style={{ ...th, textAlign: "right" }}>Settled</th>
                      <th style={{ ...th, textAlign: "right" }}>Sell-through</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["1", "BS", "Bharat Steel Co.",      23, 442140, "T+0", 64],
                      ["2", "OM", "OM Bearings",            18, 318600, "T+0", 52],
                      ["3", "TC", "Tata Components",        14, 286480, "T+1", 41],
                      ["4", "JS", "Jay Industrial Supplies", 9, 124920, "T+0", 32],
                      ["5", "PE", "Pragati Engineering",     6,  84200, "T+0", 18],
                    ].map((r) => (
                      <tr key={r[0]} style={{ borderTop: "1px solid var(--border-subtle)" }}>
                        <td style={{ ...td, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>{r[0]}</td>
                        <td style={td}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--neutral-100)", display: "grid", placeItems: "center", font: "700 10px/1 var(--font-sans)", color: "var(--fg-2)" }}>{r[1]}</div>
                            <span style={{ fontWeight: 500 }}>{r[2]}</span>
                          </div>
                        </td>
                        <td style={tdNum}>{r[3]}</td>
                        <td style={{ ...tdNum, fontWeight: 600 }}>{fmtINR(r[4])}</td>
                        <td style={tdNum}>{r[5]}</td>
                        <td style={tdNum}>{r[6]}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>

            {/* RIGHT: live ops */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card title="Live activity" meta="Last 15 min" action={<span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "500 11px/1 var(--font-mono)", color: "var(--meet-confirmed)" }}><span style={{ width: 8, height: 8, background: "var(--meet-confirmed)", borderRadius: 999 }}/>Live</span>}>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {[
                    ["14:24", "Acme Mfg",          "paid",   "BS-HBM8-304L", 12, "₹ 1.48 L"],
                    ["14:22", "Mahindra Logistics", "booked", "OM-6205-2RS",   80, "₹ 73,600"],
                    ["14:19", "Larsen Industrial", "paid",   "TC-MNX32",       6, "₹  8,880"],
                    ["14:14", "Godrej Inds.",      "paid",   "JS-BB-6204",    24, "₹ 11,040"],
                    ["14:08", "Hindalco",          "booked", "PE-GIPIPE-25", 240, "₹ 34,080"],
                    ["14:01", "Acme Mfg",          "paid",   "BS-DIN933-SET",  3, "₹  5,460"],
                  ].map((a, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 10, padding: "10px 0", borderTop: i > 0 ? "1px solid var(--border-subtle)" : "none", alignItems: "center" }}>
                      <span className="km-mono" style={{ font: "500 11px/1 var(--font-mono)", color: "var(--fg-3)" }}>{a[0]}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ font: "500 12px/1.3 var(--font-sans)" }}>{a[1]} <span style={{ color: "var(--fg-3)" }}>{a[2]}</span> <span className="km-mono" style={{ color: "var(--fg-2)" }}>{a[3]}</span></div>
                        <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 4 }}>qty {a[4]}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="km-mono" style={{ font: "600 12px/1 var(--font-mono)" }}>{a[5]}</div>
                        <Badge kind={a[2] === "paid" ? "success" : "warning"} style={{ marginTop: 4, fontSize: 9 }}>{a[2]}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Check-ins" meta="At the door">
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0" }}>
                  <div style={{ position: "relative", width: 64, height: 64 }}>
                    <svg viewBox="0 0 64 64" width="64" height="64">
                      <circle cx="32" cy="32" r="26" fill="none" stroke="var(--bg-canvas)" strokeWidth="6"/>
                      <circle cx="32" cy="32" r="26" fill="none" stroke="var(--kraya-red)" strokeWidth="6" strokeDasharray="163.4" strokeDashoffset="54" strokeLinecap="round" transform="rotate(-90 32 32)"/>
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", font: "700 14px/1 var(--font-sans)" }}>67%</div>
                  </div>
                  <div>
                    <div style={{ font: "700 22px/1 var(--font-sans)" }}>86 <span style={{ color: "var(--fg-3)", font: "400 14px/1 var(--font-sans)" }}>of 128 registered</span></div>
                    <div style={{ font: "400 12px/1.4 var(--font-mono)", color: "var(--fg-3)", marginTop: 4 }}>42 not arrived yet · 3 declined</div>
                  </div>
                </div>
                <div className="km-div"/>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    ["Acme Mfg",     "4/4"],
                    ["Mahindra Log.","3/3"],
                    ["L&T",          "2/2"],
                    ["Godrej",       "3/3"],
                    ["Hindalco",     "2/2"],
                    ["+ 13 more",    ""],
                  ].map((c, i) => (
                    <span key={i} style={{ font: "500 11px/1 var(--font-sans)", color: "var(--fg-2)", padding: "5px 9px", background: "var(--bg-canvas)", borderRadius: 999, border: "1px solid var(--border-subtle)" }}>
                      {c[0]}{c[1] && <span style={{ color: "var(--fg-3)", marginLeft: 4, fontFamily: "var(--font-mono)" }}>{c[1]}</span>}
                    </span>
                  ))}
                </div>
              </Card>

              <Card title="Send announcement" meta="Push to all phones in room">
                <div className="km-field" style={{ margin: 0 }}>
                  <label>Message</label>
                  <textarea defaultValue="Lunch in the courtyard from 13:00. Special prices reopen at 14:00." rows={3}/>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                  <button className="km-btn km-btn-outline km-btn-sm">Buyers (86)</button>
                  <button className="km-btn km-btn-outline km-btn-sm">Vendors (34)</button>
                  <button className="km-btn km-btn-primary km-btn-sm" style={{ marginLeft: "auto" }}><Icon name="broadcast" size={12}/> Send</button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { VendorItemSetup, VendorLiveBooth, AdminControlRoom });
