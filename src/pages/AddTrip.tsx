import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../utils/db';
import { TransportType, PeriodStatus, type YouBikeCity } from '../types';
import { Button, Card, CardBody, Input, Select, TransportIcon } from '../components/common';
import { PageHeader } from '../components/common/Layout';
import { StationPicker, type Station } from '../components/Trip/StationPicker';
import { getAllTransportTypes } from '../utils/transportTypes';
import { calculateYouBikeFee, calculateBusFare, isValidAmount, isValidYouBikeAmount, isValidYouBikeDuration, isValidBusSegments } from '../utils/fareCalculator';
import { getMetroFare } from '../data/fares/taipei-metro-fares';
import { getTaoyuanMetroFare } from '../data/fares/taoyuan-metro-fares';
import { getNewTaipeiMetroFare } from '../data/fares/new-taipei-metro-fares';
import { getDanhaiLRTFare } from '../data/fares/danhai-lrt-fares';
import { getAnkengLRTFare } from '../data/fares/ankeng-lrt-fares';
import { getTRAFare } from '../data/fares/tra-fares';
import { getNowString } from '../utils/dateUtils';

// Transport types that need station input
const STATION_BASED_TYPES: TransportType[] = [
  TransportType.TAIPEI_METRO,
  TransportType.NEW_TAIPEI_METRO,
  TransportType.TAOYUAN_METRO,
  TransportType.DANHAI_LRT,
  TransportType.ANKENG_LRT,
  TransportType.TRA
];

// All station-based types now have picker support
const PICKER_SUPPORTED_TYPES: TransportType[] = [
  TransportType.TAIPEI_METRO,
  TransportType.NEW_TAIPEI_METRO,
  TransportType.TAOYUAN_METRO,
  TransportType.DANHAI_LRT,
  TransportType.ANKENG_LRT,
  TransportType.TRA
];

/**
 * Add trip page for recording new transit usage.
 *
 * @returns AddTrip page element
 */
export function AddTrip() {
  const navigate = useNavigate();

  const [transportType, setTransportType] = useState<TransportType>(TransportType.TAOYUAN_METRO);
  const [amount, setAmount] = useState<string>('');
  const [routeNumber, setRouteNumber] = useState<string>('');
  const [segments, setSegments] = useState<string>('1');
  const [duration, setDuration] = useState<string>('');
  const [city, setCity] = useState<YouBikeCity>('taipei');
  const [departureStation, setDepartureStation] = useState<string>('');
  const [arrivalStation, setArrivalStation] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Station picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'departure' | 'arrival'>('departure');

  const activePeriod = useLiveQuery(
    () => db.periods.where('status').equals(PeriodStatus.ACTIVE).first()
  );

  // Query recent trips for current transport type to get recent stations
  const recentTrips = useLiveQuery(
    () => db.trips
      .where('transportType')
      .equals(transportType)
      .reverse()
      .limit(10)
      .toArray(),
    [transportType]
  );

  // Extract unique recent stations (max 2)
  const recentStations = useMemo(() => {
    if (!recentTrips) return [];
    const stations: string[] = [];
    for (const trip of recentTrips) {
      if (trip.departureStation && !stations.includes(trip.departureStation)) {
        stations.push(trip.departureStation);
      }
      if (trip.arrivalStation && !stations.includes(trip.arrivalStation)) {
        stations.push(trip.arrivalStation);
      }
      if (stations.length >= 2) break;
    }
    return stations;
  }, [recentTrips]);

  // Auto-fill last used stations when transport type changes
  useEffect(() => {
    if (recentTrips && recentTrips.length > 0 && isStationBased) {
      const lastTrip = recentTrips[0];
      if (lastTrip.departureStation && lastTrip.arrivalStation) {
        setDepartureStation(lastTrip.departureStation);
        setArrivalStation(lastTrip.arrivalStation);
        // Auto-calculate fare
        if (hasStationPicker) {
          const fare = calculateFare(lastTrip.departureStation, lastTrip.arrivalStation);
          if (fare > 0) setAmount(String(fare));
        }
      }
    }
  }, [recentTrips, transportType]);

  const cityOptions = [
    { value: 'taipei', label: '台北市' },
    { value: 'new_taipei', label: '新北市' },
    { value: 'taoyuan', label: '桃園市' },
    { value: 'keelung', label: '基隆市' }
  ];

  const isStationBased = STATION_BASED_TYPES.includes(transportType);
  const hasStationPicker = PICKER_SUPPORTED_TYPES.includes(transportType);

  const handleTransportChange = (type: TransportType) => {
    setTransportType(type);
    setAmount('');
    setDepartureStation('');
    setArrivalStation('');
    setError('');

    // Auto-calculate for bus
    if (type === TransportType.BUS) {
      setAmount(String(calculateBusFare(1)));
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

  const openStationPicker = (target: 'departure' | 'arrival') => {
    setPickerTarget(target);
    setPickerOpen(true);
  };

  /**
   * Swap departure and arrival stations.
   */
  const handleSwapStations = () => {
    const temp = departureStation;
    setDepartureStation(arrivalStation);
    setArrivalStation(temp);
    // Recalculate fare with swapped stations
    if (arrivalStation && temp && hasStationPicker) {
      const fare = calculateFare(arrivalStation, temp);
      if (fare > 0) setAmount(String(fare));
    }
  };

  /**
   * Calculate fare based on transport type and stations.
   */
  const calculateFare = (from: string, to: string): number => {
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
  };

  const handleStationSelect = (station: Station) => {
    if (pickerTarget === 'departure') {
      setDepartureStation(station.name);
      // Auto-calculate fare if both stations selected
      if (arrivalStation && hasStationPicker) {
        const fare = calculateFare(station.name, arrivalStation);
        if (fare > 0) setAmount(String(fare));
      }
    } else {
      setArrivalStation(station.name);
      // Auto-calculate fare if both stations selected
      if (departureStation && hasStationPicker) {
        const fare = calculateFare(departureStation, station.name);
        if (fare > 0) setAmount(String(fare));
      }
    }
  };

  const handleSubmit = async () => {
    setError('');

    if (!activePeriod) {
      setError('目前沒有使用中的 TPASS 週期，請先建立週期');
      return;
    }

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
      setError('請輸入起站和迄站');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = getNowString();

      await db.trips.add({
        id: uuidv4(),
        periodId: activePeriod.id,
        transportType,
        departureStation: isStationBased ? departureStation : undefined,
        arrivalStation: isStationBased ? arrivalStation : undefined,
        routeNumber: routeNumber || undefined,
        segments: transportType === TransportType.BUS ? parseInt(segments, 10) : undefined,
        duration: transportType === TransportType.YOUBIKE ? parseInt(duration, 10) : undefined,
        city: transportType === TransportType.YOUBIKE ? city : undefined,
        amount: amountNum,
        timestamp: now,
        note: note || undefined,
        createdAt: now,
        updatedAt: now
      });

      navigate('/');
    } catch (err) {
      setError('儲存失敗，請再試一次');
      console.error('Error saving trip:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activePeriod) {
    return (
      <div>
        <PageHeader title="新增紀錄" />
        <div className="p-4">
          <Card>
            <CardBody className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">目前沒有使用中的 TPASS 週期</p>
              <Button onClick={() => navigate('/periods')}>
                建立週期
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="新增紀錄" />

      <div className="p-4 space-y-4">
        {/* Transport Type Selection */}
        <Card>
          <CardBody>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              交通工具
            </label>
            <div className="grid grid-cols-5 gap-2">
              {getAllTransportTypes().map(info => (
                <button
                  key={info.type}
                  onClick={() => handleTransportChange(info.type)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                    transportType === info.type
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md'
                      : 'border-white/20 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/50 bg-white/50 dark:bg-gray-800/50'
                  }`}
                >
                  <TransportIcon
                    iconType={info.iconType}
                    size={24}
                    color={transportType === info.type ? info.color : '#9CA3AF'}
                  />
                  <span className={`text-xs mt-1 truncate w-full text-center ${
                    transportType === info.type ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {info.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Dynamic Input Based on Transport Type */}
        <Card>
          <CardBody className="space-y-4">
            {/* Station-based inputs (Metro, LRT, TRA) */}
            {isStationBased && (
              <>
                {hasStationPicker ? (
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
                ) : (
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Input
                        label="起站"
                        value={departureStation}
                        onChange={(e) => setDepartureStation(e.target.value)}
                        placeholder="輸入起站名稱"
                      />
                    </div>
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
                      <Input
                        label="迄站"
                        value={arrivalStation}
                        onChange={(e) => setArrivalStation(e.target.value)}
                        placeholder="輸入迄站名稱"
                      />
                    </div>
                  </div>
                )}

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

            {/* Highway Bus inputs */}
            {transportType === TransportType.HIGHWAY_BUS && (
              <Input
                label="路線（選填）"
                value={routeNumber}
                onChange={(e) => setRouteNumber(e.target.value)}
                placeholder="例如：1815"
              />
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
                  placeholder="輸入騎乘時間"
                />
                {duration && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {city === 'taoyuan' ? '前 60 分鐘免費' : '前 30 分鐘免費'}
                  </p>
                )}
              </>
            )}

            {/* Amount input */}
            <Input
              label="金額（元）"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="輸入金額"
              min={1}
              max={10000}
              helperText={hasStationPicker && departureStation && arrivalStation ? '已依站點自動計算' : undefined}
            />

            {/* Note input */}
            <Input
              label="備註（選填）"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="新增備註"
            />

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </CardBody>
        </Card>

        {/* Submit Button */}
        <Button
          fullWidth
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting || !amount}
        >
          {isSubmitting ? '儲存中...' : '儲存紀錄'}
        </Button>
      </div>

      {/* Station Picker Modal */}
      <StationPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleStationSelect}
        transportType={transportType}
        title={pickerTarget === 'departure' ? '選擇起站' : '選擇迄站'}
        recentStations={recentStations}
      />
    </div>
  );
}
