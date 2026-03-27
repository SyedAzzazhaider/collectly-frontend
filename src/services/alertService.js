import axiosInstance from '../utils/axiosInstance';

export const alertService = {
  /** GET /alerts — paginated list */
  getAlerts: async ({ page = 1, limit = 20, unreadOnly = false } = {}) => {
    const res = await axiosInstance.get('/alerts', {
      params: { page, limit, unreadOnly },
    });
    return res.data.data;
  },

  /** PATCH /alerts/:id/read — mark single alert as read */
  markRead: async (id) => {
    const res = await axiosInstance.patch(`/alerts/${id}/read`);
    return res.data.data;
  },

  /** PATCH /alerts/read-all — mark all alerts as read */
  markAllRead: async () => {
    const res = await axiosInstance.patch('/alerts/read-all');
    return res.data.data;
  },

  /** DELETE /alerts/:id — dismiss/delete alert */
  deleteAlert: async (id) => {
    const res = await axiosInstance.delete(`/alerts/${id}`);
    return res.data.data;
  },
};