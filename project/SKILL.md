---
name: kraya-design
description: Use this skill to generate well-branded interfaces and assets for Kraya — a B2B procurement platform — either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

# Kraya Design — invocation manifest

Read `README.md` for the full system: brand context, content fundamentals, visual foundations, iconography rules, and an index of every other file.

Other useful entry points:

- `colors_and_type.css` — drop-in CSS variables for the entire token system (colors, type, spacing, radii, shadows, motion). Link this in every HTML artifact you produce.
- `assets/logo/kraya-logo-black.png` — official wordmark.
- `ui_kits/marketing/index.html` — kraya.io home-page recreation.
- `ui_kits/buyer_app/index.html` — buyer / procurement workspace (dashboard, POs, RFQs, vendors).
- `ui_kits/vendor_app/index.html` — vendor portal (open tenders, quote submission).
- `ui_kits/auctions/index.html` — **reverse auctions** module (buyer monitor, vendor floor, setup, awarded).
- `auction.css` — module-specific tokens for the auctions surface. Import *after* `colors_and_type.css`.
- `preview/*.html` — atomic design-system cards (colors, type, spacing, components, auctions). Useful as copy-paste references.

## How to work with this skill

If creating **visual artifacts** (slides, mocks, throwaway prototypes), copy the relevant assets into your output folder, link `colors_and_type.css`, and assemble static HTML files for the user to view. Lift component patterns from the UI-kit `index.html` files — they are intentionally readable, single-file recreations rather than a build-system codebase.

If working on **production code**, treat this folder as a design source-of-truth: lift the CSS variables wholesale, point at the asset paths, and use the UI-kit HTML as a structural reference for what each surface should look like.

If the user invokes this skill **without any other guidance**, ask them what they want to build or design, ask 4–10 focused questions (audience, surface, fidelity, what to vary, what to keep), and act as an expert designer who outputs HTML artifacts *or* production code, depending on the need.

## Hard rules

- **No emoji.** Anywhere in the Kraya brand. Use Lucide icons instead.
- **No bluish-purple gradients**, no neon glow, no left-border-accent cards, no auto-generated illustration.
- Brand color is **Kraya red `#D8261C`** — used flatly, never as a gradient stop.
- Headlines are **Title Case**, body is **sentence case**, no exclamation marks.
- Kraya is referred to **by name** (third person), not "we".
- Currency examples use **₹ (INR)** and Indian-comma formatting (`14,82,500`, not `1,482,500`).
- Numerics, POs, SKUs, codes → **IBM Plex Mono**. Everything else → **DM Sans**.

Read `README.md` for the rest.
