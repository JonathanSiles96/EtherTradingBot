const priceHistory = require('./priceHistory');
const alertService = require('./alertService');

const INTERVAL_MS = 30000;

let intervalId = null;
let latestPrice = null;

async function fetchPrice() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await res.json();
    latestPrice = {
      price: data.ethereum.usd,
      change24h: data.ethereum.usd_24h_change,
      timestamp: new Date().toISOString(),
    };

    priceHistory.record(latestPrice);

    const triggered = alertService.checkAlerts(latestPrice.price);
    if (triggered.length > 0) {
      console.log(`[EtherScan] ${triggered.length} alert(s) triggered at $${latestPrice.price}`);
    }

    console.log(
      `[EtherScan] ETH/USD: $${latestPrice.price} (${latestPrice.change24h >= 0 ? '+' : ''}${latestPrice.change24h.toFixed(2)}%)`
    );
  } catch (err) {
    console.error('[EtherScan] Failed to fetch price:', err.message);
  }
}

async function getTransactionHistory(address, page = 1) {
  const apiKey = process.env.ETHERSCAN_API_KEY || '';

  let url;
  let useEtherscan = false;

  if (apiKey) {
    url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${encodeURIComponent(address)}&startblock=0&endblock=99999999&page=${page}&offset=25&sort=desc&apikey=${apiKey}`;
    useEtherscan = true;
  } else {
    url = `https://eth.blockscout.com/api?module=account&action=txlist&address=${encodeURIComponent(address)}&startblock=0&endblock=99999999&page=${page}&offset=25&sort=desc`;
  }

  const res = await fetch(url);
  const data = await res.json();

  const results = data.result;
  if (!Array.isArray(results) || results.length === 0) {
    return { transactions: [] };
  }

  const result = {
    transactions: results.map((tx) => {
      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: (parseInt(tx.value) / 1e18).toFixed(6),
        gasUsed: tx.gasUsed,
        gasPrice: (parseInt(tx.gasPrice) / 1e9).toFixed(2),
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        blockNumber: tx.blockNumber,
        confirmations: tx.confirmations,
        isError: tx.isError === '1',
      }
    }),
  };

  return result;
}

function start() {
  console.log('[EtherScan] Scanner started');
  fetchPrice();
  intervalId = setInterval(fetchPrice, INTERVAL_MS);
}

function stop() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('[EtherScan] Scanner stopped');
  }
}

function getLatestPrice() {
  return latestPrice;
}

module.exports = { start, stop, getLatestPrice, getTransactionHistory };
