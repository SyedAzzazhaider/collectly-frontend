import axiosInstance from '../utils/axiosInstance';

export const dashboardService = {
  getCustomerDashboard: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/customer', { params });
    return res.data.data;
  },

  getAgentDashboard: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/agent', { params });
    return res.data.data;
  },

  getAdminDashboard: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/admin', { params });
    return res.data.data;
  },

  getUpcomingDues: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/customer/upcoming-dues', { params });
    return res.data.data;
  },

  getReminderHistory: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/customer/reminder-history', { params });
    return res.data.data;
  },

  getOverdueList: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/agent/overdue', { params });
    return res.data.data;
  },

  getRecoveryRate: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/agent/recovery-rate', { params });
    return res.data.data;
  },
};