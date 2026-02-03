import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { db } from '../utils/db';
import { Card, CardBody, Button, TransportIcon } from '../components/common';
import { PageHeader } from '../components/common/Layout';
import { formatCurrency, formatSavedAmount } from '../utils/formatters';
import { formatPeriodRange, formatDate } from '../utils/dateUtils';
import { calculatePeriodStats } from '../utils/statsCalculator';
import { TRANSPORT_TYPE_INFO } from '../utils/transportTypes';
import { TransportType, type TripRecord } from '../types';

/**
 * Period detail page showing statistics and breakdown for a specific period.
 *
 * @returns PeriodDetail page element
 */
export function PeriodDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const period = useLiveQuery(
    () => id ? db.periods.get(id) : undefined,
    [id]
  );

  const trips = useLiveQuery(
    () => id ? db.trips.where('periodId').equals(id).toArray() : Promise.resolve([] as TripRecord[]),
    [id]
  );

  const stats = useMemo(() => {
    if (!period || !trips) return null;
    return calculatePeriodStats(period, trips);
  }, [period, trips]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!stats) return [];

    return Object.entries(stats.transportBreakdown)
      .filter(([_, data]) => data.count > 0)
      .map(([type, data]) => {
        const info = TRANSPORT_TYPE_INFO[type as TransportType];
        return {
          name: info.label,
          value: data.amount,
          count: data.count,
          color: info.color,
          iconType: info.iconType
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [stats]);

  if (!period || !stats) {
    return (
      <div>
        <PageHeader title="週期詳情" />
        <div className="p-4">
          <Card>
            <CardBody className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">找不到此週期</p>
              <Button className="mt-4" onClick={() => navigate('/periods')}>
                返回週期列表
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="週期詳情"
        subtitle={formatPeriodRange(period.startDate, period.endDate)}
      />

      <div className="p-4 space-y-4">
        {/* Summary Stats */}
        <Card>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">已使用金額</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.savedAmount >= 0 ? '省下' : '虧損'}
                </p>
                <p className={`text-2xl font-bold ${
                  stats.savedAmount >= 0 ? 'text-green-600' : 'text-red-500'
                }`}>
                  {formatSavedAmount(stats.savedAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">搭乘次數</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{stats.tripCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">每日平均</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(Math.round(stats.dailyAverage))}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Transport Breakdown Chart */}
        {chartData.length > 0 && (
          <Card>
            <CardBody>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">依交通類型</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Transport Breakdown List */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">明細</h3>
            <div className="space-y-2">
              {chartData.map(item => (
                <div
                  key={item.name}
                  className="flex items-center justify-between py-2 border-b border-white/10 dark:border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <TransportIcon iconType={item.iconType} size={24} color={item.color} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.value)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.count} 趟</p>
                  </div>
                </div>
              ))}
              {chartData.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">尚無紀錄</p>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Trips in this period */}
        {trips && trips.length > 0 && (
          <Card>
            <CardBody>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                最近紀錄（共 {trips.length} 筆）
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {trips
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 10)
                  .map(trip => {
                    const info = TRANSPORT_TYPE_INFO[trip.transportType];
                    return (
                      <div
                        key={trip.id}
                        className="flex items-center justify-between py-2 border-b border-white/10 dark:border-white/5 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <TransportIcon iconType={info.iconType} size={20} color={info.color} />
                          <div>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              {trip.departureStation && trip.arrivalStation
                                ? `${trip.departureStation} → ${trip.arrivalStation}`
                                : trip.routeNumber
                                  ? `路線 ${trip.routeNumber}`
                                  : info.label}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(trip.timestamp)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold">{formatCurrency(trip.amount)}</p>
                      </div>
                    );
                  })}
              </div>
              {trips.length > 10 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  顯示 10 筆，共 {trips.length} 筆
                </p>
              )}
            </CardBody>
          </Card>
        )}

        <Button variant="secondary" fullWidth onClick={() => navigate('/periods')}>
          返回週期列表
        </Button>
      </div>
    </div>
  );
}
