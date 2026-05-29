/* Buyer mobile flow at the in-room event.
   Sequence: Entry → Live Feed → Product detail (Book/Buy) → Checkout
            → Confirmation → My orders. */

function MobileShell({ children, navActive, hideTabBar, statusDark }) {
  return (
    <div className="km km-mobile">
      <div className="m-status" style={statusDark ? { background: "#0a0a0a", color: "white" } : {}}>
        <span>14:24</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12 }}>
          <span style={{ letterSpacing: 1 }}>● ● ●</span>
          <span>4G</span>
          <span style={{ display: "inline-block", width: 22, height: 11, border: `1px solid ${statusDark ? "white" : "var(--fg-1)"}`, borderRadius: 2, position: "relative" }}>
            <span style={{ position: "absolute", inset: 1, background: statusDark ? "white" : "var(--fg-1)", width: "80%" }}/>
          </span>
        </div>
      </div>
      <div className="m-body">{children}</div>
      {!hideTabBar && (
        <div className="m-nav">
          {[
            ["broadcast", "Event",   "event"],
            ["catalog",   "Catalog", "catalog"],
            ["po",        "Orders",  "orders"],
            ["wallet",    "Wallet",  "wallet"],
            ["cog",       "More",    "more"],
          ].map(([ic, l, k]) => (
            <div key={k} className={`item ${navActive === k ? "active" : ""}`}>
              <Icon name={ic} size={20}/><span>{l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   02 · BUYER MOBILE — Event entry / check-in
   ════════════════════════════════════════════════════════════════════ */
function BuyerEntry() {
  return (
    <MobileShell hideTabBar>
      {/* Top */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <img src={LOGO} alt="kraya" style={{ height: 18 }}/>
          <span style={{ font: "500 11px/1 var(--font-mono)", color: "var(--fg-3)" }}>Signed in as Riya · Acme Mfg</span>
        </div>
      </div>

      {/* Detected event hero */}
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ position: "relative", padding: "22px 20px 24px", borderRadius: 16,
          background: "linear-gradient(135deg, #F4EFE7 0%, #FBE9E7 100%)",
          border: "1px solid var(--border-subtle)", overflow: "hidden",
        }}>
          <div className="km-dotgrid" style={{ position: "absolute", inset: 0, opacity: 0.6 }}/>
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ width: 8, height: 8, background: "var(--kraya-red)", borderRadius: 999, boxShadow: "0 0 0 0 var(--kraya-red)", animation: "km-pulse 1.6s ease-out infinite" }}/>
              <span style={{ font: "700 11px/1 var(--font-mono)", color: "var(--kraya-red)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Live · meet detected</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, background: "var(--kraya-ink)", color: "white", borderRadius: 8, display: "grid", placeItems: "center", font: "700 10px/1 var(--font-sans)" }}>VIA</div>
              <span style={{ font: "500 12px/1 var(--font-sans)", color: "var(--fg-2)" }}>Hosted by VIA</span>
            </div>
            <h2 style={{ font: "700 22px/1.15 var(--font-sans)", letterSpacing: "-0.015em", margin: "0 0 6px", textWrap: "balance" }}>{EVENT.name}</h2>
            <div style={{ font: "400 12px/1.5 var(--font-mono)", color: "var(--fg-3)", marginBottom: 18 }}>
              VIA Hall, Nagpur  ·  10:00 – 17:00 IST  ·  Day 1
            </div>
            <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
              <div><div style={{ font: "500 9px/1 var(--font-sans)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Vendors</div><div style={{ font: "700 18px/1 var(--font-sans)" }}>{EVENT.vendorsConfirmed}</div></div>
              <div><div style={{ font: "500 9px/1 var(--font-sans)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Items live</div><div style={{ font: "700 18px/1 var(--font-sans)" }}>{EVENT.itemsLive}</div></div>
              <div><div style={{ font: "500 9px/1 var(--font-sans)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>In room</div><div style={{ font: "700 18px/1 var(--font-sans)" }}>{EVENT.buyersInRoom}</div></div>
            </div>
            <button className="km-btn km-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px 16px" }}>
              Enter event  →
            </button>
          </div>
        </div>
      </div>

      {/* Or scan QR */}
      <div style={{ padding: "26px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ height: 1, flex: 1, background: "var(--border-subtle)" }}/>
          <span style={{ font: "500 10px/1 var(--font-mono)", color: "var(--fg-3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>or</span>
          <div style={{ height: 1, flex: 1, background: "var(--border-subtle)" }}/>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button className="km-btn km-btn-outline" style={{ flexDirection: "column", padding: "16px 12px", gap: 8, alignItems: "center" }}>
            <Icon name="scan" size={22}/>
            <div>
              <div style={{ font: "600 13px/1.2 var(--font-sans)" }}>Scan QR</div>
              <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 3 }}>at door / on screen</div>
            </div>
          </button>
          <button className="km-btn km-btn-outline" style={{ flexDirection: "column", padding: "16px 12px", gap: 8, alignItems: "center" }}>
            <Icon name="tag" size={22}/>
            <div>
              <div style={{ font: "600 13px/1.2 var(--font-sans)" }}>Enter code</div>
              <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 3 }}>{EVENT.code}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Why */}
      <div style={{ padding: "28px 20px 24px" }}>
        <div style={{ font: "500 10px/1 var(--font-sans)", color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Once you enter</div>
        {[
          ["Event-only prices unlock for every item on display.", "rupee"],
          ["Scan any QR on the big screen to book or buy instantly.", "scan"],
          ["Payments settle directly to the vendor's bank account.", "wallet"],
        ].map(([t, ic]) => (
          <div key={t} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--kraya-red-soft)", color: "var(--kraya-red)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name={ic} size={16}/>
            </div>
            <div style={{ font: "400 13px/1.4 var(--font-sans)", color: "var(--fg-2)", flex: 1 }}>{t}</div>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}

/* ════════════════════════════════════════════════════════════════════
   03 · BUYER MOBILE — Live deals feed (after entering)
   ════════════════════════════════════════════════════════════════════ */
function BuyerLiveFeed() {
  return (
    <MobileShell navActive="event">
      <div className="m-event-banner">
        <span className="live"/>
        <div style={{ flex: 1 }}>
          <div style={{ font: "600 12px/1.2 var(--font-sans)" }}>{EVENT.name} · LIVE</div>
          <div style={{ font: "400 10px/1 var(--font-mono)", color: "rgba(255,255,255,0.65)", marginTop: 3 }}>VIA Hall · ends 17:00  ·  142 items</div>
        </div>
        <button style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "none", borderRadius: 999, padding: "6px 10px", font: "600 11px/1 var(--font-sans)", display: "inline-flex", gap: 5, alignItems: "center" }}>
          <Icon name="scan" size={12}/> Scan
        </button>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <h2 style={{ font: "700 22px/1.15 var(--font-sans)", letterSpacing: "-0.015em", margin: 0 }}>Live deals</h2>
          <span style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)" }}>Special prices end 17:00</span>
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14, marginRight: -16, paddingRight: 16 }}>
          {["All · 142", "Fasteners · 32", "Bearings · 24", "Electricals · 28", "MRO · 18", "Cutting · 12"].map((c, i) => (
            <button key={c} className={`km-pill ${i === 0 ? "active" : ""}`} style={{ flexShrink: 0 }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Featured horizontal card */}
      <div style={{ padding: "0 16px" }}>
        <div className="km-card" style={{ background: "var(--kraya-ink)", color: "white", borderColor: "var(--kraya-ink-2)", overflow: "hidden", padding: 0 }}>
          <div style={{ padding: 16, display: "flex", gap: 14 }}>
            <div style={{ width: 64, height: 64, background: "rgba(255,255,255,0.1)", borderRadius: 10, display: "grid", placeItems: "center", flexShrink: 0, color: "rgba(255,255,255,0.5)" }}>
              <Icon name="image" size={22}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Badge style={{ background: "#ff5a4d", color: "white", fontSize: 9, padding: "3px 8px", borderRadius: 999, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>On big screen</Badge>
              </div>
              <div style={{ font: "600 14px/1.2 var(--font-sans)" }}>{ITEMS[0].name}</div>
              <div style={{ font: "400 11px/1 var(--font-mono)", color: "rgba(255,255,255,0.55)", marginTop: 4 }}>{ITEMS[0].vendor}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
                <span style={{ font: "700 18px/1 var(--font-sans)", color: "#ff5a4d" }}>{fmtINR(ITEMS[0].special)}</span>
                <span style={{ font: "400 11px/1 var(--font-mono)", color: "rgba(255,255,255,0.4)", textDecoration: "line-through" }}>{fmtINR(ITEMS[0].regular)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deal list */}
      <div style={{ padding: "16px" }}>
        {ITEMS.slice(0, 6).map((it) => (
          <div key={it.id} style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 12, padding: "14px 0", borderTop: "1px solid var(--border-subtle)", alignItems: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 10, background: "var(--neutral-100)", display: "grid", placeItems: "center", color: "var(--fg-3)" }}>
              <Icon name="image" size={20}/>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ font: "600 13px/1.25 var(--font-sans)" }}>{it.name}</div>
              <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 4 }}>{it.vendor}  ·  {it.category}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
                <span style={{ font: "700 14px/1 var(--font-sans)", color: "var(--kraya-red)" }}>{fmtINR(it.special)}</span>
                <span style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-3)", textDecoration: "line-through" }}>{fmtINR(it.regular)}</span>
                <Badge kind="confirmed" style={{ fontSize: 9, padding: "2px 6px", marginLeft: 2 }}>−{Math.round((1 - it.special/it.regular) * 100)}%</Badge>
              </div>
            </div>
            <Icon name="chev-r" size={16}/>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}

/* ════════════════════════════════════════════════════════════════════
   04 · BUYER MOBILE — Product detail (after QR scan)
   Lands here with vendor info, special price, qty selector, Book/Buy.
   ════════════════════════════════════════════════════════════════════ */
function BuyerProductDetail() {
  const it = ITEMS[0];
  const qty = 12;
  const total = it.special * qty;
  return (
    <MobileShell navActive="event">
      <div className="m-event-banner">
        <span className="live"/>
        <div style={{ flex: 1, font: "500 11px/1 var(--font-mono)", color: "rgba(255,255,255,0.85)" }}>Scanned from big screen  ·  {EVENT.name}</div>
      </div>

      {/* Product hero image */}
      <div style={{ height: 240, background: "var(--bg-canvas)", display: "grid", placeItems: "center", borderBottom: "1px solid var(--border-subtle)", position: "relative" }}>
        <div className="km-placeholder" style={{ width: "70%", height: 160, background: "var(--bg-surface)" }}>
          [ product photo · {it.sku} ]
        </div>
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <Badge style={{ background: "var(--kraya-red)", color: "white", padding: "5px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Event-only price
          </Badge>
        </div>
        <button style={{ position: "absolute", top: 12, right: 12, background: "white", border: "1px solid var(--border-subtle)", borderRadius: 999, width: 36, height: 36, display: "grid", placeItems: "center" }}>
          <Icon name="bookmark" size={16}/>
        </button>
      </div>

      <div style={{ padding: "18px 18px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, background: "var(--neutral-100)", borderRadius: 8, display: "grid", placeItems: "center", font: "700 11px/1 var(--font-sans)", color: "var(--fg-2)" }}>{it.vlogo}</div>
          <div>
            <div style={{ font: "600 13px/1.2 var(--font-sans)" }}>{it.vendor}</div>
            <div style={{ font: "400 10px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 3 }}>GSTIN 27AAA…782J  ·  Verified</div>
          </div>
        </div>
        <h2 style={{ font: "700 22px/1.2 var(--font-sans)", letterSpacing: "-0.015em", margin: "0 0 6px", textWrap: "balance" }}>{it.name}</h2>
        <div style={{ font: "400 12px/1 var(--font-mono)", color: "var(--fg-3)", marginBottom: 16 }}>SKU {it.sku}  ·  {it.unit}</div>

        {/* Price block */}
        <div style={{ padding: "16px 16px 18px", background: "var(--kraya-red-soft)", border: "1px solid var(--kraya-red-tint)", borderRadius: 14, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
            <span style={{ font: "700 32px/1 var(--font-sans)", color: "var(--kraya-red)", letterSpacing: "-0.025em" }}>{fmtINR(it.special)}</span>
            <span style={{ font: "400 14px/1 var(--font-mono)", color: "var(--fg-3)", textDecoration: "line-through" }}>{fmtINR(it.regular)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge kind="confirmed">Save {fmtINR(it.regular - it.special)} ({Math.round((1 - it.special/it.regular) * 100)}%)</Badge>
            <span style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-2)" }}>· {it.stock} left in room</span>
          </div>
        </div>

        {/* Qty stepper */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: 10, marginBottom: 12 }}>
          <div>
            <div style={{ font: "500 10px/1 var(--font-sans)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Quantity</div>
            <div style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)" }}>{it.unit} · MOQ 1</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button style={{ width: 36, height: 36, borderRadius: 999, background: "var(--bg-canvas)", border: "1px solid var(--border-subtle)", display: "grid", placeItems: "center" }}><Icon name="minus" size={14}/></button>
            <span style={{ font: "700 22px/1 var(--font-sans)", minWidth: 36, textAlign: "center" }}>{qty}</span>
            <button style={{ width: 36, height: 36, borderRadius: 999, background: "var(--kraya-red)", color: "white", border: "none", display: "grid", placeItems: "center" }}><Icon name="plus" size={14}/></button>
          </div>
        </div>

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 14px", background: "var(--kraya-ink)", color: "white", borderRadius: 10, marginBottom: 18 }}>
          <div>
            <div style={{ font: "500 10px/1 var(--font-sans)", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Total for {qty}</div>
            <div style={{ font: "400 11px/1 var(--font-mono)", color: "rgba(255,255,255,0.5)" }}>inclusive of GST · payable to {it.vendor}</div>
          </div>
          <div style={{ font: "700 22px/1 var(--font-sans)" }}>{fmtINR(total)}</div>
        </div>

        {/* Specs */}
        <div style={{ font: "500 10px/1 var(--font-sans)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Specifications</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            ["Material", "304L stainless steel"],
            ["Thread", "M8 × 1.25"],
            ["Length", "30 mm · DIN 933"],
            ["Box of", "100 units"],
            ["Lead time", "Same-day pickup at booth B-12"],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--border-subtle)" }}>
              <span style={{ font: "400 12px/1.2 var(--font-sans)", color: "var(--fg-3)" }}>{l}</span>
              <span style={{ font: "500 12px/1.2 var(--font-mono)", color: "var(--fg-1)" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom sticky action bar */}
      <div style={{ position: "sticky", bottom: 0, background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)", padding: "12px 16px 16px", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 10 }}>
        <button className="km-btn km-btn-outline" style={{ justifyContent: "center", padding: "14px 16px" }}>
          <Icon name="bookmark" size={14}/> Book
        </button>
        <button className="km-btn km-btn-primary" style={{ justifyContent: "center", padding: "14px 16px" }}>
          <Icon name="bolt" size={14} stroke={2.4}/> Buy now · {fmtINR(total)}
        </button>
      </div>
    </MobileShell>
  );
}

/* ════════════════════════════════════════════════════════════════════
   05 · BUYER MOBILE — Checkout / payment (payment-gateway sheet)
   ════════════════════════════════════════════════════════════════════ */
function BuyerCheckout() {
  const it = ITEMS[0];
  const qty = 12;
  const subtotal = it.special * qty;
  const gst = Math.round(subtotal * 0.18);
  const fee = 24;
  const total = subtotal + gst + fee;

  return (
    <MobileShell hideTabBar>
      {/* Header */}
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border-subtle)" }}>
        <button style={{ background: "transparent", border: "none", padding: 4 }}><Icon name="chev-l" size={20}/></button>
        <div>
          <div style={{ font: "600 14px/1 var(--font-sans)" }}>Checkout</div>
          <div style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 3 }}>Step 2 of 3 · Payment</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, font: "500 11px/1 var(--font-mono)", color: "var(--meet-confirmed)" }}>
          <span style={{ width: 14, height: 14 }}><Icon name="check" size={12} stroke={3}/></span>Secure
        </div>
      </div>

      {/* Order summary */}
      <div style={{ padding: "16px" }}>
        <div className="km-card" style={{ padding: 14 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 8, background: "var(--neutral-100)", display: "grid", placeItems: "center", color: "var(--fg-3)" }}>
              <Icon name="image" size={18}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "600 13px/1.25 var(--font-sans)" }}>{it.name}</div>
              <div style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 4 }}>{it.vendor} · Booth B-12 · pickup at end</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
                <span style={{ font: "700 14px/1 var(--font-sans)", color: "var(--kraya-red)" }}>{fmtINR(it.special)}</span>
                <span style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)" }}>× {qty}</span>
              </div>
            </div>
          </div>
          <div className="km-div" style={{ margin: "0 0 12px" }}/>
          {[
            ["Subtotal",         fmtINR(subtotal)],
            ["GST · 18%",        fmtINR(gst)],
            ["Kraya event fee",  fmtINR(fee)],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", font: "400 12px/1.4 var(--font-sans)", color: "var(--fg-2)" }}>
              <span>{l}</span><span className="km-mono">{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", borderTop: "1px solid var(--border-subtle)", marginTop: 8 }}>
            <span style={{ font: "600 14px/1 var(--font-sans)" }}>Total</span>
            <span style={{ font: "700 18px/1 var(--font-sans)", color: "var(--kraya-red)" }}>{fmtINR(total)}</span>
          </div>
        </div>
      </div>

      {/* Settlement note */}
      <div style={{ margin: "0 16px 16px", padding: "12px 14px", background: "var(--meet-confirmed-bg)", border: "1px solid var(--success-soft)", borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: "white", color: "var(--meet-confirmed)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon name="wallet" size={14}/>
        </div>
        <div style={{ flex: 1, font: "400 12px/1.5 var(--font-sans)", color: "var(--meet-confirmed)" }}>
          Settles directly to <b>{it.vendor}</b>'s linked HDFC current a/c ending <b className="km-mono">…4408</b>. Kraya holds funds in escrow for 30 min in case of cancellation.
        </div>
      </div>

      {/* Payment method picker */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ font: "500 10px/1 var(--font-sans)", color: "var(--fg-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Pay using</div>
        {[
          { k: "upi-gpay", l: "Google Pay UPI", s: "riya@okhdfc", chosen: true, ico: "wallet" },
          { k: "upi-phonepe", l: "PhonePe UPI",  s: "9822012345@ybl",        ico: "wallet" },
          { k: "card",    l: "HDFC Corporate Card", s: "•• 4408 · Riya Sharma", ico: "wallet" },
          { k: "netbank", l: "Net banking",        s: "Acme Mfg · HDFC Bank",  ico: "wallet" },
          { k: "credit",  l: "Pay later · Kraya credit", s: "₹ 2.4 L of ₹ 5 L available", ico: "rupee" },
        ].map((opt) => (
          <div key={opt.k} style={{
            display: "grid", gridTemplateColumns: "32px 1fr 20px", gap: 12, alignItems: "center",
            padding: "12px 14px", borderRadius: 10, marginBottom: 8,
            background: opt.chosen ? "var(--bg-surface)" : "var(--bg-surface)",
            border: opt.chosen ? "1.5px solid var(--kraya-red)" : "1px solid var(--border-subtle)",
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-canvas)", display: "grid", placeItems: "center", color: "var(--fg-2)" }}>
              <Icon name={opt.ico} size={16}/>
            </div>
            <div>
              <div style={{ font: "600 13px/1.2 var(--font-sans)" }}>{opt.l}</div>
              <div style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 3 }}>{opt.s}</div>
            </div>
            <div style={{ width: 18, height: 18, borderRadius: 999, border: opt.chosen ? "5px solid var(--kraya-red)" : "1.5px solid var(--neutral-300)", background: opt.chosen ? "white" : "transparent" }}/>
          </div>
        ))}
      </div>

      {/* PG attribution */}
      <div style={{ padding: "16px 16px 8px", display: "flex", alignItems: "center", gap: 8, font: "400 11px/1.4 var(--font-mono)", color: "var(--fg-3)" }}>
        <Icon name="check" size={12} stroke={2.5}/>Powered by Razorpay  ·  PCI-DSS  ·  RBI-licensed
      </div>

      {/* Sticky pay button */}
      <div style={{ position: "sticky", bottom: 0, background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)", padding: "12px 16px 16px" }}>
        <button className="km-btn km-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px 16px", fontSize: 15 }}>
          <Icon name="bolt" size={14} stroke={2.5}/> Pay {fmtINR(total)} via UPI
        </button>
      </div>
    </MobileShell>
  );
}

/* ════════════════════════════════════════════════════════════════════
   06 · BUYER MOBILE — Order confirmation
   ════════════════════════════════════════════════════════════════════ */
function BuyerConfirmation() {
  const it = ITEMS[0];
  const qty = 12;
  const total = it.special * qty + Math.round(it.special * qty * 0.18) + 24;
  return (
    <MobileShell hideTabBar>
      {/* Big check */}
      <div style={{ background: "var(--kraya-ink)", color: "white", padding: "40px 24px 36px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "16px 16px" }}/>
        <div style={{ position: "relative" }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: "rgba(111, 209, 164, 0.18)", color: "#6FD1A4", display: "grid", placeItems: "center", margin: "0 auto 18px", border: "1px solid rgba(111, 209, 164, 0.4)" }}>
            <Icon name="check" size={36} stroke={3}/>
          </div>
          <h1 style={{ font: "700 26px/1.15 var(--font-sans)", letterSpacing: "-0.02em", margin: "0 0 8px" }}>Paid · {fmtINR(total)}</h1>
          <p style={{ font: "400 13px/1.5 var(--font-sans)", color: "rgba(255,255,255,0.7)", margin: "0 0 18px", maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>
            Settled to {it.vendor} · pickup ready at booth B-12 from 16:30 today.
          </p>
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "8px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, font: "500 12px/1 var(--font-mono)", letterSpacing: "0.06em" }}>
            Order #KR-26-104822
          </div>
        </div>
      </div>

      {/* Pickup QR */}
      <div style={{ padding: "20px 20px 0", textAlign: "center" }}>
        <div style={{ font: "500 10px/1 var(--font-sans)", color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Show this at booth B-12</div>
        <div style={{ background: "white", border: "1px solid var(--border-subtle)", padding: 18, borderRadius: 14, display: "inline-block", boxShadow: "var(--shadow-2)" }}>
          <QR size={180} value="KR-26-104822" color="#0a0a0a" bg="#ffffff"/>
        </div>
        <div style={{ font: "500 13px/1 var(--font-mono)", color: "var(--fg-2)", marginTop: 12, letterSpacing: "0.06em" }}>KR-26-104822</div>
      </div>

      {/* Order summary */}
      <div style={{ padding: "24px 16px 8px" }}>
        <div className="km-card" style={{ padding: 14 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 8, background: "var(--neutral-100)", display: "grid", placeItems: "center", color: "var(--fg-3)" }}>
              <Icon name="image" size={18}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "600 13px/1.25 var(--font-sans)" }}>{it.name}</div>
              <div style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 4 }}>SKU {it.sku} · qty {qty}</div>
              <Badge kind="confirmed" dot style={{ marginTop: 8 }}>Paid · settled</Badge>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 14 }}>
          {[
            ["Pickup",    "Booth B-12 · 16:30 – 17:00"],
            ["Vendor",    "Bharat Steel Co. (GSTIN 27AAA…782J)"],
            ["Settled to","HDFC current a/c …4408"],
            ["Invoice",   "INV-VIA-26-002841 · auto-emailed"],
            ["Payment",   "Google Pay UPI · riya@okhdfc · 14:24:08"],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--border-subtle)" }}>
              <span style={{ font: "400 12px/1.3 var(--font-sans)", color: "var(--fg-3)" }}>{l}</span>
              <span style={{ font: "500 12px/1.3 var(--font-mono)", color: "var(--fg-1)", textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "sticky", bottom: 0, background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)", padding: "12px 16px 16px", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 10 }}>
        <button className="km-btn km-btn-outline" style={{ justifyContent: "center", padding: "14px 16px" }}>
          <Icon name="upload" size={14}/> Invoice
        </button>
        <button className="km-btn km-btn-primary" style={{ justifyContent: "center", padding: "14px 16px" }}>
          Keep browsing deals <Icon name="arrow" size={14}/>
        </button>
      </div>
    </MobileShell>
  );
}

Object.assign(window, { BuyerEntry, BuyerLiveFeed, BuyerProductDetail, BuyerCheckout, BuyerConfirmation });
