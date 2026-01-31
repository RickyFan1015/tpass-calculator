import { getDaysElapsed, getDaysRemaining } from './dateUtils';
import { calculateSavedAmount, TPASS_TICKET_PRICE } from './fareCalculator';
import type { TPASSPeriod, TripRecord, PeriodStats } from '../types';
import { TransportType } from '../types';

/**
 * Calculate statistics for a specific period.
 *
 * @param period - The period to calculate stats for
 * @param trips - Trips belonging to this period
 * @returns Period statistics
 */
export function calculatePeriodStats(period: TPASSPeriod, trips: TripRecord[]): PeriodStats {
  const totalAmount = trips.reduce((sum, trip) => sum + trip.amount, 0);
  const tripCount = trips.length;
  const savedAmount = calculateSavedAmount(totalAmount, period.ticketPrice);
  const daysElapsed = getDaysElapsed(period.startDate);
  const daysRemaining = getDaysRemaining(period.endDate);
  const dailyAverage = daysElapsed > 0 ? totalAmount / daysElapsed : 0;

  // Calculate breakdown by transport type
  const transportBreakdown = {} as Record<TransportType, { count: number; amount: number }>;

  // Initialize all transport types
  Object.values(TransportType).forEach(type => {
    transportBreakdown[type] = { count: 0, amount: 0 };
  });

  // Aggregate trips
  trips.forEach(trip => {
    transportBreakdown[trip.transportType].count += 1;
    transportBreakdown[trip.transportType].amount += trip.amount;
  });

  return {
    totalAmount,
    tripCount,
    savedAmount,
    daysElapsed,
    daysRemaining,
    dailyAverage,
    transportBreakdown
  };
}

/**
 * Calculate how much more spending is needed to break even.
 *
 * @param currentAmount - Current total trip amount
 * @param ticketPrice - TPASS ticket price (default 1200)
 * @returns Amount needed to break even (0 if already profitable)
 */
export function getAmountToBreakEven(currentAmount: number, ticketPrice: number = TPASS_TICKET_PRICE): number {
  const remaining = ticketPrice - currentAmount;
  return Math.max(0, remaining);
}
