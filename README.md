# Sacmar Leaf Tobacco — website

Static, dependency-free marketing site for Sacmar Leaf Tobacco (Pvt) Ltd.
No build step, no framework, no npm. Open `index.html`, or drop the folder on any host.

Layout follows the **Ecoland — Farming and Agriculture** reference: photographic
hero in a rounded panel, ember accent band, dark photo cards, pill buttons.
Palette is forest green plus the ember orange sampled from the Sacmar logo.

```
index.html            Home
about.html            Welcome message, history, vision & mission, team
products.html         The four leaf products, quality assurance
product-lamina.html      Detail page per product: specs, applications,
product-cut-rag.html     benefits, compliance, related products
product-stems.html
product-fines.html
contact.html          Contact details, enquiry form, Indonesian office
assets/css/styles.css Single stylesheet
assets/js/main.js     Scroll reveals, sticky header, mobile nav, form handling
assets/img/           Logo variants, favicons, social card
assets/img/photo/     Photography (jpg + webp of each)
```

## Running it locally

```bash
python -m http.server 8000
# http://127.0.0.1:8000
```

## Deploying

Upload as-is to Netlify, Cloudflare Pages, GitHub Pages, S3 or shared hosting.

## Content source

Copy comes from two sources, both the company's own:

1. **Sacmar Leaf Tobacco [Company Profile Booklet].pdf** and **SACMAR LEAF LETTERHEAD II.pdf**
   - welcome message, history, vision, mission, "why choose us".
2. **`Documents\secmar\website`** (the existing React site) - product specifications,
   taglines, applications, benefits, certifications, team photos and current contact
   details. The product detail pages are generated from its `productsData` object.

Where the two disagree the existing site wins, being the more recent.

Confirmed facts used throughout:

| | |
|---|---|
| Established | 2009, Harare |
| Focus | Flue-cured Virginia tobacco, Zimbabwe |
| Products | Tobacco lamina · Cut rag · Tobacco stems · Tobacco fines |
| Phone | +263 783 411 889 |
| Email | info@sacmarleaftobacco.co.zw |
| Address | Unit 12, 6 Chelmsford Road, Belgravia, Harare |
| Hours | Mon-Fri 08:00-17:00, Sat 08:00-13:00 |
| Indonesian rep | Arief Yulianto, +62 811 277 209, ariefyulianto@yahoo.co.id |
| Managing Director | Sacrifice Mariga |
| Indonesian Representative | Arief Yulianto |

## Photography

Field and team shots come from the previous site's `public` folder. Product shots
come from the SLT photo shoot (`Downloads/New folder (2)`). All re-encoded to
1100px wide, 4:3, as jpg + webp.

| File | Source | Used for |
|---|---|---|
| `hero-field` | `3.jpg` | Home hero, About/Contact headers |
| `field-rows` | `field.png` | Company history |
| `crop-rows` / `crop-sun` | `7.jpg` / `12.jpg` | Vision section, CTA backgrounds |
| `grower` | `farm8.webp` | "Quality begins at the farm", accent band |
| `prod-lamina` | SLT shoot, `25-07-26 23` | Lamina card + detail hero (red-taped bale) |
| `prod-lamina-alt` | SLT shoot, `25-07-26 20` | Lamina detail page (bale, second angle) |
| `prod-cutrag` | SLT shoot, `25-07-26 12` | Cut rag card + detail hero |
| `prod-cutrag-alt` | SLT shoot, `25-07-26 19` | Cut rag detail page (pour shot) |
| `prod-stems` | SLT shoot, `25-07-26 10` | Stems card + detail page |
| `prod-fines` | `fine.png` (previous set) | Fines card + detail page |
| `team-mariga` | `l1.jpg` | Welcome message, team |
| `team-arief` | `l3.jpeg` | Team, Indonesian office |

Each is exported as both `.jpg` and `.webp`; the markup uses `<picture>` so browsers
take the webp and fall back to jpg.

## Brand

| Token | Value | Use |
|---|---|---|
| `--g-900` / `--g-800` / `--g-700` | `#0d2416` `#123020` `#1a4429` | Dark surfaces, cards, footer |
| `--ember` | `#f0903a` | Accent, sampled from the logo |
| `--ember-ink` | `#9e5210` | Accent **for text on light backgrounds** |
| `--cream` | `#f7f4ec` | Alternate light section |

The logo ember only reaches ~2.2:1 on white, which fails WCAG AA. Use `--ember-ink`
for any accent *text* on a light background; `--ember` is for dark backgrounds,
fills and buttons. Type is Plus Jakarta Sans with a system fallback stack.

### Logo files

- `logo.webp` — the original supplied file (vein cutouts are transparent)
- `logo-light.png` — vein cutouts filled cream; **use on dark backgrounds**, else the
  veins disappear. Header and footer use this.
- `logo.png` — transparent PNG master for documents and email signatures
- `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `og-image.png` — generated

## The enquiry form

`contact.html` has no backend. Submitting composes a pre-filled email to
`info@sacmarleaftobacco.co.zw` so nothing is lost. To post it somewhere real:

```html
<form class="form" data-enquiry data-endpoint="https://formspree.io/f/XXXX" novalidate>
```

The JS then POSTs the FormData and shows a success/failure message. Works with
Formspree, Basin, Netlify Forms or your own handler.

## Editing

Header and footer are duplicated across all eight pages (the cost of no build step).
Pages are generated by `gen3.py` (kept in the session scratchpad) — edit that and re-run it
rather than hand-editing eight files. To hand-edit, search for `<nav class="nav"` and `<nav class="mobile-nav"`.

Add `class="reveal"` to any element to fade it up on scroll; `data-d="1"`–`"4"` staggers it.

## Open items

- **"Cut Rag" vs "Cut Rug".** The booklet and existing site both say *Cut Rug*; one of your
  own asset filenames says *cut-rag*. "Cut rag" is the industry term, so the site normalises
  to it everywhere. Flip it in `gen3.py` (`_norm`) if you want "Cut Rug" back.
- **Certification claims.** ISO 9001:2015, GMP, HACCP, Zimbabwe Tobacco Board and ITGA claims
  are carried over verbatim from your existing site's product pages. These carry legal weight -
  worth confirming each is current before launch.
- **Four flake shots are unused.** `SLT-01-07-26 17/18/19/20` show a pile of flat leaf
  flakes. Lamina is the red-taped bale (client-confirmed), cut rag is the shreds and
  stems are the sticks, so the flakes are either loose/threshed lamina before pressing,
  or fines. They are NOT currently used anywhere - assigning them to fines without
  confirmation would risk mislabelling a product on a trade site, and the fines spec
  says "Fine Grade (< 2mm)" while the flakes read larger than that.
- **`prod-fines` still uses the previous image** (fine powder) for the same reason.
- **Team.** Shows the two people your existing site lists - Sacrifice Mariga (MD) and Arief
  Yulianto (Indonesian Representative) - with their real photos. The booklet also named Dubre
  Muller and Lars Peeters; they are not on the current site, so they are not here either.

Regulatory note: the site is written business-to-business for unmanufactured leaf, with a
trade disclaimer in the footer. Tobacco advertising rules differ by market — have counsel
review before promoting it in any jurisdiction.
