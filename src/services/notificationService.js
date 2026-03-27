import axiosInstance from '../utils/axiosInstance';

export const notificationService = {
  send: async (payload) => {
    const res = await axiosInstance.post('/notifications/send', payload);
    return res.data.data.notification;
  },

  sendBulk: async (notifications) => {
    const res = await axiosInstance.post('/notifications/send-bulk', { notifications });
    return res.data.data;
  },

  list: async ({ page = 1, limit = 20, channel, status } = {}) => {
    const params = { page, limit };
    if (channel) params.channel = channel;
    if (status)  params.status  = status;
    const res = await axiosInstance.get('/notifications', { params });
    return res.data.data;
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/notifications/${id}`);
    return res.data.data.notification;
  },

  getStats: async () => {
    const res = await axiosInstance.get('/notifications/stats');
    return res.data.data;
  },

  getDeliveryStats: async () => {
    const res = await axiosInstance.get('/notifications/delivery-stats');
    return res.data.data;
  },

  retryFailed: async () => {
    const res = await axiosInstance.post('/notifications/retry-failed');
    return res.data.data;
  },
};