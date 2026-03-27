import axiosInstance from '../utils/axiosInstance';

const BASE = '/customers';

export const customerService = {
  list: async ({ page = 1, limit = 20, search, tags, isActive } = {}) => {
    const params = { page, limit };
    if (search)            params.search   = search;
    if (tags?.length)      params.tags     = tags.join(',');
    if (isActive != null)  params.isActive = isActive;
    const res = await axiosInstance.get(BASE, { params });
    return res.data.data; // { customers, total, page, limit, pages }
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`${BASE}/${id}`);
    return res.data.data.customer;
  },

  getSummary: async (id) => {
    const res = await axiosInstance.get(`${BASE}/${id}/summary`);
    return res.data.data;
  },

  create: async (payload) => {
    const res = await axiosInstance.post(BASE, payload);
    return res.data.data.customer;
  },

  update: async (id, payload) => {
    const res = await axiosInstance.patch(`${BASE}/${id}`, payload);
    return res.data.data.customer;
  },

  remove: async (id) => {
    const res = await axiosInstance.delete(`${BASE}/${id}`);
    return res.data;
  },
};