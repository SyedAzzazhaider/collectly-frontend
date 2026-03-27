import axiosInstance from '../utils/axiosInstance';

const BASE = '/sequences';

export const sequenceService = {
  list: async ({ page = 1, limit = 20 } = {}) => {
    const res = await axiosInstance.get(BASE, { params: { page, limit } });
    return res.data.data;
  },
  getById:   async (id)        => (await axiosInstance.get(`${BASE}/${id}`)).data.data.sequence,
  getDefault: async ()         => (await axiosInstance.get(`${BASE}/default`)).data.data.sequence,
  create:    async (payload)   => (await axiosInstance.post(BASE, payload)).data.data.sequence,
  update:    async (id, data)  => (await axiosInstance.patch(`${BASE}/${id}`, data)).data.data.sequence,
  remove:    async (id)        => (await axiosInstance.delete(`${BASE}/${id}`)).data,
  duplicate: async (id)        => (await axiosInstance.post(`${BASE}/${id}/duplicate`)).data.data.sequence,
  assign:    async (payload)   => (await axiosInstance.post(`${BASE}/assign`, payload)).data.data,
  unassign:  async (payload)   => (await axiosInstance.post(`${BASE}/unassign`, payload)).data.data,
  getInvoiceSequence: async (invoiceId) => (await axiosInstance.get(`${BASE}/invoice/${invoiceId}`)).data.data,
};