/**
 * Taoyuan Metro (Airport MRT) station data.
 * Line: A (Airport Line)
 */

export interface TaoyuanMetroStation {
  code: string;
  name: string;
  nameEn: string;
  line: string;
  isExpress?: boolean;
}

export const TAOYUAN_METRO_LINES = {
  A: { name: '機場線', color: '#8246AF' }
} as const;

export const TAOYUAN_METRO_STATIONS: TaoyuanMetroStation[] = [
  { code: 'A1', name: '台北車站', nameEn: 'Taipei Main Station', line: 'A', isExpress: true },
  { code: 'A2', name: '三重', nameEn: 'Sanchong', line: 'A' },
  { code: 'A3', name: '新北產業園區', nameEn: 'New Taipei Industrial Park', line: 'A', isExpress: true },
  { code: 'A4', name: '新莊副都心', nameEn: 'Xinzhuang Fuduxin', line: 'A' },
  { code: 'A5', name: '泰山', nameEn: 'Taishan', line: 'A' },
  { code: 'A6', name: '泰山貴和', nameEn: 'Taishan Guihe', line: 'A' },
  { code: 'A7', name: '體育大學', nameEn: 'National Sports University', line: 'A' },
  { code: 'A8', name: '長庚醫院', nameEn: 'Chang Gung Memorial Hospital', line: 'A', isExpress: true },
  { code: 'A9', name: '林口', nameEn: 'Linkou', line: 'A' },
  { code: 'A10', name: '山鼻', nameEn: 'Shanbi', line: 'A' },
  { code: 'A11', name: '坑口', nameEn: 'Kengkou', line: 'A' },
  { code: 'A12', name: '機場第一航廈', nameEn: 'Airport Terminal 1', line: 'A', isExpress: true },
  { code: 'A13', name: '機場第二航廈', nameEn: 'Airport Terminal 2', line: 'A', isExpress: true },
  { code: 'A14a', name: '機場旅館', nameEn: 'Airport Hotel', line: 'A' },
  { code: 'A15', name: '大園', nameEn: 'Dayuan', line: 'A' },
  { code: 'A16', name: '橫山', nameEn: 'Hengshan', line: 'A' },
  { code: 'A17', name: '領航', nameEn: 'Linghang', line: 'A' },
  { code: 'A18', name: '高鐵桃園站', nameEn: 'HSR Taoyuan', line: 'A', isExpress: true },
  { code: 'A19', name: '桃園體育園區', nameEn: 'Taoyuan Sports Park', line: 'A' },
  { code: 'A20', name: '興南', nameEn: 'Xingnan', line: 'A' },
  { code: 'A21', name: '環北', nameEn: 'Huanbei', line: 'A', isExpress: true },
  { code: 'A22', name: '老街溪', nameEn: 'Laojie Creek', line: 'A' }
];

/**
 * Search stations by name (Chinese or English).
 *
 * @param query - Search query string
 * @returns Array of matching stations
 */
export function searchTaoyuanStations(query: string): TaoyuanMetroStation[] {
  const lowerQuery = query.toLowerCase();
  return TAOYUAN_METRO_STATIONS.filter(
    station =>
      station.name.includes(query) ||
      station.nameEn.toLowerCase().includes(lowerQuery) ||
      station.code.toLowerCase().includes(lowerQuery)
  );
}
