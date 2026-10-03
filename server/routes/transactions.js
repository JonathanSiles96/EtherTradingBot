const express = require('express');
const { getTransactionHistory } = require('../services/etherScan');

const router = express.Router();

router.get('/:address', async (req, res) => {
  const { address } = req.params;
  const page = parseInt(req.query.page) || 1;

  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return res.status(400).json({ msg: 'Invalid Ethereum address' });
  }

  try {
    const data = await getTransactionHistory(address, page);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch transactions' });
  }
});

module.exports = router;
