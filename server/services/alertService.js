const alerts = new Map();

function setAlert(userId, { type, targetPrice }) {
  if (!alerts.has(userId)) {
    alerts.set(userId, []);
  }
  const alert = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    targetPrice,
    createdAt: new Date().toISOString(),
    triggered: false,
  };
  alerts.get(userId).push(alert);
  return alert;
}

function getAlerts(userId) {
  return alerts.get(userId) || [];
}

function removeAlert(userId, alertId) {
  const userAlerts = alerts.get(userId);
  if (!userAlerts) return false;
  const index = userAlerts.findIndex((a) => a.id === alertId);
  if (index === -1) return false;
  userAlerts.splice(index, 1);
  return true;
}

function checkAlerts(currentPrice) {
  const triggered = [];

  for (const [userId, userAlerts] of alerts) {
    for (const alert of userAlerts) {
      if (alert.triggered) continue;

      const hit =
        (alert.type === 'above' && currentPrice >= alert.targetPrice) ||
        (alert.type === 'below' && currentPrice <= alert.targetPrice);

      if (hit) {
        alert.triggered = true;
        alert.triggeredAt = new Date().toISOString();
        alert.triggeredPrice = currentPrice;
        triggered.push({ userId, alert });
      }
    }
  }

  return triggered;
}

module.exports = { setAlert, getAlerts, removeAlert, checkAlerts };
