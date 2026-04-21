export function roundCurrency(value) {
  return Number((value || 0).toFixed(2));
}

export function sumValues(list, key) {
  return list.reduce((total, item) => total + Number(item[key] || 0), 0);
}

export function groupBy(list, keySelector) {
  return list.reduce((accumulator, item) => {
    const key =
      typeof keySelector === "function" ? keySelector(item) : item[keySelector];
    if (!accumulator[key]) {
      accumulator[key] = [];
    }
    accumulator[key].push(item);
    return accumulator;
  }, {});
}

export function formatMonthLabel(monthValue) {
  const [year, month] = monthValue.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
