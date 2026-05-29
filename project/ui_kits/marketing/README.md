# Kraya — Marketing UI Kit

Single-file recreation of the `kraya.io` marketing site, expressed as canonical HTML + the project's `colors_and_type.css`. Sections covered, top-to-bottom:

1. **Top nav** — sticky, translucent, blur-on-scroll
2. **Hero** — display headline with red-highlight word, lede, dual CTA, trust strip, illustration slot
3. **Features grid** — six capability cards (Approval Workflow, Vendor Management, Sourcing, Integrations, Collaboration, Cost Control)
4. **Dark split section** — *"Why senior management choose Kraya"* with bullet list + illustration slot
5. **Cream strip** — *"Why vendors choose Kraya"* mirrored layout
6. **FAQ** — accordion (`<details>` with custom +/− marker)
7. **Footer** — dark, four-column with logo, links, contact

## What's faked

- **Hero & section illustrations** are placeholder slots. The real site uses 3D-rendered procurement scenes (`why-choose-us.png`, `why-choose-us-2.png`, etc.). Drop those into `assets/` and swap the placeholders.
- **Trust-logo strip** uses plain wordmarks — real logos should be sourced and copied in if Kraya wants to display customer logos.
- **No real product copy below the fold** beyond what's lifted from `kraya.io`. Sub-pages (Audit, Company, Careers) are not built.

## How to extend

- Each section is `<section class="…">` + `<div class="container">` — copy a section block to add new content using the same vertical-rhythm tokens.
- Buttons: `.btn.btn-primary` / `.btn-outline` / `.btn-ghost` — already in `colors_and_type.css`'s spirit.
- Headlines use `.eyebrow` (small red kicker) + h1/h2/h3 from the global stylesheet.

This file is intentionally a **single HTML** — no React build required. Splitting into JSX components is the next iteration if the user wants a real codebase.
