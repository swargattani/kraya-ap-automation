# Kraya — Buyer App UI Kit

Interactive recreation of the Kraya buyer / procurement workspace. Click any sidebar item to switch screens — the app is a single HTML file with four screens routed via JavaScript:

| Screen | What it shows |
|---|---|
| **Dashboard** | Greeting, 4 KPI stat tiles (one branded dark), spend-by-category bar chart, live activity feed, recent POs table. |
| **Purchase Orders** | Full PO table with tabs (All / Pending / Approved / In Review / Closed) and filter pills. |
| **RFQs & Auctions** | Card grid — RFQ tiles with quote count, low bid, savings %, status badge, action buttons. |
| **Vendors** | Vendor card grid — logo, GSTIN, spend YTD, on-time %, score, verification badge, category tags. |

## What's reused / componentized in spirit

- **AppShell:** `.topbar` + `.sidebar` + `.canvas`. 240 × 56 + main grid.
- **NavItem** (`.nav-item`) with active state in `--kraya-red-soft`.
- **StatCard** (`.stat`, `.stat.brand` for the dark-red feature variant).
- **Card** (`.card` + `.card-h` + `.card-b`) — standard surface treatment.
- **Table** — header is `--bg-canvas`, rows hover the same, badges inline.
- **Badge** — six variants (`b-success`, `b-warning`, `b-danger`, `b-info`, `b-neutral`, `b-brand`).
- **PillButton** — toggleable filter chip.
- **VendorCard** — head (logo+meta) → 3-up stat row → tag row.

## What's faked

- **No backend.** Data is hand-rolled. Clicks on PO rows don't open detail drawers (next iteration).
- **Chart** is a 6-bar CSS stack, not a real time-series viz.
- **Approval drawer, RFQ detail page, vendor profile, and audit trail** are not built — placeholder nav items route to Dashboard.
- **Search ⌘K** is decorative.

## What would make this a real kit (next pass)

1. Split each screen into JSX (`Dashboard.jsx`, `Orders.jsx`, `RFQ.jsx`, `Vendors.jsx`) + shared `<AppShell>`, `<StatCard>`, `<Table>`, `<Badge>` components.
2. Add a **PO detail drawer** sliding from the right with line items, approval timeline, attachments.
3. Add **RFQ detail page** with quote-comparison matrix (this is the highest-value flow per `kraya.io` copy).
4. Add an **empty state** treatment for the new-account first-run experience.

Open `ui_kits/buyer_app/index.html` directly to interact.
