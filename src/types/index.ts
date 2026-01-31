/**
 * Transport type constants for all supported TPASS transit options.
 */
export const TransportType = {
  TAIPEI_METRO: 'taipei_metro',
  NEW_TAIPEI_METRO: 'new_taipei_metro',
  TAOYUAN_METRO: 'taoyuan_metro',
  DANHAI_LRT: 'danhai_lrt',
  ANKENG_LRT: 'ankeng_lrt',
  TRA: 'tra',
  BUS: 'bus',
  HIGHWAY_BUS: 'highway_bus',
  YOUBIKE: 'youbike',
  FERRY: 'ferry'
} as const;

export type TransportType = typeof TransportType[keyof typeof TransportType];

/**
 * Period status constants.
 */
export const PeriodStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed'
} as const;

export type PeriodStatus = typeof PeriodStatus[keyof typeof PeriodStatus];

/**
 * City type for YouBike free time calculation.
 */
export type YouBikeCity = 'taipei' | 'new_taipei' | 'taoyuan' | 'keelung';

/**
 * TPASS period representing a 30-day subscription cycle.
 */
export interface TPASSPeriod {
  id: string;
  startDate: string;        // ISO 8601 format
  endDate: string;          // startDate + 29 days
  ticketPrice: number;      // Default 1200
  status: PeriodStatus;
  createdAt: string;        // ISO 8601
  updatedAt: string;        // ISO 8601
}

/**
 * Trip record for a single transit usage.
 */
export interface TripRecord {
  id: string;
  periodId: string;             // Must belong to a period
  transportType: TransportType;
  departureStation?: string;    // For metro/TRA
  arrivalStation?: string;      // For metro/TRA
  routeNumber?: string;         // For bus/highway bus
  segments?: number;            // Bus segments
  duration?: number;            // YouBike duration in minutes
  city?: YouBikeCity;           // YouBike city
  ferryRoute?: string;          // Ferry route
  amount: number;               // Amount in TWD
  timestamp: string;            // ISO 8601
  note?: string;
  createdAt: string;            // ISO 8601
  updatedAt: string;            // ISO 8601
}

/**
 * Favorite route for quick trip recording.
 */
export interface FavoriteRoute {
  id: string;
  name: string;               // User-defined name
  transportType: TransportType;
  departureStation?: string;
  arrivalStation?: string;
  routeNumber?: string;
  defaultAmount?: number;
  sortOrder: number;
}

/**
 * Commute preset for quick one-tap recording on Home page.
 */
export interface CommutePreset {
  id: string;
  name: string;               // Display name (e.g., "上班", "下班")
  transportType: TransportType;
  departureStation: string;
  arrivalStation: string;
  amount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * User settings.
 */
export interface UserSettings {
  id: string;
  defaultBusFare: number;       // Default bus fare
  favoriteStations: string[];   // Favorite station IDs
  createdAt: string;
  updatedAt: string;
}

/**
 * Global statistics (calculated on demand, not stored).
 */
export interface GlobalStats {
  totalPeriods: number;
  totalTPASSCost: number;
  totalTripAmount: number;
  totalSavedAmount: number;
  totalTripCount: number;
}

/**
 * Period statistics (calculated on demand).
 */
export interface PeriodStats {
  totalAmount: number;
  tripCount: number;
  savedAmount: number;
  daysElapsed: number;
  daysRemaining: number;
  dailyAverage: number;
  transportBreakdown: Record<TransportType, { count: number; amount: number }>;
}

/**
 * Transport icon type for SVG icon selection.
 */
export type TransportIconType = 'metro' | 'lightRail' | 'airportExpress' | 'train' | 'bus' | 'coach' | 'bike' | 'ferry';

/**
 * Transport type display info.
 */
export interface TransportTypeInfo {
  type: TransportType;
  label: string;
  iconType: TransportIconType;
  color: string;
}

/**
 * Input for creating a new trip.
 */
export interface TripInput {
  transportType: TransportType;
  departureStation?: string;
  arrivalStation?: string;
  routeNumber?: string;
  segments?: number;
  duration?: number;
  city?: YouBikeCity;
  ferryRoute?: string;
  amount: number;
  timestamp?: string;
  note?: string;
}
