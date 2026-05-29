# Kraya — Auctions UI Kit (Reverse Auctions)

Reverse auctions are the high-stakes flow inside Kraya: a buyer publishes a starting price, multiple verified vendors compete by **bidding downward**, and the lowest bid wins. Time pressure, rank position, and anti-sniping mechanics make this distinct from the rest of the procurement product.

This kit covers the four moments that matter:

| Screen | Audience | What it shows |
|---|---|---|
| **Buyer · Monitor** | Procurement manager running the auction | Big countdown, leaderboard with full vendor identities, price-trajectory chart, live ticker, buyer controls (pause / extend / cancel). |
| **Vendor · Bid Floor** | Vendor placing competitive bids | Position ribbon (1st / 2nd / 5th), bid input with quick-bid buttons, **anonymized** competitor leaderboard, rules at a glance. |
| **Setup** | Buyer creating the auction | Item details, pricing (start / decrement / reserve), timing, rule toggles (anti-sniping, anonymization, auto-award), vendor invite chips, live preview of what vendors will see. |
| **Awarded** | Post-close summary | Winner card, final price, savings %, run-statistics, action buttons (audit trail, issue PO). |

Switch screens with the role toggle in the top right.

---

## What's in `auction.css`

Module-specific tokens layered on top of `colors_and_type.css`:

```
--auction-live      #D8261C    pulsing red dot, live status
--auction-extended  #B5731A    anti-snipe / +N min banners
--auction-closing   #C0392B    last-60s flash
--auction-awarded   #2E7D5B    done states
--rank-1/2/3-bg/fg            ranked vendor pills (red/amber/blue/neutral)
```

Plus utility classes:

- `.kx-live-dot` — animated pulsing dot for the "LIVE" indicator.
- `.kx-timer` (+ `.warn`, `.danger`) — monospace countdown with a tick animation on danger.
- `.kx-rank` (+ `.r1` `.r2` `.r3` `.you`) — 28×28 rank pill, the "you" variant inverts ink + red border.
- `.kx-bid-row` — grid template for a single leaderboard line (rank · vendor · bid · delta), with a `.you` highlight state.

These are reused across all four screens — the goal is the buyer and vendor live floors share the same visual vocabulary, only differing in **what data is shown** (named vs anonymized, full controls vs bid input).

---

## Design rationale

- **Big monospace countdown** anchors every live screen. Tabular numerics so the digits don't dance as they tick.
- **Rank as the primary signifier** — not bid amount. The vendor's "2nd" is bigger than their bid number, because position is the decision driver.
- **Live ticker** is chronological, descending — newest event at top. Anti-sniping extensions get a yellow row so they stand out from normal bids.
- **Anti-sniping** is surfaced as a banner *and* logged in the ticker — both because the moment of extension is the kind of thing vendors and buyers need to react to immediately.
- **Sealed identities on the vendor side** ("Bidder A") vs **named identities on the buyer side** (the actual vendor name) — Kraya's auction product can be either, but the default vendor experience is anonymized so vendors compete on price, not relationships.
- **Buyer controls** (pause, extend, cancel) live in a sidebar card on the monitor screen — present but not prominent, since the auction usually runs on autopilot.
- **No bouncy animations.** Pulse on the live dot, a subtle tick on the closing-state timer, a fade-in on new ticker rows. That's all the motion this surface gets.

---

## What's not built (next iterations)

- **Auction history / archive list** screen — table of past auctions for an account.
- **Vendor browse page** that lists open auctions matching a vendor's categories.
- **Sealed-bid / Dutch / Japanese variants** — this kit only covers English reverse. Each variant changes the live floor significantly.
- **Real-time engine.** All timer values and bids are static. A real implementation would need a WebSocket layer + optimistic UI for the bid input.
- **Mobile floor.** A vendor-on-the-floor mobile experience would be its own design pass — the bid input + position ribbon are the only critical elements there.
- **Notification templates** ("you've been outbid", "auction extended", "auction closing in 5 min") — design these as a follow-up.

---

## Files

```
ui_kits/auctions/
  index.html      ← single-file UI kit (4 screens via top-bar toggle)
  README.md       ← this file
```

The DS-tab atomic cards for the auction module live in `preview/auction-*.html` and are registered under the **Auctions** group. They cover: timer, status lifecycle, leaderboard rows, bid input, live ticker, price-trajectory chart, lifecycle banners, position ribbon, auction tile, and rule summary.
