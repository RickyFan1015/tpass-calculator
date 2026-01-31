/**
 * New Taipei Metro (Circular Line) station data.
 * Line: Y (Yellow/Circular Line)
 */

export interface NewTaipeiMetroStation {
  code: string;
  name: string;
  nameEn: string;
  line: string;
  transferLines?: string[];
}

export const NEW_TAIPEI_METRO_LINES = {
  Y: { name: '環狀線', color: '#FFDB00' }
} as const;

export const NEW_TAIPEI_METRO_STATIONS: NewTaipeiMetroStation[] = [
  { code: 'Y06', name: '大坪林', nameEn: 'Dapinglin', line: 'Y', transferLines: ['G'] },
  { code: 'Y07', name: '新北產業園區', nameEn: 'New Taipei Industrial Park', line: 'Y', transferLines: ['A'] },
  { code: 'Y08', name: '幸福', nameEn: 'Xingfu', line: 'Y' },
  { code: 'Y09', name: '頭前庄', nameEn: 'Touqianzhuang', line: 'Y', transferLines: ['O'] },
  { code: 'Y10', name: '新埔民生', nameEn: 'Xinpu Minsheng', line: 'Y', transferLines: ['BL'] },
  { code: 'Y11', name: '板橋', nameEn: 'Banqiao', line: 'Y', transferLines: ['BL'] },
  { code: 'Y12', name: '板新', nameEn: 'Banxin', line: 'Y' },
  { code: 'Y13', name: '中和', nameEn: 'Zhonghe', line: 'Y' },
  { code: 'Y14', name: '橋和', nameEn: 'Qiaohe', line: 'Y' },
  { code: 'Y15', name: '中原', nameEn: 'Zhongyuan', line: 'Y' },
  { code: 'Y16', name: '板南', nameEn: 'Bannan', line: 'Y' },
  { code: 'Y17', name: '景安', nameEn: 'Jingan', line: 'Y', transferLines: ['O'] },
  { code: 'Y18', name: '景平', nameEn: 'Jingping', line: 'Y' },
  { code: 'Y19', name: '秀朗橋', nameEn: 'Xiulanqiao', line: 'Y' },
  { code: 'Y20', name: '十四張', nameEn: 'Shisizhang', line: 'Y', transferLines: ['K'] }
];

/**
 * Search stations by name (Chinese or English).
 *
 * @param query - Search query string
 * @returns Array of matching stations
 */
export function searchNewTaipeiStations(query: string): NewTaipeiMetroStation[] {
  const lowerQuery = query.toLowerCase();
  return NEW_TAIPEI_METRO_STATIONS.filter(
    station =>
      station.name.includes(query) ||
      station.nameEn.toLowerCase().includes(lowerQuery) ||
      station.code.toLowerCase().includes(lowerQuery)
  );
}
