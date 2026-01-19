'use client';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface ExportOptions {
  filename?: string;
  sheetName?: string;
  orientation?: 'portrait' | 'landscape';
  includeHeader?: boolean;
  columns?: {
    key: string;
    title: string;
    width?: number;
    format?: (value: any) => string;
  }[];
}

export function exportToExcel(
  data: any[],
  options: ExportOptions = {}
): void {
  const {
    filename = 'export',
    sheetName = 'Sheet1',
    includeHeader = true,
    columns,
  } = options;

  let rows = data;

  if (columns) {
    rows = data.map(row => {
      const obj: any = {};
      columns.forEach(col => {
        const value = row[col.key];
        obj[col.title] = col.format ? col.format(value) : value;
      });
      return obj;
    });
  }

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: includeHeader ? undefined : [],
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const buffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  saveAs(
    new Blob([buffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    `${filename}.xlsx`
  );
}

/* ===================== CSV ===================== */
export function exportToCSV(
  data: any[],
  options: ExportOptions = {}
): void {
  const { filename = 'export', includeHeader = true, columns } = options;

  let rows = data;

  if (columns) {
    rows = data.map(row => {
      const obj: any = {};
      columns.forEach(col => {
        const value = row[col.key];
        obj[col.title] = col.format ? col.format(value) : value;
      });
      return obj;
    });
  }

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: includeHeader ? undefined : [],
  });

  const csv = XLSX.utils.sheet_to_csv(worksheet);

  saveAs(
    new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
    `${filename}.csv`
  );
}

export async function exportToPDF(
  data: any[],
  options: ExportOptions = {}
): Promise<void> {
  if (typeof window === 'undefined') return;

  const { default: jsPDF } = await import('jspdf');
  await import('jspdf-autotable');

  const {
    filename = 'export',
    orientation = 'portrait',
    columns,
  } = options;

  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

  const headers = columns
    ? columns.map(c => c.title)
    : Object.keys(data[0] ?? {});

  const rows = data.map(row =>
    columns
      ? columns.map(c => String(row[c.key] ?? ''))
      : Object.values(row).map(v => String(v ?? ''))
  );

  (doc as any).autoTable({
    head: [headers],
    body: rows,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  doc.save(`${filename}.pdf`);
}

/* ===================== DISPATCHER ===================== */
export async function exportData(
  data: any[],
  format: 'excel' | 'csv' | 'pdf',
  options: ExportOptions = {}
): Promise<void> {
  switch (format) {
    case 'excel':
      exportToExcel(data, options);
      break;
    case 'csv':
      exportToCSV(data, options);
      break;
    case 'pdf':
      await exportToPDF(data, options);
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

/* ===================== PREPARE DATA ===================== */
export function prepareDataForExport(
  data: any[],
  columnMapping: Record<string, string> = {}
): any[] {
  return data.map(item => {
    const obj: any = {};

    Object.entries(item).forEach(([key, value]) => {
      const mappedKey = columnMapping[key] ?? key;

      if (value instanceof Date) {
        obj[mappedKey] = value.toLocaleDateString('id-ID');
      } else if (typeof value === 'number') {
        obj[mappedKey] = value.toLocaleString('id-ID');
      } else if (typeof value === 'boolean') {
        obj[mappedKey] = value ? 'Ya' : 'Tidak';
      } else {
        obj[mappedKey] = value ?? '';
      }
    });

    return obj;
  });
}
