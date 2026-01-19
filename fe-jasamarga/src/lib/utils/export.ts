import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface ExportOptions {
  filename?: string;
  sheetName?: string;
  orientation?: 'portrait' | 'landscape';
  includeHeader?: boolean;
  dateFormat?: string;
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

  // Prepare data
  let exportData = data;
  
  if (columns) {
    exportData = data.map(row => {
      const newRow: any = {};
      columns.forEach(col => {
        const value = row[col.key];
        newRow[col.title] = col.format ? col.format(value) : value;
      });
      return newRow;
    });
  }

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData, {
    header: includeHeader ? undefined : [],
  });

  // Auto-size columns
  if (columns) {
    const colWidths = columns.map(col => ({
      wch: col.width || Math.max(
        col.title.length,
        ...exportData.map(row => {
          const value = row[col.title];
          return value ? String(value).length : 0;
        })
      ),
    }));
    worksheet['!cols'] = colWidths;
  }

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });
  
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  
  saveAs(blob, `${filename}.xlsx`);
}

export function exportToCSV(
  data: any[],
  options: ExportOptions = {}
): void {
  const {
    filename = 'export',
    includeHeader = true,
    columns,
  } = options;

  // Prepare data
  let exportData = data;
  
  if (columns) {
    exportData = data.map(row => {
      const newRow: any = {};
      columns.forEach(col => {
        const value = row[col.key];
        newRow[col.title] = col.format ? col.format(value) : value;
      });
      return newRow;
    });
  }

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData, {
    header: includeHeader ? undefined : [],
  });

  // Convert to CSV
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  });
  
  saveAs(blob, `${filename}.csv`);
}

export function exportToPDF(
  data: any[],
  options: ExportOptions = {}
): void {
  const {
    filename = 'export',
    orientation = 'portrait',
    columns,
  } = options;

  // Create PDF document
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });

  // Set document properties
  const title = filename.charAt(0).toUpperCase() + filename.slice(1);
  doc.setProperties({
    title,
    subject: 'Exported Data',
    author: 'Jasa Marga System',
    keywords: 'export, data, report',
    creator: 'Jasa Marga Monitoring System',
  });

  // Add header
  const pageWidth = doc.internal.pageSize.width;
  const margin = 10;
  
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('Jasa Marga - Data Export', pageWidth / 2, margin, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString('id-ID')}`, pageWidth / 2, margin + 8, { align: 'center' });

  const headers = columns 
    ? columns.map(col => col.title)
    : data.length > 0 ? Object.keys(data[0]) : [];
  
  const rows = data.map(row => {
    if (columns) {
      return columns.map(col => {
        const value = row[col.key];
        return col.format ? col.format(value) : String(value || '');
      });
    }
    return Object.values(row).map(value => String(value || ''));
  });

  // Add table
  const startY = margin + 20;
  
  (doc as any).autoTable({
    head: [headers],
    body: rows,
    startY,
    margin: { top: startY },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: columns?.reduce((styles, col, index) => {
      if (col.width) {
        styles[index] = { cellWidth: col.width };
      }
      return styles;
    }, {} as any) || {},
  });

  const pageCount = (doc as any).internal.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin,
      doc.internal.pageSize.height - margin,
      { align: 'right' }
    );
  }

  doc.save(`${filename}.pdf`);
}

export function exportData(
  data: any[],
  format: 'excel' | 'csv' | 'pdf',
  options: ExportOptions = {}
): void {
  switch (format) {
    case 'excel':
      exportToExcel(data, options);
      break;
    case 'csv':
      exportToCSV(data, options);
      break;
    case 'pdf':
      exportToPDF(data, options);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

export function prepareDataForExport(
  data: any[],
  columnMapping: Record<string, string> = {}
): any[] {
  return data.map(item => {
    const exportedItem: any = {};
    
    Object.keys(item).forEach(key => {
      const exportKey = columnMapping[key] || key;
      let value = item[key];
      
      if (value instanceof Date) {
        value = value.toLocaleDateString('id-ID');
      } else if (typeof value === 'string' && !isNaN(Date.parse(value))) {
        value = new Date(value).toLocaleDateString('id-ID');
      }
      
      if (typeof value === 'number') {
        value = value.toLocaleString('id-ID');
      }
      
      if (typeof value === 'boolean') {
        value = value ? 'Ya' : 'Tidak';
      }
      
      exportedItem[exportKey] = value;
    });
    
    return exportedItem;
  });
}