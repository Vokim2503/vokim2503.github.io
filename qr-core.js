(function exposeQrCore(root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.LottoQrCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createQrCore() {
    const OFFICIAL_HOSTS = new Set([
        'qr.dhlottery.co.kr',
        'www.dhlottery.co.kr',
        'm.dhlottery.co.kr',
        'dhlottery.co.kr'
    ]);

    function normalizeOfficialQrUrl(text) {
        try {
            const url = new URL(text);
            if (!['http:', 'https:'].includes(url.protocol)) return '';
            if (!OFFICIAL_HOSTS.has(url.hostname)) return '';
            if (!url.searchParams.get('v')) return '';
            url.protocol = 'https:';
            return url.href;
        } catch (error) {
            return '';
        }
    }

    function parseLottoTicketQr(qrText) {
        try {
            const officialUrl = normalizeOfficialQrUrl(qrText);
            if (!officialUrl) return null;

            const url = new URL(officialUrl);
            const rawValue = url.searchParams.get('v') || '';
            const match = rawValue.match(/^(\d{3,4})([a-zA-Z])(.*)$/);
            if (!match) return null;

            const round = Number(match[1]);
            const delimiter = match[2];
            const gameParts = match[3].split(delimiter);
            const games = [];

            for (const part of gameParts) {
                const digits = part.replace(/\D/g, '');
                if (digits.length < 12) continue;

                const numbers = [];
                for (let index = 0; index < 12; index += 2) {
                    numbers.push(Number(digits.slice(index, index + 2)));
                }

                const isValid = numbers.length === 6 &&
                    new Set(numbers).size === 6 &&
                    numbers.every(number => number >= 1 && number <= 45);
                if (isValid) games.push(numbers.sort((a, b) => a - b));
                if (games.length === 5) break;
            }

            return games.length ? { round, games } : null;
        } catch (error) {
            return null;
        }
    }

    function getGamePrize(numbers, winningResult) {
        const matches = numbers.filter(number => winningResult.numbers.includes(number)).length;
        const hasBonus = numbers.includes(winningResult.bonus);
        if (matches === 6) return { matches, hasBonus, label: '1등' };
        if (matches === 5 && hasBonus) return { matches, hasBonus, label: '2등' };
        if (matches === 5) return { matches, hasBonus, label: '3등' };
        if (matches === 4) return { matches, hasBonus, label: '4등' };
        if (matches === 3) return { matches, hasBonus, label: '5등' };
        return { matches, hasBonus, label: `${matches}개 일치` };
    }

    return { normalizeOfficialQrUrl, parseLottoTicketQr, getGamePrize };
});
