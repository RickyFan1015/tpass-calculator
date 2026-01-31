/**
 * Danhai Light Rail station data.
 * Lines: V (Green Mountain Line), VB (Blue Coast Line)
 */

export interface DanhaiLRTStation {
  code: string;
  name: string;
  nameEn: string;
  line: string;
  transferLines?: string[];
}

export const DANHAI_LRT_LINES = {
  V: { name: '綠山線', color: '#00A651' },
  VB: { name: '藍海線', color: '#0072BC' }
} as const;

export const DANHAI_LRT_STATIONS: DanhaiLRTStation[] = [
  // Green Mountain Line
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
  // Blue Coast Line
  { code: 'V26', name: '淡水漁人碼頭', nameEn: 'Tamsui Fisherman\'s Wharf', line: 'VB' },
  { code: 'V27', name: '沙崙', nameEn: 'Shalun', line: 'VB' },
  { code: 'V28', name: '台北海洋大學', nameEn: 'Taipei Ocean University', line: 'VB' }
];

/**
 * Search stations by name (Chinese or English).
 *
 * @param query - Search query string
 * @returns Array of matching stations
 */
export function searchDanhaiStations(query: string): DanhaiLRTStation[] {
  const lowerQuery = query.toLowerCase();
  return DANHAI_LRT_STATIONS.filter(
    station =>
      station.name.includes(query) ||
      station.nameEn.toLowerCase().includes(lowerQuery) ||
      station.code.toLowerCase().includes(lowerQuery)
  );
}
