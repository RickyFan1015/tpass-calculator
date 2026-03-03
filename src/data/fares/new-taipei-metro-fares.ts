/**
 * New Taipei Metro fare data for all lines (Y, V, K).
 * Each line has its own fare matrix; cross-line trips return 0 (manual input).
 */

import { NEW_TAIPEI_METRO_STATIONS } from '../stations/new-taipei-metro-stations';

/**
 * Fare matrix for Y line (Circular Line).
 * 14 stations (Y07-Y20), fare range: 20-40 TWD.
 * Source: New Taipei Metro official fare table
 */
const Y_FARE_MATRIX: number[][] = [
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
 * Fare matrix for V line (Danhai LRT, Green Mountain + Blue Coast).
 * 14 stations (V01-V11, V26-V28), fare range: 20-30 TWD.
 * Source: New Taipei Metro official fare table
 */
const V_FARE_MATRIX: number[][] = [
  // V01 紅樹林
  [0, 20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 30, 25, 25],
  // V02 竿蓁林
  [20, 0, 20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 25, 25],
  // V03 淡金鄧公
  [20, 20, 0, 20, 20, 20, 20, 20, 20, 20, 25, 25, 25, 20],
  // V04 淡江大學
  [20, 20, 20, 0, 20, 20, 20, 20, 20, 20, 20, 25, 20, 20],
  // V05 淡金北新
  [20, 20, 20, 20, 0, 20, 20, 20, 20, 20, 20, 25, 20, 20],
  // V06 新市一路
  [20, 20, 20, 20, 20, 0, 20, 20, 20, 20, 20, 20, 20, 20],
  // V07 淡水行政中心
  [20, 20, 20, 20, 20, 20, 0, 20, 20, 20, 20, 20, 20, 20],
  // V08 濱海義山
  [25, 20, 20, 20, 20, 20, 20, 0, 20, 20, 20, 20, 20, 20],
  // V09 濱海沙崙
  [25, 25, 20, 20, 20, 20, 20, 20, 0, 20, 20, 20, 20, 20],
  // V10 淡海新市鎮
  [25, 25, 20, 20, 20, 20, 20, 20, 20, 0, 20, 20, 20, 20],
  // V11 崁頂
  [25, 25, 25, 20, 20, 20, 20, 20, 20, 20, 0, 20, 20, 20],
  // V26 淡水漁人碼頭
  [30, 25, 25, 25, 25, 20, 20, 20, 20, 20, 20, 0, 20, 20],
  // V27 沙崙
  [25, 25, 25, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 20],
  // V28 台北海洋大學
  [25, 25, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0]
];

/**
 * Fare matrix for K line (Ankeng LRT).
 * 9 stations (K01-K09), fare range: 20-25 TWD.
 * Source: New Taipei Metro official fare table
 */
const K_FARE_MATRIX: number[][] = [
  // K01 雙城
  [0, 20, 20, 20, 20, 20, 20, 25, 25],
  // K02 玫瑰中國城
  [20, 0, 20, 20, 20, 20, 20, 25, 25],
  // K03 台北小城
  [20, 20, 0, 20, 20, 20, 20, 20, 25],
  // K04 耕莘安康院區
  [20, 20, 20, 0, 20, 20, 20, 20, 25],
  // K05 景文科大
  [20, 20, 20, 20, 0, 20, 20, 20, 20],
  // K06 安康
  [20, 20, 20, 20, 20, 0, 20, 20, 20],
  // K07 陽光運動公園
  [20, 20, 20, 20, 20, 20, 0, 20, 20],
  // K08 新和國小
  [25, 25, 20, 20, 20, 20, 20, 0, 20],
  // K09 十四張
  [25, 25, 25, 25, 20, 20, 20, 20, 0]
];

/**
 * Station code to matrix index mapping for each line.
 */
const Y_CODE_INDEX: Record<string, number> = {};
const V_CODE_INDEX: Record<string, number> = {};
const K_CODE_INDEX: Record<string, number> = {};

let yIdx = 0, vIdx = 0, kIdx = 0;
NEW_TAIPEI_METRO_STATIONS.forEach(station => {
  if (station.code.startsWith('Y')) Y_CODE_INDEX[station.code] = yIdx++;
  else if (station.code.startsWith('V')) V_CODE_INDEX[station.code] = vIdx++;
  else if (station.code.startsWith('K')) K_CODE_INDEX[station.code] = kIdx++;
});

/**
 * Determine line prefix from station code.
 *
 * @param code - Station code (e.g. 'Y07', 'V01', 'K09')
 * @returns Line prefix ('Y', 'V', or 'K'), or null if unknown
 */
function getLinePrefix(code: string): 'Y' | 'V' | 'K' | null {
  if (code.startsWith('Y')) return 'Y';
  if (code.startsWith('V')) return 'V';
  if (code.startsWith('K')) return 'K';
  return null;
}

/**
 * Look up fare given two station codes on the same line.
 *
 * @param fromCode - Departure station code
 * @param toCode - Arrival station code
 * @returns Fare in TWD, or null if not on same line
 */
function lookupFareByCode(fromCode: string, toCode: string): number | null {
  const fromLine = getLinePrefix(fromCode);
  const toLine = getLinePrefix(toCode);

  if (!fromLine || !toLine || fromLine !== toLine) return null;

  switch (fromLine) {
    case 'Y': {
      const fi = Y_CODE_INDEX[fromCode];
      const ti = Y_CODE_INDEX[toCode];
      if (fi === undefined || ti === undefined) return null;
      return Y_FARE_MATRIX[fi][ti];
    }
    case 'V': {
      const fi = V_CODE_INDEX[fromCode];
      const ti = V_CODE_INDEX[toCode];
      if (fi === undefined || ti === undefined) return null;
      return V_FARE_MATRIX[fi][ti];
    }
    case 'K': {
      const fi = K_CODE_INDEX[fromCode];
      const ti = K_CODE_INDEX[toCode];
      if (fi === undefined || ti === undefined) return null;
      return K_FARE_MATRIX[fi][ti];
    }
    default:
      return null;
  }
}

/**
 * Build a reverse lookup from station name to all matching codes.
 * Handles the "十四張" collision (Y08 + K09).
 */
const NAME_TO_CODES: Record<string, string[]> = {};
NEW_TAIPEI_METRO_STATIONS.forEach(station => {
  if (!NAME_TO_CODES[station.name]) {
    NAME_TO_CODES[station.name] = [];
  }
  NAME_TO_CODES[station.name].push(station.code);
});

/**
 * Get fare between two New Taipei Metro stations by name.
 * Handles the "十四張" station name collision by trying all code combinations.
 * Returns 0 for cross-line trips (user should input manually).
 *
 * @param fromStation - Departure station name
 * @param toStation - Arrival station name
 * @returns Fare in TWD, or 0 if stations not found or cross-line
 */
export function getNewTaipeiMetroFare(fromStation: string, toStation: string): number {
  const fromCodes = NAME_TO_CODES[fromStation];
  const toCodes = NAME_TO_CODES[toStation];

  if (!fromCodes || !toCodes) return 0;

  // Try all code combinations, return first same-line match
  for (const fc of fromCodes) {
    for (const tc of toCodes) {
      const fare = lookupFareByCode(fc, tc);
      if (fare !== null) return fare;
    }
  }

  // Cross-line: no same-line combination found
  return 0;
}

/**
 * Check if two New Taipei Metro stations are on different lines (cross-line).
 * Returns true when both stations are valid but no same-line pair exists.
 *
 * @param fromStation - Departure station name
 * @param toStation - Arrival station name
 * @returns True if the two stations are on different lines
 */
export function isNewTaipeiCrossLine(fromStation: string, toStation: string): boolean {
  const fromCodes = NAME_TO_CODES[fromStation];
  const toCodes = NAME_TO_CODES[toStation];

  if (!fromCodes || !toCodes) return false;

  // Check if ANY same-line combination exists
  for (const fc of fromCodes) {
    for (const tc of toCodes) {
      if (getLinePrefix(fc) === getLinePrefix(tc)) return false;
    }
  }

  return true;
}
