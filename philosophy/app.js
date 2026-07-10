// ====================================================
// 행복칠TV 철학자 상담소 - 앱의 두뇌(로직) 담당 (app.js)
// ====================================================

const categoryVideos = {
    "life": "https://youtu.be/qhKTbOBAtaE",      // 쇼펜하우어 인생 조언
    "human": "https://youtu.be/uc7RtVFD6L0",     // 인간관계 상처 명상
    "mind": "https://youtu.be/ViSvvAt1Agk",      // 우울/불안 극복 명상
    "politics": "https://youtu.be/I7-7YsLL0CE"   // 하이에크 사회 현안
};

// 1. 위대한 철학자들의 명언 데이터베이스 (마음껏 추가할 수 있습니다!)
const quotesDB = {
    // 진로/인생 고민에 대한 명언들
    life: [
        {
            philosopher: "아르투어 쇼펜하우어",
            quote: "우리는 다른 사람들과 같아지기 위해 삶의 4분의 3을 빼앗긴다.",
            interpretation: "행복칠TV 해석: 남의 눈치를 보며 살기엔 당신의 인생이 너무 짧습니다. 당신만의 길을 가세요.",
            youtubeLink: "" 
        },
        {
            philosopher: "레프 톨스토이",
            quote: "모두가 세상을 변화시키려고 생각하지만, 정작 스스로 변하겠다고 생각하는 사람은 없다.",
            interpretation: "행복칠TV 해석: 막막한 진로의 돌파구는 거창한 세상이 아니라, 오늘 나의 작은 변화에서 시작됩니다.",
            youtubeLink: ""
        },
        {
            philosopher: "프리드리히 니체",
            quote: "자신의 '왜' 살아야 하는지를 아는 사람은 그 어떤 '어떻게'도 견뎌낼 수 있다.",
            interpretation: "행복칠TV 해석: 방법(진로)을 찾기 전에, 당신의 가슴을 뛰게 하는 목적(이유)을 먼저 찾아보세요.",
            youtubeLink: ""
        },
        {
            philosopher: "루키우스 안나이우스 세네카",
            quote: "어느 항구를 향해 갈 것인지 모르는 사람에게는 어떤 바람도 순풍이 될 수 없다.",
            interpretation: "행복칠TV 해석: 목표가 분명해야 기회도 알아볼 수 있습니다. 당신의 목적지는 어디인가요?",
            youtubeLink: ""
        },
        {
            philosopher: "장폴 사르트르",
            quote: "인생은 B(Birth)와 D(Death) 사이의 C(Choice)다.",
            interpretation: "행복칠TV 해석: 정해진 운명은 없습니다. 오직 당신의 선택들이 당신의 인생을 만들어 갈 뿐입니다.",
            youtubeLink: ""
        }
    ],
    // 인간관계 고민에 대한 명언들
    human: [
        {
            philosopher: "아르투어 쇼펜하우어",
            quote: "인간은 고슴도치와 같다. 너무 가까이하면 가시에 찔리고, 너무 멀어지면 추위를 느낀다.",
            interpretation: "행복칠TV 해석: 상처받지 않으려면 사람들과 '적당한 거리'를 유지하는 지혜가 필요합니다.",
            youtubeLink: ""
        },
        {
            philosopher: "프리드리히 니체",
            quote: "나를 죽이지 못하는 고통은 나를 더욱 강하게 만든다.",
            interpretation: "행복칠TV 해석: 지금 그 사람 때문에 받는 상처가 결국 당신의 마음 근육을 단단하게 만들어 줄 것입니다.",
            youtubeLink: ""
        },
        {
            philosopher: "알프레드 아들러",
            quote: "모든 고민은 인간관계에서 비롯된다. 타인의 과제에 개입하지 말고 내 과제에 집중하라.",
            interpretation: "행복칠TV 해석: 남이 나를 어떻게 생각할지는 '그들의 문제'입니다. 당신은 당신의 삶에 집중하세요.",
            youtubeLink: ""
        },
        {
            philosopher: "아리스토텔레스",
            quote: "모든 사람의 친구는 누구의 친구도 아니다.",
            interpretation: "행복칠TV 해석: 모두에게 좋은 사람이 되려다 나 자신을 잃지 마세요. 진짜 소중한 소수에게 집중하십시오.",
            youtubeLink: ""
        },
        {
            philosopher: "에픽테토스",
            quote: "우리를 불안하게 만드는 것은 사물 그 자체가 아니라, 사물에 대한 우리의 생각이다.",
            interpretation: "행복칠TV 해석: 타인의 행동이 상처가 된 것이 아니라, 그것을 상처로 받아들인 나의 해석을 바꿔보세요.",
            youtubeLink: ""
        }
    ],
    // 마음/불안 고민에 대한 명언들
    mind: [
        {
            philosopher: "마르쿠스 아우렐리우스",
            quote: "우리의 인생은 우리의 생각이 만드는 것이다.",
            interpretation: "행복칠TV 해석: 마음이 복잡할 때는 상황이 아니라, 상황을 바라보는 내 '생각'의 방향을 바꿔보세요.",
            youtubeLink: ""
        },
        {
            philosopher: "레프 톨스토이",
            quote: "참된 행복은 자기 자신을 버리는 데서 찾을 수 있다.",
            interpretation: "행복칠TV 해석: 내가 모든 것을 통제해야 한다는 강박과 욕심을 내려놓을 때 진정한 평온이 찾아옵니다.",
            youtubeLink: ""
        },
        {
            philosopher: "노자",
            quote: "우울한 사람은 과거에 살고, 불안한 사람은 미래에 살며, 평안한 사람은 현재에 산다.",
            interpretation: "행복칠TV 해석: 지나간 일의 후회와 다가오지 않은 미래의 걱정을 끊어내고, 오직 '지금 이 순간'에 머무르세요.",
            youtubeLink: ""
        },
        {
            philosopher: "미셸 드 몽테뉴",
            quote: "내 인생에는 수많은 재앙이 있었지만, 그중 대부분은 실제로 일어나지 않은 일들이었다.",
            interpretation: "행복칠TV 해석: 당신의 불안이 만들어낸 상상 속 괴물에게 잡아먹히지 마세요. 현실은 생각보다 덤덤합니다.",
            youtubeLink: ""
        },
        {
            philosopher: "법정 스님",
            quote: "무소유란 아무것도 갖지 않는다는 것이 아니라, 불필요한 것을 갖지 않는다는 뜻이다.",
            interpretation: "행복칠TV 해석: 복잡한 마음을 비우고 싶다면, 내 마음속 불필요한 집착과 욕심부터 덜어내야 합니다.",
            youtubeLink: ""
        }
    ],
    // 사회/정치 현안 고민에 대한 명언들
    politics: [
        {
            philosopher: "플라톤",
            quote: "정치를 외면한 가장 큰 대가는 가장 저질스러운 인간들에게 지배당하는 것이다.",
            interpretation: "행복칠TV 해석: 답답하더라도 우리가 사회와 정치에 계속 관심을 가지고 깨어 있어야 하는 이유입니다.",
            youtubeLink: ""
        },
        {
            philosopher: "장자크 루소",
            quote: "인간은 자유롭게 태어났지만, 어디서나 쇠사슬에 매여 있다.",
            interpretation: "행복칠TV 해석: 당연하게 여겨지는 사회의 부조리와 억압에 대해 늘 깨어 질문을 던져야 할 때입니다.",
            youtubeLink: ""
        },
        {
            philosopher: "한나 아렌트",
            quote: "생각하지 않는 것은 평범한 악을 낳는다.",
            interpretation: "행복칠TV 해석: 비판 없이 남들을 따라가는 맹목적인 태도가 사회를 망칩니다. 스스로 고민하고 판단하세요.",
            youtubeLink: ""
        },
        {
            philosopher: "니콜로 마키아벨리",
            quote: "세상은 '어떻게 살아야 하는가'와 '실제로 어떻게 사는가'가 너무나도 다르다.",
            interpretation: "행복칠TV 해석: 이상만 쫓기보다 차가운 현실의 권력과 이해관계를 직시할 때 사회를 바꿀 힘이 생깁니다.",
            youtubeLink: ""
        },
        {
            philosopher: "존 스튜어트 밀",
            quote: "어떤 의견이 침묵당할 때, 우리는 진리의 한 조각을 잃어버리는 것이다.",
            interpretation: "행복칠TV 해석: 내 생각과 다르더라도 다양한 의견이 존중받는 사회야말로 가장 건강하고 발전하는 사회입니다.",
            youtubeLink: ""
        }
    ]
};

// 2. 화면에 있는 요소들(HTML)을 자바스크립트로 가져옵니다.
const worrySelect = document.getElementById('worry-select');
const spinBtn = document.getElementById('spin-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const resultArea = document.getElementById('result-area');

const philosopherNameEl = document.getElementById('philosopher-name');
const quoteTextEl = document.getElementById('quote-text');
const quoteInterpretationEl = document.getElementById('quote-interpretation');
const youtubeLinkEl = document.getElementById('youtube-link'); // 유튜브 버튼 가져오기

// 3. 사용자가 '고민'을 선택했을 때 버튼을 활성화하는 마법
worrySelect.addEventListener('change', function() {
    // 만약 '-- 고민을 선택해주세요 --' 가 아닌 다른 진짜 고민을 골랐다면?
    if (this.value !== 'none') {
        spinBtn.innerText = "철학자의 조언 구하기 🔮"; // 글씨도 바꿉니다.
        spinBtn.disabled = false; // 버튼 활성화
    } else {
        spinBtn.innerText = "철학자의 조언 구하기";
        spinBtn.disabled = true; // 버튼 비활성화
    }
});

// 4. 룰렛 버튼 클릭 이벤트 처리
spinBtn.addEventListener('click', () => {
    let category = worrySelect.value;
    
    // 아무것도 선택하지 않았을 때
    if (category === "none") {
        alert("위의 메뉴에서 지금 안고 계신 고민을 먼저 선택해주세요! 😊");
        return;
    }

    // 확장된 구체적인 고민들을 기존의 4가지 카테고리로 자연스럽게 연결해줍니다.
    const categoryMap = {
        "money": "life",
        "burnout": "life",
        "compare": "life",
        "family": "human",
        "work": "human",
        "aging": "mind"
    };
    
    // 만약 확장된 카테고리라면 매핑된 기본 카테고리로 변경
    if (categoryMap[category]) {
        category = categoryMap[category];
    }
    
    // 1) 결과창을 다시 숨기고 스피너(로딩 애니메이션)를 보여줍니다.
    resultArea.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
    spinBtn.disabled = true; // 돌아가는 동안 중복 클릭을 막습니다.
    
    // 2) 2초(2000밀리초) 동안 신비롭게 고민하는 척을 합니다.
    setTimeout(() => {
        // 해당 고민(life, human, mind)에 맞는 명언 리스트를 가져옵니다.
        const possibleQuotes = quotesDB[category];
        
        // 리스트 중에서 무작위로(랜덤) 하나를 뽑습니다.
        const randomIndex = Math.floor(Math.random() * possibleQuotes.length);
        const chosenQuote = possibleQuotes[randomIndex];
        
        // 3) 뽑힌 명언을 화면(HTML)에 쏙쏙 집어넣습니다.
        philosopherNameEl.innerText = chosenQuote.philosopher;
        quoteTextEl.innerText = `"${chosenQuote.quote}"`;
        quoteInterpretationEl.innerText = chosenQuote.interpretation;
        
        // ★ 가장 확실한 방법: 검색을 거치지 않고, 고민 유형에 맞는 단 하나의 영상으로 바로 쏴버립니다!
        // 1순위: 만약 명언 자체에 특정 영상(youtubeLink)이 있다면 그 영상으로 갑니다.
        // 2순위: 없다면, 위에서 설정한 '고민 유형별 대표 영상(categoryVideos)'으로 곧바로 갑니다!
        let finalVideoUrl = categoryVideos[category]; // 카테고리 대표 영상 
        
        if (chosenQuote.youtubeLink && chosenQuote.youtubeLink.trim() !== "") {
            finalVideoUrl = chosenQuote.youtubeLink; 
        }

        // ★ 3) 새로운 방식: 새 창으로 나가지 않고, '내장형 모달'을 띄워서 가둬둡니다!
        youtubeLinkEl.href = "#";
        youtubeLinkEl.onclick = function(e) {
            e.preventDefault();
            openVideoModal(finalVideoUrl);
        };
        youtubeLinkEl.innerText = `📺 행복칠TV의 '${chosenQuote.philosopher}' 영상 보러가기`;
        
        // 4) 로딩을 끝내고 결과창을 화려하게 보여줍니다!
        loadingSpinner.classList.add('hidden');
        resultArea.classList.remove('hidden');
        spinBtn.disabled = false; // 다시 누를 수 있게 버튼 잠금 해제
        
    }, 2000); // 2초 뒤에 이 안의 코드가 실행됨
});

// ==========================================
// 5. 철학자 갤러리 클릭 이벤트 (영상 연결 or 명언 팝업)
// ==========================================

// 철학자 데이터베이스 (영상 링크와 팝업용 명언 설정)
const philosopherGalleryData = {
    "쇼펜하우어": {
        videoLink: "", // 여기에 실제 유튜브 영상 링크를 넣으세요! (빈칸이면 팝업이 뜹니다)
        quote: "우리는 다른 사람들과 같아지기 위해 삶의 4분의 3을 빼앗긴다.",
        advice: "남의 시선에 얽매이지 말고 당신만의 길을 가세요."
    },
    "톨스토이": {
        videoLink: "", 
        quote: "모두가 세상을 변화시키려고 생각하지만, 정작 스스로 변하겠다고 생각하는 사람은 없다.",
        advice: "가장 큰 변화는 바로 내 안에서부터 시작됩니다."
    },
    "니체": {
        videoLink: "", 
        quote: "나를 죽이지 못하는 고통은 나를 더욱 강하게 만든다.",
        advice: "지금의 시련이 당신을 더 단단하게 만들어 줄 것입니다."
    },
    "아우렐리우스": {
        videoLink: "", 
        quote: "우리의 인생은 우리의 생각이 만드는 것이다.",
        advice: "상황을 바꿀 수 없다면, 상황을 바라보는 생각을 바꿔보세요."
    },
    "플라톤": {
        videoLink: "", 
        quote: "정치를 외면한 가장 큰 대가는 가장 저질스러운 인간들에게 지배당하는 것이다.",
        advice: "세상의 불의에 침묵하지 말고 늘 깨어 있으세요."
    },
    "루소": {
        videoLink: "", 
        quote: "인간은 자유롭게 태어났지만, 어디서나 쇠사슬에 매여 있다.",
        advice: "당신을 얽매고 있는 보이지 않는 사슬을 끊고 자유를 찾으세요."
    }
};

// 갤러리 카드(위쪽 철학자 사진들)를 클릭했을 때의 동작
document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault(); // 기본 링크 이동 방지
        
        const philosopherName = this.getAttribute('data-philosopher');
        const data = philosopherGalleryData[philosopherName];
        
        if (!data) return;
        
        // 1) 영상 링크가 입력되어 있다면 해당 링크를 사이트 내부 모달(내장 플레이어)로 띄웁니다!
        if (data.videoLink && data.videoLink.trim() !== "") {
            openVideoModal(data.videoLink);
        } 
        // 2) 영상 링크가 없다면 준비된 명언 팝업 띄우기!
        else {
            showPhilosopherModal(philosopherName, data.quote, data.advice);
        }
    });
});

// 모달 관련 요소 가져오기
const modalOverlay = document.getElementById('philosopher-modal');
const modalName = document.getElementById('modal-name');
const modalQuote = document.getElementById('modal-quote');
const modalAdvice = document.getElementById('modal-advice');
const modalCloseBtn = document.getElementById('modal-close');

// 모달을 화면에 보여주는 함수
function showPhilosopherModal(name, quote, advice) {
    if(!modalOverlay) return;
    modalName.innerText = name;
    modalQuote.innerText = `"${quote}"`;
    modalAdvice.innerText = `💡 행복칠TV 해석: ${advice}`;
    
    // 모달 내부의 유튜브 버튼 설정 (큰따옴표 완전 일치 검색으로 강제)
    const searchKeyword = `"행복칠TV" "${name}"`;
    const autoSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchKeyword)}`;
    const modalYoutubeLink = document.getElementById('modal-youtube-link');
    if(modalYoutubeLink) {
        modalYoutubeLink.href = autoSearchUrl;
        modalYoutubeLink.innerText = `📺 행복칠TV에서 '${name}' 영상 찾기`;
    }
    
    modalOverlay.classList.remove('hidden');
}

// 닫기 버튼 클릭 시 모달 숨기기
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
    });
}

// ==========================================
// 6. 비디오 전용 모달 (타 채널 영상 완전 차단 시스템)
// ==========================================
const videoModal = document.getElementById('video-modal');
const videoCloseBtn = document.getElementById('video-close');
const youtubeIframe = document.getElementById('youtube-iframe');

function openVideoModal(url) {
    let videoId = "";
    
    // 유튜브 링크에서 ID(고유번호)만 추출합니다.
    if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("v=")) {
        videoId = url.split("v=")[1].split("&")[0];
    } else {
        // 혹시라도 일반 링크면 그냥 새 창으로 엽니다.
        window.open(url, '_blank');
        return;
    }
    
    // ★ 핵심 마법: youtube-nocookie.com을 사용하면 로컬 폴더(file://) 실행 시 발생하는 보안/차단 오류(153 에러)를 우회할 수 있습니다.
    youtubeIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`;
    videoModal.classList.remove('hidden');
}

// 비디오 모달 닫기
if (videoCloseBtn) {
    videoCloseBtn.addEventListener('click', () => {
        videoModal.classList.add('hidden');
        // 모달을 닫을 때 영상을 완전히 멈춥니다(소리 차단).
        youtubeIframe.src = "";
    });
}
