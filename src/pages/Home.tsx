import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../utils/db';
import { PeriodStatus, type TripRecord, type CommutePreset } from '../types';
import { Card, CardBody, Button, CircularProgress, TransportIcon, SwipeableItem } from '../components/common';
import { formatCurrency, formatSavedAmount } from '../utils/formatters';
import { formatPeriodRange, formatDateTime, getNowString } from '../utils/dateUtils';
import { calculatePeriodStats, getAmountToBreakEven } from '../utils/statsCalculator';
import { TRANSPORT_TYPE_INFO, getTransportTypeInfo } from '../utils/transportTypes';
import { useNavigate } from 'react-router-dom';

// Icons for swipe actions
const CopyIcon = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const DeleteIcon = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// Button gradient colors
const BUTTON_COLORS = [
  { from: 'from-purple-500', to: 'to-indigo-600', shadow: 'shadow-purple-500/30', hoverFrom: 'hover:from-purple-600', hoverTo: 'hover:to-indigo-700' },
  { from: 'from-orange-500', to: 'to-amber-500', shadow: 'shadow-orange-500/30', hoverFrom: 'hover:from-orange-600', hoverTo: 'hover:to-amber-600' },
  { from: 'from-emerald-500', to: 'to-teal-500', shadow: 'shadow-emerald-500/30', hoverFrom: 'hover:from-emerald-600', hoverTo: 'hover:to-teal-600' },
  { from: 'from-pink-500', to: 'to-rose-500', shadow: 'shadow-pink-500/30', hoverFrom: 'hover:from-pink-600', hoverTo: 'hover:to-rose-600' },
];

/**
 * Home page component showing current period summary and recent trips.
 * Features a circular progress indicator for savings visualization.
 *
 * @returns Home page element
 */
export function Home() {
  const navigate = useNavigate();
  const [isQuickAdding, setIsQuickAdding] = useState<string | null>(null);

  const activePeriod = useLiveQuery(
    () => db.periods.where('status').equals(PeriodStatus.ACTIVE).first()
  );

  const trips = useLiveQuery(
    () => activePeriod
      ? db.trips.where('periodId').equals(activePeriod.id).toArray()
      : Promise.resolve([] as TripRecord[]),
    [activePeriod?.id]
  );

  const recentTrips = useLiveQuery(
    () => db.trips.orderBy('timestamp').reverse().limit(3).toArray()
  );

  const commutePresets = useLiveQuery(
    () => db.commutePresets.orderBy('sortOrder').toArray()
  );

  const periodStats = activePeriod && trips
    ? calculatePeriodStats(activePeriod, trips)
    : null;

  const savingsPercentage = activePeriod && periodStats
    ? (periodStats.totalAmount / activePeriod.ticketPrice) * 100
    : 0;

  /**
   * Quick add a commute trip.
   *
   * @param preset - Commute preset to add
   */
  const handleQuickAdd = async (preset: CommutePreset) => {
    if (!activePeriod) return;

    setIsQuickAdding(preset.id);
    const now = getNowString();

    try {
      await db.trips.add({
        id: uuidv4(),
        periodId: activePeriod.id,
        transportType: preset.transportType,
        departureStation: preset.departureStation,
        arrivalStation: preset.arrivalStation,
        amount: preset.amount,
        timestamp: now,
        createdAt: now,
        updatedAt: now
      });
    } catch (err) {
      console.error('Error adding quick trip:', err);
    } finally {
      setIsQuickAdding(null);
    }
  };

  /**
   * Duplicate a trip with current timestamp.
   *
   * @param trip - Trip to duplicate
   */
  const handleDuplicate = async (trip: TripRecord) => {
    const now = getNowString();
    await db.trips.add({
      ...trip,
      id: uuidv4(),
      timestamp: now,
      createdAt: now,
      updatedAt: now
    });
  };

  /**
   * Delete a trip.
   *
   * @param tripId - Trip ID to delete
   */
  const handleDelete = async (tripId: string) => {
    await db.trips.delete(tripId);
  };

  return (
    <div className="p-3 space-y-3 pb-32">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">TPASS 省錢計算機</h1>
        <button
          onClick={() => navigate('/periods')}
          className="text-xs text-white/60 hover:text-white/80 transition-colors"
        >
          週期管理
        </button>
      </div>

      {/* Current Period Card with Circular Progress */}
      {activePeriod && periodStats ? (
        <Card>
          <CardBody className="py-3">
            {/* Circular Progress - smaller size */}
            <div className="flex flex-col items-center py-2">
              <CircularProgress
                percentage={savingsPercentage}
                size={140}
                strokeWidth={12}
                label={periodStats.savedAmount >= 0
                  ? formatSavedAmount(periodStats.savedAmount)
                  : formatCurrency(getAmountToBreakEven(periodStats.totalAmount, activePeriod.ticketPrice))
                }
                sublabel={periodStats.savedAmount >= 0
                  ? `已省下 ${Math.round(savingsPercentage)}%`
                  : `還差 ${Math.round(100 - savingsPercentage)}%`
                }
              />
            </div>

            {/* Period info - compact */}
            <div className="text-center mb-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {formatPeriodRange(activePeriod.startDate, activePeriod.endDate)} · {formatCurrency(periodStats.totalAmount)} / {periodStats.tripCount} 趟
              </p>
            </div>

            {/* Day progress bar */}
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">
                第 {periodStats.daysElapsed} 天
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                剩餘 {periodStats.daysRemaining} 天
              </span>
            </div>
            <div className="h-1.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(periodStats.daysElapsed / 30) * 100}%` }}
              />
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">目前沒有使用中的 TPASS 週期</p>
            <Button variant="gradient" onClick={() => navigate('/periods')}>
              建立週期
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Recent Trips - with swipe actions */}
      {recentTrips && recentTrips.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h2 className="text-xs font-medium text-white/70">最近紀錄 <span className="text-white/40">← 滑動操作</span></h2>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-white/50 hover:text-white/70 transition-colors"
            >
              查看全部
            </button>
          </div>
          <Card className="overflow-hidden">
            <div className="divide-y divide-white/10 dark:divide-white/5">
              {recentTrips.map(trip => {
                const typeInfo = TRANSPORT_TYPE_INFO[trip.transportType];
                return (
                  <SwipeableItem
                    key={trip.id}
                    onSwipeRight={() => handleDuplicate(trip)}
                    onSwipeLeft={() => handleDelete(trip.id)}
                    rightAction={{ icon: CopyIcon, color: '#22c55e', label: '複製' }}
                    leftAction={{ icon: DeleteIcon, color: '#ef4444', label: '刪除' }}
                  >
                    <div className="px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TransportIcon iconType={typeInfo.iconType} size={18} color={typeInfo.color} />
                        <div>
                          <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            {trip.departureStation && trip.arrivalStation
                              ? `${trip.departureStation} → ${trip.arrivalStation}`
                              : trip.routeNumber || typeInfo.label}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">
                            {formatDateTime(trip.timestamp)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(trip.amount)}
                      </p>
                    </div>
                  </SwipeableItem>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Fixed Quick Action Bar - above BottomNav */}
      {activePeriod && (
        <div className="fixed bottom-20 left-0 right-0 px-3 pb-2">
          {commutePresets && commutePresets.length > 0 ? (
            <div className="flex gap-2">
              {commutePresets.slice(0, 2).map((preset, index) => {
                const colors = BUTTON_COLORS[index % BUTTON_COLORS.length];
                const typeInfo = getTransportTypeInfo(preset.transportType);
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleQuickAdd(preset)}
                    disabled={isQuickAdding !== null}
                    className={`flex-1 py-3 px-3 bg-gradient-to-r ${colors.from} ${colors.to} rounded-xl shadow-lg ${colors.shadow} flex flex-col items-center justify-center gap-0.5 ${colors.hoverFrom} ${colors.hoverTo} transition-all active:scale-[0.97] disabled:opacity-50`}
                  >
                    <div className="flex items-center gap-1.5">
                      <TransportIcon iconType={typeInfo.iconType} size={20} color="white" />
                      <span className="text-base font-bold text-white">
                        {isQuickAdding === preset.id ? '...' : preset.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/70">
                      {preset.departureStation}→{preset.arrivalStation} ${preset.amount}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <button
              onClick={() => navigate('/settings')}
              className="w-full py-3 px-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 flex items-center justify-center gap-2 hover:bg-white/30 transition-all"
            >
              <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium text-white/80">設定快速通勤按鈕</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
