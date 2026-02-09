import { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import { zhTW } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Button, Input, Select } from '../common';
import { TransportType, type TripRecord, type YouBikeCity } from '../../types';
import { getAllTransportTypes } from '../../utils/transportTypes';
import { calculateYouBikeFee, calculateBusFare, isValidAmount, isValidYouBikeAmount, isValidYouBikeDuration, isValidBusSegments } from '../../utils/fareCalculator';
import { getNowString } from '../../utils/dateUtils';
import { db } from '../../utils/db';
import { StationPicker, type Station } from './StationPicker';
import { getMetroFare } from '../../data/fares/taipei-metro-fares';
import { getTaoyuanMetroFare } from '../../data/fares/taoyuan-metro-fares';
import { getNewTaipeiMetroFare } from '../../data/fares/new-taipei-metro-fares';
import { getDanhaiLRTFare } from '../../data/fares/danhai-lrt-fares';
import { getAnkengLRTFare } from '../../data/fares/ankeng-lrt-fares';
import { getTRAFare } from '../../data/fares/tra-fares';

/** Transport types that require station selection. */
const STATION_BASED_TYPES: TransportType[] = [
  TransportType.TAIPEI_METRO,
  TransportType.NEW_TAIPEI_METRO,
  TransportType.TAOYUAN_METRO,
  TransportType.DANHAI_LRT,
  TransportType.ANKENG_LRT,
  TransportType.TRA
];

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
  const [departureStation, setDepartureStation] = useState('');
  const [arrivalStation, setArrivalStation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Station picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'departure' | 'arrival'>('departure');

  const isStationBased = STATION_BASED_TYPES.includes(transportType);

  /**
   * Calculate fare based on transport type and stations.
   *
   * @param from - Departure station name
   * @param to - Arrival station name
   * @returns Calculated fare amount
   */
  const calculateFare = useCallback((from: string, to: string): number => {
    switch (transportType) {
      case TransportType.TAIPEI_METRO:
        return getMetroFare(from, to);
      case TransportType.TAOYUAN_METRO:
        return getTaoyuanMetroFare(from, to);
      case TransportType.NEW_TAIPEI_METRO:
        return getNewTaipeiMetroFare(from, to);
      case TransportType.DANHAI_LRT:
        return getDanhaiLRTFare(from, to);
      case TransportType.ANKENG_LRT:
        return getAnkengLRTFare(from, to);
      case TransportType.TRA:
        return getTRAFare(from, to);
      default:
        return 0;
    }
  }, [transportType]);

  // Initialize form with trip data when modal opens
  useEffect(() => {
    if (trip && isOpen) {
      setTransportType(trip.transportType);
      setAmount(String(trip.amount));
      setRouteNumber(trip.routeNumber || '');
      setSegments(String(trip.segments || 1));
      setDuration(String(trip.duration || ''));
      setCity(trip.city || 'taipei');
      setDepartureStation(trip.departureStation || '');
      setArrivalStation(trip.arrivalStation || '');
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

  /**
   * Handle transport type change and reset station fields.
   *
   * @param type - Selected transport type
   */
  const handleTransportChange = (type: TransportType) => {
    setTransportType(type);
    setDepartureStation('');
    setArrivalStation('');
    setError('');
    if (type === TransportType.BUS) {
      const seg = parseInt(segments, 10) || 1;
      setAmount(String(calculateBusFare(seg)));
    } else if (type === TransportType.YOUBIKE) {
      const mins = parseInt(duration, 10);
      if (mins && isValidYouBikeDuration(mins)) {
        setAmount(String(calculateYouBikeFee(mins, city)));
      }
    } else {
      setAmount('');
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

  /**
   * Open station picker for departure or arrival.
   *
   * @param target - Which station to pick ('departure' or 'arrival')
   */
  const openStationPicker = (target: 'departure' | 'arrival') => {
    setPickerTarget(target);
    setPickerOpen(true);
  };

  /**
   * Swap departure and arrival stations, recalculating fare.
   */
  const handleSwapStations = () => {
    const temp = departureStation;
    setDepartureStation(arrivalStation);
    setArrivalStation(temp);
    if (arrivalStation && temp) {
      const fare = calculateFare(arrivalStation, temp);
      if (fare > 0) setAmount(String(fare));
    }
  };

  /**
   * Handle station selection from picker.
   *
   * @param station - Selected station
   */
  const handleStationSelect = (station: Station) => {
    if (pickerTarget === 'departure') {
      setDepartureStation(station.name);
      if (arrivalStation) {
        const fare = calculateFare(station.name, arrivalStation);
        if (fare > 0) setAmount(String(fare));
      }
    } else {
      setArrivalStation(station.name);
      if (departureStation) {
        const fare = calculateFare(departureStation, station.name);
        if (fare > 0) setAmount(String(fare));
      }
    }
  };

  /**
   * Submit the edited trip record.
   */
  const handleSubmit = async () => {
    if (!trip) return;

    setError('');
    const amountNum = parseFloat(amount);
    const isYouBike = transportType === TransportType.YOUBIKE;
    const isAmountValid = isYouBike ? isValidYouBikeAmount(amountNum) : isValidAmount(amountNum);

    if (!isAmountValid) {
      setError(isYouBike ? '金額必須介於 0 至 10,000 元之間' : '金額必須介於 1 至 10,000 元之間');
      return;
    }

    if (isYouBike) {
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

    if (isStationBased && (!departureStation || !arrivalStation)) {
      setError('請選擇起站和迄站');
      return;
    }

    setIsSubmitting(true);

    try {
      await db.trips.where('id').equals(trip.id).modify((record) => {
        record.transportType = transportType;
        record.amount = amountNum;
        record.timestamp = selectedDate.toISOString();
        record.updatedAt = getNowString();
        record.note = note || undefined;

        // Station fields: set or clear based on transport type
        if (isStationBased) {
          record.departureStation = departureStation;
          record.arrivalStation = arrivalStation;
        } else {
          delete record.departureStation;
          delete record.arrivalStation;
        }

        // Bus fields
        if (transportType === TransportType.BUS) {
          record.routeNumber = routeNumber || undefined;
          record.segments = parseInt(segments, 10);
        } else {
          delete record.segments;
          if (transportType !== TransportType.HIGHWAY_BUS) {
            delete record.routeNumber;
          } else {
            record.routeNumber = routeNumber || undefined;
          }
        }

        // YouBike fields
        if (transportType === TransportType.YOUBIKE) {
          record.duration = parseInt(duration, 10);
          record.city = city;
        } else {
          delete record.duration;
          delete record.city;
        }
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
    <>
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

          {/* Station-based inputs (Metro, LRT, TRA) */}
          {isStationBased && (
            <>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    起站
                  </label>
                  <button
                    onClick={() => openStationPicker('departure')}
                    className={`w-full px-3 py-2 border rounded-xl text-left bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm ${
                      departureStation ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
                    } border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all`}
                  >
                    {departureStation || '選擇車站...'}
                  </button>
                </div>

                {/* Swap Button */}
                <button
                  onClick={handleSwapStations}
                  disabled={!departureStation && !arrivalStation}
                  className="p-2 mb-0.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="起迄站互換"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    迄站
                  </label>
                  <button
                    onClick={() => openStationPicker('arrival')}
                    className={`w-full px-3 py-2 border rounded-xl text-left bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm ${
                      arrivalStation ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
                    } border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all`}
                  >
                    {arrivalStation || '選擇車站...'}
                  </button>
                </div>
              </div>

              {departureStation && arrivalStation && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {departureStation} → {arrivalStation}
                </p>
              )}
            </>
          )}

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
            helperText={isStationBased && departureStation && arrivalStation ? '已依站點自動計算' : undefined}
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

      {/* Station Picker Modal */}
      <StationPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleStationSelect}
        transportType={transportType}
        title={pickerTarget === 'departure' ? '選擇起站' : '選擇迄站'}
      />
    </>
  );
}
