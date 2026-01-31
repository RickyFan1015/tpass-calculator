/**
 * Ankeng Light Rail station data.
 * Line: K (Ankeng Line)
 */

export interface AnkengLRTStation {
  code: string;
  name: string;
  nameEn: string;
  line: string;
  transferLines?: string[];
}

export const ANKENG_LRT_LINES = {
  K: { name: '安坑線', color: '#80CC28' }
} as const;

export const ANKENG_LRT_STATIONS: AnkengLRTStation[] = [
  { code: 'K01', name: '十四張', nameEn: 'Shisizhang', line: 'K', transferLines: ['Y'] },
  { code: 'K02', name: '陽光運動公園', nameEn: 'Sunshine Sports Park', line: 'K' },
  { code: 'K03', name: '新和國小', nameEn: 'Xinhe Elementary School', line: 'K' },
  { code: 'K04', name: '安康', nameEn: 'Ankang', line: 'K' },
  { code: 'K05', name: '景文科大', nameEn: 'Jinwen University', line: 'K' },
  { code: 'K06', name: '耕莘安康院區', nameEn: 'Cardinal Tien Ankang', line: 'K' },
  { code: 'K07', name: '安坑國小', nameEn: 'Ankeng Elementary School', line: 'K' },
  { code: 'K08', name: '雙城', nameEn: 'Shuangcheng', line: 'K' },
  { code: 'K09', name: '玫瑰中國城', nameEn: 'Rose Chinatown', line: 'K' }
];

/**
 * Search stations by name (Chinese or English).
 *
 * @param query - Search query string
 * @returns Array of matching stations
 */
export function searchAnkengStations(query: string): AnkengLRTStation[] {
  const lowerQuery = query.toLowerCase();
  return ANKENG_LRT_STATIONS.filter(
    station =>
      station.name.includes(query) ||
      station.nameEn.toLowerCase().includes(lowerQuery) ||
      station.code.toLowerCase().includes(lowerQuery)
  );
}
