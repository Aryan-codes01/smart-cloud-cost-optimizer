export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatConfidence(value) {
  return `${Math.round(Number(value || 0) * 100)}% confidence`;
}
