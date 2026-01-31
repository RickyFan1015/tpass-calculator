import { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../utils/db';
import { Card, CardBody, Button, Input, ConfirmModal } from '../components/common';
import { PageHeader } from '../components/common/Layout';
import { CommutePresetsManager, FavoriteRoutesManager } from '../components/Settings';
import { getNowString } from '../utils/dateUtils';
import type { TPASSPeriod, TripRecord, CommutePreset } from '../types';

interface BackupData {
  periods?: TPASSPeriod[];
  trips?: TripRecord[];
  commutePresets?: CommutePreset[];
  exportedAt?: string;
}

/**
 * Settings page for app configuration.
 *
 * @returns Settings page element
 */
export function Settings() {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importData, setImportData] = useState<BackupData | null>(null);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [defaultBusFare, setDefaultBusFare] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const settings = useLiveQuery(() => db.settings.get('default'));

  // Initialize form when settings load
  if (settings && !defaultBusFare) {
    setDefaultBusFare(String(settings.defaultBusFare));
  }

  const handleSaveSettings = async () => {
    if (!settings) return;

    const fare = parseInt(defaultBusFare, 10);
    if (isNaN(fare) || fare < 1 || fare > 100) return;

    await db.settings.update('default', {
      defaultBusFare: fare,
      updatedAt: getNowString()
    });
  };

  const handleResetData = async () => {
    await db.trips.clear();
    await db.periods.clear();
    await db.commutePresets.clear();
    setIsResetModalOpen(false);
  };

  /**
   * Export all data to JSON file.
   */
  const handleExportData = async () => {
    const periods = await db.periods.toArray();
    const trips = await db.trips.toArray();
    const commutePresets = await db.commutePresets.toArray();
    const data: BackupData = {
      periods,
      trips,
      commutePresets,
      exportedAt: getNowString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tpass-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Handle file selection for import.
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError('');
    setImportSuccess('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as BackupData;

        // Validate data structure
        if (!data.periods && !data.trips && !data.commutePresets) {
          setImportError('無效的備份檔案格式');
          return;
        }

        setImportData(data);
        setIsImportModalOpen(true);
      } catch {
        setImportError('無法解析檔案，請確認是有效的 JSON 格式');
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Confirm and execute import.
   */
  const handleImportConfirm = async () => {
    if (!importData) return;

    try {
      // Clear existing data
      await db.periods.clear();
      await db.trips.clear();
      await db.commutePresets.clear();

      // Import periods
      if (importData.periods && importData.periods.length > 0) {
        await db.periods.bulkAdd(importData.periods);
      }

      // Import trips
      if (importData.trips && importData.trips.length > 0) {
        await db.trips.bulkAdd(importData.trips);
      }

      // Import commute presets
      if (importData.commutePresets && importData.commutePresets.length > 0) {
        await db.commutePresets.bulkAdd(importData.commutePresets);
      }

      const summary = [
        importData.periods?.length ? `${importData.periods.length} 個週期` : null,
        importData.trips?.length ? `${importData.trips.length} 筆紀錄` : null,
        importData.commutePresets?.length ? `${importData.commutePresets.length} 個通勤路線` : null,
      ].filter(Boolean).join('、');

      setImportSuccess(`匯入成功！已匯入 ${summary}`);
      setIsImportModalOpen(false);
      setImportData(null);
    } catch (err) {
      setImportError('匯入失敗，請再試一次');
      console.error('Import error:', err);
    }
  };

  return (
    <div>
      <PageHeader title="設定" />

      <div className="p-4 space-y-6">
        {/* Commute Presets */}
        <CommutePresetsManager />

        {/* Favorite Routes */}
        <FavoriteRoutesManager />

        {/* Default Bus Fare */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">預設公車票價</h3>
            <div className="flex gap-2">
              <Input
                type="number"
                value={defaultBusFare}
                onChange={(e) => setDefaultBusFare(e.target.value)}
                min={1}
                max={100}
                className="flex-1"
              />
              <Button onClick={handleSaveSettings}>
                儲存
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              公車每段預設票價
            </p>
          </CardBody>
        </Card>

        {/* Data Management */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">資料管理</h3>
            <div className="space-y-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={handleExportData}
              >
                匯出資料 (JSON)
              </Button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                variant="secondary"
                fullWidth
                onClick={() => fileInputRef.current?.click()}
              >
                匯入資料 (JSON)
              </Button>

              {importError && (
                <p className="text-sm text-red-500 text-center">{importError}</p>
              )}
              {importSuccess && (
                <p className="text-sm text-green-600 dark:text-green-400 text-center">{importSuccess}</p>
              )}

              <Button
                variant="danger"
                fullWidth
                onClick={() => setIsResetModalOpen(true)}
              >
                清除所有資料
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* App Info */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">關於</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">TPASS 省錢計算機 v1.0.0</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              追蹤你的 TPASS 省錢金額
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetData}
        title="清除所有資料"
        message="確定要刪除所有週期和紀錄嗎？此操作無法復原。"
        confirmText="清除"
        variant="danger"
      />

      {/* Import Confirmation Modal */}
      <ConfirmModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportData(null);
        }}
        onConfirm={handleImportConfirm}
        title="確認匯入"
        message={`即將匯入：${[
          importData?.periods?.length ? `${importData.periods.length} 個週期` : null,
          importData?.trips?.length ? `${importData.trips.length} 筆紀錄` : null,
          importData?.commutePresets?.length ? `${importData.commutePresets.length} 個通勤路線` : null,
        ].filter(Boolean).join('、') || '無資料'}\n\n現有資料將被覆蓋，確定要繼續嗎？`}
        confirmText="匯入"
        variant="primary"
      />
    </div>
  );
}
