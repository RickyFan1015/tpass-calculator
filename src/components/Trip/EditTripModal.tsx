import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { zhTW } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Button, Input, Select } from '../common';
import { TransportType, type TripRecord, type YouBikeCity } from '../../types';
import { getAllTransportTypes } from '../../utils/transportTypes';
import { calculateYouBikeFee, calculateBusFare, isValidAmount, isValidYouBikeDuration, isValidBusSegments } from '../../utils/fareCalculator';
import { getNowString } from '../../utils/dateUtils';
import { db } from '../../utils/db';

interface EditTripModalProps {
  trip: TripRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal component for editing an existing trip record.
 *
 * @param props - EditTripModal props
 * @returns EditTripModal element
 */
export function EditTripModal({ trip, isOpen, onClose }: EditTripModalProps) {
  const [transportType, setTransportType] = useState<TransportType>(TransportType.BUS);
  const [amount, setAmount] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [segments, setSegments] = useState('1');
  const [duration, setDuration] = useState('');
  const [city, setCity] = useState<YouBikeCity>('taipei');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with trip data when modal opens
  useEffect(() => {
    if (trip && isOpen) {
      setTransportType(trip.transportType);
      setAmount(String(trip.amount));
      setRouteNumber(trip.routeNumber || '');
      setSegments(String(trip.segments || 1));
      setDuration(String(trip.duration || ''));
      setCity(trip.city || 'taipei');
      setSelectedDate(new Date(trip.timestamp));
      setNote(trip.note || '');
      setError('');
    }
  }, [trip, isOpen]);

  const cityOptions = [
    { value: 'taipei', label: '台北市' },
    { value: 'new_taipei', label: '新北市' },
    { value: 'taoyuan', label: '桃園市' },
    { value: 'keelung', label: '基隆市' }
  ];

  const transportOptions = getAllTransportTypes().map(info => ({
    value: info.type,
    label: info.label
  }));

  const handleTransportChange = (type: TransportType) => {
    setTransportType(type);
    if (type === TransportType.BUS) {
      const seg = parseInt(segments, 10) || 1;
      setAmount(String(calculateBusFare(seg)));
    } else if (type === TransportType.YOUBIKE) {
      const mins = parseInt(duration, 10);
      if (mins && isValidYouBikeDuration(mins)) {
        setAmount(String(calculateYouBikeFee(mins, city)));
      }
    }
  };

  const handleSegmentsChange = (value: string) => {
    setSegments(value);
    const seg = parseInt(value, 10);
    if (!isNaN(seg) && isValidBusSegments(seg)) {
      setAmount(String(calculateBusFare(seg)));
    }
  };

  const handleDurationChange = (value: string) => {
    setDuration(value);
    const mins = parseInt(value, 10);
    if (!isNaN(mins) && isValidYouBikeDuration(mins)) {
      setAmount(String(calculateYouBikeFee(mins, city)));
    }
  };

  const handleCityChange = (value: YouBikeCity) => {
    setCity(value);
    const mins = parseInt(duration, 10);
    if (!isNaN(mins) && isValidYouBikeDuration(mins)) {
      setAmount(String(calculateYouBikeFee(mins, value)));
    }
  };

  const handleSubmit = async () => {
    if (!trip) return;

    setError('');
    const amountNum = parseFloat(amount);

    if (!isValidAmount(amountNum)) {
      setError('金額必須介於 1 至 10,000 元之間');
      return;
    }

    if (transportType === TransportType.YOUBIKE) {
      const durationNum = parseInt(duration, 10);
      if (!isValidYouBikeDuration(durationNum)) {
        setError('騎乘時間必須介於 1 至 1,440 分鐘之間');
        return;
      }
    }

    if (transportType === TransportType.BUS) {
      const segmentsNum = parseInt(segments, 10);
      if (!isValidBusSegments(segmentsNum)) {
        setError('段次必須介於 1 至 10 之間');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await db.trips.update(trip.id, {
        transportType,
        routeNumber: routeNumber || undefined,
        segments: transportType === TransportType.BUS ? parseInt(segments, 10) : undefined,
        duration: transportType === TransportType.YOUBIKE ? parseInt(duration, 10) : undefined,
        city: transportType === TransportType.YOUBIKE ? city : undefined,
        amount: amountNum,
        timestamp: selectedDate.toISOString(),
        note: note || undefined,
        updatedAt: getNowString()
      });

      onClose();
    } catch (err) {
      setError('更新失敗，請再試一次');
      console.error('Error updating trip:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="編輯紀錄"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !amount}>
            {isSubmitting ? '儲存中...' : '儲存'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Transport Type */}
        <Select
          label="交通工具"
          value={transportType}
          onChange={(e) => handleTransportChange(e.target.value as TransportType)}
          options={transportOptions}
        />

        {/* Date and Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            日期時間
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => date && setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy/MM/dd HH:mm"
            locale={zhTW}
            maxDate={new Date()}
            className="w-full px-3 py-2 border rounded-xl text-gray-900 dark:text-gray-100 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            wrapperClassName="w-full"
          />
        </div>

        {/* Bus specific inputs */}
        {transportType === TransportType.BUS && (
          <>
            <Input
              label="路線（選填）"
              value={routeNumber}
              onChange={(e) => setRouteNumber(e.target.value)}
              placeholder="例如：307"
            />
            <Input
              label="段次"
              type="number"
              value={segments}
              onChange={(e) => handleSegmentsChange(e.target.value)}
              min={1}
              max={10}
            />
          </>
        )}

        {/* YouBike specific inputs */}
        {transportType === TransportType.YOUBIKE && (
          <>
            <Select
              label="城市"
              value={city}
              onChange={(e) => handleCityChange(e.target.value as YouBikeCity)}
              options={cityOptions}
            />
            <Input
              label="騎乘時間（分鐘）"
              type="number"
              value={duration}
              onChange={(e) => handleDurationChange(e.target.value)}
              min={1}
              max={1440}
            />
          </>
        )}

        {/* Amount */}
        <Input
          label="金額（元）"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={1}
          max={10000}
        />

        {/* Note */}
        <Input
          label="備註（選填）"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="新增備註"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </Modal>
  );
}
