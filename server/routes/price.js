const express = require('express');
const etherScan = require('../services/etherScan');

const router = express.Router();

router.get('/', (req, res) => {
  const data = etherScan.getLatestPrice();
  if (!data) {
    return res.status(503).json({ msg: 'Price not available yet' });
  }
  res.json({ price: data.price, change24h: data.change24h, timestamp: data.timestamp });
});

module.exports = router;
