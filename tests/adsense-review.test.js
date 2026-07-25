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

test('QR checker is substantive publisher content and contains no ad placement', () => {
  const qrCard = indexHtml.match(/<section class="qr-check-card"[\s\S]*?<\/section>/);
  const qrModal = indexHtml.match(/<div id="qr-modal"[\s\S]*?<\/div>\s*<\/div>/);

  assert.ok(qrCard, 'QR explanation card must be published');
  assert.match(qrCard[0], /카메라 또는 저장된 사진/);
  assert.match(qrCard[0], /브라우저 안에서만/);
  assert.doesNotMatch(qrCard[0], /adsbygoogle|ad-placeholder|ad-slot/i);

  assert.ok(qrModal, 'QR dialog must be published');
  assert.match(qrModal[0], /동행복권 공식 결과/);
  assert.doesNotMatch(qrModal[0], /adsbygoogle|ad-placeholder|ad-slot/i);
});

test('static card and comparison logic use completed round 1234', () => {
  assert.match(indexHtml, /제1234회 당첨번호/);
  assert.match(indexHtml, /2026년 7월 25일 추첨/);
  assert.match(indexHtml, /당첨번호 1, 15, 19, 31, 35, 43, 보너스 27/);
  assert.match(indexHtml, />1234회와 비교</);
  assert.match(
    mainJs,
    /round:\s*1234,\s*date:\s*'2026-07-25',\s*numbers:\s*\[1, 15, 19, 31, 35, 43\],\s*bonus:\s*27/
  );
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
    /<a class="home-return-button" href="\.\.\/">← 이슈 로또로 돌아가기<\/a>/
  );
});
