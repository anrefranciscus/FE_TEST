import api from './index';
import { GerbangResponse, GerbangFormData, GerbangApiResponse } from '@/lib/types/gerbang';

export const gerbangAPI = {
  async getAll(params?: any): Promise<GerbangApiResponse> {
    const response = await api.get('/gerbangs', { params });
    return response.data;
  },

  async getById(id: number): Promise<{ data: any }> {
    const response = await api.get(`/gerbangs/${id}`);
    return response;
  },

  async create(data: GerbangFormData): Promise<any> {
    const response = await api.post('/gerbangs', data);
    return response;
  },

  async update(id: number, data: GerbangFormData): Promise<any> {
    const response = await api.put(`/gerbang/${id}`, data);
    return response;
  },

   async delete(data: { id: number; IdCabang: number }): Promise<any> {
    const response = await api.delete('/gerbangs', {
      data,
    });
    return response.data;
  },
};