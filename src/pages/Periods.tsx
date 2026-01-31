import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from 'react-datepicker';
import { zhTW } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { db } from '../utils/db';
import { PeriodStatus, type TPASSPeriod } from '../types';
import { Card, CardBody, Button, Modal, ConfirmModal } from '../components/common';
import { PageHeader } from '../components/common/Layout';
import { formatCurrency } from '../utils/formatters';
import { formatPeriodRange, calculateEndDate, getNowString, getDaysElapsed } from '../utils/dateUtils';
import { TPASS_TICKET_PRICE } from '../utils/fareCalculator';

/**
 * Periods page for managing TPASS subscription periods.
 *
 * @returns Periods page element
 */
export function Periods() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [deletePeriod, setDeletePeriod] = useState<TPASSPeriod | null>(null);
  const [error, setError] = useState('');

  const periods = useLiveQuery(
    () => db.periods.orderBy('startDate').reverse().toArray()
  );

  const tripCounts = useLiveQuery(async () => {
    const counts: Record<string, { count: number; amount: number }> = {};
    if (periods) {
      for (const period of periods) {
        const trips = await db.trips.where('periodId').equals(period.id).toArray();
        counts[period.id] = {
          count: trips.length,
          amount: trips.reduce((sum, t) => sum + t.amount, 0)
        };
      }
    }
    return counts;
  }, [periods]);

  const activePeriod = periods?.find(p => p.status === PeriodStatus.ACTIVE);

  const handleCreatePeriod = async () => {
    setError('');

    if (activePeriod) {
      setError('目前已有使用中的週期，請先結束後再建立新週期');
      return;
    }

    const now = getNowString();
    // Convert Date to YYYY-MM-DD string
    const startDateString = startDate.toISOString().split('T')[0];
    const endDate = calculateEndDate(startDateString);

    try {
      await db.periods.add({
        id: uuidv4(),
        startDate: startDateString,
        endDate,
        ticketPrice: TPASS_TICKET_PRICE,
        status: PeriodStatus.ACTIVE,
        createdAt: now,
        updatedAt: now
      });

      setIsCreateModalOpen(false);
      setStartDate(new Date());
    } catch (err) {
      setError('建立失敗，請再試一次');
      console.error('Error creating period:', err);
    }
  };

  const handleDeletePeriod = async () => {
    if (deletePeriod) {
      // Delete all trips in this period first
      await db.trips.where('periodId').equals(deletePeriod.id).delete();
      await db.periods.delete(deletePeriod.id);
      setDeletePeriod(null);
    }
  };

  const handleCompletePeriod = async (period: TPASSPeriod) => {
    await db.periods.update(period.id, {
      status: PeriodStatus.COMPLETED,
      updatedAt: getNowString()
    });
  };

  return (
    <div>
      <PageHeader
        title="TPASS 週期"
        subtitle={periods ? `共 ${periods.length} 個週期` : undefined}
        action={
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            + 新增
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {!periods || periods.length === 0 ? (
          <Card>
            <CardBody className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">尚無週期紀錄</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                建立第一個週期
              </Button>
            </CardBody>
          </Card>
        ) : (
          periods.map(period => {
            const stats = tripCounts?.[period.id] || { count: 0, amount: 0 };
            const savedAmount = stats.amount - period.ticketPrice;
            const isActive = period.status === PeriodStatus.ACTIVE;

            return (
              <Card key={period.id} onClick={() => navigate(`/periods/${period.id}`)}>
                <CardBody>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatPeriodRange(period.startDate, period.endDate)}
                      </p>
                      {isActive && (
                        <span className="inline-block mt-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                          使用中 · 第 {getDaysElapsed(period.startDate)} 天
                        </span>
                      )}
                      {!isActive && (
                        <span className="inline-block mt-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                          已結束
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {isActive && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCompletePeriod(period); }}
                          className="p-1.5 text-gray-400 hover:text-green-500 rounded"
                          title="結束週期"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeletePeriod(period); }}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                        title="刪除週期"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">搭乘次數</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stats.count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">總金額</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(stats.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {savedAmount >= 0 ? '省下' : '虧損'}
                      </p>
                      <p className={`text-lg font-semibold ${
                        savedAmount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                      }`}>
                        {formatCurrency(Math.abs(savedAmount))}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })
        )}
      </div>

      {/* Create Period Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setError('');
        }}
        title="建立新週期"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreatePeriod}>
              建立
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              開始日期
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => date && setStartDate(date)}
              dateFormat="yyyy/MM/dd"
              locale={zhTW}
              maxDate={new Date()}
              className="w-full px-3 py-2 border rounded-xl text-gray-900 dark:text-gray-100 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              wrapperClassName="w-full"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            結束日期：{calculateEndDate(startDate.toISOString().split('T')[0])}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            票價：{formatCurrency(TPASS_TICKET_PRICE)}
          </p>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletePeriod}
        onClose={() => setDeletePeriod(null)}
        onConfirm={handleDeletePeriod}
        title="刪除週期"
        message="確定要刪除這個週期嗎？該週期內的所有紀錄也會一併刪除。"
        confirmText="刪除"
        variant="danger"
      />
    </div>
  );
}
