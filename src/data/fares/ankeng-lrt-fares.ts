/**
 * Ankeng Light Rail fare data.
 * Simple distance-based fare: 20-30 TWD
 */

import { ANKENG_LRT_STATIONS } from '../stations/ankeng-lrt-stations';

/**
 * Fare matrix for Ankeng LRT.
 * 9 stations, fare range: 20-30 TWD
 */
const FARE_MATRIX: number[][] = [
  // K01 十四張
  [0, 20, 20, 20, 25, 25, 25, 30, 30],
  // K02 陽光運動公園
  [20, 0, 20, 20, 20, 25, 25, 25, 30],
  // K03 新和國小
  [20, 20, 0, 20, 20, 20, 25, 25, 25],
  // K04 安康
  [20, 20, 20, 0, 20, 20, 20, 25, 25],
  // K05 景文科大
  [25, 20, 20, 20, 0, 20, 20, 20, 25],
  // K06 耕莘安康院區
  [25, 25, 20, 20, 20, 0, 20, 20, 20],
  // K07 安坑國小
  [25, 25, 25, 20, 20, 20, 0, 20, 20],
  // K08 雙城
  [30, 25, 25, 25, 20, 20, 20, 0, 20],
  // K09 玫瑰中國城
  [30, 30, 25, 25, 25, 20, 20, 20, 0]
];

/**
 * Station name to index mapping.
 */
const STATION_INDEX: Record<string, number> = {};
ANKENG_LRT_STATIONS.forEach((station, index) => {
  STATION_INDEX[station.name] = index;
});

/**
 * Get fare between two Ankeng LRT stations.
 *
 * @param fromStation - Departure station name
 * @param toStation - Arrival station name
 * @returns Fare in TWD, or 0 if stations not found
 */
export function getAnkengLRTFare(fromStation: string, toStation: string): number {
  const fromIndex = STATION_INDEX[fromStation];
  const toIndex = STATION_INDEX[toStation];

  if (fromIndex === undefined || toIndex === undefined) {
    return 0;
  }

  return FARE_MATRIX[fromIndex][toIndex];
}
