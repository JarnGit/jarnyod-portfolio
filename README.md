# FOTO Studio — website

Static, bilingual (English / Lao) one-page site. No build step — upload the whole `website` folder to any web host.

```
website/
├── index.html                 page content (EN + Lao copy side by side)
├── site.webmanifest
├── assets/
│   ├── css/styles.css         design system + layout (tokens at the top)
│   ├── js/main.js             language switch, menu, animations, form
│   ├── img/
│   │   ├── brand/             official logo files (from "foto logo.ai"), favicons, social image
│   │   ├── work/              portfolio images  ← add yours
│   │   └── studio/            founder portrait  ← add yours
│   └── video/                 showreel          ← add yours
└── _backup/                   the previous version of index.html
```

## Add your photos and showreel

Drop files at these exact paths — the branded placeholder disappears automatically when a file exists.

| Slot | File |
|---|---|
| Hero showreel (muted loop, ~10–30 s, 1920×820 or 1920×1080, under ~8 MB) | `assets/video/showreel.mp4` |
| Tigerhead Drinking Water | `assets/img/work/tigerhead.jpg` |
| Second Sun | `assets/img/work/second-sun.jpg` |
| AGL — Cover Plus+ | `assets/img/work/agl-cover-plus.jpg` |
| Lao Telecom booths | `assets/img/work/lao-telecom-booth.jpg` |
| KhemBan Café | `assets/img/work/khemban-cafe.jpg` |
| Laos from Above (wide) | `assets/img/work/laos-from-above.jpg` |
| Founder portrait (vertical 4:5) | `assets/img/studio/founder.jpg` |

JPGs around 2000 px wide at quality ~80 keep the page fast. To change a project, edit its `<article class="work-item">` block in `index.html`.

## Contact form

By default the form opens the visitor's email app with the inquiry addressed to **info@jarnyod.com**.
To receive inquiries directly instead, create a free form endpoint (e.g. Formspree) and paste its URL into
`data-endpoint=""` on the `<form id="inquiry">` tag.

## Still to fill in

- **Social links** — in the Contact section, replace `href="#"` with your Facebook / Instagram / TikTok / YouTube URLs. Icons with `#` stay hidden.
- **Domain** — when the site is live, uncomment the `canonical` / `og:url` lines in `<head>` and make the `og:image` and JSON-LD `logo`/`image` URLs absolute (`https://your-domain/…`).
- **FOTO Studio email** — the site uses info@jarnyod.com; search-and-replace it if you set up a FOTO Studio address.
- **Stats** (8+ years, 500+ shoots, 120+ clients, 40 TB) — carried over from the previous site; update if needed.
- **Testimonials / client logos** — removed until real ones are available.

## Editing text

Every visible string has an English and a Lao version:

```html
<span lang="en">Start a project</span><span lang="lo">ເລີ່ມໂປຣເຈັກ</span>
```

The EN / ລາວ switch remembers the visitor's choice. Link straight to Lao with `index.html?lang=lo`.

## Brand rules used

- Colours: Ink `#000000`, Paper `#FFFFFF`, Mist `#CCCCCC`, Graphite `#666666`, Signal `#CC6633` (accent only, ~5% of a view).
- Type: Poppins + Noto Sans Lao (Google Fonts).
- Logo: vector paths exported unchanged from the official `foto logo.ai`. The navigation uses the FOTO / STUDIO lockup without the small descriptor line (unreadable at nav size); the footer uses the full lockup; the favicon uses the app-icon artboard.
