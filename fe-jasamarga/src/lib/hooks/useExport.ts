'use client';

import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import {
  exportData,
  prepareDataForExport,
  ExportOptions,
} from '@/lib/utils/export';

interface UseExportProps {
  onExport?: (format: 'excel' | 'csv' | 'pdf') => Promise<any[]>;
  data?: any[];
  columnMapping?: Record<string, string>;
  defaultOptions?: Partial<ExportOptions>;
}

export function useExport({
  onExport,
  data,
  columnMapping = {},
  defaultOptions = {},
}: UseExportProps = {}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(
    async (
      format: 'excel' | 'csv' | 'pdf',
      customOptions: Partial<ExportOptions> = {}
    ) => {
      if (typeof window === 'undefined') {
        throw new Error('Export hanya bisa dijalankan di browser');
      }

      setIsExporting(true);

      try {
        let rows: any[] = [];

        if (onExport) {
          rows = await onExport(format);
        } else if (data) {
          rows = data;
        } else {
          throw new Error('No data or export handler provided');
        }

        if (!rows || rows.length === 0) {
          notifications.show({
            title: 'Peringatan',
            message: 'Tidak ada data untuk diexport',
            color: 'yellow',
          });
          return false;
        }

        const preparedData = prepareDataForExport(rows, columnMapping);

        const options: ExportOptions = {
          filename: `export-${format}-${new Date()
            .toISOString()
            .split('T')[0]}`,
          ...defaultOptions,
          ...customOptions,
        };

        await exportData(preparedData, format, options);

        notifications.show({
          title: 'Sukses',
          message: `Data berhasil diexport ke format ${format.toUpperCase()}`,
          color: 'green',
        });

        return true;
      } catch (error: any) {
        console.error('Export error:', error);

        notifications.show({
          title: 'Error',
          message: `Gagal mengexport data: ${error.message}`,
          color: 'red',
        });

        return false;
      } finally {
        setIsExporting(false);
      }
    },
    [onExport, data, columnMapping, defaultOptions]
  );

  return {
    isExporting,
    exportToExcel: (options?: Partial<ExportOptions>) =>
      handleExport('excel', options),
    exportToCSV: (options?: Partial<ExportOptions>) =>
      handleExport('csv', options),
    exportToPDF: (options?: Partial<ExportOptions>) =>
      handleExport('pdf', options),
    handleExport,
  };
}
