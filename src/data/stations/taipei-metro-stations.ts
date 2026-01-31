/**
 * Taipei Metro station data.
 * Lines: BR (Wenhu), R (Tamsui-Xinyi), G (Songshan-Xindian), O (Zhonghe-Xinlu), BL (Bannan)
 */

export interface MetroStation {
  code: string;
  name: string;
  nameEn: string;
  line: string;
  transferLines?: string[];
}

export const TAIPEI_METRO_LINES = {
  BR: { name: '文湖線', color: '#c48c31' },
  R: { name: '淡水信義線', color: '#e3002c' },
  G: { name: '松山新店線', color: '#008659' },
  O: { name: '中和新蘆線', color: '#f8b61c' },
  BL: { name: '板南線', color: '#0070bd' }
} as const;

export const TAIPEI_METRO_STATIONS: MetroStation[] = [
  // Wenhu Line (BR)
  { code: 'BR01', name: '動物園', nameEn: 'Taipei Zoo', line: 'BR' },
  { code: 'BR02', name: '木柵', nameEn: 'Muzha', line: 'BR' },
  { code: 'BR03', name: '萬芳社區', nameEn: 'Wanfang Community', line: 'BR' },
  { code: 'BR04', name: '萬芳醫院', nameEn: 'Wanfang Hospital', line: 'BR' },
  { code: 'BR05', name: '辛亥', nameEn: 'Xinhai', line: 'BR' },
  { code: 'BR06', name: '麟光', nameEn: 'Linguang', line: 'BR' },
  { code: 'BR07', name: '六張犁', nameEn: 'Liuzhangli', line: 'BR' },
  { code: 'BR08', name: '科技大樓', nameEn: 'Technology Building', line: 'BR' },
  { code: 'BR09', name: '大安', nameEn: 'Daan', line: 'BR', transferLines: ['R'] },
  { code: 'BR10', name: '忠孝復興', nameEn: 'Zhongxiao Fuxing', line: 'BR', transferLines: ['BL'] },
  { code: 'BR11', name: '南京復興', nameEn: 'Nanjing Fuxing', line: 'BR', transferLines: ['G'] },
  { code: 'BR12', name: '中山國中', nameEn: 'Zhongshan Junior High School', line: 'BR' },
  { code: 'BR13', name: '松山機場', nameEn: 'Songshan Airport', line: 'BR' },
  { code: 'BR14', name: '大直', nameEn: 'Dazhi', line: 'BR' },
  { code: 'BR15', name: '劍南路', nameEn: 'Jiannan Road', line: 'BR' },
  { code: 'BR16', name: '西湖', nameEn: 'Xihu', line: 'BR' },
  { code: 'BR17', name: '港墘', nameEn: 'Gangqian', line: 'BR' },
  { code: 'BR18', name: '文德', nameEn: 'Wende', line: 'BR' },
  { code: 'BR19', name: '內湖', nameEn: 'Neihu', line: 'BR' },
  { code: 'BR20', name: '大湖公園', nameEn: 'Dahu Park', line: 'BR' },
  { code: 'BR21', name: '葫洲', nameEn: 'Huzhou', line: 'BR' },
  { code: 'BR22', name: '東湖', nameEn: 'Donghu', line: 'BR' },
  { code: 'BR23', name: '南港軟體園區', nameEn: 'Nangang Software Park', line: 'BR' },
  { code: 'BR24', name: '南港展覽館', nameEn: 'Taipei Nangang Exhibition Center', line: 'BR', transferLines: ['BL'] },

  // Tamsui-Xinyi Line (R)
  { code: 'R02', name: '淡水', nameEn: 'Tamsui', line: 'R' },
  { code: 'R03', name: '紅樹林', nameEn: 'Hongshulin', line: 'R' },
  { code: 'R04', name: '竹圍', nameEn: 'Zhuwei', line: 'R' },
  { code: 'R05', name: '關渡', nameEn: 'Guandu', line: 'R' },
  { code: 'R06', name: '忠義', nameEn: 'Zhongyi', line: 'R' },
  { code: 'R07', name: '復興崗', nameEn: 'Fuxinggang', line: 'R' },
  { code: 'R08', name: '北投', nameEn: 'Beitou', line: 'R' },
  { code: 'R09', name: '新北投', nameEn: 'Xinbeitou', line: 'R' },
  { code: 'R10', name: '奇岩', nameEn: 'Qiyan', line: 'R' },
  { code: 'R11', name: '唭哩岸', nameEn: 'Qilian', line: 'R' },
  { code: 'R12', name: '石牌', nameEn: 'Shipai', line: 'R' },
  { code: 'R13', name: '明德', nameEn: 'Mingde', line: 'R' },
  { code: 'R14', name: '芝山', nameEn: 'Zhishan', line: 'R' },
  { code: 'R15', name: '士林', nameEn: 'Shilin', line: 'R' },
  { code: 'R16', name: '劍潭', nameEn: 'Jiantan', line: 'R' },
  { code: 'R17', name: '圓山', nameEn: 'Yuanshan', line: 'R' },
  { code: 'R18', name: '民權西路', nameEn: 'Minquan W. Rd.', line: 'R', transferLines: ['O'] },
  { code: 'R19', name: '雙連', nameEn: 'Shuanglian', line: 'R' },
  { code: 'R20', name: '中山', nameEn: 'Zhongshan', line: 'R', transferLines: ['G'] },
  { code: 'R21', name: '台北車站', nameEn: 'Taipei Main Station', line: 'R', transferLines: ['BL'] },
  { code: 'R22', name: '台大醫院', nameEn: 'NTU Hospital', line: 'R' },
  { code: 'R23', name: '中正紀念堂', nameEn: 'Chiang Kai-Shek Memorial Hall', line: 'R', transferLines: ['G'] },
  { code: 'R24', name: '東門', nameEn: 'Dongmen', line: 'R', transferLines: ['O'] },
  { code: 'R25', name: '大安森林公園', nameEn: 'Daan Park', line: 'R' },
  { code: 'R26', name: '大安', nameEn: 'Daan', line: 'R', transferLines: ['BR'] },
  { code: 'R27', name: '信義安和', nameEn: "Xinyi Anhe", line: 'R' },
  { code: 'R28', name: '台北101/世貿', nameEn: 'Taipei 101/World Trade Center', line: 'R' },
  { code: 'R29', name: '象山', nameEn: 'Xiangshan', line: 'R' },

  // Songshan-Xindian Line (G)
  { code: 'G01', name: '新店', nameEn: 'Xindian', line: 'G' },
  { code: 'G02', name: '新店區公所', nameEn: 'Xindian District Office', line: 'G' },
  { code: 'G03', name: '七張', nameEn: 'Qizhang', line: 'G' },
  { code: 'G03A', name: '小碧潭', nameEn: 'Xiaobitan', line: 'G' },
  { code: 'G04', name: '大坪林', nameEn: 'Dapinglin', line: 'G' },
  { code: 'G05', name: '景美', nameEn: 'Jingmei', line: 'G' },
  { code: 'G06', name: '萬隆', nameEn: 'Wanlong', line: 'G' },
  { code: 'G07', name: '公館', nameEn: 'Gongguan', line: 'G' },
  { code: 'G08', name: '台電大樓', nameEn: 'Taipower Building', line: 'G' },
  { code: 'G09', name: '古亭', nameEn: 'Guting', line: 'G', transferLines: ['O'] },
  { code: 'G10', name: '中正紀念堂', nameEn: 'Chiang Kai-Shek Memorial Hall', line: 'G', transferLines: ['R'] },
  { code: 'G11', name: '小南門', nameEn: 'Xiaonanmen', line: 'G' },
  { code: 'G12', name: '西門', nameEn: 'Ximen', line: 'G', transferLines: ['BL'] },
  { code: 'G13', name: '北門', nameEn: 'Beimen', line: 'G' },
  { code: 'G14', name: '中山', nameEn: 'Zhongshan', line: 'G', transferLines: ['R'] },
  { code: 'G15', name: '松江南京', nameEn: 'Songjiang Nanjing', line: 'G', transferLines: ['O'] },
  { code: 'G16', name: '南京復興', nameEn: 'Nanjing Fuxing', line: 'G', transferLines: ['BR'] },
  { code: 'G17', name: '台北小巨蛋', nameEn: 'Taipei Arena', line: 'G' },
  { code: 'G18', name: '南京三民', nameEn: 'Nanjing Sanmin', line: 'G' },
  { code: 'G19', name: '松山', nameEn: 'Songshan', line: 'G' },

  // Zhonghe-Xinlu Line (O)
  { code: 'O01', name: '南勢角', nameEn: 'Nanshijiao', line: 'O' },
  { code: 'O02', name: '景安', nameEn: "Jingan", line: 'O' },
  { code: 'O03', name: '永安市場', nameEn: 'Yongan Market', line: 'O' },
  { code: 'O04', name: '頂溪', nameEn: 'Dingxi', line: 'O' },
  { code: 'O05', name: '古亭', nameEn: 'Guting', line: 'O', transferLines: ['G'] },
  { code: 'O06', name: '東門', nameEn: 'Dongmen', line: 'O', transferLines: ['R'] },
  { code: 'O07', name: '忠孝新生', nameEn: 'Zhongxiao Xinsheng', line: 'O', transferLines: ['BL'] },
  { code: 'O08', name: '松江南京', nameEn: 'Songjiang Nanjing', line: 'O', transferLines: ['G'] },
  { code: 'O09', name: '行天宮', nameEn: 'Xingtian Temple', line: 'O' },
  { code: 'O10', name: '中山國小', nameEn: 'Zhongshan Elementary School', line: 'O' },
  { code: 'O11', name: '民權西路', nameEn: 'Minquan W. Rd.', line: 'O', transferLines: ['R'] },
  { code: 'O12', name: '大橋頭', nameEn: 'Daqiaotou', line: 'O' },
  { code: 'O13', name: '台北橋', nameEn: 'Taipei Bridge', line: 'O' },
  { code: 'O14', name: '菜寮', nameEn: 'Cailiao', line: 'O' },
  { code: 'O15', name: '三重', nameEn: 'Sanchong', line: 'O' },
  { code: 'O16', name: '先嗇宮', nameEn: 'Xianse Temple', line: 'O' },
  { code: 'O17', name: '頭前庄', nameEn: 'Touqianzhuang', line: 'O' },
  { code: 'O18', name: '新莊', nameEn: 'Xinzhuang', line: 'O' },
  { code: 'O19', name: '輔大', nameEn: 'Fu Jen University', line: 'O' },
  { code: 'O20', name: '丹鳳', nameEn: 'Danfeng', line: 'O' },
  { code: 'O21', name: '迴龍', nameEn: 'Huilong', line: 'O' },
  { code: 'O50', name: '蘆洲', nameEn: 'Luzhou', line: 'O' },
  { code: 'O51', name: '三民高中', nameEn: 'Sanmin Senior High School', line: 'O' },
  { code: 'O52', name: '徐匯中學', nameEn: 'St. Ignatius High School', line: 'O' },
  { code: 'O53', name: '三和國中', nameEn: 'Sanhe Junior High School', line: 'O' },
  { code: 'O54', name: '三重國小', nameEn: 'Sanchong Elementary School', line: 'O' },

  // Bannan Line (BL)
  { code: 'BL01', name: '頂埔', nameEn: 'Dingpu', line: 'BL' },
  { code: 'BL02', name: '永寧', nameEn: 'Yongning', line: 'BL' },
  { code: 'BL03', name: '土城', nameEn: 'Tucheng', line: 'BL' },
  { code: 'BL04', name: '海山', nameEn: 'Haishan', line: 'BL' },
  { code: 'BL05', name: '亞東醫院', nameEn: 'Far Eastern Hospital', line: 'BL' },
  { code: 'BL06', name: '府中', nameEn: 'Fuzhong', line: 'BL' },
  { code: 'BL07', name: '板橋', nameEn: 'Banqiao', line: 'BL' },
  { code: 'BL08', name: '新埔', nameEn: 'Xinpu', line: 'BL' },
  { code: 'BL09', name: '江子翠', nameEn: 'Jiangzicui', line: 'BL' },
  { code: 'BL10', name: '龍山寺', nameEn: 'Longshan Temple', line: 'BL' },
  { code: 'BL11', name: '西門', nameEn: 'Ximen', line: 'BL', transferLines: ['G'] },
  { code: 'BL12', name: '台北車站', nameEn: 'Taipei Main Station', line: 'BL', transferLines: ['R'] },
  { code: 'BL13', name: '善導寺', nameEn: 'Shandao Temple', line: 'BL' },
  { code: 'BL14', name: '忠孝新生', nameEn: 'Zhongxiao Xinsheng', line: 'BL', transferLines: ['O'] },
  { code: 'BL15', name: '忠孝復興', nameEn: 'Zhongxiao Fuxing', line: 'BL', transferLines: ['BR'] },
  { code: 'BL16', name: '忠孝敦化', nameEn: 'Zhongxiao Dunhua', line: 'BL' },
  { code: 'BL17', name: '國父紀念館', nameEn: 'Sun Yat-Sen Memorial Hall', line: 'BL' },
  { code: 'BL18', name: '市政府', nameEn: 'Taipei City Hall', line: 'BL' },
  { code: 'BL19', name: '永春', nameEn: 'Yongchun', line: 'BL' },
  { code: 'BL20', name: '後山埤', nameEn: 'Houshanpi', line: 'BL' },
  { code: 'BL21', name: '昆陽', nameEn: 'Kunyang', line: 'BL' },
  { code: 'BL22', name: '南港', nameEn: 'Nangang', line: 'BL' },
  { code: 'BL23', name: '南港展覽館', nameEn: 'Taipei Nangang Exhibition Center', line: 'BL', transferLines: ['BR'] }
];

/**
 * Get station by code.
 *
 * @param code - Station code
 * @returns Station or undefined
 */
export function getStationByCode(code: string): MetroStation | undefined {
  return TAIPEI_METRO_STATIONS.find(s => s.code === code);
}

/**
 * Get station by name.
 *
 * @param name - Station name (Chinese)
 * @returns Station or undefined
 */
export function getStationByName(name: string): MetroStation | undefined {
  return TAIPEI_METRO_STATIONS.find(s => s.name === name);
}

/**
 * Search stations by keyword.
 *
 * @param keyword - Search keyword
 * @returns Matching stations
 */
export function searchStations(keyword: string): MetroStation[] {
  const lower = keyword.toLowerCase();
  return TAIPEI_METRO_STATIONS.filter(
    s => s.name.includes(keyword) ||
         s.nameEn.toLowerCase().includes(lower) ||
         s.code.toLowerCase().includes(lower)
  );
}
