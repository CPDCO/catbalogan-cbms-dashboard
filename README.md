# Catbalogan City Planning Data Portal

Static web portal for the City Planning and Development Coordinator's Office (CPDCO),
Catbalogan City, Samar. It wraps the office's Tableau Public dashboards in a shell that
reuses the dashboards' own visual language — orange header band, Tableau 10 accent colors,
white cards on a light blue-grey panel.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Landing page: population overview embed + module grid |
| `dashboard.html` | CBMS dashboard embed + Firebase view counter |
| `sdg.html` | SDG indicators embed |
| `burodcast.html` | BurodCast embed |
| `cso.html` | CSO directory embed + source disclaimer banner |
| `maps.html` | Land use and hazard map embed; `?view=HazardMap` switches views |
| `about.html` | CPDCO logo, mandate, data sources, legal basis, privacy, contact |

## Embedded workbooks

| Page | Tableau view |
|---|---|
| `index.html` | `CatbaloganCityPSAPopulationTrend/PopulationOverview` |
| `dashboard.html` | `CatbaloganCityCBMS-Portal/Demography` |
| `burodcast.html` | `BurodCast/BurodCast` |
| `sdg.html` | `CatbaloganCitySDG/SDGIndicators` |
| `cso.html` | `CSODashboard/CatbaloganCityCivilSocietyOrganizationsDirectory` |
| `maps.html` | `CatbaloganCityMaps/CityLandUse` |
| `maps.html?view=HazardMap` | `CatbaloganCityMaps/HazardMap` |

`dashboard.html` redirects `?view=BurodCast` to `burodcast.html`, for bookmarks made while
BurodCast was still a view of the CBMS workbook.

Every embed is built at runtime with `?:embed=y&:showVizHome=no&:device=…`. The device is
always named explicitly — `phone` for a phone user agent or a viewport under 600px, and
`desktop` otherwise. Leaving `:device` off makes Tableau size off the iframe, which served
the phone layout to desktop browsers. Share-link parameters such as `:redirect=auth` and
`:origin=viz_share_link` are deliberately not used.

## Stack

Plain HTML, one stylesheet, one small JS file. No build step, no framework, no package
manager, and no web fonts — the interface is set in Segoe UI. Design tokens live at the top of `assets/css/style.css` and were sampled from a
published CBMS dashboard so the portal and the embeds share one palette.

## Deploying

GitHub Pages from `main`. Push and the site updates.

## Before going live

- [ ] Add `assets/img/og-image.png` — social preview, 1200×630
- [ ] Fill in the telephone and email rows in the Contact section of `about.html`
- [ ] Confirm the Firestore document `dashboard_stats/cbms` exists with a numeric `views` field

## Notes

- The Firebase config in `dashboard.html` is a public web API key, which is expected to ship
  in client code. Access is controlled by Firestore security rules, not by hiding the key.
- Embed pages have no sidebar by design — Tableau supplies its own internal navigation.
- No emoji appear anywhere in the interface; module cards are typographic only.
- `assets/img/seal.png` is the city seal extracted at 512px from the official CPDC logo
  artwork in `assets/img/cpdc-logo.jpg`. It appears in the page header, matching the
  dashboards. The browser tab icon is `assets/img/favicon.png`, a 128px circle-masked
  reduction of the CPDCO logo.
- `:embed=y` hides Tableau's own tab strip, so any workbook with more than one view the
  public needs (currently only the maps) gets a portal-level switcher and a `?view=`
  parameter. One workbook per page otherwise.
