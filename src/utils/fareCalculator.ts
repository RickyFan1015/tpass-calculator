import { TransportType, type YouBikeCity } from '../types';
import { getMetroFare } from '../data/fares/taipei-metro-fares';
import { getTaoyuanMetroFare } from '../data/fares/taoyuan-metro-fares';
import { getNewTaipeiMetroFare, isNewTaipeiCrossLine } from '../data/fares/new-taipei-metro-fares';
import { getTRAFare } from '../data/fares/tra-fares';

/**
 * Default TPASS ticket price.
 */
export const TPASS_TICKET_PRICE = 1200;

/**
 * Calculate YouBike 2.0 fee based on duration and city.
 * Note: Only tracks YouBike 2.0, not YouBike 2.0E (electric assist).
 *
 * @param minutes - Total riding duration in minutes
 * @param city - City where the ride occurred
 * @returns Calculated fee in TWD
 */
export function calculateYouBikeFee(minutes: number, city: YouBikeCity): number {
  // Free minutes: Taoyuan 60min, others (Taipei/NewTaipei/Keelung) 30min
  const freeMinutes = city === 'taoyuan' ? 60 : 30;

  if (minutes <= freeMinutes) return 0;

  const chargeableMinutes = minutes - freeMinutes;
  let fee = 0;
  let remaining = chargeableMinutes;

  // Tier 1: Within 4 hours (240 min - free time), $10 per 30 min
  const tier1MaxMinutes = 240 - freeMinutes;
  const tier1Minutes = Math.min(remaining, tier1MaxMinutes);
  fee += Math.ceil(tier1Minutes / 30) * 10;
  remaining -= tier1Minutes;

  // Tier 2: 4-8 hours, $20 per 30 min
  if (remaining > 0) {
    const tier2Minutes = Math.min(remaining, 240);
    fee += Math.ceil(tier2Minutes / 30) * 20;
    remaining -= tier2Minutes;
  }

  // Tier 3: Over 8 hours, $40 per 30 min
  if (remaining > 0) {
    fee += Math.ceil(remaining / 30) * 40;
  }

  return fee;
}

/**
 * Calculate bus fare based on segments.
 *
 * @param segments - Number of bus segments
 * @param farePerSegment - Fare per segment (default 15)
 * @returns Total bus fare
 */
export function calculateBusFare(segments: number, farePerSegment: number = 15): number {
  return segments * farePerSegment;
}

/**
 * Calculate saved amount for a period.
 *
 * @param totalTripAmount - Total trip amounts in the period
 * @param ticketPrice - TPASS ticket price (default 1200)
 * @returns Saved amount (positive = savings, negative = loss)
 */
export function calculateSavedAmount(totalTripAmount: number, ticketPrice: number = TPASS_TICKET_PRICE): number {
  return totalTripAmount - ticketPrice;
}

/**
 * Calculate fare between two stations based on transport type.
 *
 * @param transportType - The transit system type
 * @param from - Departure station name
 * @param to - Arrival station name
 * @returns Fare in TWD, or 0 if unknown type or stations not found
 */
export function calculateStationFare(transportType: TransportType, from: string, to: string): number {
  switch (transportType) {
    case TransportType.TAIPEI_METRO:
      return getMetroFare(from, to);
    case TransportType.TAOYUAN_METRO:
      return getTaoyuanMetroFare(from, to);
    case TransportType.NEW_TAIPEI_METRO:
      return getNewTaipeiMetroFare(from, to);
    case TransportType.TRA:
      return getTRAFare(from, to);
    default:
      return 0;
  }
}

/**
 * Check if a station-based trip involves a cross-line selection that should be blocked.
 * Currently only New Taipei Metro has multiple lines that cannot share a single fare.
 *
 * @param transportType - The transit system type
 * @param from - Departure station name
 * @param to - Arrival station name
 * @returns True if the selection is cross-line and should be blocked
 */
export function isCrossLineBlocked(transportType: TransportType, from: string, to: string): boolean {
  if (transportType === TransportType.NEW_TAIPEI_METRO) {
    return isNewTaipeiCrossLine(from, to);
  }
  return false;
}

/**
 * Validate trip amount.
 *
 * @param amount - Amount to validate
 * @returns True if amount is valid (0 < amount <= 10000)
 */
export function isValidAmount(amount: number): boolean {
  return amount > 0 && amount <= 10000;
}

/**
 * Validate YouBike amount (allows 0 for free ride promotions).
 *
 * @param amount - Amount to validate
 * @returns True if amount is valid (0 <= amount <= 10000)
 */
export function isValidYouBikeAmount(amount: number): boolean {
  return amount >= 0 && amount <= 10000;
}

/**
 * Validate YouBike duration.
 *
 * @param duration - Duration in minutes
 * @returns True if duration is valid (1 <= duration <= 1440)
 */
export function isValidYouBikeDuration(duration: number): boolean {
  return duration >= 1 && duration <= 1440;
}

/**
 * Validate bus segments.
 *
 * @param segments - Number of segments
 * @returns True if segments is valid (1 <= segments <= 10)
 */
export function isValidBusSegments(segments: number): boolean {
  return segments >= 1 && segments <= 10;
}
