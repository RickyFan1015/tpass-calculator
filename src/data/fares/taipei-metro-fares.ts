/**
 * Taipei Metro fare calculation.
 *
 * Fare zones based on distance:
 * - Zone 1 (0-5km): NT$20
 * - Zone 2 (5-8km): NT$25
 * - Zone 3 (8-11km): NT$30
 * - Zone 4 (11-14km): NT$35
 * - Zone 5 (14-17km): NT$40
 * - Zone 6 (17-20km): NT$45
 * - Zone 7 (20-23km): NT$50
 * - Zone 8 (23-27km): NT$55
 * - Zone 9 (27-31km): NT$60
 * - Zone 10 (31km+): NT$65
 */

import { TAIPEI_METRO_STATIONS, type MetroStation } from '../stations/taipei-metro-stations';

// Simplified fare matrix based on common routes
// Key format: "fromCode-toCode" or "toCode-fromCode" (symmetric)
// This is a simplified version - full matrix would require official data

/**
 * Station distance zones (approximate station index difference).
 * This is a simplified approximation.
 */
function getStationIndex(code: string): number {
  const index = TAIPEI_METRO_STATIONS.findIndex(s => s.code === code);
  return index >= 0 ? index : 0;
}

/**
 * Calculate fare based on station distance approximation.
 * This is a simplified calculation - actual fares may vary.
 *
 * @param fromCode - Departure station code
 * @param toCode - Arrival station code
 * @returns Fare in TWD
 */
export function calculateTaipeiMetroFare(fromCode: string, toCode: string): number {
  if (fromCode === toCode) return 20; // Minimum fare

  const fromStation = TAIPEI_METRO_STATIONS.find(s => s.code === fromCode);
  const toStation = TAIPEI_METRO_STATIONS.find(s => s.code === toCode);

  if (!fromStation || !toStation) return 20;

  // Check if on same line for direct distance
  const sameLine = fromStation.line === toStation.line;

  if (sameLine) {
    // Stations on same line - use index difference
    const fromIdx = getStationIndex(fromCode);
    const toIdx = getStationIndex(toCode);
    const stationDiff = Math.abs(toIdx - fromIdx);

    return calculateFareByStations(stationDiff);
  }

  // Different lines - need transfer
  // Use simplified distance estimation
  const fromIdx = getStationIndex(fromCode);
  const toIdx = getStationIndex(toCode);
  const baseDiff = Math.abs(toIdx - fromIdx);

  // Add transfer penalty (approximate)
  const transferCount = hasDirectTransfer(fromStation, toStation) ? 1 : 2;
  const adjustedDiff = baseDiff + transferCount * 2;

  return calculateFareByStations(adjustedDiff);
}

/**
 * Check if two stations have a direct transfer connection.
 *
 * @param from - From station
 * @param to - To station
 * @returns True if direct transfer exists
 */
function hasDirectTransfer(from: MetroStation, to: MetroStation): boolean {
  if (!from.transferLines || !to.transferLines) return false;
  return from.transferLines.some(line =>
    line === to.line || to.transferLines?.includes(line)
  );
}

/**
 * Calculate fare based on number of stations.
 *
 * @param stationCount - Number of stations traveled
 * @returns Fare in TWD
 */
function calculateFareByStations(stationCount: number): number {
  if (stationCount <= 2) return 20;
  if (stationCount <= 4) return 25;
  if (stationCount <= 6) return 30;
  if (stationCount <= 8) return 35;
  if (stationCount <= 10) return 40;
  if (stationCount <= 12) return 45;
  if (stationCount <= 15) return 50;
  if (stationCount <= 18) return 55;
  if (stationCount <= 22) return 60;
  return 65;
}

/**
 * Common fare lookup table for frequently used routes.
 * Format: "fromName-toName": fare
 */
export const COMMON_FARE_TABLE: Record<string, number> = {
  // Example common routes (add more as needed)
  '台北車站-西門': 20,
  '台北車站-忠孝復興': 20,
  '台北車站-市政府': 25,
  '台北車站-南港展覽館': 30,
  '台北車站-板橋': 25,
  '台北車站-淡水': 50,
  '台北車站-動物園': 35,
  '西門-龍山寺': 20,
  '忠孝復興-南京復興': 20,
  '忠孝復興-台北101/世貿': 25
};

/**
 * Get fare from common routes table.
 *
 * @param fromName - From station name
 * @param toName - To station name
 * @returns Fare or undefined if not in table
 */
export function getCommonFare(fromName: string, toName: string): number | undefined {
  const key1 = `${fromName}-${toName}`;
  const key2 = `${toName}-${fromName}`;
  return COMMON_FARE_TABLE[key1] || COMMON_FARE_TABLE[key2];
}

/**
 * Calculate metro fare with fallback to estimation.
 *
 * @param fromName - From station name
 * @param toName - To station name
 * @returns Fare in TWD
 */
export function getMetroFare(fromName: string, toName: string): number {
  // First check common routes
  const commonFare = getCommonFare(fromName, toName);
  if (commonFare) return commonFare;

  // Find station codes
  const fromStation = TAIPEI_METRO_STATIONS.find(s => s.name === fromName);
  const toStation = TAIPEI_METRO_STATIONS.find(s => s.name === toName);

  if (!fromStation || !toStation) return 20; // Default minimum

  return calculateTaipeiMetroFare(fromStation.code, toStation.code);
}
