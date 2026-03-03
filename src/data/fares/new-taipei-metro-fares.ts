/**
 * New Taipei Metro (Circular Line) fare data.
 * Flat fare based on zones.
 */

import { NEW_TAIPEI_METRO_STATIONS } from '../stations/new-taipei-metro-stations';

/**
 * Fare matrix for New Taipei Metro Circular Line.
 * 14 stations (Y07-Y20), fare range: 20-40 TWD.
 * Source: New Taipei Metro official fare table (環狀線票價資訊.odt)
 */
const FARE_MATRIX: number[][] = [
  // Y07 大坪林
  [0,  20, 20, 20, 20, 25, 25, 25, 30, 30, 30, 35, 35, 40],
  // Y08 十四張
  [20,  0, 20, 20, 20, 20, 25, 25, 25, 30, 30, 30, 35, 35],
  // Y09 秀朗橋
  [20, 20,  0, 20, 20, 20, 20, 20, 25, 25, 30, 30, 35, 35],
  // Y10 景平
  [20, 20, 20,  0, 20, 20, 20, 20, 25, 25, 25, 30, 30, 35],
  // Y11 景安
  [20, 20, 20, 20,  0, 20, 20, 20, 20, 25, 25, 30, 30, 30],
  // Y12 中和
  [25, 20, 20, 20, 20,  0, 20, 20, 20, 20, 20, 25, 25, 30],
  // Y13 橋和
  [25, 25, 20, 20, 20, 20,  0, 20, 20, 20, 20, 25, 25, 30],
  // Y14 中原
  [25, 25, 20, 20, 20, 20, 20,  0, 20, 20, 20, 25, 25, 25],
  // Y15 板新
  [30, 25, 25, 25, 20, 20, 20, 20,  0, 20, 20, 20, 20, 25],
  // Y16 板橋
  [30, 30, 25, 25, 25, 20, 20, 20, 20,  0, 20, 20, 20, 25],
  // Y17 新埔民生
  [30, 30, 30, 25, 25, 20, 20, 20, 20, 20,  0, 20, 20, 20],
  // Y18 頭前庄
  [35, 30, 30, 30, 30, 25, 25, 25, 20, 20, 20,  0, 20, 20],
  // Y19 幸福
  [35, 35, 35, 30, 30, 25, 25, 25, 20, 20, 20, 20,  0, 20],
  // Y20 新北產業園區
  [40, 35, 35, 35, 30, 30, 30, 25, 25, 25, 20, 20, 20,  0]
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
