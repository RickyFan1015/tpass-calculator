import { useState, useMemo, useEffect } from 'react';
import { Modal, Input } from '../common';
import { TransportType } from '../../types';
import {
  TAIPEI_METRO_STATIONS,
  TAIPEI_METRO_LINES,
  searchStations as searchTaipeiStations,
  type MetroStation
} from '../../data/stations/taipei-metro-stations';
import {
  TAOYUAN_METRO_STATIONS,
  TAOYUAN_METRO_LINES,
  searchTaoyuanStations,
  type TaoyuanMetroStation
} from '../../data/stations/taoyuan-metro-stations';
import {
  NEW_TAIPEI_METRO_STATIONS,
  NEW_TAIPEI_METRO_LINES,
  searchNewTaipeiStations,
  type NewTaipeiMetroStation
} from '../../data/stations/new-taipei-metro-stations';
import {
  DANHAI_LRT_STATIONS,
  DANHAI_LRT_LINES,
  searchDanhaiStations,
  type DanhaiLRTStation
} from '../../data/stations/danhai-lrt-stations';
import {
  ANKENG_LRT_STATIONS,
  ANKENG_LRT_LINES,
  searchAnkengStations,
  type AnkengLRTStation
} from '../../data/stations/ankeng-lrt-stations';
import {
  TRA_STATIONS,
  TRA_LINES,
  searchTRAStations,
  type TRAStation
} from '../../data/stations/tra-stations';

/**
 * Generic station type for picker.
 */
export type Station = MetroStation | TaoyuanMetroStation | NewTaipeiMetroStation | DanhaiLRTStation | AnkengLRTStation | TRAStation;

/**
 * Line info type with name and color.
 */
interface LineInfo {
  name: string;
  color: string;
}

interface StationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (station: Station) => void;
  transportType: TransportType;
  title?: string;
  recentStations?: string[];
}

/**
 * Get station data based on transport type.
 *
 * @param transportType - Transport type
 * @returns Station data and line data
 */
function getStationData(transportType: TransportType): {
  stations: Station[];
  lines: Record<string, LineInfo>;
  search: (query: string) => Station[];
} {
  switch (transportType) {
    case TransportType.TAOYUAN_METRO:
      return {
        stations: TAOYUAN_METRO_STATIONS,
        lines: TAOYUAN_METRO_LINES as Record<string, LineInfo>,
        search: searchTaoyuanStations
      };
    case TransportType.NEW_TAIPEI_METRO:
      return {
        stations: NEW_TAIPEI_METRO_STATIONS,
        lines: NEW_TAIPEI_METRO_LINES as Record<string, LineInfo>,
        search: searchNewTaipeiStations
      };
    case TransportType.DANHAI_LRT:
      return {
        stations: DANHAI_LRT_STATIONS,
        lines: DANHAI_LRT_LINES as Record<string, LineInfo>,
        search: searchDanhaiStations
      };
    case TransportType.ANKENG_LRT:
      return {
        stations: ANKENG_LRT_STATIONS,
        lines: ANKENG_LRT_LINES as Record<string, LineInfo>,
        search: searchAnkengStations
      };
    case TransportType.TRA:
      return {
        stations: TRA_STATIONS,
        lines: TRA_LINES as Record<string, LineInfo>,
        search: searchTRAStations
      };
    case TransportType.TAIPEI_METRO:
    default:
      return {
        stations: TAIPEI_METRO_STATIONS,
        lines: TAIPEI_METRO_LINES as Record<string, LineInfo>,
        search: searchTaipeiStations
      };
  }
}

/**
 * Station picker modal for selecting metro stations.
 *
 * @param props - StationPicker props
 * @returns StationPicker element
 */
export function StationPicker({
  isOpen,
  onClose,
  onSelect,
  transportType,
  title = '選擇車站',
  recentStations = []
}: StationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  const { stations, lines, search } = useMemo(
    () => getStationData(transportType),
    [transportType]
  );

  /**
   * Auto-select the line when there is only one line available.
   * This avoids requiring an extra tap for single-line systems (e.g. Taoyuan Metro).
   * Re-triggers on modal open to handle consecutive uses of the same transport type.
   */
  useEffect(() => {
    if (!isOpen) return;
    const lineKeys = Object.keys(lines);
    if (lineKeys.length === 1) {
      setSelectedLine(lineKeys[0]);
    } else {
      setSelectedLine(null);
    }
  }, [isOpen, lines]);

  const filteredStations = useMemo(() => {
    if (searchQuery) {
      return search(searchQuery);
    }
    if (selectedLine) {
      return stations.filter(s => s.line === selectedLine);
    }
    return [];
  }, [searchQuery, selectedLine, stations, search]);

  const recentStationsList = useMemo(() => {
    return recentStations
      .map(name => stations.find(s => s.name === name))
      .filter((s): s is Station => s !== undefined)
      .slice(0, 2);
  }, [recentStations, stations]);

  const handleSelect = (station: Station) => {
    onSelect(station);
    setSearchQuery('');
    setSelectedLine(null);
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedLine(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="full" zIndex={60}>
      <div className="space-y-4 h-full flex flex-col">
        {/* Search Input */}
        <div className="flex-shrink-0">
          <Input
            placeholder="搜尋車站..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedLine(null);
            }}
            autoFocus
          />
        </div>

        {/* Recent Stations */}
        {!searchQuery && !selectedLine && recentStationsList.length > 0 && (
          <div className="flex-shrink-0">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">最近選擇</h3>
            <div className="flex flex-wrap gap-2">
              {recentStationsList.map(station => (
                <button
                  key={station.code}
                  onClick={() => handleSelect(station)}
                  className="px-3 py-1.5 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 rounded-full transition-colors"
                >
                  {station.code} {station.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Line Selection */}
        {!searchQuery && (
          <div className="flex-shrink-0">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">依路線選擇</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(lines).map(([code, line]) => (
                <button
                  key={code}
                  onClick={() => setSelectedLine(selectedLine === code ? null : code)}
                  className={`px-3 py-2.5 text-sm rounded-xl border-2 transition-all ${
                    selectedLine === code
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md'
                      : 'border-white/20 dark:border-white/10 bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/50'
                  }`}
                  style={{
                    borderLeftColor: line.color,
                    borderLeftWidth: '4px'
                  }}
                >
                  <span className="text-gray-700 dark:text-gray-300">{line.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Station List */}
        {filteredStations.length > 0 && (
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="divide-y divide-white/10 dark:divide-white/5">
              {filteredStations.map(station => {
                const lineInfo = lines[station.line];
                const isTransfer = 'transferLines' in station && station.transferLines && station.transferLines.length > 0;
                const isExpress = 'isExpress' in station && station.isExpress;
                return (
                  <button
                    key={station.code}
                    onClick={() => handleSelect(station)}
                    className="w-full px-3 py-3 flex items-center gap-3 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 active:bg-indigo-100/50 dark:active:bg-indigo-900/30 transition-colors text-left"
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: lineInfo?.color || '#888' }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{station.code} {station.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{station.nameEn}</p>
                    </div>
                    {isTransfer && (
                      <span className="text-xs text-indigo-500 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                        轉乘
                      </span>
                    )}
                    {isExpress && (
                      <span className="text-xs text-purple-500 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                        直達
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && filteredStations.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            找不到符合的車站
          </p>
        )}
      </div>
    </Modal>
  );
}
