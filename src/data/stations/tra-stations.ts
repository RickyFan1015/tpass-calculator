/**
 * TRA (Taiwan Railways) station data for TPASS applicable area.
 * Covers Keelung to Zhongli section.
 */

export interface TRAStation {
  code: string;
  name: string;
  nameEn: string;
  line: string;
}

export const TRA_LINES = {
  TRA: { name: '台鐵', color: '#0072BC' }
} as const;

export const TRA_STATIONS: TRAStation[] = [
  // Keelung Line + Western Line (Keelung to Zhongli)
  { code: 'TRA01', name: '基隆', nameEn: 'Keelung', line: 'TRA' },
  { code: 'TRA02', name: '三坑', nameEn: 'Sankeng', line: 'TRA' },
  { code: 'TRA03', name: '八堵', nameEn: 'Badu', line: 'TRA' },
  { code: 'TRA04', name: '七堵', nameEn: 'Qidu', line: 'TRA' },
  { code: 'TRA05', name: '百福', nameEn: 'Baifu', line: 'TRA' },
  { code: 'TRA06', name: '五堵', nameEn: 'Wudu', line: 'TRA' },
  { code: 'TRA07', name: '汐止', nameEn: 'Xizhi', line: 'TRA' },
  { code: 'TRA08', name: '汐科', nameEn: 'Xike', line: 'TRA' },
  { code: 'TRA09', name: '南港', nameEn: 'Nangang', line: 'TRA' },
  { code: 'TRA10', name: '松山', nameEn: 'Songshan', line: 'TRA' },
  { code: 'TRA11', name: '台北', nameEn: 'Taipei', line: 'TRA' },
  { code: 'TRA12', name: '萬華', nameEn: 'Wanhua', line: 'TRA' },
  { code: 'TRA13', name: '板橋', nameEn: 'Banqiao', line: 'TRA' },
  { code: 'TRA14', name: '浮洲', nameEn: 'Fuzhou', line: 'TRA' },
  { code: 'TRA15', name: '樹林', nameEn: 'Shulin', line: 'TRA' },
  { code: 'TRA16', name: '南樹林', nameEn: 'South Shulin', line: 'TRA' },
  { code: 'TRA17', name: '山佳', nameEn: 'Shanjia', line: 'TRA' },
  { code: 'TRA18', name: '鶯歌', nameEn: 'Yingge', line: 'TRA' },
  { code: 'TRA19', name: '桃園', nameEn: 'Taoyuan', line: 'TRA' },
  { code: 'TRA20', name: '內壢', nameEn: 'Neili', line: 'TRA' },
  { code: 'TRA21', name: '中壢', nameEn: 'Zhongli', line: 'TRA' }
];

/**
 * Search stations by name (Chinese or English).
 *
 * @param query - Search query string
 * @returns Array of matching stations
 */
export function searchTRAStations(query: string): TRAStation[] {
  const lowerQuery = query.toLowerCase();
  return TRA_STATIONS.filter(
    station =>
      station.name.includes(query) ||
      station.nameEn.toLowerCase().includes(lowerQuery) ||
      station.code.toLowerCase().includes(lowerQuery)
  );
}
