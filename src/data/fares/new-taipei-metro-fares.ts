/**
 * New Taipei Metro (Circular Line) fare data.
 * Flat fare based on zones.
 */

import { NEW_TAIPEI_METRO_STATIONS } from '../stations/new-taipei-metro-stations';

/**
 * Fare matrix for New Taipei Metro Circular Line.
 * 15 stations (Y06-Y20), fare range: 20-55 TWD
 */
const FARE_MATRIX: number[][] = [
  // Y06 大坪林
  [0, 20, 20, 25, 30, 30, 35, 35, 40, 40, 45, 45, 50, 50, 55],
  // Y07 新北產業園區
  [20, 0, 20, 20, 25, 25, 30, 30, 35, 35, 40, 40, 45, 45, 50],
  // Y08 幸福
  [20, 20, 0, 20, 20, 25, 25, 30, 30, 35, 35, 40, 40, 45, 45],
  // Y09 頭前庄
  [25, 20, 20, 0, 20, 20, 25, 25, 30, 30, 35, 35, 40, 40, 45],
  // Y10 新埔民生
  [30, 25, 20, 20, 0, 20, 20, 25, 25, 30, 30, 35, 35, 40, 40],
  // Y11 板橋
  [30, 25, 25, 20, 20, 0, 20, 20, 25, 25, 30, 30, 35, 35, 40],
  // Y12 板新
  [35, 30, 25, 25, 20, 20, 0, 20, 20, 25, 25, 30, 30, 35, 35],
  // Y13 中和
  [35, 30, 30, 25, 25, 20, 20, 0, 20, 20, 25, 25, 30, 30, 35],
  // Y14 橋和
  [40, 35, 30, 30, 25, 25, 20, 20, 0, 20, 20, 25, 25, 30, 30],
  // Y15 中原
  [40, 35, 35, 30, 30, 25, 25, 20, 20, 0, 20, 20, 25, 25, 30],
  // Y16 板南
  [45, 40, 35, 35, 30, 30, 25, 25, 20, 20, 0, 20, 20, 25, 25],
  // Y17 景安
  [45, 40, 40, 35, 35, 30, 30, 25, 25, 20, 20, 0, 20, 20, 25],
  // Y18 景平
  [50, 45, 40, 40, 35, 35, 30, 30, 25, 25, 20, 20, 0, 20, 20],
  // Y19 秀朗橋
  [50, 45, 45, 40, 40, 35, 35, 30, 30, 25, 25, 20, 20, 0, 20],
  // Y20 十四張
  [55, 50, 45, 45, 40, 40, 35, 35, 30, 30, 25, 25, 20, 20, 0]
];

/**
 * Station name to index mapping.
 */
const STATION_INDEX: Record<string, number> = {};
NEW_TAIPEI_METRO_STATIONS.forEach((station, index) => {
  STATION_INDEX[station.name] = index;
});

/**
 * Get fare between two New Taipei Metro stations.
 *
 * @param fromStation - Departure station name
 * @param toStation - Arrival station name
 * @returns Fare in TWD, or 0 if stations not found
 */
export function getNewTaipeiMetroFare(fromStation: string, toStation: string): number {
  const fromIndex = STATION_INDEX[fromStation];
  const toIndex = STATION_INDEX[toStation];

  if (fromIndex === undefined || toIndex === undefined) {
    return 0;
  }

  return FARE_MATRIX[fromIndex][toIndex];
}
