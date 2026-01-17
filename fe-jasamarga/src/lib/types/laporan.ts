export interface LaporanItem {
  id: number;
  IdCabang: number;
  IdGerbang: number;
  Tanggal: string;
  Shift: number;
  IdGardu: number;
  Golongan: number;
  IdAsalGerbang: number;
  Tunai: number;
  DinasOpr: number;
  DinasMitra: number;
  DinasKary: number;
  eMandiri: number;
  eBri: number;
  eBni: number;
  eBca: number;
  eNobu: number;
  eDKI: number;
  eMega: number;
  eFlo: number;
}

export interface LaporanResponse {
  status: boolean;
  message: string;
  code: number;
  data: {
    total_pages: number;
    current_page: number;
    count: number;
    rows: {
      count: number;
      rows: LaporanItem[];
    };
  };
}

export interface LaporanFilter {
  tanggal?: string;
  gerbang?: number;
  shift?: number;
  search?: string;
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
}

export interface PaymentSummary {
  totalTunai: number;
  totalEToll: number;
  totalFlo: number;
  totalKTP: number;
  totalKeseluruhan: number;
  totalETollTunaiFlo: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}