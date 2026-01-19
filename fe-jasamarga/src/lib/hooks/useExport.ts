import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { exportData, prepareDataForExport, ExportOptions } from '@/lib/utils/export';

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

  const handleExport = useCallback(async (
    format: 'excel' | 'csv' | 'pdf',
    customOptions: Partial<ExportOptions> = {}
  ) => {
    setIsExporting(true);
    
    try {
      let exportData: any[] = [];
      
      if (onExport) {
        exportData = await onExport(format);
      } else if (data) {
        exportData = data;
      } else {
        throw new Error('No data or export handler provided');
      }
      
      if (!exportData || exportData.length === 0) {
        notifications.show({
          title: 'Peringatan',
          message: 'Tidak ada data untuk diexport',
          color: 'yellow',
        });
        return;
      }
      
      const preparedData = prepareDataForExport(exportData, columnMapping);
      
      const options: ExportOptions = {
        filename: `export-${format}-${new Date().toISOString().split('T')[0]}`,
        ...defaultOptions,
        ...customOptions,
      };
      
      exportData(preparedData, format, options);
      
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
  }, [onExport, data, columnMapping, defaultOptions]);

  const exportToExcel = useCallback((options?: Partial<ExportOptions>) => {
    return handleExport('excel', options);
  }, [handleExport]);

  const exportToCSV = useCallback((options?: Partial<ExportOptions>) => {
    return handleExport('csv', options);
  }, [handleExport]);

  const exportToPDF = useCallback((options?: Partial<ExportOptions>) => {
    return handleExport('pdf', options);
  }, [handleExport]);

  return {
    isExporting,
    exportToExcel,
    exportToCSV,
    exportToPDF,
    handleExport,
  };
}