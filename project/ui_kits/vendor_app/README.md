# Kraya — Vendor App UI Kit

The vendor-facing side of Kraya. Two screens, navigable via the sidebar:

| Screen | What it shows |
|---|---|
| **Open tenders** | KPI stats (quotes submitted, win rate, response time, active orders), tabbed filter, list of RFQ tenders with budget + status. |
| **Quote submission** | Line-item editor with totals summary, payment terms, delivery, and a sealed competing-quotes panel. |

Click any tender on the *Open tenders* screen to jump to the *Quote submission* form, or hit the **← Back to tenders** button to return.

## Components

- **Topbar** with vendor-tag badge (so the user can tell they're in the vendor portal, not buyer).
- **Sidebar** with the same NavItem treatment as the buyer app, but red badges for action counts (`12` open tenders).
- **TenderRow** — single horizontal row: icon pill, title + meta line, status badge + budget figure.
- **QuoteForm** — line-item editor with `Qty / Unit price / Lead time` columns, GST-aware running total, sealed-bid panel.

## What's faked

- No backend, no real bid mechanics, no upload field for attachments / certifications.
- Notifications, watch-list, dispatch tracking are stubbed nav items.
- The summary GST math is hand-rolled but plausible.

## Why this is smaller than the buyer kit

The marketing copy positions the vendor app around three short pillars (**Support · Accessibility · Growth**), and the visible flows are simpler: see open RFQs, submit a quote, fulfill an order. The kit covers the high-value "browse → quote" loop and leaves dispatch / financing for a later pass.
