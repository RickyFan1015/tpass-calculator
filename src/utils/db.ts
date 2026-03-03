import Dexie, { type Table } from 'dexie';
import type { TPASSPeriod, TripRecord, UserSettings, CommutePreset } from '../types';

/**
 * TPASS Calculator IndexedDB database using Dexie.js.
 * Provides local storage for periods, trips, and settings.
 */
export class TPASSDatabase extends Dexie {
  periods!: Table<TPASSPeriod>;
  trips!: Table<TripRecord>;
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

    // Version 3: Remove favoriteRoutes (replaced by commutePresets)
    this.version(3).stores({
      periods: 'id, startDate, endDate, status',
      trips: 'id, periodId, transportType, timestamp, [periodId+transportType], [periodId+timestamp]',
      favoriteRoutes: null,  // Delete this table
      settings: 'id',
      commutePresets: 'id, sortOrder'
    });

    // Version 4: Merge danhai_lrt and ankeng_lrt into new_taipei_metro
    this.version(4).stores({
      periods: 'id, startDate, endDate, status',
      trips: 'id, periodId, transportType, timestamp, [periodId+transportType], [periodId+timestamp]',
      settings: 'id',
      commutePresets: 'id, sortOrder'
    }).upgrade(tx => {
      return Promise.all([
        tx.table('trips').toCollection().modify(trip => {
          if (trip.transportType === 'danhai_lrt' || trip.transportType === 'ankeng_lrt') {
            trip.transportType = 'new_taipei_metro';
          }
        }),
        tx.table('commutePresets').toCollection().modify(preset => {
          if (preset.transportType === 'danhai_lrt' || preset.transportType === 'ankeng_lrt') {
            preset.transportType = 'new_taipei_metro';
          }
        })
      ]);
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
