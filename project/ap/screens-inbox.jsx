/* Kraya AP — Ingestion screens
   1. Dashboard         — overview of the AP funnel + activity
   2. Invoice inbox     — list of all e-invoices (api + ocr)
   3. OCR upload        — drop zone + parsed-fields review (fallback path)
   4. GST API sources   — per-GSTIN connection status
*/

/* ────────────────────────────────────────────────────────────────────────
   01 · AP Dashboard
   ──────────────────────────────────────────────────────────────────────── */
function ScreenDashboard() {
  return (
    <div className="ka ka-app">
      <AppTopbar/>
      <Sidebar active="dashboard"/>
      <main className="ka-canvas">
        <PageHead
          title="Accounts Payable · Overview"
          sub="Live view of the invoice-to-pay funnel. Today, Kraya auto-fetched 24 e-invoices from your 5 GSTINs; 3 invoices came in by OCR and need a quick review."
          actions={
            <>
              <button className="ka-btn ka-btn-outline"><Icon name="download" size={13}/> Export</button>
              <button className="ka-btn ka-btn-outline"><Icon name="refresh"  size={13}/> Sync GST</button>
              <button className="ka-btn ka-btn-primary"><Icon name="plus"     size={13}/> Record invoice</button>
            </>
          }
        />

        {/* Step chain — invoice → PO → GRN → 3-way → AP */}
        <div style={{ marginBottom: 20 }}>
          <Steps items={[
            { label: "E-invoice / OCR · 24",  state: "done" },
            { label: "PO link · 12",          state: "live" },
            { label: "GRN match · 8",         state: "todo" },
            { label: "3-way match · 8",       state: "todo" },
            { label: "Payable · 16",          state: "todo" },
          ]}/>
        </div>

        <div className="ka-stats cols-5">
          <Stat label="Auto-fetched today" value="24" sub="from 5 active GSTINs"  delta="6 vs yesterday"/>
          <Stat label="OCR fallback"       value="3"  sub="needs review"          delta="2 vs yesterday"/>
          <Stat label="Awaiting PO link"   value="12" sub="exception queue"       delta="2"  deltaDown/>
          <Stat label="Ready to pay"       value="16" sub="3-way matched"         currency="₹" />
          <Stat brand label="Payable · cycle" value="4.82" unit="Cr" sub="168 invoices · May FY26" currency="₹"/>
        </div>

        <div className="ka-2col" style={{ marginBottom: 18 }}>
          {/* Funnel split */}
          <Card title="Invoice funnel · this week" meta="Tue 26 May, 11:04 AM" action={<button className="ka-btn ka-btn-ghost ka-btn-sm"><Icon name="more" size={14}/></button>}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 1, background: "var(--border-subtle)",
                          border: "1px solid var(--border-subtle)", borderRadius: 8, overflow: "hidden" }}>
              {[
                { lbl: "Captured",     val: 124, sub: "API + OCR", pct: 100, color: "var(--ap-info)" },
                { lbl: "PO linked",    val: 112, sub: "side-by-side", pct: 90, color: "var(--ap-info)" },
                { lbl: "GRN received", val:  96, sub: "stores team", pct: 77, color: "var(--ap-warn)" },
                { lbl: "3-way OK",     val:  84, sub: "auto + manual", pct: 67, color: "var(--ap-ok)"  },
                { lbl: "Released",     val:  72, sub: "payment run",   pct: 58, color: "var(--kraya-red)" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "16px 14px", background: "var(--bg-surface)" }}>
                  <div style={{ font: "600 10px/1 var(--font-sans)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)" }}>{s.lbl}</div>
                  <div style={{ font: "700 22px/1 var(--font-sans)", letterSpacing: "-0.02em", marginTop: 8 }}>{s.val}</div>
                  <div style={{ font: "500 11px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 4 }}>{s.sub}</div>
                  <div style={{ height: 4, background: "var(--neutral-100)", borderRadius: 999, marginTop: 12, overflow: "hidden" }}>
                    <div style={{ width: `${s.pct}%`, height: "100%", background: s.color }}/>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18 }}>
              <div className="ka-subhead">
                <h4>Exceptions to clear</h4>
                <span className="meta">5 open</span>
              </div>
              <table className="ka-tbl compact">
                <thead><tr>
                  <th>Invoice</th><th>Vendor</th><th>Issue</th><th>Owner</th><th className="num">Amount</th><th></th>
                </tr></thead>
                <tbody>
                  <tr className="row-bad">
                    <td className="ka-mono">INV-2026-00422</td><td>Ananya Polymers</td><td>HSN mismatch · 2 lines</td><td><span className="ka-av" style={{ width: 22, height: 22, fontSize: 9 }}>RS</span></td><td className="num">₹ 3,24,500</td><td><Icon name="chev-r" size={14}/></td>
                  </tr>
                  <tr className="row-warn">
                    <td className="ka-mono">INV-2026-00427</td><td>OM Bearings</td><td>No matching open PO</td><td><span className="ka-av" style={{ width: 22, height: 22, fontSize: 9 }}>NK</span></td><td className="num">₹ 2,46,800</td><td><Icon name="chev-r" size={14}/></td>
                  </tr>
                  <tr className="row-warn">
                    <td className="ka-mono">INV-2026-00425</td><td>Pragati Engineering</td><td>GRN qty short · 2 pcs MS Angle</td><td><span className="ka-av" style={{ width: 22, height: 22, fontSize: 9 }}>SK</span></td><td className="num">₹ 1,68,200</td><td><Icon name="chev-r" size={14}/></td>
                  </tr>
                  <tr className="row-warn">
                    <td className="ka-mono">INV-2026-00424</td><td>Vidarbha Steel Tools</td><td>OCR confidence 78% · verify</td><td><span className="ka-av" style={{ width: 22, height: 22, fontSize: 9 }}>RS</span></td><td className="num">₹ 96,800</td><td><Icon name="chev-r" size={14}/></td>
                  </tr>
                  <tr className="row-bad">
                    <td className="ka-mono">INV-2026-00417</td><td>Pragati Engineering</td><td>Quality NCR hold · acct hold</td><td><span className="ka-av" style={{ width: 22, height: 22, fontSize: 9 }}>AM</span></td><td className="num">₹ 3,28,400</td><td><Icon name="chev-r" size={14}/></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Activity */}
          <Card title="Activity" meta="Live"
                action={<button className="ka-btn ka-btn-ghost ka-btn-sm"><Icon name="filter" size={13}/></button>}
                noBody bodyStyle={{ padding: 0 }}>
            <div className="ka-activity">
              {ACTIVITY.map((a, i) => (
                <div className="row" key={i}>
                  <div className="icon-wrap" style={{ background: a.iconBg, color: a.iconColor }}>
                    <Icon name={a.icon} size={14} stroke={2}/>
                  </div>
                  <div className="body">
                    <div className="top">
                      <span className="who">{a.who}</span>
                    </div>
                    <div className="what">{a.what}</div>
                  </div>
                  <span className="when">{a.t}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Per-vendor payables strip */}
        <Card title="Top vendors · current cycle" meta="May FY26"
          action={<a href="#" className="ka-btn ka-btn-ghost ka-btn-sm">View all <Icon name="chev-r" size={12}/></a>}>
          <table className="ka-tbl">
            <thead><tr>
              <th>Vendor</th><th>GSTIN</th><th className="num">Open POs</th><th className="num">Invoices</th>
              <th className="num">3-way OK</th><th className="num">Payable</th><th>On-time pay</th>
            </tr></thead>
            <tbody>
              {[
                { v: "Bharat Steel Co.",    g: "27AABCB2891C1ZP", po: 12, inv: 18, ok: 16, pay: 2840000, otp: 94 },
                { v: "OM Bearings",         g: "27AAACO5612N1ZD", po:  7, inv: 11, ok:  9, pay:  428000, otp: 100 },
                { v: "Tata Components",     g: "24AABCT1322L1ZR", po:  9, inv: 12, ok: 10, pay:  768400, otp: 86 },
                { v: "Pragati Engineering", g: "27AAGCP9921B1ZF", po:  6, inv:  8, ok:  5, pay:  496600, otp: 72 },
                { v: "Vidarbha Steel Tools",g: "27AAACV2210R1Z1", po:  4, inv:  4, ok:  4, pay:   62800, otp: 100 },
              ].map((r, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className="ka-av">{r.v.split(" ").map(w => w[0]).slice(0, 2).join("")}</span>
                      <span style={{ fontWeight: 600 }}>{r.v}</span>
                    </div>
                  </td>
                  <td className="ka-mono" style={{ color: "var(--fg-2)" }}>{r.g}</td>
                  <td className="num">{r.po}</td>
                  <td className="num">{r.inv}</td>
                  <td className="num"><Badge kind="ok" dot>{r.ok}/{r.inv}</Badge></td>
                  <td className="num" style={{ fontWeight: 600 }}>{fmtINR(r.pay)}</td>
                  <td><Meter pct={r.otp}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
}


/* ────────────────────────────────────────────────────────────────────────
   02 · E-invoice inbox
   ──────────────────────────────────────────────────────────────────────── */
function ScreenInbox() {
  return (
    <div className="ka ka-app">
      <AppTopbar/>
      <Sidebar active="inbox"/>
      <main className="ka-canvas">
        <PageHead
          crumbs={["AP", "Ingestion", "E-invoice inbox"]}
          title="E-invoice inbox"
          sub="Invoices flow in two ways: auto-fetched from the GST e-invoice portal against your registered GSTINs, and OCR-captured when a vendor doesn't share GST OTP access. Both land here."
          actions={
            <>
              <button className="ka-btn ka-btn-outline"><Icon name="filter" size={13}/> Filter</button>
              <button className="ka-btn ka-btn-outline"><Icon name="refresh" size={13}/> Sync GST</button>
              <button className="ka-btn ka-btn-primary"><Icon name="upload" size={13}/> Upload PDF / image</button>
            </>
          }
        />

        <div className="ka-stats cols-6" style={{ marginBottom: 16 }}>
          <Stat label="Today · API"      value="21" sub="auto-fetched"/>
          <Stat label="Today · OCR"      value="3"  sub="needs review"/>
          <Stat label="PO link pending"  value="12" sub="6 vendors"/>
          <Stat label="GRN pending"      value="8"  sub="awaiting stores"/>
          <Stat label="3-way matched"    value="16" sub="ready to pay"/>
          <Stat label="Exceptions"       value="5"  sub="action needed"/>
        </div>

        <div className="ka-tabs">
          <div className="ka-tab active">All <span className="ct">218</span></div>
          <div className="ka-tab">OCR review <span className="ct">3</span></div>
          <div className="ka-tab">PO link pending <span className="ct">12</span></div>
          <div className="ka-tab">GRN pending <span className="ct">8</span></div>
          <div className="ka-tab">3-way matched <span className="ct">16</span></div>
          <div className="ka-tab">Exceptions <span className="ct">5</span></div>
          <div className="ka-tab">Paid <span className="ct">174</span></div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div className="ka-pills">
            <div className="ka-pill active">All vendors <span className="ct">6</span></div>
            <div className="ka-pill">Source: GST API <span className="ct">198</span></div>
            <div className="ka-pill">Source: OCR <span className="ct">17</span></div>
            <div className="ka-pill">Source: Manual <span className="ct">3</span></div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ font: "500 11.5px/1 var(--font-mono)", color: "var(--fg-3)" }}>Sort: Newest first</span>
            <button className="ka-btn ka-btn-outline ka-btn-sm"><Icon name="chev-d" size={12}/></button>
          </div>
        </div>

        <Card noBody>
          <table className="ka-tbl">
            <thead><tr>
              <th style={{ width: 28 }}></th>
              <th>Invoice #</th>
              <th>Vendor · GSTIN</th>
              <th>Date</th>
              <th>IRN</th>
              <th className="num">Items</th>
              <th className="num">Amount</th>
              <th>Source</th>
              <th>Status</th>
              <th style={{ width: 36 }}></th>
            </tr></thead>
            <tbody>
              {INBOX.map((inv, i) => {
                const s = STATUS_LABEL[inv.status];
                const rowCls = inv.status === "exception" ? "row-bad" :
                               inv.status === "ready"     ? "row-ok"  : "";
                return (
                  <tr key={i} className={rowCls}>
                    <td><input type="checkbox" style={{ accentColor: "var(--kraya-red)" }}/></td>
                    <td>
                      <div style={{ font: "600 12.5px/1.2 var(--font-mono)" }}>{inv.id}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{inv.vendor}</div>
                      <div className="sub">{inv.gstin}</div>
                    </td>
                    <td className="ka-mono" style={{ color: "var(--fg-2)" }}>{inv.date}</td>
                    <td className="ka-mono" style={{ color: "var(--fg-2)" }}>{inv.irn}</td>
                    <td className="num">{inv.items}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{fmtINR(inv.amount)}</td>
                    <td>
                      <span className="ka-src">
                        <SourceTag source={inv.src} conf={inv.conf}/>
                      </span>
                    </td>
                    <td><Badge kind={s.kind} dot>{s.txt}</Badge></td>
                    <td><button className="ka-btn ka-btn-ghost ka-btn-sm"><Icon name="chev-r" size={14}/></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "12px 18px", borderTop: "1px solid var(--border-subtle)",
                        background: "var(--bg-canvas)", font: "500 11.5px/1 var(--font-mono)", color: "var(--fg-3)" }}>
            <span>Showing 10 of 218 invoices</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="ka-btn ka-btn-outline ka-btn-sm"><Icon name="chev-l" size={12}/> Prev</button>
              <button className="ka-btn ka-btn-outline ka-btn-sm">Next <Icon name="chev-r" size={12}/></button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}


/* ────────────────────────────────────────────────────────────────────────
   03 · OCR upload + review (fallback path)
   ──────────────────────────────────────────────────────────────────────── */
function ScreenOCR() {
  return (
    <div className="ka ka-app">
      <AppTopbar/>
      <Sidebar active="ocr"/>
      <main className="ka-canvas">
        <PageHead
          crumbs={["AP", "Ingestion", "OCR upload"]}
          title="OCR upload · invoice review"
          sub="When a vendor doesn't share the GST e-invoice OTP, drop the PDF or scanned image here. Kraya runs Google Vision OCR, parses the invoice into structured line items, and shows confidence per field — you confirm or correct, then we push to the matching flow."
          actions={
            <>
              <button className="ka-btn ka-btn-outline"><Icon name="upload" size={13}/> Bulk upload</button>
              <button className="ka-btn ka-btn-primary"><Icon name="check" size={13}/> Confirm &amp; queue match</button>
            </>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
          {/* Drop zone */}
          <div className="ka-drop">
            <div style={{ width: 44, height: 44, borderRadius: 999, background: "var(--kraya-red-soft)",
                          display: "grid", placeItems: "center", margin: "0 auto 12px", color: "var(--kraya-red)" }}>
              <Icon name="upload" size={22} stroke={2}/>
            </div>
            <div className="ttl">Drop invoice PDFs or images here</div>
            <div className="sub">Or <a className="kraya-link" style={{ color: "var(--kraya-red)" }}>browse files</a> · PDF, PNG, JPG up to 25 MB · Multi-page supported</div>
            <div style={{ marginTop: 14, font: "500 10.5px/1.3 var(--font-mono)", color: "var(--fg-3)" }}>
              Google Vision OCR · 99.4% line-item recovery on tested datasets
            </div>
          </div>

          {/* Recent OCR queue */}
          <Card title="In review" meta="3 invoices · last 24h" noBody bodyStyle={{ padding: 0 }}>
            <table className="ka-tbl compact">
              <thead><tr><th>File</th><th>Vendor (detected)</th><th>Conf.</th><th></th></tr></thead>
              <tbody>
                <tr><td className="ka-mono">tata-INV-00426.pdf</td><td>Tata Components</td><td><Meter pct={94}/></td><td><Icon name="chev-r" size={14}/></td></tr>
                <tr className="row-warn"><td className="ka-mono">vst-024424.jpg</td><td>Vidarbha Steel Tools</td><td><Meter pct={78}/></td><td><Icon name="chev-r" size={14}/></td></tr>
                <tr><td className="ka-mono">pragati-419.pdf</td><td>Pragati Engineering</td><td><Meter pct={88}/></td><td><Icon name="chev-r" size={14}/></td></tr>
              </tbody>
            </table>
          </Card>
        </div>

        {/* Side-by-side: scan + parsed fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 16 }}>
          {/* Scan preview with bounding boxes */}
          <Card title="Scan · tata-INV-00426.pdf" meta="Page 1 of 1"
                action={<div style={{ display: "flex", gap: 6 }}>
                  <button className="ka-btn ka-btn-ghost ka-btn-sm"><Icon name="eye" size={13}/></button>
                  <button className="ka-btn ka-btn-ghost ka-btn-sm"><Icon name="download" size={13}/></button>
                </div>}>
            <div style={{ position: "relative", background: "white", border: "1px solid var(--border-subtle)",
                          borderRadius: 6, padding: "20px 22px", height: 560, overflow: "hidden",
                          font: "400 11px/1.55 var(--font-sans)", color: "var(--fg-1)" }}>
              {/* Faux scanned invoice */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ font: "700 18px/1 var(--font-sans)", marginBottom: 4 }}>TATA COMPONENTS</div>
                  <div style={{ color: "var(--fg-3)", font: "500 10px/1.3 var(--font-mono)" }}>Plot 14, Sector 21, Vadodara 390023</div>
                  <div style={{ color: "var(--fg-3)", font: "500 10px/1.3 var(--font-mono)" }}>GSTIN 24AABCT1322L1ZR</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ font: "600 13px/1 var(--font-sans)" }}>TAX INVOICE</div>
                  <div style={{ color: "var(--fg-3)", font: "500 10px/1.3 var(--font-mono)", marginTop: 4 }}>INV / TC / 00426</div>
                  <div style={{ color: "var(--fg-3)", font: "500 10px/1.3 var(--font-mono)" }}>25-May-2026</div>
                </div>
              </div>
              <div style={{ borderTop: "1px dashed var(--neutral-300)", paddingTop: 10, marginBottom: 12, font: "500 10.5px/1.5 var(--font-mono)", color: "var(--fg-2)" }}>
                <div><b style={{ color: "var(--fg-1)" }}>Bill to:</b> Haldiram Snacks Pvt Ltd, Plant 03 · Nagpur</div>
                <div>GSTIN: 27AAACH1234D1Z5 · PO ref: PO-26-0414</div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", font: "400 10px/1.4 var(--font-mono)" }}>
                <thead>
                  <tr style={{ background: "#f5f1ea" }}>
                    {["#", "Item", "HSN", "Qty", "Rate", "GST%", "Amount"].map(h => (
                      <th key={h} style={{ padding: "6px 8px", textAlign: "left", borderBottom: "1px solid var(--neutral-300)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: 6 }}>1</td><td>MNX-32 Contactor 32A</td><td>8536</td><td>40</td><td>1,480</td><td>18%</td><td>59,200</td></tr>
                  <tr><td style={{ padding: 6 }}>2</td><td>Push button NO+NC</td><td>8536</td><td>120</td><td>92</td><td>18%</td><td>11,040</td></tr>
                  <tr><td style={{ padding: 6 }}>3</td><td>Relay 4-pole 24V DC</td><td>8536</td><td>60</td><td>720</td><td>18%</td><td>43,200</td></tr>
                  <tr><td style={{ padding: 6 }}>4</td><td>Cable PVC 2.5 sq.mm</td><td>8544</td><td>800</td><td>34</td><td>18%</td><td>27,200</td></tr>
                  <tr><td style={{ padding: 6 }}>5</td><td>Switch SPST 16A</td><td>8536</td><td>200</td><td>180</td><td>18%</td><td>36,000</td></tr>
                  <tr><td style={{ padding: 6 }}>6</td><td>Cable gland 25mm</td><td>8536</td><td>50</td><td>112</td><td>18%</td><td>5,600</td></tr>
                </tbody>
              </table>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, font: "500 11px/1.4 var(--font-mono)" }}>
                <div style={{ color: "var(--fg-3)" }}>E-way bill: 271-9476 · Vehicle MH-12-RJ-2218</div>
                <div style={{ textAlign: "right" }}>
                  <div>Subtotal &emsp; 1,82,240</div>
                  <div>CGST 9% &emsp; 16,402</div>
                  <div>SGST 9% &emsp; 16,402</div>
                  <div style={{ fontWeight: 700, marginTop: 4, fontSize: 12 }}>Total &emsp; ₹ 2,15,044</div>
                </div>
              </div>

              {/* OCR bounding box overlays */}
              <div className="ka-bbox" style={{ left: 22,  top:  20, width: 200, height: 22 }}/>
              <div className="ka-bbox" style={{ left: 22,  top:  56, width: 240, height: 14 }}/>
              <div className="ka-bbox" style={{ right: 22, top:  20, width: 110, height: 18 }}/>
              <div className="ka-bbox" style={{ left: 22,  top: 156, width: "calc(100% - 44px)", height: 132 }}/>
              <div className="ka-bbox" style={{ right: 22, bottom:18, width: 160, height: 78  }}/>
            </div>
          </Card>

          {/* Parsed fields */}
          <Card title="Parsed fields · review &amp; confirm" meta="Confidence per field shown"
            action={<Badge kind="info" dot>OCR · Google Vision</Badge>}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 18px", marginBottom: 18 }}>
              {[
                ["Vendor name",      "Tata Components",      98],
                ["Vendor GSTIN",     "24AABCT1322L1ZR",      99],
                ["Invoice number",   "INV / TC / 00426",     97],
                ["Invoice date",     "25-May-2026",          99],
                ["Bill-to GSTIN",    "27AAACH1234D1Z5",      96],
                ["PO reference",     "PO-26-0414",           92],
                ["Place of supply",  "Maharashtra",          90],
                ["E-way bill",       "271-9476",             95],
                ["Subtotal",         "₹ 1,82,240",           99],
                ["Tax (CGST+SGST)",  "₹ 32,804",             99],
                ["Total",            "₹ 2,15,044",           99],
                ["IRN",              "—",                    100],
              ].map(([k, v, c], i) => (
                <div key={i} style={{ background: "var(--bg-canvas)", padding: "9px 11px", borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ font: "500 10px/1 var(--font-sans)", color: "var(--fg-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{k}</span>
                    <Meter pct={c}/>
                  </div>
                  <div style={{ font: "500 12px/1.2 var(--font-mono)", color: "var(--fg-1)" }}>{v}</div>
                </div>
              ))}
            </div>

            <div className="ka-subhead">
              <h4>Line items · 6 detected</h4>
              <span className="meta">Drag a row to merge · click to edit</span>
            </div>
            <table className="ka-tbl compact">
              <thead><tr>
                <th>#</th><th>Item</th><th>HSN</th><th className="num">Qty</th><th className="num">Rate</th><th className="num">GST</th><th className="num">Amt</th><th>Conf.</th>
              </tr></thead>
              <tbody>
                <tr><td>1</td><td>MNX-32 Contactor 32A</td><td className="ka-mono">8536</td><td className="num">40</td><td className="num">1,480</td><td className="num">18%</td><td className="num">59,200</td><td><Meter pct={96}/></td></tr>
                <tr><td>2</td><td>Push button NO+NC</td><td className="ka-mono">8536</td><td className="num">120</td><td className="num">92</td><td className="num">18%</td><td className="num">11,040</td><td><Meter pct={92}/></td></tr>
                <tr><td>3</td><td>Relay 4-pole 24V DC</td><td className="ka-mono">8536</td><td className="num">60</td><td className="num">720</td><td className="num">18%</td><td className="num">43,200</td><td><Meter pct={94}/></td></tr>
                <tr><td>4</td><td>Cable PVC 2.5 sq.mm</td><td className="ka-mono">8544</td><td className="num">800</td><td className="num">34</td><td className="num">18%</td><td className="num">27,200</td><td><Meter pct={97}/></td></tr>
                <tr className="row-warn"><td>5</td><td>Switch SPST 16A</td><td className="ka-mono">8536</td><td className="num">200</td><td className="num">180</td><td className="num">18%</td><td className="num">36,000</td><td><Meter pct={82}/></td></tr>
                <tr><td>6</td><td>Cable gland 25mm</td><td className="ka-mono">8536</td><td className="num">50</td><td className="num">112</td><td className="num">18%</td><td className="num">5,600</td><td><Meter pct={91}/></td></tr>
              </tbody>
            </table>

            <div className="ka-div"/>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="ka-hint">
                <Icon name="alert" size={13}/>
                Line 5 confidence below 85% · please verify rate &amp; amount.
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="ka-btn ka-btn-outline ka-btn-sm">Skip</button>
                <button className="ka-btn ka-btn-primary ka-btn-sm"><Icon name="check" size={12}/> Confirm &amp; match to PO</button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}


/* ────────────────────────────────────────────────────────────────────────
   04 · GST sources · per-GSTIN connection status
   ──────────────────────────────────────────────────────────────────────── */
function ScreenSources() {
  return (
    <div className="ka ka-app">
      <AppTopbar/>
      <Sidebar active="sources"/>
      <main className="ka-canvas">
        <PageHead
          crumbs={["AP", "Ingestion", "GST sources"]}
          title="GST e-invoice sources"
          sub="Each GSTIN registered for your company is paired with the GST e-invoice portal. Kraya polls every 5 minutes and pulls fresh invoices automatically. If a session's OTP expires, this is where you reconnect."
          actions={
            <>
              <button className="ka-btn ka-btn-outline"><Icon name="refresh" size={13}/> Sync all</button>
              <button className="ka-btn ka-btn-primary"><Icon name="plus"    size={13}/> Add GSTIN</button>
            </>
          }
        />

        <div className="ka-stats cols-4" style={{ marginBottom: 18 }}>
          <Stat label="Total GSTINs"      value="5"   sub="across 5 states"/>
          <Stat label="Healthy"           value="3"   sub="auto-pulling"/>
          <Stat label="Action needed"     value="2"   sub="OTP / connection"/>
          <Stat label="Invoices · 7d"     value="386" sub="auto-fetched"/>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {SOURCES.map((s, i) => {
            const kind = s.health === "ok" ? "ok" : s.health === "warn" ? "warn" : "bad";
            const otpKind = s.otp === "active" ? "ok" : s.otp === "expiring" ? "warn" : "bad";
            return (
              <Card key={i} noBody>
                <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
                              borderBottom: "1px solid var(--border-subtle)" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span className="ka-av" style={{ background: kind === "bad" ? "var(--ap-bad-bg)" : kind === "warn" ? "var(--ap-warn-bg)" : "var(--ap-ok-bg)",
                                                       color: kind === "bad" ? "var(--ap-bad)" : kind === "warn" ? "var(--ap-warn)" : "var(--ap-ok)" }}>
                        <Icon name={kind === "ok" ? "check-c" : kind === "warn" ? "alert" : "x-c"} size={14} stroke={2}/>
                      </span>
                      <div style={{ font: "600 14px/1.1 var(--font-sans)" }}>{s.branch}</div>
                      <Badge kind={kind} dot>{kind === "ok" ? "Healthy" : kind === "warn" ? "OTP expiring" : "Needs reconnect"}</Badge>
                    </div>
                    <div className="ka-mono" style={{ color: "var(--fg-2)", fontSize: 12 }}>GSTIN {s.gstin} · {s.state}</div>
                  </div>
                  <button className="ka-btn ka-btn-outline ka-btn-sm"><Icon name="settings" size={12}/></button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "var(--border-subtle)" }}>
                  <div style={{ padding: "12px 16px", background: "var(--bg-surface)" }}>
                    <div style={{ font: "500 10px/1 var(--font-sans)", color: "var(--fg-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 5 }}>Last pull</div>
                    <div style={{ font: "600 12.5px/1 var(--font-mono)" }}>{s.lastPull}</div>
                  </div>
                  <div style={{ padding: "12px 16px", background: "var(--bg-surface)" }}>
                    <div style={{ font: "500 10px/1 var(--font-sans)", color: "var(--fg-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 5 }}>Invoices · month</div>
                    <div style={{ font: "600 12.5px/1 var(--font-mono)" }}>{s.invMonth}</div>
                  </div>
                  <div style={{ padding: "12px 16px", background: "var(--bg-surface)" }}>
                    <div style={{ font: "500 10px/1 var(--font-sans)", color: "var(--fg-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 5 }}>OTP session</div>
                    <Badge kind={otpKind} dot style={{ fontSize: 10 }}>{s.otp}</Badge>
                  </div>
                  <div style={{ padding: "12px 16px", background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    {s.health === "ok"
                      ? <button className="ka-btn ka-btn-ghost ka-btn-sm"><Icon name="refresh" size={12}/> Sync now</button>
                      : <button className="ka-btn ka-btn-primary ka-btn-sm"><Icon name="key" size={12}/> Reconnect OTP</button>
                    }
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { ScreenDashboard, ScreenInbox, ScreenOCR, ScreenSources });
