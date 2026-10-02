const ccxt = require('ccxt');
const ApiKey = require('../models/ApiKey');

async function getExchangeInstance(userId) {
  const keyDoc = await ApiKey.findOne({ userId });
  if (!keyDoc) return null;

  const exchangeId = keyDoc.exchange.toLowerCase();
  if (!ccxt.exchanges.includes(exchangeId)) return null;

  const ExchangeClass = ccxt[exchangeId];
  return new ExchangeClass({
    apiKey: keyDoc.apiKey,
    secret: keyDoc.getDecryptedSecret(),
  });
}

async function getBalance(userId) {
  const exchange = await getExchangeInstance(userId);
  if (!exchange) return null;

  const balance = await exchange.fetchBalance();
  return {
    ETH: balance.free?.ETH || 0,
    USDT: balance.free?.USDT || 0,
    total: balance.total || {},
  };
}

async function getOpenOrders(userId) {
  const exchange = await getExchangeInstance(userId);
  if (!exchange) return [];

  return exchange.fetchOpenOrders('ETH/USDT');
}

async function placeBuyOrder(userId, amount, price = null) {
  const exchange = await getExchangeInstance(userId);
  if (!exchange) throw new Error('Exchange not connected');

  if (price) {
    return exchange.createLimitBuyOrder('ETH/USDT', amount, price);
  }
  return exchange.createMarketBuyOrder('ETH/USDT', amount);
}

async function placeSellOrder(userId, amount, price = null) {
  const exchange = await getExchangeInstance(userId);
  if (!exchange) throw new Error('Exchange not connected');

  if (price) {
    return exchange.createLimitSellOrder('ETH/USDT', amount, price);
  }
  return exchange.createMarketSellOrder('ETH/USDT', amount);
}

async function cancelOrder(userId, orderId) {
  const exchange = await getExchangeInstance(userId);
  if (!exchange) throw new Error('Exchange not connected');

  return exchange.cancelOrder(orderId, 'ETH/USDT');
}

module.exports = { getBalance, getOpenOrders, placeBuyOrder, placeSellOrder, cancelOrder };
