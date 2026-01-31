import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../utils/db';
import { Card, CardBody, Button, Input, Select, Modal, ConfirmModal, TransportIcon } from '../common';
import { TransportType, type FavoriteRoute } from '../../types';
import { getAllTransportTypes, TRANSPORT_TYPE_INFO } from '../../utils/transportTypes';
import { formatCurrency } from '../../utils/formatters';

/**
 * Component for managing favorite routes in settings.
 *
 * @returns FavoriteRoutesManager element
 */
export function FavoriteRoutesManager() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editRoute, setEditRoute] = useState<FavoriteRoute | null>(null);
  const [deleteRoute, setDeleteRoute] = useState<FavoriteRoute | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [transportType, setTransportType] = useState<TransportType>(TransportType.TAIPEI_METRO);
  const [departureStation, setDepartureStation] = useState('');
  const [arrivalStation, setArrivalStation] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [defaultAmount, setDefaultAmount] = useState('');
  const [error, setError] = useState('');

  const favorites = useLiveQuery(
    () => db.favoriteRoutes.orderBy('sortOrder').toArray()
  );

  const transportOptions = getAllTransportTypes().map(info => ({
    value: info.type,
    label: info.label
  }));

  const resetForm = () => {
    setName('');
    setTransportType(TransportType.TAIPEI_METRO);
    setDepartureStation('');
    setArrivalStation('');
    setRouteNumber('');
    setDefaultAmount('');
    setError('');
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (route: FavoriteRoute) => {
    setName(route.name);
    setTransportType(route.transportType);
    setDepartureStation(route.departureStation || '');
    setArrivalStation(route.arrivalStation || '');
    setRouteNumber(route.routeNumber || '');
    setDefaultAmount(route.defaultAmount ? String(route.defaultAmount) : '');
    setError('');
    setEditRoute(route);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('請輸入名稱');
      return;
    }

    const amount = defaultAmount ? parseFloat(defaultAmount) : undefined;
    if (defaultAmount && (isNaN(amount!) || amount! <= 0)) {
      setError('金額無效');
      return;
    }

    try {
      if (editRoute) {
        // Update existing
        await db.favoriteRoutes.update(editRoute.id, {
          name: name.trim(),
          transportType,
          departureStation: departureStation || undefined,
          arrivalStation: arrivalStation || undefined,
          routeNumber: routeNumber || undefined,
          defaultAmount: amount
        });
        setEditRoute(null);
      } else {
        // Add new
        const maxSort = favorites?.reduce((max, f) => Math.max(max, f.sortOrder), 0) || 0;
        await db.favoriteRoutes.add({
          id: uuidv4(),
          name: name.trim(),
          transportType,
          departureStation: departureStation || undefined,
          arrivalStation: arrivalStation || undefined,
          routeNumber: routeNumber || undefined,
          defaultAmount: amount,
          sortOrder: maxSort + 1
        });
        setIsAddModalOpen(false);
      }
      resetForm();
    } catch (err) {
      setError('儲存失敗，請再試一次');
      console.error('Error saving favorite route:', err);
    }
  };

  const handleDelete = async () => {
    if (deleteRoute) {
      await db.favoriteRoutes.delete(deleteRoute.id);
      setDeleteRoute(null);
    }
  };

  const metroTypes: TransportType[] = [
    TransportType.TAIPEI_METRO,
    TransportType.NEW_TAIPEI_METRO,
    TransportType.TAOYUAN_METRO,
    TransportType.DANHAI_LRT,
    TransportType.ANKENG_LRT,
    TransportType.TRA
  ];
  const isMetroType = metroTypes.includes(transportType);

  const busTypes: TransportType[] = [TransportType.BUS, TransportType.HIGHWAY_BUS];
  const isBusType = busTypes.includes(transportType);

  const renderForm = () => (
    <div className="space-y-4">
      <Input
        label="名稱"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="例如：上班"
      />

      <Select
        label="交通工具"
        value={transportType}
        onChange={(e) => setTransportType(e.target.value as TransportType)}
        options={transportOptions}
      />

      {isMetroType && (
        <>
          <Input
            label="起站"
            value={departureStation}
            onChange={(e) => setDepartureStation(e.target.value)}
            placeholder="例如：台北車站"
          />
          <Input
            label="迄站"
            value={arrivalStation}
            onChange={(e) => setArrivalStation(e.target.value)}
            placeholder="例如：台北101"
          />
        </>
      )}

      {isBusType && (
        <Input
          label="路線"
          value={routeNumber}
          onChange={(e) => setRouteNumber(e.target.value)}
          placeholder="例如：307"
        />
      )}

      <Input
        label="預設金額（選填）"
        type="number"
        value={defaultAmount}
        onChange={(e) => setDefaultAmount(e.target.value)}
        placeholder="例如：25"
        min={1}
        max={10000}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );

  return (
    <div>
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">常用路線</h3>
            <Button size="sm" onClick={openAddModal}>+ 新增</Button>
          </div>

          {!favorites || favorites.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              尚無常用路線
            </p>
          ) : (
            <div className="space-y-2">
              {favorites.map(route => {
                const info = TRANSPORT_TYPE_INFO[route.transportType];
                return (
                  <div
                    key={route.id}
                    className="flex items-center justify-between py-2 border-b border-white/10 dark:border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <TransportIcon iconType={info.iconType} size={24} color={info.color} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{route.name}</p>
                        <p className="text-xs text-gray-500">
                          {route.departureStation && route.arrivalStation
                            ? `${route.departureStation} → ${route.arrivalStation}`
                            : route.routeNumber
                              ? `路線 ${route.routeNumber}`
                              : info.label}
                          {route.defaultAmount && ` · ${formatCurrency(route.defaultAmount)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(route)}
                        className="p-1 text-gray-400 hover:text-blue-500 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteRoute(route)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
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
          )}
        </CardBody>
      </Card>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); resetForm(); }}
        title="新增常用路線"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>
              取消
            </Button>
            <Button onClick={handleSave}>新增</Button>
          </>
        }
      >
        {renderForm()}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editRoute}
        onClose={() => { setEditRoute(null); resetForm(); }}
        title="編輯常用路線"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setEditRoute(null); resetForm(); }}>
              取消
            </Button>
            <Button onClick={handleSave}>儲存</Button>
          </>
        }
      >
        {renderForm()}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteRoute}
        onClose={() => setDeleteRoute(null)}
        onConfirm={handleDelete}
        title="刪除常用路線"
        message={`確定要刪除「${deleteRoute?.name}」嗎？`}
        confirmText="刪除"
        variant="danger"
      />
    </div>
  );
}
