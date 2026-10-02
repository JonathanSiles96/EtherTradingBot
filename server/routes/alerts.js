const express = require('express');
const auth = require('../middleware/auth');
const alertService = require('../services/alertService');

const router = express.Router();

router.get('/', auth, (req, res) => {
  const alerts = alertService.getAlerts(req.user.id);
  res.json(alerts);
});

router.post('/', auth, (req, res) => {
  const { type, targetPrice } = req.body;

  if (!type || !['above', 'below'].includes(type)) {
    return res.status(400).json({ msg: 'Type must be "above" or "below"' });
  }
  if (!targetPrice || targetPrice <= 0) {
    return res.status(400).json({ msg: 'Valid target price is required' });
  }

  const alert = alertService.setAlert(req.user.id, { type, targetPrice });
  res.status(201).json(alert);
});

router.delete('/:alertId', auth, (req, res) => {
  const removed = alertService.removeAlert(req.user.id, req.params.alertId);
  if (!removed) return res.status(404).json({ msg: 'Alert not found' });
  res.json({ msg: 'Alert removed' });
});

module.exports = router;
