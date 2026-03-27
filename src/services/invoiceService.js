import axiosInstance from '../utils/axiosInstance';

const BASE = '/invoices';

export const invoiceService = {
  list: async ({ page = 1, limit = 20, status, customerId, search } = {}) => {
    const params = { page, limit };
    if (status)     params.status     = status;
    if (customerId) params.customerId = customerId;
    if (search)     params.search     = search;
    const res = await axiosInstance.get(BASE, { params });
    return res.data.data; // { invoices, total, page, limit, pages }
  },

  getOverdue: async () => {
    const res = await axiosInstance.get(`${BASE}/overdue`);
    return res.data.data;
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`${BASE}/${id}`);
    return res.data.data.invoice;
  },

  create: async (payload) => {
    const res = await axiosInstance.post(BASE, payload);
    return res.data.data.invoice;
  },

  update: async (id, payload) => {
    const res = await axiosInstance.patch(`${BASE}/${id}`, payload);
    return res.data.data.invoice;
  },

  remove: async (id) => {
    const res = await axiosInstance.delete(`${BASE}/${id}`);
    return res.data;
  },

  recordPayment: async (id, payload) => {
    const res = await axiosInstance.post(`${BASE}/${id}/payment`, payload);
    return res.data.data.invoice;
  },
};