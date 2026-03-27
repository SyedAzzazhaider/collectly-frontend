import axiosInstance from '../utils/axiosInstance';

export const billingService = {
  getBilling: async () => {
    const res = await axiosInstance.get('/billing');
    return res.data.data.billing;
  },

  getPlans: async () => {
    const res = await axiosInstance.get('/billing/plans');
    return res.data.data.plans;
  },

  getUsage: async () => {
    const res = await axiosInstance.get('/billing/usage');
    return res.data.data.usage;
  },

  getInvoices: async () => {
    const res = await axiosInstance.get('/billing/invoices');
    return res.data.data;
  },

  subscribe: async (plan) => {
    const res = await axiosInstance.post('/billing/subscribe', { plan });
    return res.data.data.billing;
  },

  changePlan: async (plan) => {
    const res = await axiosInstance.patch('/billing/plan', { plan });
    return res.data.data.billing;
  },

  cancel: async () => {
    const res = await axiosInstance.delete('/billing/cancel');
    return res.data.data.billing;
  },

  reactivate: async () => {
    const res = await axiosInstance.post('/billing/reactivate');
    return res.data.data.billing;
  },
};