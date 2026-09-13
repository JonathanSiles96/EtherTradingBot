const express = require('express');
const ccxt = require('ccxt');
const auth = require('../middleware/auth');
const ApiKey = require('../models/ApiKey');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { exchange, apiKey, apiSecret } = req.body;

    if (!exchange || !apiKey || !apiSecret) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    let existing = await ApiKey.findOne({ userId: req.user.id });
    if (existing) {
      existing.exchange = exchange;
      existing.apiKey = apiKey;
      existing.apiSecret = apiSecret;
      await existing.save();
      return res.json({ msg: 'API key updated', connected: true });
    }

    const newKey = new ApiKey({
      userId: req.user.id,
      exchange,
      apiKey,
      apiSecret,
    });
    await newKey.save();

    res.status(201).json({ msg: 'API key saved', connected: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/status', auth, async (req, res) => {
  try {
    const keyDoc = await ApiKey.findOne({ userId: req.user.id });
    if (!keyDoc) {
      return res.json({ connected: false, exchange: null });
    }

    const exchangeId = keyDoc.exchange.toLowerCase();
    if (!ccxt.exchanges.includes(exchangeId)) {
      return res.json({ connected: false, error: 'Unsupported exchange' });
    }

    const ExchangeClass = ccxt[exchangeId];
    const exchangeInstance = new ExchangeClass({
      apiKey: keyDoc.apiKey,
      secret: keyDoc.getDecryptedSecret(),
    });

    await exchangeInstance.fetchBalance();
    res.json({ connected: true, exchange: keyDoc.exchange });
  } catch (err) {
    console.error(err);
    res.json({ connected: false, error: 'API key validation failed' });
  }
});

module.exports = router;
