const express = require('express');
const auth = require('../middleware/auth');
const tradeEngine = require('../services/tradeEngine');

const router = express.Router();

router.get('/balance', auth, async (req, res) => {
  try {
    const balance = await tradeEngine.getBalance(req.user.id);
    if (!balance) return res.status(400).json({ msg: 'Exchange not connected' });
    res.json(balance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch balance' });
  }
});

router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await tradeEngine.getOpenOrders(req.user.id);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch orders' });
  }
});

router.post('/buy', auth, async (req, res) => {
  try {
    const { amount, price } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Valid amount is required' });
    }
    const order = await tradeEngine.placeBuyOrder(req.user.id, amount, price || null);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message || 'Failed to place buy order' });
  }
});

router.post('/sell', auth, async (req, res) => {
  try {
    const { amount, price } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Valid amount is required' });
    }
    const order = await tradeEngine.placeSellOrder(req.user.id, amount, price || null);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message || 'Failed to place sell order' });
  }
});

router.delete('/orders/:orderId', auth, async (req, res) => {
  try {
    const result = await tradeEngine.cancelOrder(req.user.id, req.params.orderId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to cancel order' });
  }
});

module.exports = router;
