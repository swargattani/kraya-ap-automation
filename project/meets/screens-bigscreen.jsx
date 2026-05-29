/* Kraya Live Meets · screens
   New flow — in-room event with QR-driven purchase. */

/* ════════════════════════════════════════════════════════════════════
   01 · BIG SCREEN — in-room display (1920 × 1080, dark)
   The TV in the room. Hero deal rotates every ~12s. Sidebar shows
   what's coming next + a leaderboard of activity. Bottom ticker
   marquees recent buys/bookings.
   ════════════════════════════════════════════════════════════════════ */
function BigScreen() {
  const featured = ITEMS[0];
  return (
    <div className="km km-bigscreen">
      <div className="head">
        <img src={LOGO} className="logo" alt="kraya"/>
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.15)" }}/>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>{EVENT.name}</div>
        <div style={{ font: "400 13px/1 var(--font-mono)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>·  Hosted by {EVENT.hostFull}</div>
        <div className="liveband" style={{ marginLeft: 32 }}>
          <span style={{ width: 10, height: 10, background: "#ff5a4d", borderRadius: 999, boxShadow: "0 0 0 0 #ff5a4d", animation: "km-pulse 1.6s ease-out infinite" }}/>
          Live · Day 1 of 1
        </div>
        <div className="time">14:24 IST  ·  {EVENT.buyersInRoom} in room  ·  {EVENT.vendorsConfirmed} vendors</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 0, height: "100%", overflow: "hidden" }}>
        {/* LEFT: hero featured deal */}
        <div style={{ padding: "44px 56px", display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
            <Badge style={{ background: "#ff5a4d", color: "white", padding: "6px 14px", fontSize: 13, letterSpacing: "0.08em", borderRadius: 999, fontWeight: 700, textTransform: "uppercase" }}>Featured Now</Badge>
            <div style={{ font: "500 14px/1 var(--font-mono)", color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Item 1 of 142  ·  Rotating every 12s</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 56, alignItems: "center", flex: 1 }}>
            {/* Product info */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                <div style={{ width: 56, height: 56, background: "white", color: "#0a0a0a", borderRadius: 12, display: "grid", placeItems: "center", font: "700 18px/1 var(--font-sans)" }}>{featured.vlogo}</div>
                <div>
                  <div style={{ font: "500 13px/1 var(--font-mono)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Vendor</div>
                  <div style={{ font: "600 22px/1 var(--font-sans)", letterSpacing: "-0.01em" }}>{featured.vendor}</div>
                </div>
              </div>

              <div style={{ font: "500 13px/1 var(--font-mono)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                {featured.category}  ·  SKU {featured.sku}
              </div>

              <h1 style={{ font: "600 64px/1.02 var(--font-sans)", letterSpacing: "-0.025em", margin: "0 0 32px", textWrap: "balance" }}>
                {featured.name}
              </h1>

              <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 18 }}>
                <div style={{ font: "400 22px/1 var(--font-mono)", color: "rgba(255,255,255,0.45)", textDecoration: "line-through" }}>{fmtINR(featured.regular)}</div>
                <Badge style={{ background: "rgba(46,125,91,0.2)", color: "#6FD1A4", padding: "6px 12px", borderRadius: 999, fontSize: 14, fontWeight: 600 }}>
                  Save {fmtINR(featured.regular - featured.special)}  ·  {Math.round((1 - featured.special/featured.regular) * 100)}% off
                </Badge>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 40 }}>
                <div style={{ font: "700 96px/0.9 var(--font-sans)", letterSpacing: "-0.04em", color: "#ff5a4d" }}>{fmtINR(featured.special)}</div>
                <div style={{ font: "500 18px/1.3 var(--font-sans)", color: "rgba(255,255,255,0.7)" }}>{featured.unit}<br/><span style={{ font: "500 13px/1.3 var(--font-mono)", color: "rgba(255,255,255,0.4)" }}>Event-only price</span></div>
              </div>

              <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                <div>
                  <div style={{ font: "500 13px/1 var(--font-mono)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Stock at this price</div>
                  <div style={{ font: "600 24px/1 var(--font-sans)" }}>{featured.stock} <span style={{ font: "500 14px/1 var(--font-mono)", color: "rgba(255,255,255,0.4)" }}>boxes left</span></div>
                </div>
                <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.15)" }}/>
                <div>
                  <div style={{ font: "500 13px/1 var(--font-mono)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Special price ends</div>
                  <div style={{ font: "600 24px/1 var(--font-sans)" }}>{EVENT.endsAt}</div>
                </div>
              </div>
            </div>

            {/* QR + how to */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ background: "white", padding: 20, borderRadius: 18, boxShadow: "0 24px 48px rgba(0,0,0,0.45)" }}>
                <QR size={260} value={featured.sku} color="#0a0a0a" bg="#ffffff"/>
              </div>
              <div style={{ marginTop: 22, padding: "10px 18px", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, font: "600 13px/1 var(--font-mono)", letterSpacing: "0.08em" }}>
                SCAN  →  BOOK  /  BUY
              </div>
              <div style={{ marginTop: 18, textAlign: "center", font: "400 13px/1.55 var(--font-sans)", color: "rgba(255,255,255,0.6)", maxWidth: 240 }}>
                Or open the Kraya app and use code <span style={{ color: "white", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{featured.sku}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: up-next + live activity */}
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", height: "100%" }}>
          <div style={{ padding: "32px 40px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <div style={{ font: "500 13px/1 var(--font-mono)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Up next</div>
              <div style={{ font: "500 12px/1 var(--font-mono)", color: "rgba(255,255,255,0.4)" }}>4 of 142</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {ITEMS.slice(1, 5).map((it, i) => (
                <div key={it.id} style={{
                  display: "grid", gridTemplateColumns: "32px 1fr auto", gap: 16, alignItems: "center",
                  padding: "12px 16px", borderRadius: 10,
                  background: i === 0 ? "rgba(255,90,77,0.08)" : "transparent",
                  border: i === 0 ? "1px solid rgba(255,90,77,0.2)" : "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ font: "500 13px/1 var(--font-mono)", color: i === 0 ? "#ff5a4d" : "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>0{i + 2}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ font: "600 14px/1.25 var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name}</div>
                    <div style={{ font: "400 12px/1 var(--font-mono)", color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{it.vendor}  ·  {it.category}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ font: "700 16px/1 var(--font-sans)", color: "#ff5a4d" }}>{fmtINR(it.special)}</div>
                    <div style={{ font: "400 10px/1 var(--font-mono)", color: "rgba(255,255,255,0.4)", marginTop: 4, textDecoration: "line-through" }}>{fmtINR(it.regular)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "32px 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <span style={{ width: 8, height: 8, background: "#6FD1A4", borderRadius: 999 }}/>
              <div style={{ font: "500 13px/1 var(--font-mono)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Live activity</div>
              <div style={{ marginLeft: "auto", font: "500 12px/1 var(--font-mono)", color: "rgba(255,255,255,0.4)" }}>last 30 min</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "48px 1fr auto", gap: 14, alignItems: "center" }}>
                  <div style={{ font: "500 13px/1 var(--font-mono)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>{a.t}</div>
                  <div>
                    <span style={{ font: "600 14px/1.3 var(--font-sans)", color: "white" }}>{a.who}</span>{" "}
                    <span style={{ font: "400 13px/1.3 var(--font-sans)", color: "rgba(255,255,255,0.55)" }}>{a.act === "bought" ? "bought" : "booked"} {a.qty} ×</span>{" "}
                    <span style={{ font: "500 13px/1.3 var(--font-mono)", color: "rgba(255,255,255,0.75)" }}>{a.sku}</span>
                  </div>
                  <Badge style={{
                    background: a.act === "bought" ? "rgba(46,125,91,0.18)" : "rgba(181,115,26,0.18)",
                    color:      a.act === "bought" ? "#6FD1A4"              : "#E5B670",
                    padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>{a.act}</Badge>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {[["GMV today", "₹ 18.4 L"], ["Orders", "62"], ["Bookings", "104"]].map(([l, v]) => (
                <div key={l}>
                  <div style={{ font: "500 10px/1 var(--font-mono)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{l}</div>
                  <div style={{ font: "600 24px/1 var(--font-sans)", letterSpacing: "-0.02em" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-track">
          <span className="item"><span style={{ color: "#6FD1A4" }}>●</span> Acme Mfg bought 12 × BS-HBM8-304L</span>
          <span className="sep">/</span>
          <span className="item"><span style={{ color: "#E5B670" }}>●</span> Mahindra Logistics booked 80 × OM-6205-2RS</span>
          <span className="sep">/</span>
          <span className="item"><span style={{ color: "#6FD1A4" }}>●</span> Larsen Industrial bought 6 × TC-MNX32</span>
          <span className="sep">/</span>
          <span className="item"><span style={{ color: "#6FD1A4" }}>●</span> Godrej Inds. bought 24 × JS-BB-6204</span>
          <span className="sep">/</span>
          <span className="item"><span style={{ color: "#E5B670" }}>●</span> Hindalco booked 240 m × PE-GIPIPE-25</span>
          <span className="sep">/</span>
          <span className="item"><span style={{ color: "#ff5a4d" }}>●</span> Special prices end 17:00 IST · 2h 36m</span>
          <span className="sep">/</span>
          {/* duplicate for seamless loop */}
          <span className="item"><span style={{ color: "#6FD1A4" }}>●</span> Acme Mfg bought 12 × BS-HBM8-304L</span>
          <span className="sep">/</span>
          <span className="item"><span style={{ color: "#E5B670" }}>●</span> Mahindra Logistics booked 80 × OM-6205-2RS</span>
          <span className="sep">/</span>
          <span className="item"><span style={{ color: "#6FD1A4" }}>●</span> Larsen Industrial bought 6 × TC-MNX32</span>
          <span className="sep">/</span>
          <span className="item"><span style={{ color: "#6FD1A4" }}>●</span> Godrej Inds. bought 24 × JS-BB-6204</span>
          <span className="sep">/</span>
          <span className="item"><span style={{ color: "#E5B670" }}>●</span> Hindalco booked 240 m × PE-GIPIPE-25</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BigScreen });
