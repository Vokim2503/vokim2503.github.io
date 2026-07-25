const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeOfficialQrUrl, parseLottoTicketQr, getGamePrize } = require('../qr-core.js');

const winning1234 = {
  round: 1234,
  numbers: [1, 15, 19, 31, 35, 43],
  bonus: 27,
};

test('accepts an official lottery QR and upgrades it to HTTPS', () => {
  const input = 'http://qr.dhlottery.co.kr/?v=1234q011519313543q020304050607';
  assert.equal(
    normalizeOfficialQrUrl(input),
    'https://qr.dhlottery.co.kr/?v=1234q011519313543q020304050607'
  );
});

test('rejects lookalike and non-web QR destinations', () => {
  assert.equal(normalizeOfficialQrUrl('https://qr.dhlottery.co.kr.evil.example/?v=1234q011519313543'), '');
  assert.equal(normalizeOfficialQrUrl('javascript:alert(1)'), '');
  assert.equal(normalizeOfficialQrUrl('https://example.com/?v=1234q011519313543'), '');
});

test('parses up to five valid six-number games from a ticket QR', () => {
  const ticket = parseLottoTicketQr(
    'https://qr.dhlottery.co.kr/?v=1234q011519313543q020304050607q081020304045q091121334044q121827364142q010101010101'
  );

  assert.deepEqual(ticket, {
    round: 1234,
    games: [
      [1, 15, 19, 31, 35, 43],
      [2, 3, 4, 5, 6, 7],
      [8, 10, 20, 30, 40, 45],
      [9, 11, 21, 33, 40, 44],
      [12, 18, 27, 36, 41, 42],
    ],
  });
});

test('rejects malformed tickets and duplicate or out-of-range games', () => {
  assert.equal(parseLottoTicketQr('https://qr.dhlottery.co.kr/?v=bad'), null);
  assert.equal(parseLottoTicketQr('https://qr.dhlottery.co.kr/?v=1234q010101010101q004647484950'), null);
});

test('classifies first through fifth prize and non-winning games', () => {
  assert.deepEqual(getGamePrize([1, 15, 19, 31, 35, 43], winning1234), { matches: 6, hasBonus: false, label: '1등' });
  assert.deepEqual(getGamePrize([1, 15, 19, 31, 35, 27], winning1234), { matches: 5, hasBonus: true, label: '2등' });
  assert.deepEqual(getGamePrize([1, 15, 19, 31, 35, 2], winning1234), { matches: 5, hasBonus: false, label: '3등' });
  assert.deepEqual(getGamePrize([1, 15, 19, 31, 2, 3], winning1234), { matches: 4, hasBonus: false, label: '4등' });
  assert.deepEqual(getGamePrize([1, 15, 19, 2, 3, 4], winning1234), { matches: 3, hasBonus: false, label: '5등' });
  assert.deepEqual(getGamePrize([1, 2, 3, 4, 5, 6], winning1234), { matches: 1, hasBonus: false, label: '1개 일치' });
});
