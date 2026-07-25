# 철학 앱 GitHub 기록 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 철학 앱 애드센스 심사 대응형 보완과 배포 결과를 저장소 README와 CHANGELOG에 정확히 기록한다.

**Architecture:** 앱 코드는 변경하지 않고 `README.md`의 현재 앱 상태와 실행 링크를 갱신하며, `CHANGELOG.md`에 2026년 7월 26일 작업 내역과 검증 증거를 추가한다. 문서 정합성과 기존 앱 회귀 테스트를 확인한 뒤 `main`에 푸시한다.

**Tech Stack:** Markdown, Git, Node.js `node:test`

## Global Constraints

- 앱 HTML, CSS, JavaScript와 애드센스 설정은 변경하지 않는다.
- 심사 상태는 `준비 중 / 리뷰가 요청됨`으로 기록하고 승인 완료라고 표현하지 않는다.
- 배포 커밋은 `6bdd30f`, GitHub Pages 실행은 `30176894568`로 기록한다.

---

### Task 1: README와 CHANGELOG 갱신

**Files:**
- Modify: `README.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: 운영 URL `https://vokim2503.github.io/philosophy-V1/`, 검증된 배포 정보
- Produces: GitHub 방문자가 읽을 수 있는 최신 앱 현황과 날짜별 변경 기록

- [ ] **Step 1: README의 철학 앱 상태를 현재 운영 상태로 교체**

앱 바로가기 표의 실행 열을 다음 링크로 변경한다.

```markdown
[Philosophy Roulette 실행](https://vokim2503.github.io/philosophy-V1/)
```

Philosophy Roulette 설명에서 “심사 중 메인 탐색에서 임시 분리” 문구를 제거하고 다음 내용을 기록한다.

```markdown
`philosophy-V1`은 현재 공개 중인 최신 운영 버전입니다. 검색 허용, 애드센스 게시자 코드, 고유 설명 콘텐츠, 이용 안내·개인정보·운영자 링크, 로또 메인 연결과 사이트맵 등록을 완료했습니다. 같은 도메인의 애드센스 상태는 **준비 중 / 리뷰가 요청됨**이며, 승인 결과를 기다리고 있습니다.
```

- [ ] **Step 2: CHANGELOG에 철학 앱 심사 대응 항목 추가**

기존 QR 복원 항목 아래에 다음 기록을 추가한다.

```markdown
## 2026-07-26 — 철학 앱 애드센스 심사 대응

- 현재 공개 버전 `philosophy-V1`을 최신 운영 대상으로 확인
- `noindex, nofollow`를 제거하고 검색 허용 및 canonical URL 적용
- 애드센스 게시자 `ca-pub-5598414628909120` 연결 코드 적용
- 앱 이용 방법, 여섯 철학자의 관점, 현실 적용 방법과 전문 상담 면책 안내 추가
- 개인정보처리방침, 이용 안내, 운영자 문의와 로또 메인 이동 링크 추가
- 로또 메인 상·하단 메뉴와 `sitemap.xml`에서 철학 앱을 발견할 수 있도록 연결
- 기존 철학 룰렛 선택과 결과·영상 연결 기능 유지 확인
- 전체 자동화 테스트 14개 통과
- 배포 커밋 `6bdd30f`, GitHub Pages 실행 `30176894568` 성공
- 애드센스는 같은 도메인에서 `준비 중 / 리뷰가 요청됨` 상태로 계속 심사 중
```

- [ ] **Step 3: 문서 정합성과 변경 범위 확인**

Run: `rg -n "임시 분리|Philosophy Roulette 실행|준비 중 / 리뷰가 요청됨|6bdd30f|30176894568" README.md CHANGELOG.md && git diff --check && git diff --name-only`

Expected: 과거 “임시 분리” 문구는 없고 새 링크·상태·배포 식별자가 표시된다. 변경 파일은 `README.md`, `CHANGELOG.md`뿐이다.

- [ ] **Step 4: 전체 회귀 테스트 실행**

Run: `node --test tests/*.test.js`

Expected: 14 tests PASS, 0 failures.

- [ ] **Step 5: 문서 변경 커밋**

```bash
git add README.md CHANGELOG.md
git commit -m "docs: record philosophy AdSense deployment"
```

### Task 2: GitHub 기록 게시

**Files:**
- Verify: `README.md`
- Verify: `CHANGELOG.md`

**Interfaces:**
- Consumes: Task 1의 문서 커밋
- Produces: GitHub `main`에서 공개되는 최신 기록

- [ ] **Step 1: 커밋과 작업 트리 최종 확인**

Run: `git status --short && git log -3 --oneline`

Expected: 작업 트리가 깨끗하고 최신 커밋이 `docs: record philosophy AdSense deployment`이다.

- [ ] **Step 2: 원격 main에 푸시**

Run: `git push origin main`

Expected: 원격 `main`이 문서 커밋으로 갱신된다.

- [ ] **Step 3: GitHub 원격 파일 확인**

Run: `gh api repos/Vokim2503/vokim2503.github.io/contents/README.md?ref=main --jq .sha && gh api repos/Vokim2503/vokim2503.github.io/contents/CHANGELOG.md?ref=main --jq .sha`

Expected: 두 파일의 원격 blob SHA가 출력되고 최신 `main`에서 접근 가능하다.
