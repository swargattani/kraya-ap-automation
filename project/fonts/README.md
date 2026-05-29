# Fonts

This system uses two Google-Fonts families, loaded via CDN import in `colors_and_type.css`:

- **DM Sans** — display + UI (weights 400, 500, 600, 700)
- **IBM Plex Mono** — numerics, codes, table cells (weights 400, 500, 600)

## ⚠️ Substitution flag

**No official typeface was provided by Kraya.** The original wordmark on `kraya.io` is a custom-feeling geometric sans (very likely a lightly-customised commercial face). DM Sans was chosen as the **nearest free Google Font match** — geometric, friendly, low-contrast, supports diacritics (important for the macron-accented wordmark), and pairs well with a procurement / B2B register.

**Action for the user:** if Kraya has a licensed brand typeface (e.g. *Manrope*, *Geist*, a custom *Kraya Sans*, a foundry face like *Söhne* or *GT Walsheim*), drop the `.woff2` files in this folder and update the `@font-face` declarations in `colors_and_type.css`. The rest of the system will pick it up automatically.

## Why no local woff2 files

The sandbox couldn't reach `fonts.gstatic.com` to bundle the files at build time, so the CSS imports them from the Google Fonts CDN at runtime instead. This works for online previews but will not work offline. For an offline-capable bundle, download the woff2 files into this folder manually and switch the `@import` in `colors_and_type.css` to `@font-face` rules pointing at local paths.
