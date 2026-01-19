// lib/types/laporan.ts

export interface LalinFilter {
  tanggal?: string;
  page?: number;
  limit?: number;
  search?: string;
  gerbang?: number;
  shift?: number;
}

export interface LalinRow {
  id: number;
  IdCabang: number;
  IdGerbang: number;
  IdGardu: number;
  Tanggal: string;
  Shift: number;
  Golongan: 1 | 2 | 3 | 4;

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

export interface LalinApiResponse {
  status: boolean;
  message: string;
  code: number;
  data: {
    total_pages: number;
    current_page: number;
    count: number;
    rows: {
      count: number;
      rows: LalinRow[];
    };
  };
}
