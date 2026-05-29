# Kraya Design System

> Design system, brand guidelines, and UI kits for **Kraya** — a B2B procurement platform.

---

## About Kraya

**Kraya** (Sanskrit: *to buy*, often written **krayaḥ** with macron diacritics — reflected in the wordmark) is an end-to-end procurement platform that streamlines sourcing, vendor management, and spend control for medium and large enterprises. The product is built by **Kraya Concepts Private Limited**, based in India.

**Tagline / promise**
> *Change the way you procure. Streamline your procurements with Kraya.*

**Audience**
- **Buyers / Companies** — purchase, finance, and operations teams who run procurement (their senior management is the primary economic buyer).
- **Vendors / Suppliers** — including OEM vendors and distributors, who quote on tenders and fulfill orders.
- **Auditors / Compliance** — internal and external audit teams.

**Product surfaces**
1. **Marketing website** — `kraya.io`. Lead generation, product education, demo requests.
2. **Buyer / Company app** — procurement workflows, vendor management, sourcing automation, dashboards, audit.
3. **Vendor app** — quoting, order management, accessibility to tenders, growth tooling.

**Capability pillars** (lifted from product copy)
- Custom Approval Workflows
- Compliance Driven Vendor Management
- Smart Sourcing Automation (auctions, e-sourcing, spend analysis)
- Advanced ERP / Integration Capabilities
- Enhanced Collaboration Tools (logistics, supply-chain finance, secure data sharing)
- Cost Control & Budget Management

---

## Sources used to build this system

| Source | URL / Path | Notes |
|---|---|---|
| Black wordmark | `uploads/kraya-logo-black-r.png` (264×90 PNG, transparent) | Provided directly by user. Reproduced in `assets/logo/`. |
| Marketing site (home) | https://www.kraya.io/ | Fetched via web; copy + structure extracted. |
| Marketing site (company) | https://www.kraya.io/company | Three pillars: Vendor Relationship, Savings, Workflow Speed. |
| Marketing site (vendors) | https://www.kraya.io/vendors | Pillars: Support, Accessibility, Growth. |
| Footer note | © Kraya Concepts Private Limited | Indian entity. |

> No codebase, Figma, or production screenshots were provided. The visual system here is **inferred from the wordmark and marketing copy** and is intentionally a *plausible, opinionated* take — not a pixel-perfect recreation of the existing product UI. Iterate with real product source for the next pass.

---

## Index — what's in this folder

| Path | What it is |
|---|---|
| `README.md` | This file. Brand context + Content Fundamentals + Visual Foundations + Iconography. |
| `SKILL.md` | Agent Skills manifest — entry point when this folder is imported as a Skill. |
| `colors_and_type.css` | Canonical CSS variables: colors, type, spacing, radii, shadow, motion. **Link this in every HTML artifact.** |
| `assets/logo/kraya-logo-black.png` | Official wordmark (264×90 PNG, transparent). |
| `fonts/README.md` | Notes on the DM Sans + IBM Plex Mono Google-Fonts substitution. |
| `preview/*.html` | 18 atomic design-system cards rendered in the **Design System** tab — colors, type, spacing, components, brand voice. |
| `ui_kits/marketing/` | Single-file recreation of the `kraya.io` marketing site. |
| `ui_kits/buyer_app/` | Buyer / procurement workspace (Dashboard · POs · RFQs · Vendors). |
| `ui_kits/vendor_app/` | Vendor portal (Open tenders · Quote submission). |
| `ui_kits/auctions/` | **Reverse auctions** module (Buyer monitor · Vendor floor · Setup · Awarded). |
| `auction.css` | Module-specific tokens & utility classes for the auctions surface. |

### Quick start — building a new artifact

```html
<link rel="stylesheet" href="path/to/colors_and_type.css" />
<body class="kraya">
  <h1>Change the way you procure</h1>
  <a class="btn btn-primary">Get Started</a>
</body>
```

The `.kraya` body class wires up the canvas color, base type, and the global `h1/h2/h3/p/.kraya-eyebrow/.kraya-mono` helpers.

---

## CONTENT FUNDAMENTALS

How Kraya talks. Pulled from observed marketing copy.

### Voice
Confident, outcome-driven, and faintly aspirational — Kraya sells **change** ("Change the way you procure", "Transform your procurements"). It speaks to senior management and operators, not end-consumers, so the register is **business-pragmatic**: efficiency, compliance, savings, control. There is mild marketing flourish ("Unlock your purchase department's potential") but no slang, no jokes, no exclamation marks.

### Person & address
- **Second person** for the reader. "*You procure*", "*your procurement process*", "*your business*".
- **First person plural is rare** — Kraya is referred to in **third person by name** ("Kraya helps you save…", "Only Kraya understands…"). This is unusual and worth preserving — it positions Kraya as a *named entity / product* rather than a generic vendor.
- **Imperatives** for CTAs: *Get Started*, *Read More*, *Request Demo*, *Boost Your Vendor Performance Today*.

### Tone rules
- **No emoji.** Anywhere. Ever.
- **No exclamation marks** in marketing copy.
- **Title Case** for headlines and most subheads (e.g. *Streamline Your Procurements with Kraya*).
- **Sentence case** for body, list items, and microcopy.
- Lists use **active verbs**: *Eliminates… Improves… Automates… Enhances…*
- Numbers and stats are **not** used as headline crutches — there are no "10x" / "94%" claims in observed copy. Avoid inventing them.

### Vocabulary
| Use | Don't use |
|---|---|
| Procurement, sourcing, vendors, suppliers | Purchasing (sometimes ok), buyers (interchangeable) |
| Workflow, lifecycle, pipeline | Funnel |
| Compliance, transparency, control | Governance |
| Spend, savings, cost control | Cheap, discount |
| Audit, integration, ERP | Plugin, hack |
| Quoting, tenders, RFx | Bid (use sparingly) |

### Casing & punctuation specifics
- **kraya** is written **lowercase** in the wordmark, but **Kraya** is correct in running prose. Don't lowercase it mid-sentence.
- The wordmark carries **macron bars** over the **k** and **y** (above the *a* sounds) — these are *typographic, not editorial*. **Never** try to render them in body copy.
- Possessive: *Kraya's* (apostrophe-s), not *Krayas'*.
- Avoid Oxford comma in marketing copy (observed copy is inconsistent; prefer no Oxford for tighter feel) but use it in technical / legal contexts.

### Sample copy (golden examples)
> *Empower your procurement process with seamless sourcing, saving time and reducing costs with Kraya's smart solutions.*

> *With unmatched features, Kraya helps you save on time, energy, and resources to streamline with higher efficiency, transparency, and cost savings at every step.*

> *Only Kraya Understands the Connection Between Efficient Procurement and Bottomline.*

### What to avoid
- AI-era buzzwords: *seamless* is borderline-overused in source copy and ok in moderation; avoid *synergize*, *unlock value*, *next-generation*, *world-class*, *AI-powered* unless the feature genuinely is.
- Casual tech voice (*"we're cooking"*, *"shipped"*). Kraya is suits-and-spreadsheets, not Twitter.

---

## VISUAL FOUNDATIONS

The visual identity is built from the **wordmark** (geometric sans, lowercase, macron diacritics) and the brand's **red signature** observed on `kraya.io`.

### Color
- **Brand red** is the single dominant accent — used for the wordmark, primary CTAs, and selective highlights. It is a confident, warm, slightly-orange red (~`#D8261C`), not a fashion fuchsia or a fire-engine red.
- **Neutrals are warm-leaning charcoals and off-whites**, not cool blue-grays. The page background is a slight cream / paper tint, not pure `#FFF`.
- **No bluish-purple gradients.** No rainbow. No multi-stop hero gradients. Color is used **flatly** with one accent + neutrals.
- Semantic colors (success / warning / danger / info) are muted, not saturated.
- See `colors_and_type.css` for the full palette + tokens.

### Typography
- **Display & UI:** `DM Sans` — geometric, friendly, low-contrast strokes that echo the wordmark's clean curves. Heavy weights (600/700) for headlines, 400/500 for body.
- **Mono / Numerics:** `IBM Plex Mono` — used for procurement numbers, SKUs, PO codes, table cells where alignment matters.
- **Body sizes:** 16px base, 1.5 line-height. Headlines run large and tight (line-height 1.05–1.15, letter-spacing −0.02em).
- **Headlines are Title Case**; body and labels are sentence case.
- No italic display type. No script fonts.

### Spacing & rhythm
- 4-px base unit. Token scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`.
- Page max-width ~1200–1280px; generous gutters on marketing, tighter on app surfaces.
- Section vertical rhythm: `96px` between marketing sections; `32–48px` between app cards.

### Backgrounds & surfaces
- **Marketing:** off-white/cream paper (`#FAF7F2`) as the canvas. Occasional dark sections (`#1A1A1A`) for emphasis. No full-bleed photography. No gradients on the body.
- **App:** neutral cream-tinted surface for the canvas, with **white cards** sitting on it. This creates the warm-paper / clean-document feeling appropriate for a procurement tool.
- A subtle **dot-grid** pattern (1px dots on a 16px grid) shows up behind hero sections and empty states — a procurement-paper / grid-paper allusion.
- Hero imagery on the site uses **3D-rendered illustration** (`why-choose-us-*.png`). Until those are provided, use placeholder slots with the dot-grid background.

### Borders, radii, shadows
- **Border radii:** components stay restrained: `4px` (inputs, small chips), `8px` (cards, buttons), `12px` (large cards, modals), `999px` (pills / circular avatars). No `24px+` blobby radii.
- **Borders:** hairline `1px solid` neutrals (`--border-subtle`, `--border-default`). Cards lean on **soft shadow** more than borders.
- **Shadow system** (4 elevations, soft & low):
  - `--shadow-1`: small, `0 1px 2px rgba(15, 12, 10, 0.06)`
  - `--shadow-2`: card, `0 4px 12px -2px rgba(15, 12, 10, 0.08)`
  - `--shadow-3`: popover, `0 12px 32px -8px rgba(15, 12, 10, 0.14)`
  - `--shadow-4`: modal, `0 32px 64px -16px rgba(15, 12, 10, 0.20)`
- **No glow.** No inner shadows except inside inputs (`inset 0 1px 0 rgba(0,0,0,0.02)`).
- Cards = `background: white`, `border-radius: 12px`, `box-shadow: var(--shadow-2)`. No left-border accent stripes (avoid that AI trope).

### Imagery vibe
- **Warm, paper-toned, slightly desaturated.** Reference 3D illustrations on the marketing site are warm-lit, soft shadows, neutral palettes with red accents.
- No black-and-white photography. No heavy grain. No duotones.
- Iconography on the marketing site uses **filled, slightly-isometric SVG icons** with red & dark fills.

### Motion
- **Fast and confident.** 150–250ms for state changes, `cubic-bezier(0.2, 0.8, 0.2, 1)` (ease-out) for entrances, linear for hover color shifts.
- **No bounce.** No rubber-banding. No spring animations on enterprise components.
- Page-section reveals on marketing: 8–16px translateY + opacity fade, 300ms.
- Loading: skeleton shimmer at 1.5s cycle, not spinners on top-level lists.

### Hover & press states
- **Buttons:**
  - Primary (red) — hover darkens ~8% and lifts shadow from `--shadow-1` → `--shadow-2`. Press flattens to `--shadow-none` + 2% darker.
  - Secondary (outline) — hover fills with `--bg-subtle`; press goes one shade deeper.
- **Links:** underline appears on hover; color stays the same.
- **Cards (clickable):** hover lifts shadow `--shadow-2` → `--shadow-3`, translateY(-2px), 200ms.
- **Icon buttons / chips:** hover background `--bg-subtle`; press `--bg-muted`.
- **Press = darken + flatten**, never grow.

### Layout rules
- **Sticky top nav on marketing**, sticky sidebar on app. No bottom-anchored navigation on web.
- **No fixed floating CTAs**. No cookie banners until needed.
- 12-column grid on marketing; flexible flex/grid on app.
- App uses a **left sidebar (240px)** + **top utility bar (56px)** layout, with the main canvas filling the rest.

### Transparency & blur
- Used **sparingly**. The top nav goes from opaque → translucent with `backdrop-filter: blur(12px)` on scroll. Modal scrims are `rgba(15, 12, 10, 0.55)` — solid feel, no blur.
- No frosted-glass cards. No blurred-color blobs behind content.

---

## ICONOGRAPHY

The Kraya marketing site uses **filled, slightly-isometric custom SVG illustrations** for the feature blocks (e.g. `images/services/sales.svg`, `loan.svg`, `finance.svg`). These are **brand illustrations**, not a UI icon set — they should appear sparingly, only as feature pillars or empty-state hero art, and ideally as the user's own brand assets when they become available.

For the **UI icon system** — sidebar, toolbar, table-row icons — Kraya does not publish a documented icon library, so this design system uses **Lucide** as the working baseline:

- **Style:** stroke-based, 1.8px / 24-box, rounded line-caps and joins.
- **Source:** [`lucide.dev`](https://lucide.dev) — load via CDN: `https://unpkg.com/lucide@latest`. SVGs may also be inlined directly.
- **Color:** icons inherit `currentColor`; default to `var(--fg-2)` for resting, `var(--kraya-red)` for the active item.
- **Size:** 16px in dense UI (table cells, menus), 20px in primary nav, 24–32px in headlines / empty states.

### ⚠️ Substitution flag

The Lucide set is a **stand-in** for whatever icon library Kraya is actually using in their app (it could be Phosphor, Iconoir, Material, Tabler, or a custom set). When the real one is identified, swap the CDN and re-check the brand-illustration SVGs in `assets/icons/`. Until then, **do not hand-roll new SVGs** — pick from Lucide instead.

### Emoji & unicode

- **Emoji are not used anywhere** in the Kraya brand. Never substitute them for icons.
- Unicode glyphs (✓ ✕ → ←) are acceptable inside controls when rendered with the brand font (e.g. checkbox check, dismiss-chip ×). Don't use them in body copy.

### Brand illustration

The marketing site's hero illustrations (`why-choose-us-*.png` on `kraya.io`) are warm-lit 3D renders with red accents — clay-shaded, neutral palette, soft global lighting. Until originals are provided, leave hero slots **empty with a dot-grid background** rather than substituting a different illustration style. Do not generate replacement illustrations with AI image tools — they will look off-brand.

### What to avoid (anti-patterns)
- Bluish-purple gradients
- Emoji used as iconography
- Left-border-accent cards
- Glowing buttons / neon shadows
- Auto-illustrated brand-art that doesn't exist in `assets/`
- Custom hand-drawn SVG icons when a CDN library would do the same job
