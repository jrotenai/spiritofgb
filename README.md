# Spirit of GB — Website

A redesign of [spiritofgb.co.uk](https://spiritofgb.co.uk/) — the British motorcycle
land speed record project led by Alex Macfadzean, piloted by Guy Martin, aiming to be
the first motorcycle to reach **400mph**.

## Run locally

It's a static site — no build step. Use any static server:

```bash
node server.js          # serves on http://localhost:4321
# or
python3 -m http.server 4321
```

Then open <http://localhost:4321>.

## Structure

```
index.html          # all page markup (single-page, anchored sections)
css/styles.css      # design system + layout + components
js/main.js          # nav, scroll-reveal, animated counters, record bars
assets/
  Spirit_of_GB.svg  # the brand logo (used in header + footer)
  machine.jpg       # workshop photo for "The Machine" section — ADD THIS FILE
  favicon.svg
server.js           # tiny zero-dependency static server for local preview
```

## Design notes

- **Palette:** brand navy `#0A1A3F`, flag red `#C8102E`, flag blue `#0B3D91`, white `#F4F6FB`.
- **Type:** Saira Condensed (display), Saira (headings/UI), Inter (body) — via Google Fonts.
- **Responsive:** fluid `clamp()` type scale, breakpoints at 1024 / 720 / 460px, mobile nav.
- **Accessibility:** skip link, reduced-motion support, semantic landmarks, focus states.
- **Sections:** Hero → Key figures → Mission → The Machine → The Record → Guy Martin
  → Founder → Progress timeline → Social proof → Partner/Sponsor CTA → Team → Gallery
  → Contact → Footer.
- **Gallery:** 26 tiles in a responsive grid with a dependency-free lightbox (click, arrow
  keys, Esc). Thumbnails currently use `picsum.photos` placeholder images (needs internet to
  load). Replace each `src`/`data-full` URL with the real photos when ready.
- **Social proof:** factual credibility cards + a partner logo wall. The 8 `.logo-tile`
  placeholders are slots for real sponsor logos.

### To add / replace
- **`assets/machine.jpg`** — the workshop photo for "The Machine" section. Until it exists,
  a dashed placeholder panel is shown. Landscape (~16:10) works best.
- **Contact form backend** — the enquiry form (`#contact`) currently has no server. On submit,
  JS validates and opens the visitor's email client with a pre-filled message to
  `info@spiritofgb.co.uk`. To route submissions to an inbox instead, point the `<form>` at a
  service like Formspree or Netlify Forms and remove the submit handler in `js/main.js`.
- Founder portrait placeholder if a photo of Alex becomes available.
- Partnership enquiry email `info@spiritofgb.co.uk` if a different address is preferred.

### Editorial note
Body copy deliberately avoids em-dashes (—) and mid-sentence colons; keep new copy in that
style for consistency.
