import Dexie, { type Table } from 'dexie';
import type { TPASSPeriod, TripRecord, FavoriteRoute, UserSettings, CommutePreset } from '../types';

/**
 * TPASS Calculator IndexedDB database using Dexie.js.
 * Provides local storage for periods, trips, favorite routes, and settings.
 */
export class TPASSDatabase extends Dexie {
  periods!: Table<TPASSPeriod>;
  trips!: Table<TripRecord>;
  favoriteRoutes!: Table<FavoriteRoute>;
  settings!: Table<UserSettings>;
  commutePresets!: Table<CommutePreset>;

  constructor() {
    super('TPASSCalculator');

    this.version(1).stores({
      periods: 'id, startDate, endDate, status',
      trips: 'id, periodId, transportType, timestamp, [periodId+transportType], [periodId+timestamp]',
      favoriteRoutes: 'id, sortOrder',
      settings: 'id'
    });

    this.version(2).stores({
      periods: 'id, startDate, endDate, status',
      trips: 'id, periodId, transportType, timestamp, [periodId+transportType], [periodId+timestamp]',
      favoriteRoutes: 'id, sortOrder',
      settings: 'id',
      commutePresets: 'id, sortOrder'
    });
  }
}

export const db = new TPASSDatabase();

/**
 * Initialize default settings if not exists.
 *
 * @returns Promise that resolves when initialization is complete
 */
export async function initializeSettings(): Promise<void> {
  const existing = await db.settings.get('default');
  if (!existing) {
    const now = new Date().toISOString();
    await db.settings.add({
      id: 'default',
      defaultBusFare: 15,
      favoriteStations: [],
      createdAt: now,
      updatedAt: now
    });
  }
}
