// Generates real, dynamic alerts from a farm's actual data -- weather,
// sowing/harvesting dates, and status. No mock data, no fixed alert types.

const DAY_MS = 24 * 60 * 60 * 1000;

const daysBetween = (fromDateStr, toDateStr) => {
  const from = new Date(fromDateStr);
  const to = new Date(toDateStr);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;
  // Compare calendar days only, ignore time-of-day drift
  const fromMidnight = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const toMidnight = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((toMidnight - fromMidnight) / DAY_MS);
};

const relativeDayLabel = (days) => {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 1) return `In ${days} days`;
  return `${Math.abs(days)} days overdue`;
};

/**
 * Builds all alerts for a single farm (weather + calendar + status).
 * @param {object} farm - normalized farm record (id, name, location, status, currentCrop, sowingDate, harvestingDate)
 * @param {object|null} weather - result of getFarmWeather(farm.location), or null if unavailable
 * @returns {Array} alert objects: { id, severity, type, title, message, farmName, farmId, daysAway }
 */
export const buildFarmAlerts = (farm, weather) => {
  const alerts = [];
  const today = new Date().toISOString().slice(0, 10);
  const farmName = farm.name || farm.farmName || 'Unnamed farm';
  const cropName = farm.currentCrop || 'this crop';

  // ── Weather-based alert ────────────────────────────────────────────────
  if (weather && weather.tomorrowRainChance >= 60) {
    alerts.push({
      id: `weather-${farm.id}`,
      severity: 'warning',
      type: 'weather',
      title: 'Rain likely tomorrow',
      message: `${weather.tomorrowRainChance}% chance of rain expected at ${farmName} tomorrow. Consider delaying spraying or irrigation.`,
      farmName,
      farmId: farm.id,
      daysAway: 1,
    });
  } else if (weather && weather.currentCondition && /thunder|storm/i.test(weather.currentCondition)) {
    alerts.push({
      id: `weather-now-${farm.id}`,
      severity: 'urgent',
      type: 'weather',
      title: 'Severe weather right now',
      message: `${weather.currentCondition} currently at ${farmName}. Avoid fieldwork until conditions clear.`,
      farmName,
      farmId: farm.id,
      daysAway: 0,
    });
  }

  // ── Harvesting date alert ───────────────────────────────────────────────
  if (farm.harvestingDate) {
    const days = daysBetween(today, farm.harvestingDate);
    if (days !== null) {
      if (days < 0) {
        alerts.push({
          id: `harvest-overdue-${farm.id}`,
          severity: 'urgent',
          type: 'harvest',
          title: 'Harvesting overdue',
          message: `${cropName} at ${farmName} was due for harvesting ${relativeDayLabel(days)}.`,
          farmName,
          farmId: farm.id,
          daysAway: days,
        });
      } else if (days <= 5) {
        alerts.push({
          id: `harvest-upcoming-${farm.id}`,
          severity: days <= 1 ? 'urgent' : 'warning',
          type: 'harvest',
          title: 'Harvesting coming up',
          message: `${cropName} at ${farmName} is due for harvesting ${relativeDayLabel(days).toLowerCase()}.`,
          farmName,
          farmId: farm.id,
          daysAway: days,
        });
      }
    }
  }

  // ── Sowing date alert ────────────────────────────────────────────────────
  if (farm.sowingDate) {
    const days = daysBetween(today, farm.sowingDate);
    if (days !== null && days >= 0 && days <= 3) {
      alerts.push({
        id: `sowing-upcoming-${farm.id}`,
        severity: 'info',
        type: 'sowing',
        title: 'Sowing reminder',
        message: `${cropName} sowing is planned at ${farmName} ${relativeDayLabel(days).toLowerCase()}.`,
        farmName,
        farmId: farm.id,
        daysAway: days,
      });
    }
  }

  // ── Farm status alert ────────────────────────────────────────────────────
  if (farm.status === 'Needs Attention') {
    alerts.push({
      id: `status-${farm.id}`,
      severity: 'warning',
      type: 'status',
      title: 'Farm needs attention',
      message: `${farmName} is currently marked "Needs Attention".`,
      farmName,
      farmId: farm.id,
      daysAway: 0,
    });
  } else if (farm.status === 'Under Maintenance') {
    alerts.push({
      id: `status-${farm.id}`,
      severity: 'info',
      type: 'status',
      title: 'Farm under maintenance',
      message: `${farmName} is currently marked "Under Maintenance".`,
      farmName,
      farmId: farm.id,
      daysAway: 0,
    });
  }

  return alerts;
};

const SEVERITY_ORDER = { urgent: 0, warning: 1, info: 2 };

/** Sorts a flat list of alerts: most urgent first, then soonest first. */
export const sortAlerts = (alerts) =>
  [...alerts].sort((a, b) => {
    const sevDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    if (sevDiff !== 0) return sevDiff;
    return (a.daysAway ?? 0) - (b.daysAway ?? 0);
  });
