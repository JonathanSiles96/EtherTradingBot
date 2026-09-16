const express = require('express');

const router = express.Router();

let cachedPrice = null;
let lastFetch = 0;
const CACHE_MS = 15000;

router.get('/', async (req, res) => {
  try {
    const now = Date.now();
    if (cachedPrice && now - lastFetch < CACHE_MS) {
      return res.json(cachedPrice);
    }

    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await response.json();

    cachedPrice = {
      price: data.ethereum.usd,
      change24h: data.ethereum.usd_24h_change,
    };
    lastFetch = now;

    res.json(cachedPrice);
  } catch (err) {
    console.error(err);
    if (cachedPrice) return res.json(cachedPrice);
    res.status(500).json({ msg: 'Failed to fetch price' });
  }
});

module.exports = router;
