import { TransportType, type TransportTypeInfo } from '../types';

/**
 * Transport type display information with icon types.
 */
export const TRANSPORT_TYPE_INFO: Record<TransportType, TransportTypeInfo> = {
  [TransportType.TAIPEI_METRO]: {
    type: TransportType.TAIPEI_METRO,
    label: '台北捷運',
    iconType: 'metro',
    color: '#0066CC'
  },
  [TransportType.NEW_TAIPEI_METRO]: {
    type: TransportType.NEW_TAIPEI_METRO,
    label: '新北捷運',
    iconType: 'metro',
    color: '#FFCC00'
  },
  [TransportType.TAOYUAN_METRO]: {
    type: TransportType.TAOYUAN_METRO,
    label: '桃園機捷',
    iconType: 'airportExpress',
    color: '#8246AF'
  },
  [TransportType.TRA]: {
    type: TransportType.TRA,
    label: '台鐵',
    iconType: 'train',
    color: '#0072BC'
  },
  [TransportType.BUS]: {
    type: TransportType.BUS,
    label: '公車',
    iconType: 'bus',
    color: '#E31937'
  },
  [TransportType.HIGHWAY_BUS]: {
    type: TransportType.HIGHWAY_BUS,
    label: '客運',
    iconType: 'coach',
    color: '#FF6600'
  },
  [TransportType.YOUBIKE]: {
    type: TransportType.YOUBIKE,
    label: 'YouBike',
    iconType: 'bike',
    color: '#FFA500'
  },
  [TransportType.FERRY]: {
    type: TransportType.FERRY,
    label: '渡輪',
    iconType: 'ferry',
    color: '#006994'
  }
};

/** Fallback info for unmigrated or unknown transport types. */
const FALLBACK_INFO: TransportTypeInfo = {
  type: TransportType.NEW_TAIPEI_METRO,
  label: '新北捷運',
  iconType: 'metro',
  color: '#FFCC00'
};

/**
 * Get transport type info by type.
 * Returns fallback for unknown types (e.g. un-migrated legacy data).
 *
 * @param type - Transport type
 * @returns Transport type info
 */
export function getTransportTypeInfo(type: TransportType): TransportTypeInfo {
  return TRANSPORT_TYPE_INFO[type] ?? FALLBACK_INFO;
}

/**
 * Get all transport types as array.
 * Order: Taoyuan Metro first, then others.
 *
 * @returns Array of transport type info
 */
export function getAllTransportTypes(): TransportTypeInfo[] {
  const order: TransportType[] = [
    TransportType.TAOYUAN_METRO,
    TransportType.TAIPEI_METRO,
    TransportType.YOUBIKE,
    TransportType.NEW_TAIPEI_METRO,
    TransportType.TRA,
    TransportType.BUS,
    TransportType.HIGHWAY_BUS,
    TransportType.FERRY
  ];
  return order.map(type => TRANSPORT_TYPE_INFO[type]);
}
