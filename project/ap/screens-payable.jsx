/* Kraya AP — Payables screens
   8. GRN (stores team)   — receive material against open POs
   9. AP register         — verified, ready-to-pay queue
  10. E-way bill tracker  — track in-transit consignments
*/

/* ────────────────────────────────────────────────────────────────────────
   08 · GRN · stores team view
   ──────────────────────────────────────────────────────────────────────── */
function ScreenGRN() {
  const expecting = [
    { po: "PO-26-0418", vendor: "Bharat Steel Co.",   item: "HSS Cutting Disc 12in",   hsn: "8202",  ord:  20, recv: 20, uom: "box",  rate: 3120,  ewb: "EWB-271-9482", eta: "Today, 14:00", status: "received" },
    { po: "PO-26-0418", vendor: "Bharat Steel Co.",   item: "M8 304L Hex Bolt",        hsn: "7318",  ord: 200, recv: 200,uom: "pc",   rate:   14,  ewb: "EWB-271-9482", eta: "Today, 14:00", status: "received" },
    { po: "PO-26-0421", vendor: "Bharat Steel Co.",   item: "GI Pipe 25mm Class B",    hsn: "7306",  ord: 120, recv: 120,uom: "m",    rate:  142,  ewb: "EWB-271-9482", eta: "Today, 14:00", status: "received" },
    { po: "PO-26-0421", vendor: "Bharat Steel Co.",   item: "MS Angle 50×50×6",        hsn: "7216",  ord:  80, recv:  78,uom: "pc",   rate:  188,  ewb: "EWB-271-9482", eta: "Today, 14:00", status: "short"    },
    { po: "PO-26-0425", vendor: "Bharat Steel Co.",   item: "Welding Rod E7018",       hsn: "8311",  ord:  40, recv:  40,uom: "pack", rate:  620,  ewb: "EWB-271-9482", eta: "Today, 14:00", status: "received" },
    { po: "PO-26-0425", vendor: "Bharat Steel Co.",   item: "Hex Nut M12 Galvanized",  hsn: "7318",  ord: 500, recv: 500,uom: "pc",   rate:    8,  ewb: "EWB-271-9482", eta: "Today, 14:00", status: "received" },
    { po: "PO-26-0432", vendor: "OM Bearings",        item: "6205-2RS Bearing",        hsn: "8482",  ord: 200, recv:   0,uom: "pc",   rate:  920,  ewb: "EWB-271-9481", eta: "Tomorrow",     status: "in-transit" },
    { po: "PO-26-0432", vendor: "OM Bearings",        item: "6204 Bearing",            hsn: "8482",  ord: 120, recv:   0,uom: "pc",   rate:  460,  ewb: "EWB-271-9481", eta: "Tomorrow",     status: "in-transit" },
    { po: "PO-26-0414", vendor: "Tata Components",    item: "MNX-32 Contactor 32A",    hsn: "8536",  ord:  40, recv:   0,uom: "pc",   rate: 1480,  ewb: "EWB-271-9475", eta: "Awaited",      status: "pending"  },
  ];

  const STSTYLE = {
    "received":    { kind: "ok",   txt: "Received in full" },
    "short":       { kind: "warn", txt: "Short receipt" },
    "in-transit":  { kind: "info", txt: "In transit" },
    "pending":     { kind: "mute", txt: "Pending" },
  };

  return (
    <div className="ka ka-app">
      <AppTopbar role="Stores" roleStyle="stores" initials="SK" business="Plant 03 · Stores" gstin="Gate 4 · Receiving"/>
      <Sidebar active="grn"/>
      <main className="ka-canvas">
        <PageHead
          crumbs={["AP", "Match & verify", "GRN · stores"]}
          title="Goods Receipt Notes"
          sub="The stores team records received quantities against open POs. Vehicle arrivals are pre-loaded from the linked e-way bills, so when the truck rolls in you only confirm what was actually received and any short / damaged remarks."
          actions={
            <>
              <button className="ka-btn ka-btn-outline"><Icon name="barcode" size={13}/> Scan PO / e-way</button>
              <button className="ka-btn ka-btn-outline"><Icon name="upload" size={13}/> Upload photo</button>
              <button className="ka-btn ka-btn-primary"><Icon name="check" size={13}/> Confirm GRN</button>
            </>
          }
        />

        <div className="ka-stats cols-5" style={{ marginBottom: 18 }}>
          <Stat label="Trucks at gate"  value="2"   sub="Bharat Steel, Pragati"/>
          <Stat label="In transit"      value="3"   sub="next 24h"/>
          <Stat label="Received today"  value="142" unit="pcs" sub="6 GRNs raised"/>
          <Stat label="Short / damaged" value="1"   sub="MS Angle · 2 pcs"/>
          <Stat brand label="Open POs · pending receipt" value="38" sub="₹ 18.4 L total" currency="₹"/>
        </div>

        {/* Vehicles at gate */}
        <Card title="Vehicles at gate · live" meta="Gate 4 receiving"
              action={<a href="#" className="ka-btn ka-btn-ghost ka-btn-sm">Gate log <Icon name="chev-r" size={12}/></a>}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
            {[
              { veh: "MH-12-AB-3421", driver: "Vikram T.",  vendor: "Bharat Steel Co.", ewb: "EWB-271-9482", since: "13:42", state: "live", invoice: "INV-2026-00428", val: "₹ 12,48,400" },
              { veh: "MH-15-CD-8821", driver: "Manoj P.",   vendor: "Pragati Engg",     ewb: "EWB-271-9479", since: "12:18", state: "live", invoice: "INV-2026-00425", val: "₹ 1,68,200"  },
            ].map((v, i) => (
              <div key={i} style={{ border: "1px solid var(--border-subtle)", borderRadius: 10, padding: 14,
                                    display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--kraya-red-soft)",
                              display: "grid", placeItems: "center", color: "var(--kraya-red)" }}>
                  <Icon name="truck" size={22} stroke={2}/>
                </div>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <span className="ka-mono" style={{ fontWeight: 600, fontSize: 13 }}>{v.veh}</span>
                    <Badge kind="brand" dot>At gate · since {v.since}</Badge>
                  </div>
                  <div style={{ font: "500 12px/1.4 var(--font-sans)", color: "var(--fg-2)" }}>
                    {v.vendor} · {v.driver} · <span className="ka-mono">{v.ewb}</span>
                  </div>
                  <div className="ka-mono" style={{ color: "var(--fg-3)", fontSize: 11, marginTop: 4 }}>
                    {v.invoice} · {v.val}
                  </div>
                </div>
                <button className="ka-btn ka-btn-dark ka-btn-sm">Start GRN <Icon name="arrow" size={12}/></button>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ height: 16 }}/>

        {/* Items to receive */}
        <Card title="Items expected · today" meta="Filtered to vendor: Bharat Steel Co."
              action={
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="ka-btn ka-btn-ghost ka-btn-sm"><Icon name="filter" size={12}/></button>
                  <button className="ka-btn ka-btn-outline ka-btn-sm"><Icon name="download" size={12}/></button>
                </div>
              }>
          <table className="ka-tbl">
            <thead><tr>
              <th>PO</th><th>Item</th><th>HSN</th><th>E-way</th><th>ETA</th>
              <th className="num">Ord. qty</th><th className="num">Recv. qty</th>
              <th>Status</th><th>Remarks</th><th style={{ width: 130 }}></th>
            </tr></thead>
            <tbody>
              {expecting.map((r, i) => {
                const s = STSTYLE[r.status];
                const rowCls = r.status === "short" ? "row-warn" : r.status === "received" ? "" : "";
                return (
                  <tr key={i} className={rowCls}>
                    <td className="ka-mono">{r.po}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.item}</div>
                      <div className="sub">{r.vendor}</div>
                    </td>
                    <td className="ka-mono">{r.hsn}</td>
                    <td className="ka-mono" style={{ color: "var(--fg-2)" }}>{r.ewb}</td>
                    <td className="ka-mono" style={{ color: "var(--fg-2)" }}>{r.eta}</td>
                    <td className="num">{fmtN(r.ord)} <span style={{ color: "var(--fg-3)" }}>{r.uom}</span></td>
                    <td className="num">
                      {r.status === "received" || r.status === "short" ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontWeight: 600 }}>{fmtN(r.recv)}</span>
                          {r.status === "short" && <Diff kind="bad">{r.recv - r.ord}</Diff>}
                        </span>
                      ) : (
                        <input style={{ width: 76, padding: "5px 8px", border: "1px solid var(--border-default)",
                                        borderRadius: 5, font: "500 12px/1 var(--font-mono)", textAlign: "right",
                                        background: "var(--bg-surface)" }} placeholder="—"/>
                      )}
                    </td>
                    <td><Badge kind={s.kind} dot>{s.txt}</Badge></td>
                    <td style={{ color: "var(--fg-2)", fontSize: 11.5 }}>
                      {r.status === "short" && "2 pcs damaged in transit"}
                      {r.status === "received" && "—"}
                      {r.status === "in-transit" && "ETA tomorrow 10:00"}
                      {r.status === "pending" && "Vehicle not assigned"}
                    </td>
                    <td>
                      {r.status === "in-transit" || r.status === "pending"
                        ? <button className="ka-btn ka-btn-outline ka-btn-sm" disabled>Awaiting</button>
                        : <button className="ka-btn ka-btn-outline ka-btn-sm"><Icon name="open" size={11}/> Open GRN</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
}


/* ────────────────────────────────────────────────────────────────────────
   09 · AP register · ready to pay
   ──────────────────────────────────────────────────────────────────────── */
function ScreenRegister() {
  return (
    <div className="ka ka-app">
      <AppTopbar role="Accounts" roleStyle="accounts" initials="AM"/>
      <Sidebar active="register"/>
      <main className="ka-canvas">
        <PageHead
          crumbs={["AP", "Payables", "AP register"]}
          title="Accounts Payable register"
          sub="Every 3-way matched invoice lands here as an established payable. Schedule a payment run, hold on a vendor, or release a single invoice — the audit trail follows the document end-to-end."
          actions={
            <>
              <button className="ka-btn ka-btn-outline"><Icon name="filter"   size={13}/> Filter</button>
              <button className="ka-btn ka-btn-outline"><Icon name="download" size={13}/> Export CSV</button>
              <button className="ka-btn ka-btn-primary"><Icon name="send"     size={13}/> Schedule payment run</button>
            </>
          }
        />

        <div className="ka-stats cols-5" style={{ marginBottom: 18 }}>
          <Stat label="Ready to pay"    value="16"  sub="₹ 24.8 L"/>
          <Stat label="Overdue"         value="3"   sub="₹ 4.62 L · 6 days"/>
          <Stat label="Due this week"   value="7"   sub="₹ 12.4 L"/>
          <Stat label="On hold"         value="2"   sub="quality NCR / HSN"/>
          <Stat brand label="Next payment run" value="Today" unit="16:00" sub="₹ 8.92 L · 4 invoices"/>
        </div>

        {/* Payment run preview */}
        <Card title="Today's payment run · 16:00 IST" meta="Auto-generated · awaiting Director sign-off"
              action={
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="ka-btn ka-btn-outline ka-btn-sm"><Icon name="lock" size={12}/> Lock</button>
                  <button className="ka-btn ka-btn-primary ka-btn-sm"><Icon name="shield" size={12}/> Approve &amp; release</button>
                </div>
              }>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 0,
                          border: "1px solid var(--border-subtle)", borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ padding: 16, borderRight: "1px solid var(--border-subtle)", background: "var(--kraya-ink)", color: "white" }}>
                <div style={{ font: "600 10px/1 var(--font-sans)", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Run total · 4 invoices</div>
                <div style={{ font: "700 32px/1 var(--font-sans)", letterSpacing: "-0.02em" }}>₹ 8,92,400</div>
                <div style={{ font: "500 11px/1.4 var(--font-mono)", color: "rgba(255,255,255,0.55)", marginTop: 6 }}>NEFT · 3 vendors · TDS deducted</div>
              </div>
              <div style={{ padding: 16, borderRight: "1px solid var(--border-subtle)" }}>
                <div style={{ font: "600 10px/1 var(--font-sans)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 8 }}>Cash impact</div>
                <div style={{ font: "700 22px/1 var(--font-sans)", letterSpacing: "-0.02em" }}>₹ 8,74,752</div>
                <div style={{ font: "500 11px/1.4 var(--font-mono)", color: "var(--fg-3)", marginTop: 6 }}>after ₹ 17,648 TDS</div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ font: "600 10px/1 var(--font-sans)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 8 }}>Funding account</div>
                <div style={{ font: "600 13px/1.3 var(--font-sans)" }}>HDFC Bank · Current</div>
                <div className="ka-mono" style={{ color: "var(--fg-3)", fontSize: 11, marginTop: 4 }}>***4421 · Bal ₹ 1.42 Cr</div>
              </div>
            </div>
            <table className="ka-tbl compact">
              <thead><tr>
                <th>Invoice</th><th>Vendor</th><th className="num">Gross</th><th className="num">TDS</th><th className="num">Net</th><th>Mode</th><th>Status</th>
              </tr></thead>
              <tbody>
                {PAYABLES.slice(0, 4).map((p, i) => {
                  const tds = Math.round(p.amount * 0.02);
                  return (
                    <tr key={i}>
                      <td className="ka-mono">{p.id}</td>
                      <td>{p.vendor}</td>
                      <td className="num">{fmtINR(p.amount)}</td>
                      <td className="num" style={{ color: "var(--fg-3)" }}>−{fmtN(tds)}</td>
                      <td className="num" style={{ fontWeight: 600 }}>{fmtINR(p.amount - tds)}</td>
                      <td><Badge kind="info">{p.paymentMode}</Badge></td>
                      <td>
                        {p.holds.length > 0
                          ? <Badge kind="warn" dot>Hold: {p.holds[0]}</Badge>
                          : <Badge kind="ok" dot>Cleared</Badge>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </Card>

        <div style={{ height: 16 }}/>

        {/* Full payables register */}
        <Card title="All payables" meta="Filtered: 3-way matched · ready to pay"
              action={
                <div className="ka-tabs" style={{ border: "none", margin: 0 }}>
                  <div className="ka-tab active">All <span className="ct">16</span></div>
                  <div className="ka-tab">Due this week <span className="ct">7</span></div>
                  <div className="ka-tab">Overdue <span className="ct">3</span></div>
                  <div className="ka-tab">On hold <span className="ct">2</span></div>
                </div>
              }>
          <table className="ka-tbl">
            <thead><tr>
              <th>Invoice</th><th>Vendor · GSTIN</th><th className="num">Payable</th>
              <th>Due</th><th>Mode</th><th>Approvers</th><th>Status</th><th style={{ width: 90 }}></th>
            </tr></thead>
            <tbody>
              {PAYABLES.map((p, i) => {
                const overdue = p.dueIn < 0;
                const dueSoon = p.dueIn >= 0 && p.dueIn <= 3;
                return (
                  <tr key={i} className={p.holds.length ? "row-warn" : ""}>
                    <td className="ka-mono">{p.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.vendor}</div>
                      <div className="sub">{p.gstin}</div>
                    </td>
                    <td className="num" style={{ fontWeight: 600 }}>{fmtINR(p.amount)}</td>
                    <td>
                      {overdue
                        ? <Badge kind="bad" dot>{Math.abs(p.dueIn)}d overdue</Badge>
                        : dueSoon
                          ? <Badge kind="warn" dot>{p.dueIn === 0 ? "Today" : `${p.dueIn}d`}</Badge>
                          : <span className="ka-mono" style={{ color: "var(--fg-2)" }}>in {p.dueIn}d</span>}
                    </td>
                    <td><Badge kind="info">{p.paymentMode}</Badge></td>
                    <td>
                      <div style={{ display: "flex" }}>
                        {p.approvers.map((a, j) => (
                          <span key={j} className="ka-av" style={{ width: 22, height: 22, fontSize: 9, marginLeft: j === 0 ? 0 : -6,
                                                                    border: "2px solid var(--bg-surface)", background: "var(--ap-ok-bg)", color: "var(--ap-ok)" }}>{a}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {p.holds.length > 0
                        ? <Badge kind="warn" dot>{p.holds[0]}</Badge>
                        : <Badge kind="ok" dot>Cleared to pay</Badge>}
                    </td>
                    <td>
                      <button className="ka-btn ka-btn-outline ka-btn-sm">
                        {p.holds.length > 0 ? "Resolve" : "Pay now"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
}


/* ────────────────────────────────────────────────────────────────────────
   10 · E-way bill tracker
   ──────────────────────────────────────────────────────────────────────── */
function ScreenEway() {
  return (
    <div className="ka ka-app">
      <AppTopbar role="Purchase" roleStyle="purchase" initials="RK"/>
      <Sidebar active="eway"/>
      <main className="ka-canvas">
        <PageHead
          crumbs={["AP", "Payables", "E-way bills"]}
          title="E-way bill tracker"
          sub="E-way bills are pulled in automatically with each e-invoice. Track in-transit consignments, watch for validity windows, and confirm material receipt from this screen — the receipt flows back to the GRN and into the 3-way match."
          actions={
            <>
              <button className="ka-btn ka-btn-outline"><Icon name="map" size={13}/> Map view</button>
              <button className="ka-btn ka-btn-outline"><Icon name="refresh" size={13}/> Sync NIC</button>
              <button className="ka-btn ka-btn-primary"><Icon name="check" size={13}/> Confirm receipt</button>
            </>
          }
        />

        <div className="ka-stats cols-5" style={{ marginBottom: 18 }}>
          <Stat label="In transit"     value="14" sub="across 8 vendors"/>
          <Stat label="At gate"        value="2"  sub="Bharat Steel, Pragati"/>
          <Stat label="Delivered · 7d" value="38" sub="all reconciled"/>
          <Stat label="Expiring · 24h" value="3"  sub="action needed"/>
          <Stat brand label="Goods in transit · value" value="42.6" unit="L" sub="across 14 e-way bills" currency="₹"/>
        </div>

        <div className="ka-tabs">
          <div className="ka-tab active">In transit <span className="ct">14</span></div>
          <div className="ka-tab">At gate <span className="ct">2</span></div>
          <div className="ka-tab">Delivered <span className="ct">38</span></div>
          <div className="ka-tab">Expiring <span className="ct">3</span></div>
          <div className="ka-tab">Expired <span className="ct">1</span></div>
        </div>

        {/* List of e-way bills with route */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {EWAYS.map((e, i) => {
            const s = EWAY_STATUS[e.status];
            const liveIdx = e.progress >= 100 ? 3 : e.progress > 70 ? 2 : e.progress > 30 ? 1 : 0;
            return (
              <div key={i} className="ka-card" style={{ padding: 0 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr 1fr", alignItems: "center" }}>
                  {/* Left — id + invoice */}
                  <div style={{ padding: "16px 18px", borderRight: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <Icon name="truck" size={16} stroke={2}/>
                      <span className="ka-mono" style={{ fontWeight: 600 }}>{e.id}</span>
                      <Badge kind={s.kind} dot>{s.txt}</Badge>
                    </div>
                    <div style={{ font: "600 13px/1.3 var(--font-sans)" }}>{e.vendor}</div>
                    <div className="ka-mono" style={{ color: "var(--fg-3)", fontSize: 11, marginTop: 4 }}>{e.inv} · {e.vehicle} · {e.driver}</div>
                  </div>

                  {/* Middle — route */}
                  <div style={{ padding: "16px 22px", borderRight: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ font: "600 11px/1 var(--font-sans)" }}>{e.from}</span>
                      <span className="ka-mono" style={{ color: "var(--fg-3)", fontSize: 11 }}>{e.distance}</span>
                      <span style={{ font: "600 11px/1 var(--font-sans)" }}>{e.to}</span>
                    </div>
                    <div className="ka-route">
                      <div className={`node ${liveIdx >= 0 ? "done" : ""}`}/>
                      <div className={`seg ${liveIdx >= 1 ? "done" : ""}`}/>
                      <div className={`node ${liveIdx === 1 ? "live" : liveIdx > 1 ? "done" : ""}`}/>
                      <div className={`seg ${liveIdx >= 2 ? "done" : ""}`}/>
                      <div className={`node ${liveIdx === 2 ? "live" : liveIdx > 2 ? "done" : ""}`}/>
                      <div className={`seg ${liveIdx >= 3 ? "done" : ""}`}/>
                      <div className={`node ${liveIdx === 3 ? "done" : ""}`}/>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, font: "500 10.5px/1 var(--font-mono)", color: "var(--fg-3)" }}>
                      <span>Dispatched</span>
                      <span>Last scan</span>
                      <span>At buyer</span>
                      <span>Confirmed</span>
                    </div>
                  </div>

                  {/* Right — validity + action */}
                  <div style={{ padding: "16px 18px" }}>
                    <div style={{ font: "500 10px/1 var(--font-sans)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 4 }}>Valid until</div>
                    <div className="ka-mono" style={{ fontWeight: 600, fontSize: 13 }}>{e.valid}</div>
                    <div style={{ marginTop: 12, display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      {e.status === "delivered"
                        ? <button className="ka-btn ka-btn-outline ka-btn-sm" disabled><Icon name="check" size={11}/> Receipt confirmed</button>
                        : e.status === "in-transit"
                          ? <button className="ka-btn ka-btn-outline ka-btn-sm"><Icon name="pin" size={11}/> Track</button>
                          : <button className="ka-btn ka-btn-primary ka-btn-sm"><Icon name="refresh" size={11}/> Extend validity</button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { ScreenGRN, ScreenRegister, ScreenEway });
