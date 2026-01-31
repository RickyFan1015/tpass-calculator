/**
 * TRA (Taiwan Railways) fare data for TPASS applicable area.
 * Based on local train (區間車) fares.
 * Covers Keelung to Zhongli section.
 */

import { TRA_STATIONS } from '../stations/tra-stations';

/**
 * Fare matrix for TRA (Keelung-Zhongli section).
 * 21 stations, fare based on local train prices.
 */
const FARE_MATRIX: number[][] = [
  // TRA01 基隆
  [0, 15, 15, 19, 19, 23, 27, 31, 39, 46, 50, 54, 58, 62, 66, 70, 74, 78, 86, 93, 97],
  // TRA02 三坑
  [15, 0, 15, 15, 19, 19, 23, 27, 35, 42, 46, 50, 54, 58, 62, 66, 70, 74, 82, 89, 93],
  // TRA03 八堵
  [15, 15, 0, 15, 15, 19, 23, 27, 35, 42, 46, 50, 54, 58, 62, 66, 70, 74, 82, 89, 93],
  // TRA04 七堵
  [19, 15, 15, 0, 15, 15, 19, 23, 31, 38, 42, 46, 50, 54, 58, 62, 66, 70, 78, 85, 89],
  // TRA05 百福
  [19, 19, 15, 15, 0, 15, 19, 23, 31, 38, 42, 46, 50, 54, 58, 62, 66, 70, 78, 85, 89],
  // TRA06 五堵
  [23, 19, 19, 15, 15, 0, 15, 19, 27, 34, 38, 42, 46, 50, 54, 58, 62, 66, 74, 81, 85],
  // TRA07 汐止
  [27, 23, 23, 19, 19, 15, 0, 15, 23, 30, 34, 38, 42, 46, 50, 54, 58, 62, 70, 77, 81],
  // TRA08 汐科
  [31, 27, 27, 23, 23, 19, 15, 0, 19, 26, 30, 34, 38, 42, 46, 50, 54, 58, 66, 73, 77],
  // TRA09 南港
  [39, 35, 35, 31, 31, 27, 23, 19, 0, 15, 19, 23, 27, 31, 35, 39, 43, 47, 55, 62, 66],
  // TRA10 松山
  [46, 42, 42, 38, 38, 34, 30, 26, 15, 0, 15, 19, 23, 27, 31, 35, 39, 43, 51, 58, 62],
  // TRA11 台北
  [50, 46, 46, 42, 42, 38, 34, 30, 19, 15, 0, 15, 19, 23, 27, 31, 35, 39, 47, 54, 58],
  // TRA12 萬華
  [54, 50, 50, 46, 46, 42, 38, 34, 23, 19, 15, 0, 15, 19, 23, 27, 31, 35, 43, 50, 54],
  // TRA13 板橋
  [58, 54, 54, 50, 50, 46, 42, 38, 27, 23, 19, 15, 0, 15, 19, 23, 27, 31, 39, 46, 50],
  // TRA14 浮洲
  [62, 58, 58, 54, 54, 50, 46, 42, 31, 27, 23, 19, 15, 0, 15, 19, 23, 27, 35, 42, 46],
  // TRA15 樹林
  [66, 62, 62, 58, 58, 54, 50, 46, 35, 31, 27, 23, 19, 15, 0, 15, 19, 23, 31, 38, 42],
  // TRA16 南樹林
  [70, 66, 66, 62, 62, 58, 54, 50, 39, 35, 31, 27, 23, 19, 15, 0, 15, 19, 27, 34, 38],
  // TRA17 山佳
  [74, 70, 70, 66, 66, 62, 58, 54, 43, 39, 35, 31, 27, 23, 19, 15, 0, 15, 23, 30, 34],
  // TRA18 鶯歌
  [78, 74, 74, 70, 70, 66, 62, 58, 47, 43, 39, 35, 31, 27, 23, 19, 15, 0, 19, 26, 30],
  // TRA19 桃園
  [86, 82, 82, 78, 78, 74, 70, 66, 55, 51, 47, 43, 39, 35, 31, 27, 23, 19, 0, 15, 19],
  // TRA20 內壢
  [93, 89, 89, 85, 85, 81, 77, 73, 62, 58, 54, 50, 46, 42, 38, 34, 30, 26, 15, 0, 15],
  // TRA21 中壢
  [97, 93, 93, 89, 89, 85, 81, 77, 66, 62, 58, 54, 50, 46, 42, 38, 34, 30, 19, 15, 0]
];

/**
 * Station name to index mapping.
 */
const STATION_INDEX: Record<string, number> = {};
TRA_STATIONS.forEach((station, index) => {
  STATION_INDEX[station.name] = index;
});

/**
 * Get fare between two TRA stations.
 *
 * @param fromStation - Departure station name
 * @param toStation - Arrival station name
 * @returns Fare in TWD, or 0 if stations not found
 */
export function getTRAFare(fromStation: string, toStation: string): number {
  const fromIndex = STATION_INDEX[fromStation];
  const toIndex = STATION_INDEX[toStation];

  if (fromIndex === undefined || toIndex === undefined) {
    return 0;
  }

  return FARE_MATRIX[fromIndex][toIndex];
}
