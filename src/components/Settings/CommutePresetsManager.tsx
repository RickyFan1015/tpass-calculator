import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../utils/db';
import { TransportType, type CommutePreset } from '../../types';
import { Button, Card, CardBody, Input, Select, Modal, ConfirmModal, TransportIcon } from '../common';
import { StationPicker, type Station } from '../Trip/StationPicker';
import { getAllTransportTypes, getTransportTypeInfo } from '../../utils/transportTypes';
import { getNowString } from '../../utils/dateUtils';
import { getMetroFare } from '../../data/fares/taipei-metro-fares';
import { getTaoyuanMetroFare } from '../../data/fares/taoyuan-metro-fares';
import { getNewTaipeiMetroFare } from '../../data/fares/new-taipei-metro-fares';
import { getDanhaiLRTFare } from '../../data/fares/danhai-lrt-fares';
import { getAnkengLRTFare } from '../../data/fares/ankeng-lrt-fares';
import { getTRAFare } from '../../data/fares/tra-fares';

// Transport types that support station picker
const STATION_BASED_TYPES: TransportType[] = [
  TransportType.TAIPEI_METRO,
  TransportType.NEW_TAIPEI_METRO,
  TransportType.TAOYUAN_METRO,
  TransportType.DANHAI_LRT,
  TransportType.ANKENG_LRT,
  TransportType.TRA
];

/**
 * Component for managing commute presets (quick buttons on Home page).
 *
 * @returns CommutePresetsManager element
 */
export function CommutePresetsManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<CommutePreset | null>(null);
  const [deletePreset, setDeletePreset] = useState<CommutePreset | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [transportType, setTransportType] = useState<TransportType>(TransportType.TAOYUAN_METRO);
  const [departureStation, setDepartureStation] = useState('');
  const [arrivalStation, setArrivalStation] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  // Station picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'departure' | 'arrival'>('departure');

  const presets = useLiveQuery(
    () => db.commutePresets.orderBy('sortOrder').toArray()
  );

  const transportOptions = getAllTransportTypes()
    .filter(info => STATION_BASED_TYPES.includes(info.type))
    .map(info => ({
      value: info.type,
      label: info.label
    }));

  /**
   * Calculate fare based on transport type and stations.
   */
  const calculateFare = (type: TransportType, from: string, to: string): number => {
    switch (type) {
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

  const openAddModal = () => {
    setEditingPreset(null);
    setName('');
    setTransportType(TransportType.TAOYUAN_METRO);
    setDepartureStation('');
    setArrivalStation('');
    setAmount('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (preset: CommutePreset) => {
    setEditingPreset(preset);
    setName(preset.name);
    setTransportType(preset.transportType);
    setDepartureStation(preset.departureStation);
    setArrivalStation(preset.arrivalStation);
    setAmount(String(preset.amount));
    setError('');
    setIsModalOpen(true);
  };

  const openStationPicker = (target: 'departure' | 'arrival') => {
    setPickerTarget(target);
    setPickerOpen(true);
  };

  const handleStationSelect = (station: Station) => {
    if (pickerTarget === 'departure') {
      setDepartureStation(station.name);
      if (arrivalStation) {
        const fare = calculateFare(transportType, station.name, arrivalStation);
        if (fare > 0) setAmount(String(fare));
      }
    } else {
      setArrivalStation(station.name);
      if (departureStation) {
        const fare = calculateFare(transportType, departureStation, station.name);
        if (fare > 0) setAmount(String(fare));
      }
    }
  };

  const handleTransportChange = (type: TransportType) => {
    setTransportType(type);
    setDepartureStation('');
    setArrivalStation('');
    setAmount('');
  };

  const handleSubmit = async () => {
    setError('');

    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }

    if (!departureStation || !arrivalStation) {
      setError('Please select both stations');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const now = getNowString();

    try {
      if (editingPreset) {
        await db.commutePresets.update(editingPreset.id, {
          name: name.trim(),
          transportType,
          departureStation,
          arrivalStation,
          amount: amountNum,
          updatedAt: now
        });
      } else {
        const maxSortOrder = presets?.length ? Math.max(...presets.map(p => p.sortOrder)) : -1;
        await db.commutePresets.add({
          id: uuidv4(),
          name: name.trim(),
          transportType,
          departureStation,
          arrivalStation,
          amount: amountNum,
          sortOrder: maxSortOrder + 1,
          createdAt: now,
          updatedAt: now
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save');
      console.error('Error saving commute preset:', err);
    }
  };

  const handleDelete = async () => {
    if (deletePreset) {
      await db.commutePresets.delete(deletePreset.id);
      setDeletePreset(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">快速通勤按鈕</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">顯示在首頁的快速記帳按鈕</p>
        </div>
        <Button size="sm" onClick={openAddModal}>+ 新增</Button>
      </div>

      {!presets || presets.length === 0 ? (
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">尚未設定通勤路線</p>
            <Button onClick={openAddModal}>新增路線</Button>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-white/10 dark:divide-white/5">
            {presets.map(preset => {
              const typeInfo = getTransportTypeInfo(preset.transportType);
              return (
                <div key={preset.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TransportIcon iconType={typeInfo.iconType} size={24} color={typeInfo.color} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{preset.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {preset.departureStation} → {preset.arrivalStation} · ${preset.amount}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(preset)}
                      className="p-1.5 text-gray-400 hover:text-blue-500 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeletePreset(preset)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded"
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
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPreset ? '編輯通勤路線' : '新增通勤路線'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button onClick={handleSubmit}>儲存</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="名稱"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="如：上班、下班"
          />

          <Select
            label="交通工具"
            value={transportType}
            onChange={(e) => handleTransportChange(e.target.value as TransportType)}
            options={transportOptions}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">起站</label>
            <button
              onClick={() => openStationPicker('departure')}
              className={`w-full px-3 py-2 border rounded-xl text-left bg-white/70 dark:bg-gray-800/70 ${
                departureStation ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'
              } border-white/20 dark:border-white/10`}
            >
              {departureStation || '選擇車站...'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">迄站</label>
            <button
              onClick={() => openStationPicker('arrival')}
              className={`w-full px-3 py-2 border rounded-xl text-left bg-white/70 dark:bg-gray-800/70 ${
                arrivalStation ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'
              } border-white/20 dark:border-white/10`}
            >
              {arrivalStation || '選擇車站...'}
            </button>
          </div>

          <Input
            label="金額"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="自動計算或手動輸入"
            min={1}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </Modal>

      {/* Station Picker */}
      <StationPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleStationSelect}
        transportType={transportType}
        title={pickerTarget === 'departure' ? '選擇起站' : '選擇迄站'}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletePreset}
        onClose={() => setDeletePreset(null)}
        onConfirm={handleDelete}
        title="刪除路線"
        message={`確定要刪除「${deletePreset?.name}」嗎？`}
        confirmText="刪除"
        variant="danger"
      />
    </div>
  );
}
