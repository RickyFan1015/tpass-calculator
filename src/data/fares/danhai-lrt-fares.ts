/**
 * Danhai Light Rail fare data.
 * Simple distance-based fare: 20-30 TWD
 */

import { DANHAI_LRT_STATIONS } from '../stations/danhai-lrt-stations';

/**
 * Fare matrix for Danhai LRT.
 * 14 stations, fare range: 20-30 TWD
 */
const FARE_MATRIX: number[][] = [
  // V01 紅樹林
  [0, 20, 20, 20, 25, 25, 25, 30, 30, 30, 30, 30, 30, 30],
  // V02 竿蓁林
  [20, 0, 20, 20, 20, 25, 25, 25, 30, 30, 30, 30, 30, 30],
  // V03 淡金鄧公
  [20, 20, 0, 20, 20, 20, 25, 25, 25, 30, 30, 30, 30, 30],
  // V04 淡江大學
  [20, 20, 20, 0, 20, 20, 20, 25, 25, 25, 30, 30, 30, 30],
  // V05 淡金北新
  [25, 20, 20, 20, 0, 20, 20, 20, 25, 25, 25, 30, 30, 30],
  // V06 新市一路
  [25, 25, 20, 20, 20, 0, 20, 20, 20, 25, 25, 30, 30, 30],
  // V07 淡水行政中心
  [25, 25, 25, 20, 20, 20, 0, 20, 20, 20, 25, 25, 25, 25],
  // V08 濱海義山
  [30, 25, 25, 25, 20, 20, 20, 0, 20, 20, 20, 25, 25, 25],
  // V09 濱海沙崙
  [30, 30, 25, 25, 25, 20, 20, 20, 0, 20, 20, 20, 20, 20],
  // V10 淡海新市鎮
  [30, 30, 30, 25, 25, 25, 20, 20, 20, 0, 20, 25, 25, 25],
  // V11 崁頂
  [30, 30, 30, 30, 25, 25, 25, 20, 20, 20, 0, 25, 25, 25],
  // V26 淡水漁人碼頭
  [30, 30, 30, 30, 30, 30, 25, 25, 20, 25, 25, 0, 20, 20],
  // V27 沙崙
  [30, 30, 30, 30, 30, 30, 25, 25, 20, 25, 25, 20, 0, 20],
  // V28 台北海洋大學
  [30, 30, 30, 30, 30, 30, 25, 25, 20, 25, 25, 20, 20, 0]
];

/**
 * Station name to index mapping.
 */
const STATION_INDEX: Record<string, number> = {};
DANHAI_LRT_STATIONS.forEach((station, index) => {
  STATION_INDEX[station.name] = index;
});

/**
 * Get fare between two Danhai LRT stations.
 *
 * @param fromStation - Departure station name
 * @param toStation - Arrival station name
 * @returns Fare in TWD, or 0 if stations not found
 */
export function getDanhaiLRTFare(fromStation: string, toStation: string): number {
  const fromIndex = STATION_INDEX[fromStation];
  const toIndex = STATION_INDEX[toStation];

  if (fromIndex === undefined || toIndex === undefined) {
    return 0;
  }

  return FARE_MATRIX[fromIndex][toIndex];
}
