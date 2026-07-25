# AdSense Review Hardening Design

## Goal

Resolve the two reported AdSense issues—ads on screens without publisher content and low-value content—without changing the lottery generator's core behavior.

## Design

- Keep the explanatory `service-info` content visible for every interactive stage instead of nesting it inside the home-only stage.
- Update the displayed comparison data to the latest completed draw, round 1234 (2026-07-25): 1, 15, 19, 31, 35, 43; bonus 27.
- Keep non-primary philosophy app paths excluded from indexing and keep the sitemap limited to the three substantive lottery pages.
- Do not add manual ad units or empty ad containers. Retain only the AdSense site-verification loader.

## Verification

- A structural test must fail if `service-info` returns inside `stage-0` or if any manual ad container is added.
- A data test must fail if the HTML and JavaScript comparison round or numbers diverge.
- Run JavaScript syntax validation and inspect all indexable HTML pages for titles, descriptions, canonical URLs, and substantive headings.

