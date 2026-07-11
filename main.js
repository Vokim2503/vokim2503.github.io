document.addEventListener('DOMContentLoaded', () => {
    
    let currentTheme = 'nothing'; // 기본 테마
    let userSeedData = []; // 시드 생성을 위한 데이터
    let energy = 0;
    
    // 실시간 뉴스 기사 가져오기 (대구매일신문 RSS)
    let currentTrend = "압도적인 긍정 에너지"; // 기본값
    let newsLink = "#";
    const newsRSSUrl = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.imaeil.com%2Frss";
    
    // API 응답 지연을 방지하기 위한 3초 타임아웃
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    fetch(newsRSSUrl, { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
            clearTimeout(timeoutId);
            if(data && data.items && data.items.length > 0) {
                // 특정 키워드(정치인 등)가 포함된 기사를 제외하는 필터링 로직
                const forbiddenKeywords = ['윤석열', '대통령', '김건희', '한동훈', '이재명', '정부', '여당', '야당'];
                
                const filteredItems = data.items.filter(item => {
                    const title = item.title || "";
                    // 제목에 금지어가 하나라도 포함되어 있으면 제외
                    return !forbiddenKeywords.some(keyword => title.includes(keyword));
                });

                // 필터링된 기사가 없으면 원본 데이터라도 사용하되, 가급적 필터링된 목록에서 선택
                const validItems = filteredItems.length > 0 ? filteredItems : data.items;

                // 상위 5개(또는 필터링된 전체) 기사 중 하나를 무작위로 선택하여 노출
                const maxIndex = Math.min(5, validItems.length);
                const randomIndex = Math.floor(Math.random() * maxIndex);
                const newsItem = validItems[randomIndex];
                currentTrend = newsItem.title;
                newsLink = newsItem.link;
                
                const keywordEl = document.getElementById('live-trend-keyword');
                if(keywordEl) {
                    keywordEl.innerHTML = `<a href="${newsLink}" target="_blank" style="color: #fff; text-decoration: underline; text-decoration-color: var(--primary-glow); text-underline-offset: 4px;">"${currentTrend}"</a>`;
                }
            }
        })
        .catch(err => {
            console.log("뉴스 로딩 실패 또는 지연", err);
            const keywordEl = document.getElementById('live-trend-keyword');
            if(keywordEl) keywordEl.innerText = `[오늘의 긍정적인 파동]`;
        });

    // --- 0단계: 메인 버튼 클릭 ---
    const btnStartCalc = document.getElementById('btn-start-calc');
    if(btnStartCalc) {
        btnStartCalc.addEventListener('click', () => {
            try {
                btnStartCalc.disabled = true;
                btnStartCalc.textContent = "연산 중...";
                btnStartCalc.style.opacity = "0.5";

                const terminal = document.getElementById('integrated-terminal');
                terminal.style.display = 'block';

                // 맥 사용자 분들을 위해 상단 UI를 가리지 않고 그대로 둡니다.
                // 옛날 아이폰에서 에러가 나지 않는 가장 완벽한 구식 스크롤 코드 적용
                setTimeout(() => {
                    try {
                        // 페이지 맨 아래로 이동
                        window.scrollTo(0, document.body.scrollHeight);
                    } catch(scrollErr) {
                        // 스크롤 실패해도 무시하고 진행
                    }
                }, 100);

                runTerminalAnimation();
            } catch (err) {
                alert("기기 호환성 에러가 발생했습니다: " + err.message + "\n다시 시도해주세요!");
            }
        });
    }

    // --- 1단계: 터미널 연산 애니메이션 ---
    function runTerminalAnimation() {
        const titleEl = document.getElementById('term-news-title');
        const lengthEl = document.getElementById('term-news-length');
        const timeSyncEl = document.getElementById('term-time-sync');
        const timeEl = document.getElementById('term-click-time');
        const calcStartEl = document.getElementById('term-calc-start');
        const finalSeedEl = document.getElementById('term-final-seed');
        const actionBtn = document.getElementById('stage1-action');
        const btnToCatch = document.getElementById('btn-to-catch');

        // 자동 스크롤 함수 복구 (맥 사용자 편의성)
        function scrollToBottom() {
            try {
                window.scrollTo(0, document.body.scrollHeight);
            } catch(e) {}
        }

        // Reset (미리 공간을 차지하게 하고 투명도만 조절하여 화면 높이 떨림 현상 완벽 방지)
        [titleEl, lengthEl, timeSyncEl, timeEl, calcStartEl, finalSeedEl].forEach(el => {
            if(el) {
                el.style.display = 'block';
                el.style.opacity = '0';
                el.style.transition = 'opacity 0.4s ease';
            }
        });
        if (actionBtn) actionBtn.style.display = 'none';

        // 1. 이슈 데이터 표시
        setTimeout(() => {
            titleEl.innerText = `선택된 이슈: [${currentTrend}]`;
            titleEl.style.opacity = '1';
        }, 800);

        setTimeout(() => {
            lengthEl.innerText = `기사 문자 길이 값 추출: ${currentTrend.length} bytes`;
            lengthEl.style.opacity = '1';
        }, 1600);

        // 2. 시간 동기화
        setTimeout(() => {
            timeSyncEl.style.opacity = '1';
        }, 2400);

        let clickTimeMs = Date.now();
        setTimeout(() => {
            const date = new Date(clickTimeMs);
            const timeStr = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')} ` +
                            `${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}:${date.getSeconds().toString().padStart(2,'0')}.${date.getMilliseconds()}`;
            timeEl.innerText = `사용자 고유 클릭 시간: ${timeStr}`;
            timeEl.style.opacity = '1';
        }, 3200);

        // 3. 연산 시작
        setTimeout(() => {
            calcStartEl.style.opacity = '1';
        }, 4000);

        // 4. 결과 출력
        setTimeout(() => {
            const finalSeed = clickTimeMs * currentTrend.length;
            userSeedData = [finalSeed]; // 저장
            
            finalSeedEl.innerText = `=> 고유 난수(Seed): ${finalSeed} 생성 완료!`;
            finalSeedEl.style.opacity = '1';
        }, 5500);

        // 5. 버튼 표시
        setTimeout(() => {
            actionBtn.style.display = 'block';
            // 마지막 순간에만 부드럽게 한 번 스크롤
            scrollToBottom();
        }, 6000);
    }
    
    // 이벤트 리스너 중복 방지를 위해 전역으로 분리
    const btnToCatch = document.getElementById('btn-to-catch');
    if(btnToCatch) {
        btnToCatch.addEventListener('click', () => {
            goToStage(2, userSeedData[0]);
        });
    }

    // --- 스테이지 전환 관리 ---
    function goToStage(stageNum, seed) {
        document.querySelectorAll('.stage').forEach(s => s.classList.remove('active'));
        document.getElementById(`stage-${stageNum}`).classList.add('active');
        
        if (stageNum === 2) initStage2(seed);
        else if (stageNum === 3) initStage3();
    }

    // --- 2단계: 1~45 전체 번호를 3페이지로 선택 ---
    const orbField = document.getElementById('orb-field');
    const pageIndicator = document.getElementById('number-page-indicator');
    const btnPagePrev = document.getElementById('btn-page-prev');
    const btnPageNext = document.getElementById('btn-page-next');
    const btnModeManual = document.getElementById('btn-mode-manual');
    const btnModeAuto = document.getElementById('btn-mode-auto');
    const manualPanel = document.getElementById('manual-selection-panel');
    const autoPanel = document.getElementById('auto-selection-panel');
    const btnViewBlind = document.getElementById('btn-view-blind');
    const btnViewNumber = document.getElementById('btn-view-number');
    const autoGamesEl = document.getElementById('auto-games');
    const btnAutoRegenerate = document.getElementById('btn-auto-regenerate');
    const btnAutoCopy = document.getElementById('btn-auto-copy');
    const btnAutoCompare = document.getElementById('btn-auto-compare');
    const latestLottoResult = { round: 1231, date: '2026-07-04', numbers: [4, 13, 14, 18, 31, 38], bonus: 15 };
    let selectedNumbers = [];
    let orbs = [];
    let currentNumberPage = 0;
    let autoGenerationCount = 0;
    let currentAutoGames = [];
    let autoAnimationTimers = [];

    function customRandom(seed) {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    function initStage2(seed) {
        orbField.innerHTML = '';
        selectedNumbers = [];
        currentNumberPage = 0;
        autoGenerationCount = 0;
        currentAutoGames = [];
        setSelectionMode('manual');
        setManualView('blind');
        document.querySelectorAll('.slot').forEach(s => {
            s.classList.remove('filled'); s.textContent = '';
        });
        orbs = [];

        let allNumbers = Array.from({length: 45}, (_, i) => i + 1);
        let currentSeed = seed;
        for (let i = allNumbers.length - 1; i > 0; i--) {
            const j = Math.floor(customRandom(currentSeed++) * (i + 1));
            [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
        }
        const track = document.createElement('div');
        track.className = 'number-pages-track';
        orbField.appendChild(track);

        for (let pageIndex = 0; pageIndex < 3; pageIndex++) {
            const page = document.createElement('div');
            page.className = 'number-page';
            page.setAttribute('aria-label', `${pageIndex + 1}번째 번호 페이지`);

            allNumbers.slice(pageIndex * 15, pageIndex * 15 + 15).forEach(num => {
                const orb = document.createElement('button');
                orb.type = 'button';
                orb.className = 'candidate-orb';
                orb.textContent = num;
                orb.setAttribute('aria-label', `${num}번 선택`);
                page.appendChild(orb);

                const orbData = { el: orb, num };
                orbs.push(orbData);
                orb.addEventListener('click', () => handleOrbClick(orbData));
            });

            track.appendChild(page);
        }

        updateNumberPage(0, false);
    }

    function updateNumberPage(page, smooth = true) {
        currentNumberPage = Math.max(0, Math.min(2, page));
        const track = orbField.querySelector('.number-pages-track');
        if (track) {
            track.style.transform = `translateX(-${currentNumberPage * 100}%)`;
            track.style.transition = smooth ? 'transform 0.3s ease' : 'none';
        }
        if (pageIndicator) pageIndicator.textContent = `${currentNumberPage + 1} / 3`;
        if (btnPagePrev) btnPagePrev.disabled = currentNumberPage === 0;
        if (btnPageNext) btnPageNext.disabled = currentNumberPage === 2;
    }

    if (btnPagePrev) btnPagePrev.addEventListener('click', () => updateNumberPage(currentNumberPage - 1));
    if (btnPageNext) btnPageNext.addEventListener('click', () => updateNumberPage(currentNumberPage + 1));

    function setSelectionMode(mode) {
        const isManual = mode === 'manual';
        btnModeManual?.classList.toggle('active', isManual);
        btnModeAuto?.classList.toggle('active', !isManual);
        manualPanel?.classList.toggle('active', isManual);
        autoPanel?.classList.toggle('active', !isManual);
        if (!isManual && currentAutoGames.length === 0) generateAutoGames();
    }

    function setManualView(view) {
        const isBlind = view === 'blind';
        orbField.classList.toggle('blind-view', isBlind);
        btnViewBlind?.classList.toggle('active', isBlind);
        btnViewNumber?.classList.toggle('active', !isBlind);
    }

    function generateAutoGames() {
        const baseSeed = Number(userSeedData[0] || Date.now()) % 1000000000;
        currentAutoGames = [];

        for (let gameIndex = 0; gameIndex < 5; gameIndex++) {
            const numbers = Array.from({ length: 45 }, (_, i) => i + 1);
            let gameSeed = baseSeed + (autoGenerationCount * 100003) + (gameIndex * 997);
            for (let i = numbers.length - 1; i > 0; i--) {
                const j = Math.floor(customRandom(gameSeed++) * (i + 1));
                [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
            }
            currentAutoGames.push(numbers.slice(0, 6).sort((a, b) => a - b));
        }

        autoGenerationCount += 1;
        renderAutoGames();
    }

    function renderAutoGames() {
        if (!autoGamesEl) return;
        autoAnimationTimers.forEach(timer => clearTimeout(timer));
        autoAnimationTimers = [];
        autoGamesEl.innerHTML = '';
        currentAutoGames.forEach((game, gameIndex) => {
            const row = document.createElement('div');
            row.className = 'auto-game-row';
            const label = document.createElement('span');
            label.className = 'auto-game-label';
            label.textContent = `${gameIndex + 1}게임`;
            row.appendChild(label);

            const balls = document.createElement('div');
            balls.className = 'auto-game-balls';
            game.forEach((num, ballIndex) => {
                const ball = document.createElement('span');
                ball.className = `auto-ball waiting ${gameIndex % 2 === 0 ? 'from-left' : 'from-right'}`;
                ball.textContent = num;
                const revealOrder = gameIndex % 2 === 0 ? ballIndex : 5 - ballIndex;
                const revealDelay = 500 + (gameIndex * 6 + revealOrder) * 90;
                if (num <= 10) ball.classList.add('yellow');
                else if (num <= 20) ball.classList.add('blue');
                else if (num <= 30) ball.classList.add('red');
                else if (num <= 40) ball.classList.add('gray');
                else ball.classList.add('green');
                balls.appendChild(ball);
                autoAnimationTimers.push(setTimeout(() => { ball.classList.add('show'); }, revealDelay));
            });
            row.appendChild(balls);
            const comparison = document.createElement('div');
            comparison.className = 'auto-game-result';
            comparison.setAttribute('aria-live', 'polite');
            row.appendChild(comparison);
            autoGamesEl.appendChild(row);
        });
    }

    btnModeManual?.addEventListener('click', () => setSelectionMode('manual'));
    btnModeAuto?.addEventListener('click', () => setSelectionMode('auto'));
    btnViewBlind?.addEventListener('click', () => setManualView('blind'));
    btnViewNumber?.addEventListener('click', () => setManualView('number'));
    btnAutoRegenerate?.addEventListener('click', generateAutoGames);
    btnAutoCompare?.addEventListener('click', compareAutoGames);
    function compareAutoGames() {
        const resultEls = autoGamesEl?.querySelectorAll('.auto-game-result') || [];
        currentAutoGames.forEach((game, index) => {
            const matches = game.filter(num => latestLottoResult.numbers.includes(num)).length;
            const hasBonus = game.includes(latestLottoResult.bonus);
            let resultText = `${matches}개 일치`;
            let resultClass = 'no-prize';
            if (matches === 6) { resultText = '1등'; resultClass = 'prize'; }
            else if (matches === 5 && hasBonus) { resultText = '2등'; resultClass = 'prize'; }
            else if (matches === 5) { resultText = '3등'; resultClass = 'prize'; }
            else if (matches === 4) { resultText = '4등'; resultClass = 'prize'; }
            else if (matches === 3) { resultText = '5등'; resultClass = 'prize'; }
            if (resultEls[index]) {
                resultEls[index].textContent = `${latestLottoResult.round}회 기준 · ${resultText}${hasBonus && matches < 5 ? ' · 보너스 포함' : ''}`;
                resultEls[index].className = `auto-game-result ${resultClass}`;
            }
        });
    }

    btnAutoCopy?.addEventListener('click', () => {
        const text = currentAutoGames.map((game, index) => `${index + 1}게임: ${game.join(', ')}`).join('\n');
        navigator.clipboard.writeText(text).then(() => {
            const originalText = btnAutoCopy.textContent;
            btnAutoCopy.textContent = '복사 완료!';
            setTimeout(() => { btnAutoCopy.textContent = originalText; }, 2000);
        });
    });

    let swipeStartX = 0;
    orbField.addEventListener('touchstart', event => {
        swipeStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    orbField.addEventListener('touchend', event => {
        const distance = event.changedTouches[0].clientX - swipeStartX;
        if (Math.abs(distance) > 50) updateNumberPage(currentNumberPage + (distance < 0 ? 1 : -1));
    }, { passive: true });

    let lastClickTime = 0;
    function handleOrbClick(orbData) {
        if (selectedNumbers.length >= 6) return;
        if (orbData.el.classList.contains('selected')) return;
        
        // 아이폰에서 여러 구슬이 동시에 터치되는 현상 방지 (0.1초 쿨타임)
        const now = Date.now();
        if (now - lastClickTime < 100) return;
        lastClickTime = now;

        orbData.el.classList.add('selected');
        const slot = document.querySelector(`.slot[data-index="${selectedNumbers.length}"]`);
        slot.textContent = orbData.num;
        slot.classList.add('filled');
        selectedNumbers.push(orbData.num);

        if (selectedNumbers.length === 6) {
            setTimeout(() => goToStage(3), 1000);
        }
    }

    // --- 3단계: 결과 로직 ---
    // --- 3단계: 결과 로직 ---
    function initStage3() {
        const resultContainer = document.getElementById('result-numbers');
        resultContainer.innerHTML = '';
        
        const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
        
        // 종교/테마별로 마무리 멘트를 다르게 줄 수 있습니다.
        const resultMsg = document.getElementById('result-message');
        if(currentTheme === 'bible') resultMsg.textContent = "기도와 함께하는 행운의 번호입니다.";
        else if(currentTheme === 'buddha') resultMsg.textContent = "마음을 비운 자에게 찾아온 행운의 번호입니다.";
        else if(currentTheme === 'tarot') resultMsg.textContent = "운명의 카드가 계시한 당신의 번호입니다.";
        else resultMsg.textContent = "우주의 기운이 담긴 당신의 로또 번호입니다.";

        sortedNumbers.forEach((num, index) => {
            const orb = document.createElement('div');
            orb.classList.add('result-orb');
            orb.textContent = num;
            
            // 기존 동행복권 색상
            if(num <= 10) orb.style.background = 'linear-gradient(135deg, #facc15, #eab308)';
            else if(num <= 20) orb.style.background = 'linear-gradient(135deg, #60a5fa, #3b82f6)';
            else if(num <= 30) orb.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
            else if(num <= 40) orb.style.background = 'linear-gradient(135deg, #9ca3af, #6b7280)';
            else orb.style.background = 'linear-gradient(135deg, #34d399, #10b981)';
            
            orb.style.animationDelay = `${index * 0.1}s`;
            resultContainer.appendChild(orb);
        });

        // 🚀 자동화: 행복칠TV(UCeDsZt5n75Wh4UXuVl9wICg) 최신 영상 가져오기
        const ytContainer = document.getElementById('youtube-promo-container');
        const channelRSS = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3DUCeDsZt5n75Wh4UXuVl9wICg";
        
        fetch(channelRSS)
            .then(res => res.json())
            .then(data => {
                if(data && data.items && data.items.length > 0) {
                    const latestVideo = data.items[0]; // 가장 최신 영상
                    document.getElementById('yt-thumb').src = latestVideo.thumbnail;
                    document.getElementById('yt-title').innerText = latestVideo.title;
                    
                    ytContainer.style.display = 'block';
                    ytContainer.onclick = () => {
                        window.open(latestVideo.link, '_blank');
                    };
                }
            })
            .catch(err => console.log("유튜브 로딩 실패", err));
    }

    document.getElementById('btn-retry').addEventListener('click', () => {
        // 완전 초기화 후 0단계(테마선택)로
        document.body.className = 'theme-default';
        goToStage(0);
    });

    document.getElementById('btn-copy').addEventListener('click', () => {
        const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
        const text = `나의 [${currentTheme}] 성향 로또 번호: ${sortedNumbers.join(', ')}`;
        
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('btn-copy');
            const originalText = btn.textContent;
            btn.textContent = '복사 완료!';
            setTimeout(() => { btn.textContent = originalText; }, 2000);
        });
    });
});
