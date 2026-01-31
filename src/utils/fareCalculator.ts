import type { YouBikeCity } from '../types';

/**
 * Default TPASS ticket price.
 */
export const TPASS_TICKET_PRICE = 1200;

/**
 * Default bus fare per segment.
 */
export const DEFAULT_BUS_FARE = 15;

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
export function calculateBusFare(segments: number, farePerSegment: number = DEFAULT_BUS_FARE): number {
  return segments * farePerSegment;
}

/**
 * Calculate TPASS refund amount.
 *
 * @param daysElapsed - Number of days elapsed since start
 * @returns Refund amount (can be negative if no refund available)
 */
export function calculateRefundAmount(daysElapsed: number): number {
  // Formula: 1200 - (days × 300) - 20 (handling fee)
  const deduction = daysElapsed * 300;
  const handlingFee = 20;
  return TPASS_TICKET_PRICE - deduction - handlingFee;
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
 * Validate trip amount.
 *
 * @param amount - Amount to validate
 * @returns True if amount is valid (0 < amount <= 10000)
 */
export function isValidAmount(amount: number): boolean {
  return amount > 0 && amount <= 10000;
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
