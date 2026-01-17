import api from './index';
import { GerbangResponse, GerbangFormData, GerbangApiResponse } from '@/lib/types/gerbang';

export const gerbangAPI = {
  async getAll(params?: any): Promise<GerbangApiResponse> {
    const response = await api.get('/gerbangs', { params });
    return response.data;
  },

  async getById(id: number): Promise<{ data: any }> {
    const response = await api.get(`/gerbang/${id}`);
    return response;
  },

  async create(data: GerbangFormData): Promise<any> {
    const response = await api.post('/gerbang', data);
    return response;
  },

  async update(id: number, data: GerbangFormData): Promise<any> {
    const response = await api.put(`/gerbang/${id}`, data);
    return response;
  },

  async delete(id: number): Promise<any> {
    const response = await api.delete(`/gerbang/${id}`);
    return response;
  },
};