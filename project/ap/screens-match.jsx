/* Kraya AP — Match & verify screens
   5. Invoice detail   — single fetched/parsed invoice, all fields
   6. PO ↔ Invoice match — side-by-side line items per vendor GSTIN
   7. 3-way match      — PO ↔ Invoice ↔ GRN with diffs flagged
*/

/* ────────────────────────────────────────────────────────────────────────
   05 · Invoice detail (parsed)
   ──────────────────────────────────────────────────────────────────────── */
function ScreenInvoiceDetail() {
  const inv = INBOX[0]; // INV-2026-00428 · Bharat Steel
  const lineTotal = INV_LINES.reduce((s, l) => s + l.qty * l.rate, 0);
  const gst = Math.round(lineTotal * 0.18);

  return (
    <div className="ka ka-app">
      <AppTopbar/>
      <Sidebar active="inbox"/>
      <main className="ka-canvas">
        <PageHead
          crumbs={["AP", "Inbox", inv.id]}
          title={inv.id}
          sub={<>Bharat Steel Co. · IRN <span className="ka-mono">8a3f…7d2c</span> · acknowledged 26 May 2026 by NIC IRP</>}
          actions={
            <>
              <button className="ka-btn ka-btn-outline"><Icon name="download" size={13}/> PDF</button>
              <button className="ka-btn ka-btn-outline"><Icon name="split"    size={13}/> Open match</button>
              <button className="ka-btn ka-btn-primary"><Icon name="arrow"    size={13}/> Send to 3-way</button>
            </>
          }
        />

        <div style={{ marginBottom: 18 }}>
          <Steps items={[
            { label: "Captured · GST API", state: "done" },
            { label: "PO link · auto",     state: "done" },
            { label: "GRN match",          state: "live" },
            { label: "3-way verify",       state: "todo" },
            { label: "Payable",            state: "todo" },
          ]}/>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 16 }}>
          {/* Header card */}
          <Card noBody>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border-subtle)",
                          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
              <div>
                <div style={{ font: "600 10.5px/1 var(--font-sans)", letterSpacing: "0.12em",
                              textTransform: "uppercase", color: "var(--kraya-red)", marginBottom: 8 }}>Tax invoice</div>
                <div style={{ font: "700 22px/1.1 var(--font-sans)", letterSpacing: "-0.02em" }}>Bharat Steel Co.</div>
                <div className="ka-mono" style={{ color: "var(--fg-3)", marginTop: 4 }}>GSTIN 27AABCB2891C1ZP · Pune, MH</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <SourceTag source="api"/>
                <div style={{ font: "600 22px/1 var(--font-sans)", marginTop: 12, letterSpacing: "-0.01em" }}>{fmtINR(inv.amount)}</div>
                <div style={{ font: "500 11px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 4 }}>incl. CGST + SGST @ 18%</div>
              </div>
            </div>

            <div style={{ padding: "16px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
              <dl className="ka-kv">
                <dt>Invoice #</dt>     <dd className="mono">{inv.id}</dd>
                <dt>IRN</dt>           <dd className="mono">8a3f5e6c-1a44-49b9-bb12-9fa207d2c</dd>
                <dt>Invoice date</dt>  <dd>26 May 2026</dd>
                <dt>Place of supply</dt><dd>Maharashtra (27)</dd>
                <dt>PO ref</dt>        <dd className="mono">PO-26-0418, PO-26-0421, PO-26-0425</dd>
                <dt>E-way bill</dt>    <dd className="mono">EWB-271-9482</dd>
              </dl>
              <dl className="ka-kv">
                <dt>Bill from</dt>     <dd>Bharat Steel Co.<br/><span style={{ font: "500 11px/1.4 var(--font-mono)", color: "var(--fg-3)" }}>Plot 14, MIDC Bhosari, Pune 411026</span></dd>
                <dt>Bill to</dt>       <dd>{BUYER_ORG.name}<br/><span style={{ font: "500 11px/1.4 var(--font-mono)", color: "var(--fg-3)" }}>{BUYER_ORG.branch} · {BUYER_ORG.state}</span></dd>
                <dt>Ship to</dt>       <dd>Same as bill to</dd>
                <dt>Payment terms</dt> <dd>Net 30 days · TDS @ 2%</dd>
              </dl>
            </div>
          </Card>

          {/* Compliance side card */}
          <Card title="Compliance checks" meta="Auto"
                action={<Badge kind="ok" dot>5 of 6 pass</Badge>}>
            {[
              { lbl: "GSTIN active on portal",       state: "ok"   },
              { lbl: "IRN signed by NIC IRP",        state: "ok"   },
              { lbl: "HSN codes valid",              state: "ok"   },
              { lbl: "Place of supply consistent",   state: "ok"   },
              { lbl: "Vendor not on TDS-exempt list",state: "ok"   },
              { lbl: "E-way bill linked &amp; live", state: "warn", note: "in-transit · 62%" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0",
                                    borderBottom: i < 5 ? "1px solid var(--border-subtle)" : "none" }}>
                <Icon name={c.state === "ok" ? "check-c" : c.state === "warn" ? "alert" : "x-c"} size={16}
                  stroke={2} />
                <span style={{ flex: 1, font: "500 12.5px/1.3 var(--font-sans)" }} dangerouslySetInnerHTML={{ __html: c.lbl }}/>
                {c.note && <span className="ka-mono" style={{ color: "var(--fg-3)", fontSize: 11 }}>{c.note}</span>}
              </div>
            ))}
          </Card>
        </div>

        {/* Line items */}
        <Card title="Line items" meta={`${INV_LINES.length} items · auto-parsed from GST e-invoice payload`}
              action={<button className="ka-btn ka-btn-outline ka-btn-sm"><Icon name="split" size={12}/> Match to POs</button>}>
          <table className="ka-tbl compact">
            <thead><tr>
              <th>#</th><th>Item</th><th>Description</th><th>HSN</th><th className="num">GST %</th>
              <th className="num">Qty</th><th className="num">Rate</th><th className="num">Taxable</th><th className="num">Tax</th><th className="num">Total</th>
            </tr></thead>
            <tbody>
              {INV_LINES.map((l, i) => {
                const taxable = l.qty * l.rate;
                const tax = Math.round(taxable * l.gst / 100);
                return (
                  <tr key={i}>
                    <td>{l.sr}</td>
                    <td style={{ fontWeight: 600 }}>{l.item}</td>
                    <td style={{ color: "var(--fg-2)" }}>{l.desc}</td>
                    <td className="ka-mono">{l.hsn}</td>
                    <td className="num">{l.gst}%</td>
                    <td className="num">{fmtN(l.qty)}</td>
                    <td className="num">{fmtAmt(l.rate)}</td>
                    <td className="num">{fmtAmt(taxable)}</td>
                    <td className="num">{fmtAmt(tax)}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{fmtAmt(taxable + tax)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: "var(--bg-canvas)" }}>
                <td colSpan={5} style={{ padding: "10px 12px", font: "600 11px/1 var(--font-sans)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-3)" }}>Totals</td>
                <td className="num" style={{ padding: "10px 12px", fontWeight: 600 }}>—</td>
                <td className="num" style={{ padding: "10px 12px" }}>—</td>
                <td className="num" style={{ padding: "10px 12px", fontWeight: 600 }}>{fmtAmt(lineTotal)}</td>
                <td className="num" style={{ padding: "10px 12px", fontWeight: 600 }}>{fmtAmt(gst)}</td>
                <td className="num" style={{ padding: "10px 12px", fontWeight: 700 }}>{fmtAmt(lineTotal + gst)}</td>
              </tr>
            </tfoot>
          </table>
        </Card>
      </main>
    </div>
  );
}


/* ────────────────────────────────────────────────────────────────────────
   06 · PO ↔ Invoice match · side-by-side
   ──────────────────────────────────────────────────────────────────────── */
function ScreenPOMatch() {
  // Match guesses per line:
  //   pp = exact PO+inv match
  //   warn = qty/rate diff
  //   none = unmatched (no PO link)
  // 7 invoice lines but only 6 PO lines (line 7 freight is unmatched)
  const links = ["ok","ok","warn","ok","ok","warn","none"]; // by inv-line index
  return (
    <div className="ka ka-app">
      <AppTopbar role="Purchase" roleStyle="purchase" initials="RK"/>
      <Sidebar active="po-match"/>
      <main className="ka-canvas">
        <PageHead
          crumbs={["AP", "Match", "PO ↔ Invoice"]}
          title="PO ↔ Invoice match"
          sub="Per vendor GSTIN, Kraya places your open PO line items beside the line items pulled from the vendor's e-invoice. The matcher pre-links what it can; you confirm or correct."
          actions={
            <>
              <button className="ka-btn ka-btn-outline"><Icon name="list" size={13}/> View as table</button>
              <button className="ka-btn ka-btn-outline"><Icon name="refresh" size={13}/> Re-run match</button>
              <button className="ka-btn ka-btn-primary"><Icon name="check" size={13}/> Confirm &amp; send to GRN</button>
            </>
          }
        />

        {/* Vendor strip */}
        <div className="ka-vendor-strip">
          <span className="ka-av" style={{ width: 38, height: 38, fontSize: 13, background: "var(--kraya-ink)", color: "white" }}>BS</span>
          <div>
            <div className="name">Bharat Steel Co.</div>
            <div className="gst">GSTIN 27AABCB2891C1ZP · Pune, Maharashtra</div>
          </div>
          <div className="summary">
            <div className="item"><span className="k">Open POs</span><span className="v">3</span></div>
            <div className="item"><span className="k">PO value</span><span className="v">₹ 14,28,400</span></div>
            <div className="item"><span className="k">Invoice</span><span className="v ka-mono">INV-2026-00428</span></div>
            <div className="item"><span className="k">Invoice value</span><span className="v">₹ 12,48,400</span></div>
            <div className="item"><span className="k">Auto-match</span><span className="v" style={{ color: "var(--ap-ok)" }}>4 / 6 lines</span></div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div className="ka-pills">
            <div className="ka-pill active">Only this invoice</div>
            <div className="ka-pill">All open POs · this vendor</div>
            <div className="ka-pill">Show closed POs</div>
          </div>
          <div className="ka-hint">
            <Icon name="info" size={13}/>
            Drag a PO row onto an invoice row to link manually · click the spine arrow to break a link
          </div>
        </div>

        {/* Side-by-side match grid */}
        <div className="ka-match-grid">
          {/* LEFT — Pending PO lines */}
          <div className="ka-match-col left">
            <div className="ka-col-h">
              <span className="ttl">Pending PO line items <span style={{ color: "var(--fg-3)", marginLeft: 6, fontWeight: 500 }}>· 6 open</span></span>
              <span className="src-tag api" style={{ background: "var(--bg-subtle)", color: "var(--fg-2)" }}><Icon name="doc" size={10} stroke={2.2}/> Kraya PO ledger</span>
            </div>
            <table className="ka-tbl compact">
              <thead><tr>
                <th>#</th><th>PO</th><th>Item</th><th>HSN</th>
                <th className="num">GST</th><th className="num">Qty</th><th className="num">Rate</th>
              </tr></thead>
              <tbody>
                {PO_LINES.map((p, i) => (
                  <tr key={i}>
                    <td>{p.sr}</td>
                    <td className="ka-mono">{p.po}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.item}</div>
                      <div className="sub">{p.desc}</div>
                    </td>
                    <td className="ka-mono">{p.hsn}</td>
                    <td className="num">{p.gst}%</td>
                    <td className="num">{fmtN(p.qty)} <span style={{ color: "var(--fg-3)" }}>{p.uom}</span></td>
                    <td className="num">{fmtAmt(p.rate)}</td>
                  </tr>
                ))}
                <tr style={{ background: "var(--bg-canvas)" }}>
                  <td colSpan={7} style={{ textAlign: "center", color: "var(--fg-3)", font: "500 11px/1.3 var(--font-mono)", padding: "14px 12px" }}>
                    — no unmatched PO lines remain for this vendor —
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* MIDDLE — link spine */}
          <div className="ka-match-spine">
            <div className="spine-h"/>
            {links.map((s, i) => (
              <div key={i} className={`link ${s === "ok" ? "" : s === "warn" ? "warn" : s === "bad" ? "bad" : "none"}`}>
                {s === "ok"   && <Icon name="arrow" size={14} stroke={2}/>}
                {s === "warn" && <Icon name="alert" size={14} stroke={2}/>}
                {s === "none" && <span style={{ font: "600 9px/1 var(--font-mono)", color: "var(--fg-3)" }}>NEW</span>}
              </div>
            ))}
            <div style={{ background: "var(--bg-canvas)", padding: "12px 6px", borderTop: "1px solid var(--border-subtle)" }}></div>
          </div>

          {/* RIGHT — Invoice lines */}
          <div className="ka-match-col right">
            <div className="ka-col-h">
              <span className="ttl">E-invoice line items <span style={{ color: "var(--fg-3)", marginLeft: 6, fontWeight: 500 }}>· INV-2026-00428</span></span>
              <SourceTag source="api"/>
            </div>
            <table className="ka-tbl compact">
              <thead><tr>
                <th>#</th><th>Inv</th><th>Item</th><th>HSN</th>
                <th className="num">GST</th><th className="num">Qty</th><th className="num">Rate</th>
              </tr></thead>
              <tbody>
                {INV_LINES.map((l, i) => {
                  const state = links[i];
                  const rowCls = state === "warn" ? "row-warn" : state === "none" ? "row-bad" : "";
                  const po = PO_LINES[i];
                  const qtyDiff = po ? l.qty - po.qty : 0;
                  const rateDiff = po ? l.rate - po.rate : 0;
                  return (
                    <tr key={i} className={rowCls}>
                      <td>{l.sr}</td>
                      <td className="ka-mono">{l.inv.replace("INV-", "")}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{l.item}</div>
                        <div className="sub">{l.desc}</div>
                      </td>
                      <td className="ka-mono">{l.hsn}</td>
                      <td className="num">{l.gst}%</td>
                      <td className="num">
                        {fmtN(l.qty)}
                        {qtyDiff !== 0 && <div><Diff kind="warn">{qtyDiff > 0 ? "+" : ""}{qtyDiff}</Diff></div>}
                      </td>
                      <td className="num">
                        {fmtAmt(l.rate)}
                        {rateDiff !== 0 && <div><Diff kind="warn">{rateDiff > 0 ? "+" : ""}{fmtAmt(rateDiff)}</Diff></div>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginTop: 18 }}>
          <Card noBody>
            <div style={{ padding: "14px 18px" }}>
              <div style={{ font: "500 10px/1 var(--font-sans)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 6 }}>Exact match</div>
              <div style={{ font: "700 22px/1 var(--font-sans)", letterSpacing: "-0.01em", color: "var(--ap-ok)" }}>4 lines</div>
            </div>
          </Card>
          <Card noBody>
            <div style={{ padding: "14px 18px" }}>
              <div style={{ font: "500 10px/1 var(--font-sans)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 6 }}>Match · qty / rate diff</div>
              <div style={{ font: "700 22px/1 var(--font-sans)", letterSpacing: "-0.01em", color: "var(--ap-warn)" }}>2 lines</div>
              <div style={{ font: "500 11px/1.4 var(--font-mono)", color: "var(--fg-3)", marginTop: 4 }}>GI Pipe rate +6, Hex Nut qty +20</div>
            </div>
          </Card>
          <Card noBody>
            <div style={{ padding: "14px 18px" }}>
              <div style={{ font: "500 10px/1 var(--font-sans)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 6 }}>Unmatched · invoice extra</div>
              <div style={{ font: "700 22px/1 var(--font-sans)", letterSpacing: "-0.01em", color: "var(--ap-bad)" }}>1 line</div>
              <div style={{ font: "500 11px/1.4 var(--font-mono)", color: "var(--fg-3)", marginTop: 4 }}>Freight ₹ 4,800 · approve as new</div>
            </div>
          </Card>
          <Card noBody style={{ background: "var(--kraya-ink)", borderColor: "var(--kraya-ink-2)", color: "white" }}>
            <div style={{ padding: "14px 18px" }}>
              <div style={{ font: "500 10px/1 var(--font-sans)", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Match confidence</div>
              <div style={{ font: "700 22px/1 var(--font-sans)", letterSpacing: "-0.01em" }}>92%</div>
              <div style={{ font: "500 11px/1.4 var(--font-mono)", color: "rgba(255,255,255,0.55)", marginTop: 4 }}>2 lines need a quick decision</div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}


/* ────────────────────────────────────────────────────────────────────────
   07 · 3-way match (PO + Invoice + GRN)
   ──────────────────────────────────────────────────────────────────────── */
function Screen3Way() {
  // We compose by item, joining PO + Invoice + GRN where they exist
  // GRN_LINES indices follow PO order; INV_LINES item-7 is the unmatched freight
  const rows = PO_LINES.map((p, i) => ({
    po: p,
    inv: INV_LINES[i] || null,
    grn: GRN_LINES[i] || null,
  }));
  // Append freight row (no PO, no GRN)
  rows.push({ po: null, inv: INV_LINES[6], grn: null });

  function cellState({ po, inv, grn }, field) {
    if (!po || !inv) return "none";
    if (field === "qty") {
      if (!grn) return "warn";
      if (inv.qty === po.qty && grn.recvQty === po.qty) return "ok";
      return inv.qty !== po.qty || grn.recvQty !== po.qty ? "warn" : "ok";
    }
    if (field === "rate") {
      return inv.rate === po.rate ? "ok" : "warn";
    }
    return "ok";
  }

  return (
    <div className="ka ka-app">
      <AppTopbar role="Accounts" roleStyle="accounts"/>
      <Sidebar active="threeway"/>
      <main className="ka-canvas">
        <PageHead
          crumbs={["AP", "Match", "3-way verification"]}
          title="3-way match · PO + Invoice + GRN"
          sub="The accounts team's verification view. Each item shows PO (purchase), Invoice (vendor) and GRN (stores receipt) side-by-side. Diffs in qty, rate, HSN and GST are flagged automatically — three matching rows turn the row green and the line is cleared for payable."
          actions={
            <>
              <button className="ka-btn ka-btn-outline"><Icon name="download" size={13}/> Audit trail</button>
              <button className="ka-btn ka-btn-outline"><Icon name="x" size={13}/> Reject invoice</button>
              <button className="ka-btn ka-btn-primary"><Icon name="wallet" size={13}/> Establish payable</button>
            </>
          }
        />

        <div className="ka-vendor-strip">
          <span className="ka-av" style={{ width: 38, height: 38, fontSize: 13, background: "var(--kraya-ink)", color: "white" }}>BS</span>
          <div>
            <div className="name">Bharat Steel Co. · INV-2026-00428</div>
            <div className="gst">GSTIN 27AABCB2891C1ZP · 3 POs · 3 GRNs · Stores cleared on 26 May</div>
          </div>
          <div className="summary">
            <div className="item"><span className="k">PO value</span><span className="v ka-mono">₹ 12,06,800</span></div>
            <div className="item"><span className="k">Invoice value</span><span className="v ka-mono">₹ 12,48,400</span></div>
            <div className="item"><span className="k">GRN value</span><span className="v ka-mono">₹ 11,99,304</span></div>
            <div className="item"><span className="k">Payable (post-diff)</span><span className="v" style={{ color: "var(--kraya-red)" }}>₹ 12,15,600</span></div>
          </div>
        </div>

        {/* Triple column body */}
        <div className="ka-tri">
          <div className="ka-tri-col">
            <div className="ka-col-h">
              <span className="ttl">Purchase Order</span>
              <span className="src-tag" style={{ background: "var(--bg-subtle)", color: "var(--fg-2)", padding: "3px 8px", borderRadius: 4, font: "600 9.5px/1 var(--font-sans)", letterSpacing: "0.04em" }}><Icon name="doc" size={10} stroke={2.2}/> PO ledger</span>
            </div>
          </div>
          <div className="ka-tri-col">
            <div className="ka-col-h">
              <span className="ttl">E-invoice (vendor)</span>
              <SourceTag source="api"/>
            </div>
          </div>
          <div className="ka-tri-col">
            <div className="ka-col-h">
              <span className="ttl">GRN (stores)</span>
              <span className="src-tag" style={{ background: "var(--ap-info-bg)", color: "var(--ap-info)", padding: "3px 8px", borderRadius: 4, font: "600 9.5px/1 var(--font-sans)", letterSpacing: "0.04em" }}><Icon name="warehouse" size={10} stroke={2.2}/> Stores entry</span>
            </div>
          </div>
        </div>

        {/* Item rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          {rows.map((r, i) => {
            const overall =
              (!r.po || !r.inv || !r.grn) ? "warn" :
              (r.inv.qty === r.po.qty && r.grn.recvQty === r.po.qty && r.inv.rate === r.po.rate) ? "ok" : "warn";
            const bgFor = overall === "ok"   ? "rgba(46,125,91,0.04)" :
                          overall === "warn" ? "rgba(181,115,26,0.05)" :
                                                "rgba(192,57,43,0.05)";
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                                    border: "1px solid var(--border-subtle)", borderRadius: 10,
                                    overflow: "hidden", background: bgFor }}>
                {/* PO cell */}
                <div style={{ padding: "12px 14px", borderRight: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}>
                  {r.po ? (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span className="ka-mono" style={{ color: "var(--fg-3)", fontSize: 11 }}>{r.po.po}</span>
                        <span className="ka-mono" style={{ color: "var(--fg-3)", fontSize: 11 }}>HSN {r.po.hsn}</span>
                      </div>
                      <div style={{ font: "600 13px/1.3 var(--font-sans)", marginBottom: 3 }}>{r.po.item}</div>
                      <div style={{ font: "400 11px/1.3 var(--font-sans)", color: "var(--fg-3)", marginBottom: 8 }}>{r.po.desc}</div>
                      <div style={{ display: "flex", gap: 12, font: "500 12px/1 var(--font-mono)" }}>
                        <span><span style={{ color: "var(--fg-3)" }}>Qty</span> &nbsp;{fmtN(r.po.qty)} {r.po.uom}</span>
                        <span><span style={{ color: "var(--fg-3)" }}>Rate</span> &nbsp;{fmtAmt(r.po.rate)}</span>
                        <span><span style={{ color: "var(--fg-3)" }}>GST</span> &nbsp;{r.po.gst}%</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: "grid", placeItems: "center", height: "100%", padding: "20px 0",
                                  color: "var(--fg-3)", font: "500 12px/1.3 var(--font-mono)", textAlign: "center" }}>
                      — no PO line · invoice extra —
                    </div>
                  )}
                </div>

                {/* Invoice cell */}
                <div style={{ padding: "12px 14px", borderRight: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}>
                  {r.inv ? (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span className="ka-mono" style={{ color: "var(--fg-3)", fontSize: 11 }}>Inv line {r.inv.sr}</span>
                        <span className="ka-mono" style={{ color: "var(--fg-3)", fontSize: 11 }}>HSN {r.inv.hsn}</span>
                      </div>
                      <div style={{ font: "600 13px/1.3 var(--font-sans)", marginBottom: 3 }}>{r.inv.item}</div>
                      <div style={{ font: "400 11px/1.3 var(--font-sans)", color: "var(--fg-3)", marginBottom: 8 }}>{r.inv.desc}</div>
                      <div style={{ display: "flex", gap: 12, font: "500 12px/1 var(--font-mono)", flexWrap: "wrap" }}>
                        <span><span style={{ color: "var(--fg-3)" }}>Qty</span> &nbsp;{fmtN(r.inv.qty)}
                          {r.po && r.inv.qty !== r.po.qty && (
                            <span style={{ marginLeft: 5 }}><Diff kind="warn">{r.inv.qty > r.po.qty ? "+" : ""}{r.inv.qty - r.po.qty}</Diff></span>
                          )}
                        </span>
                        <span><span style={{ color: "var(--fg-3)" }}>Rate</span> &nbsp;{fmtAmt(r.inv.rate)}
                          {r.po && r.inv.rate !== r.po.rate && (
                            <span style={{ marginLeft: 5 }}><Diff kind="warn">{r.inv.rate > r.po.rate ? "+" : ""}{fmtAmt(r.inv.rate - r.po.rate)}</Diff></span>
                          )}
                        </span>
                        <span><span style={{ color: "var(--fg-3)" }}>GST</span> &nbsp;{r.inv.gst}%</span>
                      </div>
                    </>
                  ) : <div style={{ height: 80 }}/>}
                </div>

                {/* GRN cell */}
                <div style={{ padding: "12px 14px", background: "var(--bg-surface)" }}>
                  {r.grn ? (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span className="ka-mono" style={{ color: "var(--fg-3)", fontSize: 11 }}>{r.grn.grn}</span>
                        <span className="ka-mono" style={{ color: "var(--fg-3)", fontSize: 11 }}>{r.grn.date}</span>
                      </div>
                      <div style={{ font: "600 13px/1.3 var(--font-sans)", marginBottom: 3 }}>{r.grn.item}</div>
                      <div style={{ font: "400 11px/1.3 var(--font-sans)", color: "var(--fg-3)", marginBottom: 8 }}>
                        Stores remark · {r.grn.remarks}
                      </div>
                      <div style={{ display: "flex", gap: 12, font: "500 12px/1 var(--font-mono)" }}>
                        <span><span style={{ color: "var(--fg-3)" }}>Received</span> &nbsp;{fmtN(r.grn.recvQty)}
                          {r.po && r.grn.recvQty !== r.po.qty && (
                            <span style={{ marginLeft: 5 }}><Diff kind="bad">{r.grn.recvQty > r.po.qty ? "+" : ""}{r.grn.recvQty - r.po.qty}</Diff></span>
                          )}
                        </span>
                        <span style={{ marginLeft: "auto" }}>
                          {overall === "ok"   ? <Badge kind="ok"   dot>3-way OK</Badge> :
                           overall === "warn" ? <Badge kind="warn" dot>Review</Badge>  :
                                                <Badge kind="bad"  dot>Hold</Badge>}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: "grid", placeItems: "center", height: "100%", padding: "20px 0", color: "var(--fg-3)" }}>
                      <div style={{ font: "500 12px/1.3 var(--font-mono)", textAlign: "center" }}>
                        — no GRN required —<br/>
                        <span style={{ color: "var(--ap-warn)" }}>service / freight line</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Verifier signoffs */}
        <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[
            { team: "Stores",   who: "Sandeep K.",  initials: "SK", state: "ok",   note: "All GRNs recorded · 1 line short by 2 pcs (MS Angle)" },
            { team: "Purchase", who: "Rohit S.",    initials: "RS", state: "ok",   note: "Linked to PO-26-0418, 0421, 0425 · approved diffs" },
            { team: "Accounts", who: "Asha M.",     initials: "AM", state: "live", note: "Compliance checks pass · ready to release" },
          ].map((s, i) => (
            <div key={i} className="ka-card" style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="ka-av">{s.initials}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ font: "600 9.5px/1 var(--font-sans)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)" }}>{s.team} team</div>
                  <div style={{ font: "600 13px/1.2 var(--font-sans)", marginTop: 3 }}>{s.who}</div>
                </div>
                {s.state === "ok"
                  ? <Badge kind="ok" dot>Signed off</Badge>
                  : <Badge kind="brand" dot>You</Badge>}
              </div>
              <div style={{ font: "400 11.5px/1.45 var(--font-sans)", color: "var(--fg-2)", marginTop: 10 }}>{s.note}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { ScreenInvoiceDetail, ScreenPOMatch, Screen3Way });
