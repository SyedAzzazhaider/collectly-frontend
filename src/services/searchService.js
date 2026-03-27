import axiosInstance from '../utils/axiosInstance';

export const searchService = {
  /**
   * Global search across customers, invoices, and sequences.
   * GET /search?q=<query>&type=<all|customers|invoices|sequences>&page=1&limit=20
   */
  search: async ({ q, type = 'all', page = 1, limit = 20 }) => {
    const res = await axiosInstance.get('/search', {
      params: { q, type, page, limit },
    });
    return res.data.data;
  },
};