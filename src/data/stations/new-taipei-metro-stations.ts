/**
 * New Taipei Metro station data.
 * Lines: Y (Circular Line), V (Danhai LRT), K (Ankeng LRT)
 */

export interface NewTaipeiMetroStation {
  code: string;
  name: string;
  nameEn: string;
  line: string;
  transferLines?: string[];
}

export const NEW_TAIPEI_METRO_LINES = {
  Y: { name: '環狀線', color: '#FFDB00' },
  V: { name: '淡海輕軌', color: '#00A3E0' },
  K: { name: '安坑輕軌', color: '#80CC28' }
} as const;

export const NEW_TAIPEI_METRO_STATIONS: NewTaipeiMetroStation[] = [
  // Y - Circular Line
  { code: 'Y07', name: '大坪林', nameEn: 'Dapinglin', line: 'Y', transferLines: ['G'] },
  { code: 'Y08', name: '十四張', nameEn: 'Shisizhang', line: 'Y', transferLines: ['K'] },
  { code: 'Y09', name: '秀朗橋', nameEn: 'Xiulangqiao', line: 'Y' },
  { code: 'Y10', name: '景平', nameEn: 'Jingping', line: 'Y' },
  { code: 'Y11', name: '景安', nameEn: 'Jingan', line: 'Y', transferLines: ['O'] },
  { code: 'Y12', name: '中和', nameEn: 'Zhonghe', line: 'Y' },
  { code: 'Y13', name: '橋和', nameEn: 'Qiaohe', line: 'Y' },
  { code: 'Y14', name: '中原', nameEn: 'Zhongyuan', line: 'Y' },
  { code: 'Y15', name: '板新', nameEn: 'Banxin', line: 'Y' },
  { code: 'Y16', name: '板橋', nameEn: 'Banqiao', line: 'Y', transferLines: ['BL'] },
  { code: 'Y17', name: '新埔民生', nameEn: 'Xinpu Minsheng', line: 'Y', transferLines: ['BL'] },
  { code: 'Y18', name: '頭前庄', nameEn: 'Touqianzhuang', line: 'Y', transferLines: ['O'] },
  { code: 'Y19', name: '幸福', nameEn: 'Xingfu', line: 'Y' },
  { code: 'Y20', name: '新北產業園區', nameEn: 'New Taipei Industrial Park', line: 'Y', transferLines: ['A'] },
  // V - Danhai LRT (Green Mountain Line + Blue Coast Line)
  { code: 'V01', name: '紅樹林', nameEn: 'Hongshulin', line: 'V', transferLines: ['R'] },
  { code: 'V02', name: '竿蓁林', nameEn: 'Ganzhenlin', line: 'V' },
  { code: 'V03', name: '淡金鄧公', nameEn: 'Danjin Denggong', line: 'V' },
  { code: 'V04', name: '淡江大學', nameEn: 'Tamkang University', line: 'V' },
  { code: 'V05', name: '淡金北新', nameEn: 'Danjin Beixin', line: 'V' },
  { code: 'V06', name: '新市一路', nameEn: 'Xinshi 1st Road', line: 'V' },
  { code: 'V07', name: '淡水行政中心', nameEn: 'Tamsui Admin Center', line: 'V' },
  { code: 'V08', name: '濱海義山', nameEn: 'Binhai Yishan', line: 'V' },
  { code: 'V09', name: '濱海沙崙', nameEn: 'Binhai Shalun', line: 'V' },
  { code: 'V10', name: '淡海新市鎮', nameEn: 'Danhai New Town', line: 'V' },
  { code: 'V11', name: '崁頂', nameEn: 'Kanding', line: 'V' },
  { code: 'V26', name: '淡水漁人碼頭', nameEn: 'Tamsui Fisherman\'s Wharf', line: 'V' },
  { code: 'V27', name: '沙崙', nameEn: 'Shalun', line: 'V' },
  { code: 'V28', name: '台北海洋大學', nameEn: 'Taipei Ocean University', line: 'V' },
  // K - Ankeng LRT
  { code: 'K01', name: '雙城', nameEn: 'Shuangcheng', line: 'K' },
  { code: 'K02', name: '玫瑰中國城', nameEn: 'Rose Chinatown', line: 'K' },
  { code: 'K03', name: '台北小城', nameEn: 'Taipei Small Town', line: 'K' },
  { code: 'K04', name: '耕莘安康院區', nameEn: 'Cardinal Tien Ankang', line: 'K' },
  { code: 'K05', name: '景文科大', nameEn: 'Jinwen University', line: 'K' },
  { code: 'K06', name: '安康', nameEn: 'Ankang', line: 'K' },
  { code: 'K07', name: '陽光運動公園', nameEn: 'Sunshine Sports Park', line: 'K' },
  { code: 'K08', name: '新和國小', nameEn: 'Xinhe Elementary School', line: 'K' },
  { code: 'K09', name: '十四張', nameEn: 'Shisizhang', line: 'K', transferLines: ['Y'] }
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
