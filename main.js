document.addEventListener('DOMContentLoaded', () => {
    
    let userSeedData = []; // 시드 생성을 위한 데이터
    
    // 심사 중에는 외부 콘텐츠를 자동 노출하지 않고 운영자가 확인한 중립적 주제를 사용한다.
    const currentTrend = "오늘의 작은 발견";

    const keywordEl = document.getElementById('live-trend-keyword');
    if (keywordEl) keywordEl.textContent = currentTrend;

    function hashText(text) {
        let hash = 2166136261;
        for (const character of text) {
            hash ^= character.codePointAt(0);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    async function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return;
            } catch (error) {
                // 일부 아이폰 브라우저에서는 권한 문제로 실패할 수 있어 아래 방식을 시도한다.
            }
        }

        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, text.length);
        const copied = document.execCommand('copy');
        textArea.remove();
        if (!copied) throw new Error('clipboard-copy-failed');
    }

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

        // 1. 주제 데이터 표시
        setTimeout(() => {
            titleEl.innerText = `선택된 주제: [${currentTrend}]`;
            titleEl.style.opacity = '1';
        }, 800);

        setTimeout(() => {
            lengthEl.innerText = `주제 문자 정보 확인: ${[...currentTrend].length}자`;
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
            const finalSeed = (clickTimeMs % 1000000000) + hashText(currentTrend);
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

        window.scrollTo(0, 0);
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
    const latestLottoResult = { round: 1234, date: '2026-07-25', numbers: [1, 15, 19, 31, 35, 43], bonus: 27 };
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
        btnModeManual?.setAttribute('aria-selected', String(isManual));
        btnModeAuto?.setAttribute('aria-selected', String(!isManual));
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

    btnAutoCopy?.addEventListener('click', async () => {
        const text = currentAutoGames.map((game, index) => `${index + 1}게임: ${game.join(', ')}`).join('\n');
        try {
            await copyToClipboard(text);
            const originalText = btnAutoCopy.textContent;
            btnAutoCopy.textContent = '복사 완료!';
            setTimeout(() => { btnAutoCopy.textContent = originalText; }, 2000);
        } catch (error) {
            alert('번호를 복사하지 못했습니다. 번호를 길게 눌러 직접 복사해 주세요.');
        }
    });

    // --- 동행복권 공식 QR 확인 ---
    const btnOpenQr = document.getElementById('btn-open-qr');
    const btnCloseQr = document.getElementById('btn-close-qr');
    const btnQrCamera = document.getElementById('btn-qr-camera');
    const qrCameraInput = document.getElementById('qr-camera-input');
    const qrFileInput = document.getElementById('qr-file-input');
    const qrModal = document.getElementById('qr-modal');
    const qrReader = document.getElementById('qr-reader');
    const qrStatus = document.getElementById('qr-status');
    const qrTicketResult = document.getElementById('qr-ticket-result');
    const btnOpenQrResult = document.getElementById('btn-open-qr-result');
    const qrCore = window.LottoQrCore;
    let qrScanner = null;
    let qrCameraRunning = false;
    let qrLibraryPromise = null;
    let verifiedQrUrl = '';
    let qrPreviousFocus = null;
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    function setQrStatus(message, isError = false) {
        if (!qrStatus) return;
        qrStatus.textContent = message;
        qrStatus.classList.toggle('error', isError);
    }

    function loadQrLibrary() {
        if (typeof window.Html5Qrcode !== 'undefined') return Promise.resolve(window.Html5Qrcode);
        if (qrLibraryPromise) return qrLibraryPromise;

        qrLibraryPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js';
            script.crossOrigin = 'anonymous';
            script.referrerPolicy = 'no-referrer';
            script.onload = () => {
                if (typeof window.Html5Qrcode !== 'undefined') resolve(window.Html5Qrcode);
                else reject(new Error('qr-library-unavailable'));
            };
            script.onerror = () => reject(new Error('qr-library-load-failed'));
            document.head.appendChild(script);
        }).catch(error => {
            qrLibraryPromise = null;
            throw error;
        });

        return qrLibraryPromise;
    }

    async function prepareQrScanner() {
        if (!qrCore) {
            setQrStatus('QR 확인 기능을 초기화하지 못했습니다. 페이지를 새로고침해 주세요.', true);
            return false;
        }
        try {
            const Html5QrcodeClass = await loadQrLibrary();
            if (!qrScanner) qrScanner = new Html5QrcodeClass('qr-reader');
            return true;
        } catch (error) {
            setQrStatus('QR 판독 도구를 불러오지 못했습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.', true);
            return false;
        }
    }

    function renderScannedTicket(ticket) {
        qrTicketResult.innerHTML = '';
        qrTicketResult.style.display = 'block';

        const heading = document.createElement('div');
        heading.className = 'qr-ticket-heading';
        heading.textContent = `제${ticket.round}회 복권 번호`;
        qrTicketResult.appendChild(heading);

        const canCompare = ticket.round === latestLottoResult.round;
        ticket.games.forEach((numbers, gameIndex) => {
            const row = document.createElement('div');
            row.className = 'qr-ticket-game';

            const label = document.createElement('span');
            label.className = 'qr-ticket-label';
            label.textContent = String.fromCharCode(65 + gameIndex);
            row.appendChild(label);

            const balls = document.createElement('div');
            balls.className = 'qr-ticket-balls';
            numbers.forEach(number => {
                const ball = document.createElement('span');
                ball.className = 'qr-ticket-ball';
                ball.textContent = number;
                if (canCompare && latestLottoResult.numbers.includes(number)) {
                    ball.classList.add('matched');
                    ball.setAttribute('aria-label', `${number}번 당첨번호 일치`);
                } else if (canCompare && number === latestLottoResult.bonus) {
                    ball.classList.add('bonus-matched');
                    ball.setAttribute('aria-label', `${number}번 보너스번호 일치`);
                }
                balls.appendChild(ball);
            });
            row.appendChild(balls);

            const result = document.createElement('span');
            result.className = 'qr-ticket-game-result';
            if (canCompare) {
                const prize = qrCore.getGamePrize(numbers, latestLottoResult);
                result.textContent = prize.label;
                if (prize.matches >= 3) result.classList.add('prize');
            } else {
                result.textContent = '번호 확인';
            }
            row.appendChild(result);
            qrTicketResult.appendChild(row);
        });

        const guide = document.createElement('p');
        guide.className = 'qr-ticket-guide';
        guide.textContent = canCompare
            ? '✓ 표시된 공은 당첨번호와 일치합니다. 보라색 공은 보너스번호입니다.'
            : `현재 앱은 제${latestLottoResult.round}회 당첨번호 비교를 지원합니다. 제${ticket.round}회 결과는 아래 공식 결과에서 확인하세요.`;
        qrTicketResult.appendChild(guide);
    }

    async function stopQrScanner() {
        if (!qrScanner) return;
        try {
            if (qrCameraRunning) await qrScanner.stop();
        } catch (error) {}
        try {
            await Promise.resolve(qrScanner.clear());
        } catch (error) {}
        qrScanner = null;
        qrCameraRunning = false;
        qrReader.style.display = 'none';
        btnQrCamera.textContent = '카메라로 확인';
        btnQrCamera.disabled = false;
    }

    async function closeQrScanner() {
        qrModal.style.display = 'none';
        qrModal.setAttribute('aria-hidden', 'true');
        await stopQrScanner();
        qrPreviousFocus?.focus();
    }

    async function handleDecodedQr(decodedText) {
        const officialUrl = qrCore.normalizeOfficialQrUrl(decodedText);
        if (!officialUrl) {
            setQrStatus('동행복권 로또 QR이 아닙니다. 복권의 QR 부분이 선명하게 보이도록 다시 시도해 주세요.', true);
            return;
        }

        verifiedQrUrl = officialUrl;
        const ticket = qrCore.parseLottoTicketQr(decodedText);
        if (ticket) {
            renderScannedTicket(ticket);
            setQrStatus('복권 번호를 읽었습니다. 표시된 일치 번호를 확인해 주세요.');
        } else {
            qrTicketResult.style.display = 'none';
            setQrStatus('공식 QR은 확인했지만 번호 형식을 읽지 못했습니다. 아래 공식 결과를 이용해 주세요.', true);
        }
        btnOpenQrResult.hidden = false;
        await stopQrScanner();
    }

    function cameraErrorMessage(error) {
        const message = String(error || '');
        if (/NotAllowed|Permission|denied/i.test(message)) return '카메라 권한이 꺼져 있습니다. 브라우저 설정에서 카메라를 허용하거나 사진으로 확인해 주세요.';
        if (/NotFound|DevicesNotFound|camera not found/i.test(message)) return '사용할 수 있는 카메라를 찾지 못했습니다. 사진으로 확인해 주세요.';
        if (/NotReadable|TrackStart|Could not start/i.test(message)) return '다른 앱이 카메라를 사용 중입니다. 다른 앱을 닫고 다시 시도해 주세요.';
        return '카메라를 시작하지 못했습니다. 사진으로 확인하거나 카메라 권한을 확인해 주세요.';
    }

    btnOpenQr?.addEventListener('click', () => {
        qrPreviousFocus = document.activeElement;
        qrModal.style.display = 'flex';
        qrModal.setAttribute('aria-hidden', 'false');
        setQrStatus('카메라 또는 저장된 복권 사진을 선택해 주세요.');
        btnOpenQrResult.hidden = true;
        qrTicketResult.style.display = 'none';
        qrTicketResult.innerHTML = '';
        verifiedQrUrl = '';
        qrReader.style.display = 'none';
        btnCloseQr.focus();
    });

    btnQrCamera?.addEventListener('click', async () => {
        if (isIOSDevice) {
            setQrStatus('아이폰 카메라가 열리면 복권의 QR 부분을 선명하게 촬영해 주세요.');
            qrCameraInput?.click();
            return;
        }

        if (!await prepareQrScanner()) return;
        btnQrCamera.disabled = true;
        btnQrCamera.textContent = '카메라 여는 중…';
        qrReader.style.display = 'block';
        setQrStatus('카메라 권한 요청이 나오면 허용을 눌러 주세요.');
        try {
            await qrScanner.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1 },
                handleDecodedQr,
                () => {}
            );
            qrCameraRunning = true;
            btnQrCamera.textContent = '카메라 사용 중';
            setQrStatus('복권의 정사각형 QR을 화면 중앙 네모 안에 맞춰 주세요.');
        } catch (error) {
            setQrStatus(cameraErrorMessage(error), true);
            await stopQrScanner();
        }
    });

    async function createQrScanVariants(file) {
        const variants = [file];
        if (typeof createImageBitmap !== 'function') return variants;

        try {
            const bitmap = await createImageBitmap(file);
            const crops = [
                { x: 0, y: 0, w: 1, h: 1 },
                { x: 0.1, y: 0.1, w: 0.8, h: 0.8 },
                { x: 0.2, y: 0.2, w: 0.6, h: 0.6 },
                { x: 0, y: 0, w: 0.7, h: 0.7 },
                { x: 0.3, y: 0, w: 0.7, h: 0.7 },
                { x: 0, y: 0.3, w: 0.7, h: 0.7 },
                { x: 0.3, y: 0.3, w: 0.7, h: 0.7 }
            ];

            for (let index = 0; index < crops.length; index++) {
                const crop = crops[index];
                const sx = Math.round(bitmap.width * crop.x);
                const sy = Math.round(bitmap.height * crop.y);
                const sw = Math.round(bitmap.width * crop.w);
                const sh = Math.round(bitmap.height * crop.h);
                const scale = Math.min(1, 1400 / Math.max(sw, sh));
                const canvas = document.createElement('canvas');
                canvas.width = Math.max(1, Math.round(sw * scale));
                canvas.height = Math.max(1, Math.round(sh * scale));
                const context = canvas.getContext('2d', { willReadFrequently: true });
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = 'high';
                context.drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
                if (blob) variants.push(new File([blob], `qr-area-${index}.jpg`, { type: 'image/jpeg' }));
            }
            bitmap.close?.();
        } catch (error) {
            console.log('QR 사진 보정 생략', error);
        }
        return variants;
    }

    async function scanQrImageFile(file, inputElement) {
        if (!file) return;
        await stopQrScanner();
        if (!await prepareQrScanner()) return;
        qrReader.style.display = 'block';
        setQrStatus('사진을 보정하고 QR을 찾는 중입니다…');
        try {
            const variants = await createQrScanVariants(file);
            let decodedText = '';
            for (let index = 0; index < variants.length; index++) {
                setQrStatus(`QR 판독 중입니다… (${index + 1}/${variants.length})`);
                try {
                    decodedText = await qrScanner.scanFile(variants[index], index === 0);
                    if (decodedText) break;
                } catch (error) {}
            }
            if (!decodedText) throw new Error('qr-not-found');
            await handleDecodedQr(decodedText);
        } catch (error) {
            setQrStatus('QR을 찾지 못했습니다. 정사각형 QR이 화면의 절반 이상 보이도록 가까이 촬영해 주세요.', true);
            await stopQrScanner();
        } finally {
            inputElement.value = '';
        }
    }

    qrCameraInput?.addEventListener('change', async event => {
        await scanQrImageFile(event.target.files?.[0], qrCameraInput);
    });
    qrFileInput?.addEventListener('change', async event => {
        await scanQrImageFile(event.target.files?.[0], qrFileInput);
    });
    btnCloseQr?.addEventListener('click', closeQrScanner);
    qrModal?.addEventListener('click', event => {
        if (event.target === qrModal) closeQrScanner();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && qrModal?.getAttribute('aria-hidden') === 'false') closeQrScanner();
    });
    btnOpenQrResult?.addEventListener('click', () => {
        if (!verifiedQrUrl) {
            setQrStatus('먼저 복권 QR을 카메라 또는 사진으로 확인해 주세요.', true);
            return;
        }
        window.location.assign(verifiedQrUrl);
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
    function initStage3() {
        const resultContainer = document.getElementById('result-numbers');
        resultContainer.innerHTML = '';
        
        const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
        
        const resultMsg = document.getElementById('result-message');
        resultMsg.textContent = "오락용 무작위 번호 생성이 완료됐습니다.";

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

    }

    document.getElementById('btn-retry').addEventListener('click', () => {
        // 완전 초기화 후 첫 화면으로 돌아간다.
        document.body.className = 'theme-default';
        userSeedData = [];
        selectedNumbers = [];
        currentAutoGames = [];
        autoAnimationTimers.forEach(timer => clearTimeout(timer));
        autoAnimationTimers = [];

        btnStartCalc.disabled = false;
        btnStartCalc.textContent = '이 주제 데이터로 난수 생성하기';
        btnStartCalc.style.opacity = '';

        const terminal = document.getElementById('integrated-terminal');
        terminal.style.display = 'none';
        document.getElementById('stage1-action').style.display = 'none';
        goToStage(0);
        window.scrollTo(0, 0);
    });

    document.getElementById('btn-copy').addEventListener('click', async () => {
        const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
        const text = `오락용 로또 번호: ${sortedNumbers.join(', ')}`;

        try {
            await copyToClipboard(text);
            const btn = document.getElementById('btn-copy');
            const originalText = btn.textContent;
            btn.textContent = '복사 완료!';
            setTimeout(() => { btn.textContent = originalText; }, 2000);
        } catch (error) {
            alert('번호를 복사하지 못했습니다. 번호를 길게 눌러 직접 복사해 주세요.');
        }
    });
});
