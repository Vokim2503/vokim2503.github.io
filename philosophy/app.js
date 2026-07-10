// ====================================================
// 행복칠TV 철학자 상담소 - 앱의 두뇌(로직) 담당 (app.js)
// ====================================================

// 1. 위대한 철학자들의 명언 데이터베이스 (풍성하게 20개로 확장!)
const quotesDB = {
    // 진로/인생 고민에 대한 명언들
    life: [
        {
            philosopher: "아르투어 쇼펜하우어",
            quote: "우리는 다른 사람들과 같아지기 위해 삶의 4분의 3을 빼앗긴다.",
            interpretation: "행복칠TV 해석: 남의 눈치를 보며 살기엔 당신의 인생이 너무 짧습니다. 당신만의 길을 가세요."
        },
        {
            philosopher: "레프 톨스토이",
            quote: "모두가 세상을 변화시키려고 생각하지만, 정작 스스로 변하겠다고 생각하는 사람은 없다.",
            interpretation: "행복칠TV 해석: 막막한 진로의 돌파구는 거창한 세상이 아니라, 오늘 나의 작은 변화에서 시작됩니다."
        },
        {
            philosopher: "프리드리히 니체",
            quote: "자신의 '왜' 살아야 하는지를 아는 사람은 그 어떤 '어떻게'도 견뎌낼 수 있다.",
            interpretation: "행복칠TV 해석: 방법(진로)을 찾기 전에, 당신의 가슴을 뛰게 하는 목적(이유)을 먼저 찾아보세요."
        },
        {
            philosopher: "루키우스 안나이우스 세네카",
            quote: "어느 항구를 향해 갈 것인지 모르는 사람에게는 어떤 바람도 순풍이 될 수 없다.",
            interpretation: "행복칠TV 해석: 목표가 분명해야 기회도 알아볼 수 있습니다. 당신의 목적지는 어디인가요?"
        },
        {
            philosopher: "장폴 사르트르",
            quote: "인생은 B(Birth)와 D(Death) 사이의 C(Choice)다.",
            interpretation: "행복칠TV 해석: 정해진 운명은 없습니다. 오직 당신의 선택들이 당신의 인생을 만들어 갈 뿐입니다."
        }
    ],
    // 인간관계 고민에 대한 명언들
    human: [
        {
            philosopher: "아르투어 쇼펜하우어",
            quote: "인간은 고슴도치와 같다. 너무 가까이하면 가시에 찔리고, 너무 멀어지면 추위를 느낀다.",
            interpretation: "행복칠TV 해석: 상처받지 않으려면 사람들과 '적당한 거리'를 유지하는 지혜가 필요합니다."
        },
        {
            philosopher: "프리드리히 니체",
            quote: "나를 죽이지 못하는 고통은 나를 더욱 강하게 만든다.",
            interpretation: "행복칠TV 해석: 지금 그 사람 때문에 받는 상처가 결국 당신의 마음 근육을 단단하게 만들어 줄 것입니다."
        },
        {
            philosopher: "알프레드 아들러",
            quote: "모든 고민은 인간관계에서 비롯된다. 타인의 과제에 개입하지 말고 내 과제에 집중하라.",
            interpretation: "행복칠TV 해석: 남이 나를 어떻게 생각할지는 '그들의 문제'입니다. 당신은 당신의 삶에 집중하세요."
        },
        {
            philosopher: "아리스토텔레스",
            quote: "모든 사람의 친구는 누구의 친구도 아니다.",
            interpretation: "행복칠TV 해석: 모두에게 좋은 사람이 되려다 나 자신을 잃지 마세요. 진짜 소중한 소수에게 집중하십시오."
        },
        {
            philosopher: "에픽테토스",
            quote: "우리를 불안하게 만드는 것은 사물 그 자체가 아니라, 사물에 대한 우리의 생각이다.",
            interpretation: "행복칠TV 해석: 타인의 행동이 상처가 된 것이 아니라, 그것을 상처로 받아들인 나의 해석을 바꿔보세요."
        }
    ],
    // 마음/불안 고민에 대한 명언들
    mind: [
        {
            philosopher: "마르쿠스 아우렐리우스",
            quote: "우리의 인생은 우리의 생각이 만드는 것이다.",
            interpretation: "행복칠TV 해석: 마음이 복잡할 때는 상황이 아니라, 상황을 바라보는 내 '생각'의 방향을 바꿔보세요."
        },
        {
            philosopher: "레프 톨스토이",
            quote: "참된 행복은 자기 자신을 버리는 데서 찾을 수 있다.",
            interpretation: "행복칠TV 해석: 내가 모든 것을 통제해야 한다는 강박과 욕심을 내려놓을 때 진정한 평온이 찾아옵니다."
        },
        {
            philosopher: "노자",
            quote: "우울한 사람은 과거에 살고, 불안한 사람은 미래에 살며, 평안한 사람은 현재에 산다.",
            interpretation: "행복칠TV 해석: 지나간 일의 후회와 다가오지 않은 미래의 걱정을 끊어내고, 오직 '지금 이 순간'에 머무르세요."
        },
        {
            philosopher: "미셸 드 몽테뉴",
            quote: "내 인생에는 수많은 재앙이 있었지만, 그중 대부분은 실제로 일어나지 않은 일들이었다.",
            interpretation: "행복칠TV 해석: 당신의 불안이 만들어낸 상상 속 괴물에게 잡아먹히지 마세요. 현실은 생각보다 덤덤합니다."
        },
        {
            philosopher: "법정 스님",
            quote: "무소유란 아무것도 갖지 않는다는 것이 아니라, 불필요한 것을 갖지 않는다는 뜻이다.",
            interpretation: "행복칠TV 해석: 복잡한 마음을 비우고 싶다면, 내 마음속 불필요한 집착과 욕심부터 덜어내야 합니다."
        }
    ],
    // 사회/정치 현안 고민에 대한 명언들
    politics: [
        {
            philosopher: "플라톤",
            quote: "정치를 외면한 가장 큰 대가는 가장 저질스러운 인간들에게 지배당하는 것이다.",
            interpretation: "행복칠TV 해석: 답답하더라도 우리가 사회와 정치에 계속 관심을 가지고 깨어 있어야 하는 이유입니다."
        },
        {
            philosopher: "장자크 루소",
            quote: "인간은 자유롭게 태어났지만, 어디서나 쇠사슬에 매여 있다.",
            interpretation: "행복칠TV 해석: 당연하게 여겨지는 사회의 부조리와 억압에 대해 늘 깨어 질문을 던져야 할 때입니다."
        },
        {
            philosopher: "한나 아렌트",
            quote: "생각하지 않는 것은 평범한 악을 낳는다.",
            interpretation: "행복칠TV 해석: 비판 없이 남들을 따라가는 맹목적인 태도가 사회를 망칩니다. 스스로 고민하고 판단하세요."
        },
        {
            philosopher: "니콜로 마키아벨리",
            quote: "세상은 '어떻게 살아야 하는가'와 '실제로 어떻게 사는가'가 너무나도 다르다.",
            interpretation: "행복칠TV 해석: 이상만 쫓기보다 차가운 현실의 권력과 이해관계를 직시할 때 사회를 바꿀 힘이 생깁니다."
        },
        {
            philosopher: "존 스튜어트 밀",
            quote: "어떤 의견이 침묵당할 때, 우리는 진리의 한 조각을 잃어버리는 것이다.",
            interpretation: "행복칠TV 해석: 내 생각과 다르더라도 다양한 의견이 존중받는 사회야말로 가장 건강하고 발전하는 사회입니다."
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
const youtubeLinkEl = document.getElementById('youtube-link');

// 3. 사용자가 '고민'을 선택했을 때 버튼을 활성화하는 마법
worrySelect.addEventListener('change', function() {
    if (this.value !== 'none') {
        spinBtn.disabled = false;
        spinBtn.innerText = "철학자의 조언 구하기 🔮";
    } else {
        spinBtn.disabled = true;
        spinBtn.innerText = "철학자의 조언 구하기";
    }
});

// 4. '조언 구하기' 버튼을 눌렀을 때 실행되는 룰렛 마법!
spinBtn.addEventListener('click', function() {
    const selectedWorry = worrySelect.value;
    
    resultArea.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
    spinBtn.disabled = true;
    
    setTimeout(() => {
        const possibleQuotes = quotesDB[selectedWorry];
        const randomIndex = Math.floor(Math.random() * possibleQuotes.length);
        const chosenQuote = possibleQuotes[randomIndex];
        
        philosopherNameEl.innerText = chosenQuote.philosopher;
        quoteTextEl.innerText = `"${chosenQuote.quote}"`;
        quoteInterpretationEl.innerText = chosenQuote.interpretation;
        
        // 유튜브 '자동 검색' 링크 생성
        const searchKeyword = "행복칠TV " + chosenQuote.philosopher;
        const autoSearchUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(searchKeyword);
        
        youtubeLinkEl.href = autoSearchUrl;
        youtubeLinkEl.innerText = `📺 행복칠TV의 '${chosenQuote.philosopher}' 영상 찾아보기`;
        
        loadingSpinner.classList.add('hidden');
        resultArea.classList.remove('hidden');
        spinBtn.disabled = false;
        
    }, 2000);
});
