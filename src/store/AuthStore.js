import { create } from 'zustand';
import axiosInstance, {
  setAccessToken,
  clearAccessToken,
} from '../utils/axiosInstance';

export const useAuthStore = create((set, get) => ({
  user:            null,
  isAuthenticated: false,
  isInitialized:   false, // true after first checkAuth completes
  isLoading:       false,
  error:           null,

  // ── Utilities ─────────────────────────────────────────────────────────
  clearError: () => set({ error: null }),

  // ── App boot — runs once on mount ─────────────────────────────────────
  // Tries to refresh the access token using httpOnly cookie.
  // If cookie is valid → user is restored. If not → logged out state.
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const refreshRes = await axiosInstance.post('/auth/refresh');
      const token      = refreshRes.data?.data?.accessToken;

      if (!token) throw new Error('No token returned from refresh');

      setAccessToken(token);

      const meRes = await axiosInstance.get('/auth/me');
      const user  = meRes.data?.data?.user;

      set({ user, isAuthenticated: true, isLoading: false, isInitialized: true, error: null });
      return true;
    } catch {
      clearAccessToken();
      set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
      return false;
    }
  },

  // ── Signup ─────────────────────────────────────────────────────────────
  signup: async ({ name, email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const res   = await axiosInstance.post('/auth/signup', { name, email, password });
      const data  = res.data?.data;
      setAccessToken(data.accessToken);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed. Please try again.';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // ── Login ──────────────────────────────────────────────────────────────
  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const res  = await axiosInstance.post('/auth/login', { email, password });
      const data = res.data?.data;

      // Backend returns requires2FA flag when 2FA is enabled
      if (data.requires2FA) {
        set({ isLoading: false });
        return {
          success:      true,
          requires2FA:  true,
          preAuthToken: data.preAuthToken,
          userId:       data.userId,
        };
      }

      setAccessToken(data.accessToken);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return { success: true, requires2FA: false };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password.';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // ── 2FA Verify — called after login when requires2FA === true ──────────
  // preAuthToken is a scope-limited JWT issued by backend for this step only
  verify2FA: async ({ preAuthToken, totpCode }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post(
        '/auth/2fa/verify',
        { totpCode },
        { headers: { Authorization: `Bearer ${preAuthToken}` } }
      );
      const token = res.data?.data?.accessToken;
      setAccessToken(token);

      const meRes = await axiosInstance.get('/auth/me');
      const user  = meRes.data?.data?.user;

      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid 2FA code.';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // ── Logout ─────────────────────────────────────────────────────────────
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // Always clear client state regardless of server response
    } finally {
      clearAccessToken();
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  // ── Forgot Password — sends reset email ───────────────────────────────
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Request failed. Please try again.';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // ── Reset Password — token comes from email link URL param ─────────────
  resetPassword: async ({ token, newPassword }) => {
    set({ isLoading: true, error: null });
    try {
      const res       = await axiosInstance.post(`/auth/reset-password/${token}`, { newPassword });
      const accessToken = res.data?.data?.accessToken;
      if (accessToken) setAccessToken(accessToken);
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Password reset failed.';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // ── Verify Email — token comes from email link URL param ───────────────
  verifyEmail: async (token) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.get(`/auth/verify-email/${token}`);
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Verification failed or link expired.';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // ── Setup 2FA ──────────────────────────────────────────────────────────
  setup2FA: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post('/auth/2fa/setup');
      set({ isLoading: false });
      return { success: true, data: res.data?.data };
    } catch (err) {
      const message = err.response?.data?.message || '2FA setup failed.';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // ── Update local user after profile changes ────────────────────────────
  refreshUser: async () => {
    try {
      const res  = await axiosInstance.get('/auth/me');
      const user = res.data?.data?.user;
      set({ user });
      return user;
    } catch {
      return null;
    }
  },
}));