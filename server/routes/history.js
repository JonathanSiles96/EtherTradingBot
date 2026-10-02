const express = require('express');
const priceHistory = require('../services/priceHistory');

const router = express.Router();

router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(priceHistory.getHistory(limit));
});

router.get('/stats', (req, res) => {
  const stats = priceHistory.getStats();
  if (!stats) return res.status(503).json({ msg: 'No data yet' });
  res.json(stats);
});

module.exports = router;
