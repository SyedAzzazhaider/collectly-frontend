import axiosInstance from '../utils/axiosInstance';

export const complianceService = {
  // ── DNC (Do Not Contact) ──────────────────────────────────────────────

  /** GET /compliance/dnc — list all DNC entries */
  getDncList: async ({ page = 1, limit = 20 } = {}) => {
    const res = await axiosInstance.get('/compliance/dnc', {
      params: { page, limit },
    });
    return res.data.data;
  },

  /** POST /compliance/dnc — add phone/email to DNC */
  addDnc: async ({ identifier, type, reason }) => {
    const res = await axiosInstance.post('/compliance/dnc', {
      identifier,
      type,
      reason,
    });
    return res.data.data;
  },

  /** DELETE /compliance/dnc/:id — remove entry from DNC */
  removeDnc: async (id) => {
    const res = await axiosInstance.delete(`/compliance/dnc/${id}`);
    return res.data.data;
  },

  // ── Consent ───────────────────────────────────────────────────────────

  /** GET /compliance/consent — list consent records */
  getConsentList: async ({ page = 1, limit = 20 } = {}) => {
    const res = await axiosInstance.get('/compliance/consent', {
      params: { page, limit },
    });
    return res.data.data;
  },

  // ── GDPR ─────────────────────────────────────────────────────────────

  /** POST /compliance/gdpr/export — request data export for a customer */
  requestGdprExport: async (customerId) => {
    const res = await axiosInstance.post('/compliance/gdpr/export', {
      customerId,
    });
    return res.data.data;
  },
};