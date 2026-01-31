import { useEffect } from 'react';
import { db } from '../utils/db';
import { PeriodStatus } from '../types';
import { isPeriodEnded, getNowString } from '../utils/dateUtils';

/**
 * Hook to automatically check and update period status on app startup.
 * Marks expired periods as completed.
 */
export function usePeriodCheck() {
  useEffect(() => {
    async function checkPeriods() {
      const activePeriod = await db.periods
        .where('status')
        .equals(PeriodStatus.ACTIVE)
        .first();

      if (activePeriod && isPeriodEnded(activePeriod.endDate)) {
        // Period has expired, mark as completed
        await db.periods.update(activePeriod.id, {
          status: PeriodStatus.COMPLETED,
          updatedAt: getNowString()
        });

        console.log(`Period ${activePeriod.id} marked as completed (expired)`);
      }
    }

    checkPeriods();
  }, []);
}
