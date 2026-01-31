/**
 * Format an amount as TWD currency.
 *
 * @param amount - Amount in TWD
 * @returns Formatted currency string (e.g., "NT$ 1,200")
 */
export function formatCurrency(amount: number): string {
  return `NT$ ${amount.toLocaleString('zh-TW')}`;
}

/**
 * Format an amount with sign indicator.
 *
 * @param amount - Amount in TWD (positive = saved, negative = loss)
 * @returns Formatted currency string with sign
 */
export function formatSavedAmount(amount: number): string {
  const prefix = amount >= 0 ? '+' : '';
  return `${prefix}${formatCurrency(amount)}`;
}

/**
 * Format minutes as duration string.
 *
 * @param minutes - Duration in minutes
 * @returns Formatted duration (e.g., "1h 30m" or "45m")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Format a percentage value.
 *
 * @param value - Decimal value (e.g., 0.75 for 75%)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
