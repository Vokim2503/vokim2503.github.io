# 철학 앱 로또 홈 버튼 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 철학 앱 첫 화면 상단에 로또 홈으로 돌아가는 명확한 버튼을 추가한다.

**Architecture:** 기존 정적 페이지 구조를 유지하면서 `<main>`의 첫 요소로 상단 탐색 링크를 추가한다. 기존 테마에 맞는 CSS를 추가하고 Node 정적 회귀 테스트로 위치·대상 URL·접근 가능한 이름을 보호한다.

**Tech Stack:** HTML5, CSS3, Node.js `node:test`, GitHub Pages

## Global Constraints

- 링크 문구는 `← 이슈 로또로 돌아가기`이다.
- 링크 대상은 `../`이다.
- 기존 푸터 링크와 철학 룰렛·영상·애드센스 기능은 유지한다.

---

### Task 1: 상단 홈 버튼 테스트와 구현

**Files:**
- Modify: `tests/adsense-review.test.js`
- Modify: `philosophy-V1/index.html`
- Modify: `philosophy-V1/index.css`

**Interfaces:**
- Consumes: 철학 앱의 `<main>`과 기존 루트 URL
- Produces: `.philosophy-top-nav` 및 `.home-return-button`

- [ ] **Step 1: 실패 테스트 작성**

```js
test('philosophy app exposes a prominent home link before its interactive content', () => {
  const mainStart = philosophyHtml.indexOf('<main class="container">');
  const topNav = philosophyHtml.indexOf('<nav class="philosophy-top-nav"');
  const gallery = philosophyHtml.indexOf('<div class="philosopher-gallery-3d">');
  const footer = philosophyHtml.indexOf('<footer class="philosophy-footer">');

  assert.ok(mainStart >= 0);
  assert.ok(topNav > mainStart && topNav < gallery);
  assert.ok(footer > topNav);
  assert.match(philosophyHtml.slice(topNav, gallery), /<a class="home-return-button" href="\.\.\/">← 이슈 로또로 돌아가기<\/a>/);
});
```

- [ ] **Step 2: RED 확인**

Run: `node --test tests/adsense-review.test.js`

Expected: 새 상단 탐색 요소가 없어 해당 테스트만 FAIL.

- [ ] **Step 3: 최소 HTML 구현**

`<main class="container">` 바로 뒤에 추가한다.

```html
<nav class="philosophy-top-nav" aria-label="앱 이동">
  <a class="home-return-button" href="../">← 이슈 로또로 돌아가기</a>
</nav>
```

- [ ] **Step 4: 기존 테마에 맞는 CSS 구현**

`.philosophy-top-nav`는 좌측 정렬·하단 여백을 적용하고, `.home-return-button`은 최소 높이 44px, 네온 녹색 테두리, 반투명 배경, 명확한 hover·focus-visible 상태를 갖는다. 모바일에서도 `max-width: 100%`와 `box-sizing: border-box`로 넘침을 막는다.

- [ ] **Step 5: GREEN과 전체 회귀 확인**

Run: `node --test tests/*.test.js && git diff --check`

Expected: 15 tests PASS, 0 failures, 공백 오류 없음.

- [ ] **Step 6: 커밋**

```bash
git add tests/adsense-review.test.js philosophy-V1/index.html philosophy-V1/index.css
git commit -m "fix: add philosophy home return button"
```

### Task 2: 배포와 공개 확인

**Files:**
- Verify: `philosophy-V1/index.html`
- Verify: `philosophy-V1/index.css`

**Interfaces:**
- Consumes: Task 1 커밋
- Produces: 공개 철학 앱의 상단 로또 홈 버튼

- [ ] **Step 1: 원격 main 푸시**

Run: `git push origin main`

Expected: 문서 커밋 이후 새 기능 커밋까지 원격 `main`에 반영.

- [ ] **Step 2: Pages 배포 성공 확인**

Run: `gh run list --workflow pages-build-deployment --limit 1`

Expected: 새 HEAD의 배포가 `completed / success`.

- [ ] **Step 3: 공개 화면과 이동 검증**

`https://vokim2503.github.io/philosophy-V1/`에서 상단 버튼이 보이는지 확인하고 클릭하여 `https://vokim2503.github.io/`로 이동하는지 확인한다.
