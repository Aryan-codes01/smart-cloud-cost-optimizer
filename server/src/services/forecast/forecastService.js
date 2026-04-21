import { clamp, roundCurrency } from "../../utils/formatters.js";

export function buildForecast(monthlyTrend) {
  if (monthlyTrend.length === 0) {
    return {
      nextMonth: 0,
      confidence: 0,
      deltaPct: 0,
      scenarios: [],
    };
  }

  if (monthlyTrend.length === 1) {
    const base = monthlyTrend[0].cost;
    return {
      nextMonth: roundCurrency(base),
      confidence: 0.62,
      deltaPct: 0,
      scenarios: [
        { label: "Conservative", amount: roundCurrency(base * 0.94) },
        { label: "Expected", amount: roundCurrency(base) },
        { label: "Peak", amount: roundCurrency(base * 1.08) },
      ],
    };
  }

  const costs = monthlyTrend.map((item) => item.cost);
  const last = costs.at(-1);
  const previous = costs.at(-2);
  const averageChange =
    costs.slice(1).reduce((total, value, index) => total + (value - costs[index]), 0) /
    (costs.length - 1);
  const nextMonth = roundCurrency(last + averageChange);
  const deltaPct = previous ? ((nextMonth - previous) / previous) * 100 : 0;
  const volatility =
    costs.reduce((total, value) => total + Math.abs(value - last), 0) /
    Math.max(costs.length, 1);
  const confidence = clamp(1 - volatility / Math.max(last, 1), 0.58, 0.94);

  return {
    nextMonth,
    confidence: roundCurrency(confidence),
    deltaPct: roundCurrency(deltaPct),
    scenarios: [
      { label: "Conservative", amount: roundCurrency(nextMonth * 0.92) },
      { label: "Expected", amount: nextMonth },
      { label: "Peak", amount: roundCurrency(nextMonth * 1.09) },
    ],
  };
}
