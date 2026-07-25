# 철학 앱 애드센스 심사 대응형 보완 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 최신 운영 버전 `philosophy-V1`을 검색·심사 가능한 고유 콘텐츠 페이지로 보완하고, 현재 심사 중인 `vokim2503.github.io` 도메인에서 발견되도록 배포한다.

**Architecture:** 기존 정적 HTML/CSS/JavaScript 룰렛은 보존한다. 심사 관련 메타데이터와 정적 설명·신뢰 콘텐츠를 `philosophy-V1/index.html`에 추가하고, 루트 내비게이션과 사이트맵에서 해당 경로를 연결한다. Node 내장 테스트 러너로 필수 요소와 기존 광고 배치 금지 규칙을 검증한다.

**Tech Stack:** HTML5, CSS3, 기존 바닐라 JavaScript, Node.js `node:test`, GitHub Pages

## Global Constraints

- 대상 운영 URL은 `https://vokim2503.github.io/philosophy-V1/`이다.
- 애드센스 게시자 ID는 `ca-pub-5598414628909120`이다.
- 기존 철학 룰렛, 고민 선택, 철학자 갤러리, 영상 연결 동작과 현재 시각 디자인을 보존한다.
- 수동 광고 컨테이너를 룰렛, 결과, 팝업 내부에 추가하지 않는다.
- 공용 정책 문서는 `/privacy.html`과 `/guide.html`을 재사용한다.
- 같은 호스트를 애드센스에 중복 등록하거나 심사를 중복 요청하지 않는다.

---

### Task 1: 철학 앱 심사 계약을 테스트로 정의

**Files:**
- Modify: `tests/adsense-review.test.js`
- Test: `tests/adsense-review.test.js`

**Interfaces:**
- Consumes: 저장소 루트의 정적 HTML과 XML 파일
- Produces: 철학 앱 메타데이터, 고유 콘텐츠, 정책 링크, 내부 링크, 사이트맵 등록을 강제하는 회귀 테스트

- [ ] **Step 1: 기존 인덱싱 테스트를 최신 요구사항으로 분리하고 실패 테스트 작성**

`philosophy-V1`은 인덱싱 대상에서 제외하고, 레거시 `philosophy`와 중첩 `philosophy-roulette` 페이지만 계속 `noindex`인지 확인한다. 다음 테스트를 추가한다.

```js
const philosophyHtml = fs.readFileSync(path.join(root, 'philosophy-V1/index.html'), 'utf8');
const sitemapXml = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');

test('current philosophy app is indexable and connected to AdSense', () => {
  assert.doesNotMatch(philosophyHtml, /noindex|nofollow/i);
  assert.match(philosophyHtml, /<meta name="robots" content="index, follow">/);
  assert.match(philosophyHtml, /<link rel="canonical" href="https:\/\/vokim2503\.github\.io\/philosophy-V1\/">/);
  assert.match(philosophyHtml, /google-adsense-account[^>]+ca-pub-5598414628909120/);
  assert.match(philosophyHtml, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-5598414628909120/);
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
  assert.match(sitemapXml, /<loc>https:\/\/vokim2503\.github\.io\/philosophy-V1\/<\/loc>/);
});
```

- [ ] **Step 2: 테스트가 요구 기능 부재로 실패하는지 확인**

Run: `node --test tests/adsense-review.test.js`

Expected: FAIL. `philosophy-V1`의 `noindex`, 누락된 애드센스 코드·설명 콘텐츠·내부 링크·사이트맵 항목을 정확히 지적해야 한다.

- [ ] **Step 3: 테스트 변경만 커밋**

```bash
git add tests/adsense-review.test.js
git commit -m "test: define philosophy AdSense review requirements"
```

### Task 2: 철학 앱 메타데이터와 게시자 콘텐츠 구현

**Files:**
- Modify: `philosophy-V1/index.html`
- Modify: `philosophy-V1/index.css`
- Test: `tests/adsense-review.test.js`

**Interfaces:**
- Consumes: 기존 `app.js`, `videos.js`, 이미지, 공용 `/privacy.html`, `/guide.html`
- Produces: 검색 가능한 철학 앱 페이지와 `philosophy-content`, `philosophy-footer` UI 섹션

- [ ] **Step 1: `<head>`의 검색·애드센스 메타데이터 구현**

기존 `noindex, nofollow`를 다음 구성으로 교체한다.

```html
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://vokim2503.github.io/philosophy-V1/">
<meta name="google-adsense-account" content="ca-pub-5598414628909120">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5598414628909120" crossorigin="anonymous"></script>
```

- [ ] **Step 2: 조작부 뒤에 정적 설명 콘텐츠 추가**

`</main>` 직전에 다음 의미 구조를 추가하되 문구를 생략하거나 동적 JavaScript로 옮기지 않는다.

```html
<section class="philosophy-content" aria-labelledby="philosophy-guide-title">
  <p class="content-kicker">행복칠TV 철학 성찰 도구</p>
  <h1 id="philosophy-guide-title">오늘의 고민을 철학자의 관점으로 다시 바라보세요</h1>
  <p>이 앱은 일상에서 마주치는 고민을 여섯 철학자의 핵심 관점과 연결해, 잠시 멈추고 생각을 정리할 수 있도록 돕습니다. 선택 결과는 정답이나 예언이 아니라 성찰을 시작하기 위한 질문입니다.</p>

  <article>
    <h2>철학 앱 이용 방법</h2>
    <ol>
      <li>현재 마음에 가장 가까운 고민 주제를 선택합니다.</li>
      <li>표시된 철학자의 문장과 해설을 천천히 읽습니다.</li>
      <li>지금 바꿀 수 있는 작은 행동 한 가지를 메모합니다.</li>
      <li>더 깊이 살펴보고 싶다면 연결된 행복칠TV 영상을 확인합니다.</li>
    </ol>
  </article>

  <article>
    <h2>여섯 철학자의 관점</h2>
    <p><strong>쇼펜하우어</strong>는 욕망과 고통의 관계를, <strong>톨스토이</strong>는 양심과 단순한 삶을, <strong>니체</strong>는 자기 극복과 가치 창조를 생각하게 합니다.</p>
    <p><strong>마르쿠스 아우렐리우스</strong>는 통제할 수 있는 일에 집중하는 태도를, <strong>플라톤</strong>은 좋은 삶과 정의를, <strong>루소</strong>는 사회와 개인의 자유를 돌아보게 합니다.</p>
  </article>

  <article>
    <h2>조언을 현실에 적용하는 방법</h2>
    <p>문장을 그대로 따르기보다 현재 상황, 관계, 책임을 함께 고려하세요. 도움이 된 부분은 구체적인 행동으로 바꾸고, 맞지 않는 부분은 다른 관점을 비교하는 출발점으로 사용하세요.</p>
  </article>

  <aside class="philosophy-notice" aria-label="이용 시 주의사항">
    <h2>이용 시 주의사항</h2>
    <p>이 서비스는 오락과 자기 성찰을 위한 정보이며 전문적인 의료·심리·법률·재정 상담을 대신하지 않습니다. 긴급하거나 중대한 문제는 관련 전문가와 기관의 도움을 받으세요.</p>
  </aside>
</section>
```

- [ ] **Step 3: 운영 정보와 공용 페이지 링크 추가**

팝업 요소 밖, 스크립트 태그 앞에 다음 푸터를 둔다.

```html
<footer class="philosophy-footer">
  <nav aria-label="철학 앱 하단 메뉴">
    <a href="../">이슈 로또 홈</a>
    <a href="../guide.html">이용 안내</a>
    <a href="../privacy.html">개인정보처리방침</a>
    <a href="https://github.com/Vokim2503" target="_blank" rel="noopener noreferrer">운영자 문의</a>
  </nav>
  <p>행복칠TV가 운영하는 철학 성찰 콘텐츠입니다.</p>
</footer>
```

- [ ] **Step 4: 기존 테마를 따르는 반응형 스타일 구현**

`index.css`에 `.philosophy-content`, `.content-kicker`, `.philosophy-content article`, `.philosophy-notice`, `.philosophy-footer` 규칙을 추가한다. 최대 폭은 기존 `.container`와 맞추고 본문 줄간격은 `1.75` 이상, 링크에는 명확한 밑줄과 `:focus-visible` 표시를 적용한다. `@media (max-width: 640px)`에서 카드 패딩을 줄이고 가로 스크롤을 만들지 않는다.

- [ ] **Step 5: 대상 테스트가 통과하는지 확인**

Run: `node --test tests/adsense-review.test.js`

Expected: 아직 루트 링크와 사이트맵 테스트만 FAIL하고 철학 페이지 관련 테스트는 PASS.

- [ ] **Step 6: 철학 앱 변경 커밋**

```bash
git add philosophy-V1/index.html philosophy-V1/index.css
git commit -m "feat: prepare philosophy app for AdSense review"
```

### Task 3: 도메인 내부 탐색과 사이트맵 연결

**Files:**
- Modify: `index.html`
- Modify: `sitemap.xml`
- Test: `tests/adsense-review.test.js`

**Interfaces:**
- Consumes: 공개 경로 `/philosophy-V1/`
- Produces: 루트 내비게이션 링크와 Google 크롤러용 사이트맵 URL

- [ ] **Step 1: 루트 상단 내비게이션에 철학 앱 링크 추가**

`index.html`의 `.site-nav` 안에 다음 링크를 추가한다.

```html
<a href="philosophy-V1/">철학 앱</a>
```

- [ ] **Step 2: 루트 하단 메뉴에도 철학 앱 링크 추가**

`site-footer`의 내비게이션에 같은 상대 URL을 사용하는 링크를 추가해 모바일과 페이지 하단에서도 발견할 수 있게 한다.

```html
<a href="philosophy-V1/">철학 앱</a>
```

- [ ] **Step 3: 사이트맵에 철학 앱 등록**

`sitemap.xml`의 `urlset` 안에 다음 항목을 추가한다.

```xml
<url>
  <loc>https://vokim2503.github.io/philosophy-V1/</loc>
  <lastmod>2026-07-26</lastmod>
</url>
```

- [ ] **Step 4: 심사 테스트 전체 통과 확인**

Run: `node --test tests/adsense-review.test.js`

Expected: PASS, 0 failures.

- [ ] **Step 5: 탐색 변경 커밋**

```bash
git add index.html sitemap.xml
git commit -m "feat: expose philosophy app to site review"
```

### Task 4: 전체 회귀 검증과 공개 배포

**Files:**
- Verify: `index.html`
- Verify: `philosophy-V1/index.html`
- Verify: `philosophy-V1/index.css`
- Verify: `sitemap.xml`
- Verify: `tests/*.test.js`

**Interfaces:**
- Consumes: Tasks 1–3의 커밋
- Produces: GitHub Pages에 배포된 철학 앱과 검증 증거

- [ ] **Step 1: 전체 자동화 테스트 실행**

Run: `node --test tests/*.test.js`

Expected: 모든 테스트 PASS, 0 failures.

- [ ] **Step 2: 정적 변경과 저장소 상태 확인**

Run: `git diff --check && git status --short`

Expected: 공백 오류 없음. 계획된 변경이 모두 커밋되어 status 출력이 비어 있음.

- [ ] **Step 3: 기본 브랜치를 원격에 배포**

Run: `git push origin main`

Expected: 원격 `main`이 최신 커밋으로 갱신되고 GitHub Pages 배포가 시작됨.

- [ ] **Step 4: GitHub Pages 배포 성공 확인**

Run: `gh run list --workflow pages-build-deployment --limit 1`

Expected: 최신 실행 상태가 `completed`이고 결론이 `success`.

- [ ] **Step 5: 공개 철학 앱을 브라우저로 검증**

`https://vokim2503.github.io/philosophy-V1/`을 열어 다음을 확인한다.

- 기존 철학자 갤러리와 고민 선택 콤보박스가 동작한다.
- 설명 콘텐츠, 면책 안내, 개인정보·이용 안내·로또 홈 링크가 표시된다.
- 페이지 DOM에 canonical과 애드센스 게시자 코드가 있다.
- 모바일 폭에서 새 콘텐츠가 가로로 넘치지 않는다.

- [ ] **Step 6: 애드센스 상태 확인**

애드센스 사이트 화면에서 `vokim2503.github.io`가 계속 `준비 중` 및 `리뷰가 요청됨`인지 읽기 전용으로 확인한다. 별도 사이트 추가나 재요청은 하지 않는다.
