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

