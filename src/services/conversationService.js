import axiosInstance from '../utils/axiosInstance';

export const conversationService = {
  getInbox: async ({ page = 1, limit = 30, channel } = {}) => {
    const params = { page, limit };
    if (channel) params.channel = channel;
    const res = await axiosInstance.get('/conversations/inbox', { params });
    return res.data.data;
  },

  getThread: async (customerId) => {
    const res = await axiosInstance.get(`/conversations/thread/${customerId}`);
    return res.data.data;
  },

  sendMessage: async (payload) => {
    const res = await axiosInstance.post('/conversations/messages', payload);
    return res.data.data.message;
  },

  markAsRead: async (messageId) => {
    const res = await axiosInstance.post(`/conversations/messages/${messageId}/read`);
    return res.data;
  },

  getCannedReplies: async () => {
    const res = await axiosInstance.get('/conversations/canned-replies');
    return res.data.data;
  },
};