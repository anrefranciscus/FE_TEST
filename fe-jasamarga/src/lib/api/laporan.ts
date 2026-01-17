import axios from 'axios';
import { LaporanResponse, LaporanFilter } from '@/lib/types/laporan';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const lalinsApi = {
  async getAll(filter: LaporanFilter) {
    const response = await api.get('/lalins', { params: filter });
    return response.data;
  },

  async getByDate(date: string) {
    const response = await api.get('/lalins', { params: { tanggal: date } });
    return response.data;
  },

};