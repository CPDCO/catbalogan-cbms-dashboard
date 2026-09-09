# Catbalogan City Planning Data Portal
## Build context — VSCode

---

## What we are building

A static city planning web portal for the **City Planning and Development Coordinator's Office (CPDCO), Catbalogan City, Samar**. The portal is a thin wrapper website whose primary job is to **surface Tableau Public dashboards** inside a consistent government-branded shell. Its interface deliberately mirrors the dashboards' own visual language so the portal and the embeds read as one product. Every chrome decision should ask: does this help the user get to the dashboard faster?

---

## Core principle

The dashboard IS the product. The portal chrome — nav, footer — exists only to orient the user and provide consistent branding. Keep it minimal and fast, and keep it visually continuous with the dashboards. No sidebars on dashboard pages — Tableau already provides all navigation internally.

---

## Stack

| Layer | Tool | Notes |
|---|---|---|
| Markup | HTML5 | One `.html` file per page |
| Styling | Custom CSS | Design tokens in `style.css` |
| Scripting | Vanilla JS | No framework |
| Hosting | GitHub Pages | Push to `main` → live |
| Embeds | Tableau Public iframes | Phone detection + URL params |
| Visitor counter | Firebase Firestore | Already integrated in `dashboard.html` |

---

## File structure

```
catbalogan-portal/
│
├── index.html              ← Homepage / portal landing
├── dashboard.html          ← CBMS Tableau embed + view counter
├── sdg.html                ← SDG indicators embed
├── cso.html                ← CSO directory embed
├── maps.html               ← Spatial maps embed
├── about.html              ← CPDCO mandate & contact
│
├── assets/
│   ├── css/
│   │   └── style.css       ← Design tokens + shared rules
│   ├── js/
│   │   └── main.js         ← Nav active state
│   └── img/
│       ├── seal.png        ← City seal, extracted from the CPDC logo artwork
│       ├── cpdc-logo.jpg   ← CPDCO office logo (about page)
│       ├── favicon.png     ← Browser tab icon, 128px from the CPDCO logo
│       └── og-image.png    ← Social preview (1200×630)
│
└── README.md
```

**Removed from original plan:**
- `projects.html` — project monitoring removed from scope

---

## Design system

### Color tokens

```css
:root {
  /* Dashboard header */
  --head-orange:    #ffa95a;   /* header band */
  --pill:           #d66b00;   /* nav pill, other pages */
  --pill-hover:     #bf5f00;
  --pill-current:   #fbe3c8;   /* nav pill, current page */

  /* Tableau 10 accents — the same series colors the dashboards use */
  --tab-blue:       #4e79a7;
  --tab-orange:     #f28e2b;
  --tab-red:        #e15759;
  --tab-teal:       #76b7b2;
  --tab-green:      #59a14f;
  --tab-yellow:     #edc948;
  --tab-purple:     #b07aa1;
  --tab-blue-pale:  #c4e1f6;
  --tab-orange-pale:#fdcf87;

  /* Surfaces */
  --bg:             #f7f9fc;
  --panel:          #eceff5;   /* panel behind card groups */
  --surface:        #ffffff;
  --border:         #dde3ec;

  /* Text */
  --text:           #222b36;
  --text-muted:     #5b6879;
  --text-dim:       #8fa0b5;

  /* Status */
  --stat-good:      #59a14f;
  --stat-warn:      #ff5500;

  --radius:         8px;
  --shadow:         0 1px 3px rgba(30,50,80,.10);
}
```

All values above were sampled directly from the published CBMS dashboard, so the portal
chrome and the embedded viz share one palette.

### Typography

Segoe UI, no web font. It ships with Windows, which is what the office runs, so there is no
Google Fonts request and nothing external to fail.

```css
body        { font-family: 'Segoe UI', 'Segoe UI Variable', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 14px; color: var(--text); margin: 0; }
code, .mono { font-family: 'Cascadia Code', Consolas, monospace; font-size: 12px; }
```

### Interface rules

```
NO:  navy chrome — the dashboards are orange-and-blue, the portal follows
NO:  gradient fills
NO:  heavy borders around cards; use the soft shadow instead
YES: orange header band with the seal, page title, subtitle, and navigation
YES: nav items as plain text, filled rounded rectangle on hover and for the current page
YES: white cards, 8px radius, 0 1px 3px rgba(30,50,80,.10) shadow
YES: Tableau blue #4e79a7 for card and section titles, orange #f28e2b for
     group headings and the "Open →" affordance
YES: 8px base spacing unit, multiples of 8
YES: full-bleed iframe with minimal surrounding chrome
```

---

## Shared components

### Header band — background: `--head-orange`

The header carries identity only: seal, page title, subtitle. Navigation moved out of it into
its own bar (below), so the band is kept short to protect iframe height on embed pages.

```html
<header class="site-head">
  <a class="head-brand" href="index.html">
    <img class="head-seal" src="assets/img/seal.png" width="46" height="46" alt="Catbalogan City seal">
    <div>
      <h1 class="head-title">Catbalogan City Planning Data Portal</h1>
      <p class="head-sub">City Planning and Development Coordinator's Office &middot; Catbalogan City, Samar</p>
    </div>
  </a>
</header>
```

### Navigation — right side of the header band

Navigation sits inside the orange header, not in a band of its own. Items are plain text at
rest; hover and the current page each fill a rounded rectangle behind the item.

```html
<nav class="head-nav">
  <a href="index.html"     class="nav-pill">Home</a>
  <a href="dashboard.html" class="nav-pill">CBMS Dashboard</a>
  <a href="sdg.html"       class="nav-pill">SDG Indicators</a>
  <a href="cso.html"       class="nav-pill">CSO Directory</a>
  <a href="maps.html"      class="nav-pill">Maps</a>
  <a href="about.html"     class="nav-pill">About</a>
</nav>
```

| Token | Value | Use |
|---|---|---|
| `--nav-text` | `#4a2f10` | item text at rest, on the orange band |
| `--nav-hover` | `#e07f1f` | hover fill, white text |
| `--nav-active` | `#d66b00` | current page fill, white text, faint white border |

No item carries a resting fill — only hover and the current page are filled.

Active state — `main.js` matches on the last path segment so it works at the GitHub Pages
root, where `/` serves `index.html`:

```js
var here = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-pill').forEach(function (pill) {
  var target = pill.getAttribute('href').split(/[?#]/)[0];
  if (target === here) pill.classList.add('active');
});
```

### Footer — light, `--surface` with a top rule

Dark chrome would fight the orange header, so the footer is white with a 1px top border and
muted text. The Firebase view counter occupies the left slot on `dashboard.html`; other pages
put the office name there.

```html
<footer class="site-footer">
  <span id="visitor-count" class="footer-views">Loading views...</span>
  <div class="footer-links">
    <a href="about.html#sources">Data sources</a>
    <a href="about.html#contact">Contact CPDCO</a>
    <a href="about.html#privacy">Privacy</a>
  </div>
</footer>
```

---

## Page specifications

### `index.html` — Portal homepage

**Purpose:** orient the user and route them to the right dashboard. Not a marketing page. Direct and functional.

**Layout:**
```
HEADER BAND  (orange, seal + title + nav pills)
───────────────────────────────────────
HOME EMBED  (620px, population overview viz)
───────────────────────────────────────
PANEL  (--panel background)
  "City Data Modules"  (orange section title)
  MODULE GRID  (white cards)
───────────────────────────────────────
FOOTER
```

The landing page embeds the PSA population overview at a fixed 620px height and the page
scrolls; it is not a full-viewport embed, because the module grid below it is the page's
routing job. There is no KPI strip — headline figures belong to the sector dashboards that
own them, not to the portal.

**Module cards — white, 8px radius, soft shadow, 5px left rule in module color:**
```
┌──────────────────────────┐
▌  [icon]                  │  ← 5px left border in module color
▌                          │
▌  Title        (blue)     │
▌  One-line description    │
▌                          │
▌  [tag]            Open → │
└──────────────────────────┘
```

| # | Title | Left rule | Source tag | Link |
|---|---|---|---|---|
| 1 | CBMS Dashboard | `#4e79a7` | PSA · CBMS 2024 | dashboard.html |
| 2 | SDG Indicators | `#b07aa1` | CBMS SDG Tables | sdg.html |
| 3 | CSO Directory | `#59a14f` | CPDCO records | cso.html |
| 4 | Spatial Maps | `#76b7b2` | CLUP · CDRA | maps.html |
| 5 | BurodCast | `#e15759` | CPDCO · CBMS | dashboard.html?view=BurodCast |

No icons and no emoji — the title carries the card. The sixth "future module" placeholder was
removed; the grid simply ends after five cards.

```html
<!-- Module card pattern -->
<a href="dashboard.html" class="module-card" style="border-top-color:#1e4d7b;">
  <div class="module-icon">📊</div>
  <div class="module-title">CBMS Dashboard</div>
  <div class="module-desc">
    Explore 2022 and 2024 household data across all CDP sectors.
  </div>
  <div class="module-footer">
    <span class="module-tag">PSA · CBMS 2024</span>
    <span class="module-open">Open →</span>
  </div>
</a>
```

```css
.module-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--color-border);
  padding: 1px;
}
.module-card {
  background: var(--color-surface);
  padding: 20px;
  border-top: 3px solid var(--color-border);
  text-decoration: none;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: background .1s;
}
.module-card:hover    { background: var(--color-bg); }
.module-icon          { font-size: 22px; margin-bottom: 4px; }
.module-title         { font-size: 14px; font-weight: 600; }
.module-desc          { font-size: 12px; color: var(--color-text-muted);
                        line-height: 1.5; flex: 1; }
.module-footer        { display: flex; align-items: center;
                        justify-content: space-between; margin-top: 8px; }
.module-tag           { font-size: 10px; background: var(--color-bg);
                        border: 1px solid var(--color-border);
                        padding: 2px 7px; color: var(--color-text-dim); }
.module-open          { font-size: 12px; color: var(--color-orange);
                        font-weight: 500; }
.module-card.planned  { border-style: dashed; opacity: .5;
                        pointer-events: none; }
```

---

### `dashboard.html` — CBMS Dashboard

**Status: already partially built and hosted on GitHub Pages.**

Layout: nav + full-bleed iframe + footer. No sidebar — Tableau provides all internal navigation.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CBMS Dashboard — Catbalogan City Planning</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body style="margin:0; display:flex; flex-direction:column; height:100vh; overflow:hidden;">

  <!-- Shared nav -->
  <nav class="site-nav">...</nav>

  <!-- Full-bleed iframe -->
  <div id="vizContainer" style="flex:1; min-height:0;"></div>

  <!-- Footer with visitor counter -->
  <footer class="site-footer">
    <span id="visitor-count" class="footer-views">Loading views...</span>
    <div class="footer-links">
      <a href="about.html#sources">Data sources</a>
      <a href="about.html#contact">Contact CPDCO</a>
    </div>
  </footer>

  <!-- Iframe builder — phone detection preserved from original -->
  <script>
    (function buildViz() {
      const baseUrl =
        "https://public.tableau.com/views/CatbaloganCityCBMS/Demography";
      const isPhone =
        window.innerWidth < 600 ||
        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      const src = baseUrl
        + "?:embed=y"
        + "&:showVizHome=no"
        + (isPhone ? "&:device=phone" : "");
      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "width:100%; height:100%; max-width:1400px;" +
        "margin:0 auto; border:none; display:block;";
      iframe.setAttribute("src", src);
      document.getElementById("vizContainer").appendChild(iframe);
    })();
  </script>

  <!-- Firebase visitor counter — unchanged from original -->
  <script type="module">
    import { initializeApp }
      from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
    import { getFirestore, doc, getDoc, updateDoc, increment }
      from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyDF-eGFewM9QYBbvx2t7tTsV3VlTwhAqNs",
      authDomain: "cpdco-dashboard.firebaseapp.com",
      projectId: "cpdco-dashboard",
      storageBucket: "cpdco-dashboard.firebasestorage.app",
      messagingSenderId: "1071975859817",
      appId: "1:1071975859817:web:dd1ad31fa011938d8b04f8"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const docRef = doc(db, "dashboard_stats", "cbms");
    const hasVisited = localStorage.getItem("cbms_visited");

    async function updateCounter() {
      if (!hasVisited) {
        await updateDoc(docRef, { views: increment(1) });
        localStorage.setItem("cbms_visited", "true");
      }
      const snap = await getDoc(docRef);
      document.getElementById("visitor-count").innerText =
        "Total views: " + snap.data().views.toLocaleString();
    }
    updateCounter();
  </script>

  <script src="assets/js/main.js"></script>
</body>
</html>
```

**Key decisions preserved from original:**
- Phone detection via `window.innerWidth < 600` and user agent
- `max-width: 1400px` centering on the iframe
- Firebase Firestore visitor counter (one count per device via localStorage)
- `?:embed=y&:showVizHome=no` Tableau parameters

---

### `cso.html` — CSO Directory

**Dashboard title:** `Catbalogan City Civil Society Organizations Directory`
**Dashboard subtitle:** `Registered, recognized, and accredited CSOs · Governed by RA 7160 and DILG MC 2022-083 · Accreditation valid for 3 years`

Layout: nav + source disclaimer banner + full-bleed iframe + footer. No sidebar.

**Source disclaimer banner:**
```html
<div class="source-banner">
  ⚠ CSO data is from CPDCO administrative records under RA 7160 and
  DILG MC 2022-083 — not from the PSA Community-Based Monitoring System.
  Last updated: 2024.
</div>
```

```css
.source-banner {
  background: #fef3e2;
  border-bottom: 1px solid #f6c675;
  padding: 7px 16px;
  font-size: 11px;
  color: #7a4f00;
  flex-shrink: 0;
}
```

**Tableau workbook:** `CSODashboard` — separate from the CBMS workbook.
View: `CatbaloganCityCivilSocietyOrganizationsDirectory`
Base URL: `https://public.tableau.com/views/CSODashboard/CatbaloganCityCivilSocietyOrganizationsDirectory`

Share-link params (`:language`, `:sid`, `:redirect`, `:display_count`, `:origin`) are dropped for the embed — use only the embed params below.

Same phone detection and iframe pattern as `dashboard.html`.

---

### `maps.html` — Spatial Maps

Embed page with a portal-level view switcher. `:embed=y` hides Tableau's own tab strip, so
the two views are exposed as switcher tabs backed by a `?view=` parameter.

**Tableau workbook:** `CatbaloganCityMaps`

| Tab | View | URL |
|---|---|---|
| Land Use (default) | `CityLandUse` | `maps.html` |
| Hazard | `HazardMap` | `maps.html?view=HazardMap` |

Hazard layers are attributed to the city's Climate and Disaster Risk Assessment (CDRA), not
to an office.

---

### `about.html` — About CPDCO

Static page, no iframe. Content:
- CPDCO mandate under RA 7160
- Office contact and address
- Data sources and citations with links
- Legal basis: RA 7160 · DILG MC 2022-083 · PSA CBMS · DILG RaPIDS

---

## Tableau embed URL parameters

| Parameter | Value | Effect |
|---|---|---|
| `:embed` | `y` | Hides Tableau chrome |
| `:showVizHome` | `no` | Removes "View on Tableau Public" bar |
| `:device` | `phone` or `desktop` | Always set explicitly; omitting it let Tableau size off the iframe and serve the phone layout to desktop browsers |

Pattern used across all embed pages:
```js
var isPhone =
  /Android|iPhone|iPod|IEMobile|Windows Phone/i.test(navigator.userAgent) ||
  window.innerWidth < 600;
var src = baseUrl
  + "?:embed=y"
  + "&:showVizHome=no"
  + "&:device=" + (isPhone ? "phone" : "desktop");
```

---

## Tableau workbooks

| Workbook | Tableau name | View | Notes |
|---|---|---|---|
| Home embed | `CatbaloganCityPSAPopulationTrend` | `PopulationOverview` | PSA population trend, embedded on the landing page |
| CBMS Dashboard | `CatbaloganCityCBMS-Portal` | `Demography` | Portal copy of the CBMS workbook; replaces the original `CatbaloganCityCBMS` |
| BurodCast | `CatbaloganCityCBMS` | `BurodCast` | Still the original workbook — confirm whether it also exists in the portal copy |
| SDG Indicators | `CatbaloganCitySDG` | `SDGIndicators` | Own page, `sdg.html` |
| CSO Directory | `CSODashboard` | `CatbaloganCityCivilSocietyOrganizationsDirectory` | Separate workbook, TopoJSON base layer |
| Spatial Maps | `CatbaloganCityMaps` | `CityLandUse`, `HazardMap` | Two views, one page, portal-level switcher |

---|---|---|---|
| CBMS Dashboard | `CatbaloganCityCBMS` | ✅ Live | View: `Demography`; already embedded at current GitHub Pages URL |
| CSO Directory | `CSODashboard` | ✅ Live | View: `CatbaloganCityCivilSocietyOrganizationsDirectory`; separate workbook, TopoJSON base layer |
| BurodCast | `CatbaloganCityCBMS` | ✅ Live | View: `BurodCast`; same workbook as the CBMS dashboard, reached via `dashboard.html?view=BurodCast` |
| Spatial Maps | `CatbaloganCityMaps` | ✅ Live | View: `HazardMap`; land use is a second tab inside the same workbook |
| SDG Tracker | `CatbaloganCityCBMS` | ⚠ URL needed | The dashboard has an SDG Indicators view; its share link has not been supplied, so the module still points at the default view |

---

## GitHub Pages — current hosting

The CBMS dashboard is already live. The portal wraps around it.

Current `dashboard.html` hosts at the root of the GitHub Pages site. When the portal is built:
1. Move or rename the current file to `dashboard.html` inside the portal folder
2. Add the shared nav and footer around the existing iframe + Firebase code
3. All other pages follow the same nav + content + footer shell

---

## Build order

All pages are built. Current state:

| # | File | State |
|---|---|---|
| 1 | `assets/css/style.css` | Tokens sampled from the dashboards; header, pills, cards, switcher, responsive |
| 2 | `index.html` | Population overview embed + five module cards |
| 3 | `dashboard.html` | Portal CBMS workbook + BurodCast via `?view=`, Firebase counter |
| 4 | `sdg.html` | SDG indicators embed |
| 5 | `cso.html` | CSO embed with source disclaimer banner |
| 6 | `maps.html` | Land use / hazard embed with view switcher |
| 7 | `about.html` | CPDCO logo, mandate, sources, legal basis, privacy, contact |
| 8 | `assets/js/main.js` | Nav active state only |

Outstanding: `og-image.png`, the telephone and email rows in `about.html`, and confirmation
of which workbook BurodCast should come from.

---

## Design decisions log

| Decision | Rationale |
|---|---|
| No sidebar on dashboard pages | Tableau already has full internal navigation — a sidebar would duplicate it and steal iframe width |
| Firebase counter stays in footer | It was already in the original code; moving it to the footer puts it in the shared shell |
| Projects & plans removed | Out of scope for this build |
| Phone detection preserved | Original code already handles this correctly — do not remove |
| `:device` always named | Auto-detection served the phone layout to desktop browsers; the branch now sets `desktop` explicitly instead of omitting the parameter |
| Tab icon is the CPDCO logo, header keeps the city seal | The office owns the site; the header still matches the dashboards |
| `max-width: 1400px` on iframe | Prevents the embed from stretching past the Tableau dashboard's designed max width |
| Interface matched to the dashboards | The flat navy shell read as a separate product bolted on top of the viz; the portal now uses the dashboard's own orange header, pill nav, Tableau 10 accents, and white rounded cards, so the chrome and the embed are visually continuous |
| Palette sampled, not guessed | Colors were read pixel-by-pixel from a published dashboard screenshot rather than approximated |
| Soft shadow allowed | Overrides the earlier no-shadow rule — the dashboards use raised white cards, and flat bordered cards next to them looked like a different site |
| Current nav pill is the pale one | Same convention as the dashboards, where the active view's button is cream and the rest are solid orange |
| Light footer | Dark chrome fought the orange header band |
| Navigation stays in the header band | A separate bar was tried and reverted; it cost iframe height on every embed page for no gain |
| Nav items unfilled at rest | Only hover and the current page are filled, so the bar does not read as six competing buttons |
| Segoe UI, no web font | System font on the office's machines; removes the Google Fonts request entirely |
| "About", not "About CPDCO" | The office is already named in the header subtitle |
| BurodCast via `?view=` | Same workbook as the CBMS dashboard, so one page handles both views instead of duplicating the embed and counter code |
| KPI strip dropped | Headline figures belong to the sector dashboard that owns them; hardcoding them on the landing page also meant silent staleness on every republish |
| Home embeds the population overview | Gives the landing page live content without duplicating figures, and the module grid below keeps the routing job |
| No emoji anywhere | Government tool — icons were decorative and read as informal |
| Future-module placeholder removed | An empty dashed card advertised absence; the grid ends after the real modules |
| Seal taken from the CPDC logo | The official logo carries the city seal at usable resolution, so the screenshot crop was replaced |
| Portal-level view switcher | `:embed=y` hides Tableau's tab strip, so multi-view workbooks need the portal to expose the views |
| CDRA, not the DRRM office | Hazard layers are cited to the assessment, not to an office |
| No hero image | The dashboards ARE the product; a landing image delays getting there |
