const nock = require('nock');

beforeEach(() => {
  nock('https://api.exchangeratesapi.io')
    .get('/latest?base=USD')
    .reply(200, {
      'base': 'USD',
      'rates': {
        'EUR': 0.899
      }
    });

  nock('https://api.exchangeratesapi.io')
    .get('/latest?base=EUR')
    .reply(200, {
      'base': 'EUR',
      'rates': {
        'USD': 1.1122
      }
    });

  nock('https://blockchain.info')
    .get('/ticker')
    .reply(200, {
      'USD': {
        '15m': 8944.49,
        'last': 8944.49,
        'buy': 8944.49,
        'sell': 8944.49,
        'symbol': '$'
      },
      'EUR': {
        '15m': 8048.11,
        'last': 8048.11,
        'buy': 8048.11,
        'sell': 8048.11,
        'symbol': '€'
      }
    });
});

test('convert 1 USD to EUR', async () => {
  const amount = 1,
    from = "USD",
    to = "EUR";
  const opts = { amount, from, to };
  const result = await currency(opts);
  expect(result).toBe(0.899);
});

test('convert 1 USD to USD', async () => {
  const amount = 1,
    from = "USD",
    to = "USD";
  const opts = { amount, from, to };
  const result = await currency(opts);
  expect(result).toBe(1);
});

test("convert 1 EUR to USD", async () => {
  const amount = 1,
    from = "EUR";
    to = "USD",
  const opts = { amount, from, to };
  const result = await currency(opts);
  expect(result).toBe(1.1122);
});

test("convert 1 BTC to USD", async () => {
  const amount = 1,
    from = "BTC",
    to = "USD";
  const opts = { amount, from, to };
  const result = await currency(opts);
  expect(result).toBe(8944.49);
});;

test("convert 1 BTC to EUR", async () => {
  const amount = 1,
    from = "BTC",
    to = "EUR";
  const opts = { amount, from, to };
  const result = await currency(opts);
  expect(result).toBe(8048.11);
});

test('convert without arguments', async () => {
  const opts = {};
  const result = await currency(opts);
  expect(result).toBe(8944.49);
});

test('convert with amount only', async () => {
  const amount = 1;
  const opts = { amount };
  const result = await currency(opts);
  expect(result).toBe(8944.49);
});

test("convert with amount and (from) currency only", async () => {
  const amount = 1,
    from = "USD";
  const opts = { amount, from };
  const result = await currency(opts);
  expect(result).toBe(8944.49);
});

test("convert without a correct `from` or `to` currency value", () => {
  const amount = 1,
    from = "BREYCOIN",
    to = "BTC";
  const opts = { amount, from, to };
  return currency(opts).catch(e => expect(e.message).toMatch("ERROR"));
});