export interface Gerbang {
  id: number;
  kode: string;
  nama: string;
  lokasi: string;
  ruas: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface GerbangResponse {
  status: boolean;
  message: string;
  code: number;
  data: Gerbang[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface GerbangFormData {
  id: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
}
export interface Gateway {
  id: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
}

export interface GerbangApiResponse {
  status: boolean;
  message: string;
  code: number;
  data: {
    total_pages: number;
    current_page: number;
    count: number;
    rows: {
      count: number;
      rows: Gateway[];
    };
  };
}
