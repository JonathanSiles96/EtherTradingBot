const MAX_ENTRIES = 100;
const history = [];

function record(priceData) {
  history.push({
    price: priceData.price,
    change24h: priceData.change24h,
    timestamp: priceData.timestamp,
  });
  if (history.length > MAX_ENTRIES) {
    history.shift();
  }
}

function getHistory(limit = 50) {
  return history.slice(-limit);
}

function getStats() {
  if (history.length === 0) return null;

  const prices = history.map((h) => h.price);
  const high = Math.max(...prices);
  const low = Math.min(...prices);
  const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const latest = prices[prices.length - 1];
  const oldest = prices[0];
  const changePercent = ((latest - oldest) / oldest) * 100;

  return {
    high,
    low,
    avg: Math.round(avg * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    dataPoints: history.length,
    since: history[0].timestamp,
  };
}

module.exports = { record, getHistory, getStats };
