import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../utils/db';
import { Card, CardBody, ConfirmModal, TransportIcon } from '../components/common';
import { PageHeader } from '../components/common/Layout';
import { EditTripModal } from '../components/Trip';
import { formatCurrency } from '../utils/formatters';
import { formatDate, formatDateTime, getNowString } from '../utils/dateUtils';
import { getTransportTypeInfo } from '../utils/transportTypes';
import type { TripRecord } from '../types';

/**
 * Trip history page showing all recorded trips.
 *
 * @returns TripHistory page element
 */
export function TripHistory() {
  const [editTrip, setEditTrip] = useState<TripRecord | null>(null);
  const [deleteTrip, setDeleteTrip] = useState<TripRecord | null>(null);

  const trips = useLiveQuery(
    () => db.trips.orderBy('timestamp').reverse().toArray()
  );

  // Group trips by date
  const groupedTrips = trips?.reduce((groups, trip) => {
    const date = formatDate(trip.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(trip);
    return groups;
  }, {} as Record<string, TripRecord[]>) || {};

  const handleDelete = async () => {
    if (deleteTrip) {
      await db.trips.delete(deleteTrip.id);
      setDeleteTrip(null);
    }
  };

  /**
   * Duplicate a trip with current timestamp.
   *
   * @param trip - Trip record to duplicate
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

  if (!trips || trips.length === 0) {
    return (
      <div>
        <PageHeader title="搭乘紀錄" />
        <div className="p-4">
          <Card>
            <CardBody className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">尚無紀錄</p>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="搭乘紀錄"
        subtitle={`共 ${trips.length} 筆紀錄`}
      />

      <div className="p-4 space-y-4">
        {Object.entries(groupedTrips).map(([date, dayTrips]) => (
          <div key={date}>
            <h3 className="text-sm font-medium text-white/80 mb-2">{date}</h3>
            <Card>
              <div className="divide-y divide-white/10 dark:divide-white/5">
                {dayTrips.map(trip => {
                  const transportInfo = getTransportTypeInfo(trip.transportType);
                  return (
                    <div
                      key={trip.id}
                      className="px-4 py-3 flex items-center justify-between"
                    >
                      <div
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => setEditTrip(trip)}
                      >
                        <TransportIcon iconType={transportInfo.iconType} size={28} color={transportInfo.color} />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {trip.departureStation && trip.arrivalStation
                              ? `${trip.departureStation} → ${trip.arrivalStation}`
                              : trip.routeNumber
                                ? `路線 ${trip.routeNumber}`
                                : transportInfo.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDateTime(trip.timestamp).split(' ')[1]}
                            {trip.duration && ` · ${trip.duration} 分鐘`}
                            {trip.segments && trip.segments > 1 && ` · ${trip.segments} 段`}
                            {trip.note && ` · ${trip.note}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mr-1">
                          {formatCurrency(trip.amount)}
                        </p>
                        <button
                          onClick={() => handleDuplicate(trip)}
                          className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          aria-label="Duplicate trip"
                          title="複製紀錄"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setEditTrip(trip)}
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          aria-label="Edit trip"
                          title="編輯紀錄"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteTrip(trip)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          aria-label="Delete trip"
                          title="刪除紀錄"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Edit Trip Modal */}
      <EditTripModal
        trip={editTrip}
        isOpen={!!editTrip}
        onClose={() => setEditTrip(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTrip}
        onClose={() => setDeleteTrip(null)}
        onConfirm={handleDelete}
        title="刪除紀錄"
        message={`確定要刪除這筆紀錄（${formatCurrency(deleteTrip?.amount || 0)}）嗎？`}
        confirmText="刪除"
        variant="danger"
      />
    </div>
  );
}
