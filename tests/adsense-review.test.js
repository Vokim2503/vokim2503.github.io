const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const mainJs = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const philosophyHtml = fs.readFileSync(path.join(root, 'philosophy-V1/index.html'), 'utf8');
const sitemapXml = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');

test('publisher information remains outside the stage-only screens', () => {
  const stageZeroStart = indexHtml.indexOf('<section id="stage-0"');
  const stageZeroEnd = indexHtml.indexOf('<section id="stage-2"');
  const stageThreeStart = indexHtml.indexOf('<section id="stage-3"');
  const serviceInfo = indexHtml.indexOf('<div id="service-info"');

  assert.ok(stageZeroStart >= 0, 'stage-0 must exist');
  assert.ok(stageZeroEnd > stageZeroStart, 'stage-2 must follow stage-0');
  assert.ok(serviceInfo > stageZeroStart, 'service-info must exist after stage-0 starts');
  assert.ok(serviceInfo > stageThreeStart, 'service-info must follow the interactive stages');
  const beforeServiceInfo = indexHtml.slice(stageZeroStart, serviceInfo);
  const openedSections = (beforeServiceInfo.match(/<section\b/g) || []).length;
  const closedSections = (beforeServiceInfo.match(/<\/section>/g) || []).length;
  assert.equal(openedSections, closedSections, 'stage-0 must close before service-info begins');
});

test('stage changes return the viewport to the active screen', () => {
  const goToStage = mainJs.match(/function goToStage\([\s\S]*?\n    }/);
  assert.ok(goToStage, 'goToStage must exist');
  assert.match(goToStage[0], /window\.scrollTo\(0, 0\)/);
});

test('page contains no manual AdSense ad containers', () => {
  assert.doesNotMatch(indexHtml, /<ins[^>]+adsbygoogle/i);
  assert.doesNotMatch(indexHtml, /class=["'][^"']*ad-slot/i);
});

test('no lottery-, gambling-, or real-draw-related content remains on the site', () => {
  assert.doesNotMatch(indexHtml, /로또|복권|당첨|동행복권/);
  assert.doesNotMatch(mainJs, /로또|복권|당첨|동행복권/);
});

test('no QR ticket-scanning feature remains', () => {
  assert.doesNotMatch(indexHtml, /qr-check-card|qr-modal|btn-open-qr/);
  assert.doesNotMatch(mainJs, /qrCore|LottoQrCore|qr-modal/);
});

test('legacy and nested philosophy pages remain excluded from indexing', () => {
  const nonCanonicalPages = [
    'philosophy/index.html',
    'philosophy/philosophy-roulette/index.html',
    'philosophy-V1/philosophy-roulette/index.html',
  ];

  for (const relativePath of nonCanonicalPages) {
    const html = fs.readFileSync(path.join(root, relativePath), 'utf8');
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
  }
});

test('current philosophy app is indexable and connected to AdSense', () => {
  assert.doesNotMatch(philosophyHtml, /noindex|nofollow/i);
  assert.match(philosophyHtml, /<meta name="robots" content="index, follow">/);
  assert.match(
    philosophyHtml,
    /<link rel="canonical" href="https:\/\/vokim2503\.github\.io\/philosophy-V1\/">/
  );
  assert.match(philosophyHtml, /google-adsense-account[^>]+ca-pub-5598414628909120/);
  assert.match(
    philosophyHtml,
    /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-5598414628909120/
  );
  assert.doesNotMatch(philosophyHtml, /<ins[^>]+adsbygoogle/i);
});

test('current philosophy app publishes substantive and trustworthy content', () => {
  assert.match(philosophyHtml, /철학 앱 이용 방법/);
  assert.match(philosophyHtml, /여섯 철학자/);
  assert.match(philosophyHtml, /전문적인 의료·심리·법률·재정 상담을 대신하지 않습니다/);
  assert.match(philosophyHtml, /href="\.\.\/privacy\.html"/);
  assert.match(philosophyHtml, /href="\.\.\/guide\.html"/);
  assert.match(philosophyHtml, /href="\.\.\/"/);
});

test('root page and sitemap expose the current philosophy app', () => {
  assert.match(indexHtml, /href="philosophy-V1\/"/);
  assert.match(
    sitemapXml,
    /<loc>https:\/\/vokim2503\.github\.io\/philosophy-V1\/<\/loc>/
  );
});

test('philosophy app exposes a prominent home link before its interactive content', () => {
  const mainStart = philosophyHtml.indexOf('<main class="container">');
  const topNav = philosophyHtml.indexOf('<nav class="philosophy-top-nav"');
  const gallery = philosophyHtml.indexOf('<div class="philosopher-gallery-3d">');
  const footer = philosophyHtml.indexOf('<footer class="philosophy-footer">');

  assert.ok(mainStart >= 0, 'philosophy main must exist');
  assert.ok(topNav > mainStart && topNav < gallery, 'home link must appear before the gallery');
  assert.ok(footer > topNav, 'footer fallback link must remain after the top link');
  assert.match(
    philosophyHtml.slice(topNav, gallery),
    /<a class="home-return-button" href="\.\.\/">← 이슈 넘버로 돌아가기<\/a>/
  );
  assert.match(
    philosophyHtml,
    /<link rel="stylesheet" href="index\.css\?v=e32e74b">/,
    'the page must request the stylesheet version containing the prominent button styles'
  );
});
