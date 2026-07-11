# 행복칠TV 제작 앱 관리 안내판

이 저장소에는 **서로 다른 두 개의 앱**이 함께 들어 있습니다.  
아래 표에서 원하는 앱의 실행 화면이나 소스 폴더로 바로 이동할 수 있습니다.

## 먼저 확인: GitHub 저장소가 두 개입니다

| 구분 | 저장소 | 상태 |
|---|---|---|
| ✅ **현재 작업 저장소** | [`Vokim2503/vokim2503.github.io`](https://github.com/Vokim2503/vokim2503.github.io) | 2026년 7월 11일부터 진행한 최신 수정이 저장되는 곳 |
| 📦 **이전 저장소** | [`Vokim2503/First-Lotto`](https://github.com/Vokim2503/First-Lotto) | Antigravity에서 시작한 예전 기록 보관용 |

`First-Lotto`의 배포 화면에는 예전 주소인 `https://vokim2503.github.io/First-Lotto/`와 오래된 배포만 나타납니다.  
현재 앱 주소는 **https://vokim2503.github.io/** 입니다.

### v32와 v34는 무엇인가요?

`v32`, `v34`는 GitHub의 배포 번호가 아닙니다. 아이폰이 최신 파일을 받도록 `main.js?v=34`처럼 파일 주소 뒤에 붙인 **내부 캐시 버전**입니다. 따라서 GitHub의 Deployments 목록에서 `v34`라는 이름을 찾는 방식이 아닙니다.

최신 작업을 확인하려면 다음을 이용하세요.

- [사람이 읽기 쉬운 날짜별 변경 기록](./CHANGELOG.md)
- [현재 저장소의 전체 수정 기록](https://github.com/Vokim2503/vokim2503.github.io/commits/main/)
- [현재 저장소의 배포 기록](https://github.com/Vokim2503/vokim2503.github.io/deployments)

## 앱 바로가기

| 앱 | 설명 | 실행하기 | 코드 위치 |
|---|---|---|---|
| 🎱 **FirstLott** | 뉴스와 시간을 이용한 오락용 로또 번호 생성기 | [FirstLott 실행](https://vokim2503.github.io/) | [저장소 최상위 파일 보기](https://github.com/Vokim2503/vokim2503.github.io) |
| 🎡 **Philosophy Roulette** | 철학자를 선택하고 관련 콘텐츠를 보는 앱 | [Philosophy Roulette 실행](https://vokim2503.github.io/philosophy-V1/) | [현재 사용 폴더 보기](https://github.com/Vokim2503/vokim2503.github.io/tree/main/philosophy-V1) |

## 1. FirstLott

FirstLott는 별도 폴더가 아니라 **저장소의 첫 화면에 있는 파일들**로 실행됩니다.

주요 파일:

- `index.html` — FirstLott 화면 구성
- `main.js` — 번호 생성, 자동 5게임, 당첨번호 비교, QR 관련 동작
- `style.css` — FirstLott 디자인
- `sw.js` — 아이폰과 PWA 캐시 갱신
- `manifest.json` — 홈 화면 설치 정보
- `icon-192.png`, `icon-512.png` — 앱 아이콘

> FirstLott를 수정할 때는 위 파일들을 확인하면 됩니다.

## 2. Philosophy Roulette

현재 공개 중인 Philosophy Roulette의 소스는 다음 폴더에 있습니다.

➡️ [`philosophy-V1`](./philosophy-V1/)

주요 파일:

- `philosophy-V1/index.html` — 화면 구성
- `philosophy-V1/app.js` — 앱 동작
- `philosophy-V1/index.css` — 디자인
- `philosophy-V1/videos.js` — 콘텐츠 목록
- `philosophy-V1/images/` — 철학자 이미지

## 3. 이전 버전 보관함

[`philosophy`](./philosophy/) 폴더는 Philosophy Roulette의 **이전 버전**입니다.  
현재 공개 앱을 수정할 때는 이 폴더가 아니라 `philosophy-V1`을 사용해야 합니다.

`index_v1_backup.html`, `index_v1_backup.css`도 FirstLott의 이전 백업 파일입니다.

## 최근 변경내용 확인

- 사람이 읽기 쉬운 날짜별 기록: [`CHANGELOG.md`](./CHANGELOG.md)
- GitHub의 전체 수정 기록: [Commits 보기](https://github.com/Vokim2503/vokim2503.github.io/commits/main/)

## 초보자를 위한 관리 원칙

1. FirstLott 수정은 저장소 최상위 파일에서 합니다.
2. Philosophy Roulette 수정은 `philosophy-V1` 폴더에서 합니다.
3. `philosophy`와 `index_v1_backup`은 이전 버전이므로 수정하지 않습니다.
4. 중요한 수정이 끝나면 `CHANGELOG.md`에 날짜와 내용을 한 줄씩 기록합니다.
5. 배포 후에는 Mac과 iPhone에서 각각 한 번씩 확인합니다.

---

운영자: 행복칠TV  
저장소: [Vokim2503/vokim2503.github.io](https://github.com/Vokim2503/vokim2503.github.io)
