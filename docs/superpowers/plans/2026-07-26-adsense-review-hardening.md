# AdSense Review Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep substantive publisher content visible throughout the lottery workflow and update the comparison panel to round 1234.

**Architecture:** Preserve the static HTML/CSS/JavaScript application. Move the existing service content outside the stage container so stage switching cannot hide it, and update the single round data object plus its matching static card.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, Node.js built-in test runner

## Global Constraints

- Do not add manual ad units or empty ad placeholders.
- Keep all non-primary philosophy paths `noindex, nofollow`.
- Preserve current lottery generation behavior.

---

### Task 1: Add AdSense review regression tests

**Files:**
- Create: `tests/adsense-review.test.js`
- Test: `tests/adsense-review.test.js`

- [ ] Write tests asserting persistent service content, no manual ad containers, and matching round 1234 data.
- [ ] Run `node --test tests/adsense-review.test.js` and confirm the persistent-content and round-data assertions fail.
- [ ] Commit with the implementation in Task 2 after the tests pass.

### Task 2: Make content persistent and refresh round data

**Files:**
- Modify: `index.html`
- Modify: `main.js`
- Modify: `sitemap.xml`
- Modify: `sw.js`

- [ ] Move `#service-info` outside `#stage-0` while keeping it inside `<main>`.
- [ ] Replace round 1232 data with round 1234, date `2026-07-25`, numbers `1, 15, 19, 31, 35, 43`, and bonus `27` in HTML and JavaScript.
- [ ] Update sitemap modification dates and the service-worker cache version.
- [ ] Run `node --test tests/adsense-review.test.js` and confirm all tests pass.
- [ ] Run `node --check main.js` and inspect `git diff --check`.
- [ ] Commit and push the verified change to `main`.

