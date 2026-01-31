import { format, differenceInDays, addDays, parseISO, isAfter } from 'date-fns';
import { zhTW } from 'date-fns/locale';

/**
 * Format a date string for display.
 *
 * @param dateString - ISO 8601 date string
 * @param formatStr - date-fns format string
 * @returns Formatted date string
 */
export function formatDate(dateString: string, formatStr: string = 'yyyy/MM/dd'): string {
  return format(parseISO(dateString), formatStr, { locale: zhTW });
}

/**
 * Format a date string with time for display.
 *
 * @param dateString - ISO 8601 date string
 * @returns Formatted datetime string
 */
export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), 'yyyy/MM/dd HH:mm', { locale: zhTW });
}

/**
 * Get today's date as ISO 8601 string (date only).
 *
 * @returns Today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Get current datetime as ISO 8601 string.
 *
 * @returns Current datetime in ISO 8601 format
 */
export function getNowString(): string {
  return new Date().toISOString();
}

/**
 * Calculate the end date for a TPASS period (29 days after start).
 *
 * @param startDate - Period start date as ISO 8601 string
 * @returns End date as ISO 8601 string (date only)
 */
export function calculateEndDate(startDate: string): string {
  const start = parseISO(startDate);
  const end = addDays(start, 29);
  return format(end, 'yyyy-MM-dd');
}

/**
 * Calculate days elapsed in a period.
 *
 * @param startDate - Period start date as ISO 8601 string
 * @returns Number of days elapsed (1-based, today is day N)
 */
export function getDaysElapsed(startDate: string): number {
  const start = parseISO(startDate);
  const today = new Date();
  const days = differenceInDays(today, start) + 1;
  return Math.max(1, Math.min(days, 30));
}

/**
 * Calculate days remaining in a period.
 *
 * @param endDate - Period end date as ISO 8601 string
 * @returns Number of days remaining
 */
export function getDaysRemaining(endDate: string): number {
  const end = parseISO(endDate);
  const today = new Date();
  const days = differenceInDays(end, today) + 1;
  return Math.max(0, days);
}

/**
 * Check if a period has ended.
 *
 * @param endDate - Period end date as ISO 8601 string
 * @returns True if the period has ended
 */
export function isPeriodEnded(endDate: string): boolean {
  const end = parseISO(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isAfter(today, end);
}

/**
 * Format a period date range for display.
 *
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Formatted date range string
 */
export function formatPeriodRange(startDate: string, endDate: string): string {
  return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
}

