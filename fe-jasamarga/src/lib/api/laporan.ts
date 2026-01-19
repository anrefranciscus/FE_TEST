// lib/api/laporan.ts

import axios from 'axios';
import {
  LalinApiResponse,
  LalinFilter,
} from '@/lib/types/laporan';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Inject token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const lalinsApi = {
  async getAll(
    params: LalinFilter
  ): Promise<LalinApiResponse> {
    const response = await api.get<LalinApiResponse>(
      '/lalins',
      { params }
    );
    return response.data;
  },

  async getByDate(
    tanggal: string
  ): Promise<LalinApiResponse> {
    const response = await api.get<LalinApiResponse>(
      '/lalins',
      { params: { tanggal } }
    );
    return response.data;
  },
};
