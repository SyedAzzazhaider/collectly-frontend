import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

const STALE = 2 * 60 * 1000; // 2 minutes

export const useCustomerDashboard = (params = {}) =>
  useQuery({
    queryKey: ['dashboard', 'customer', params],
    queryFn:  () => dashboardService.getCustomerDashboard(params),
    staleTime: STALE,
  });

export const useAgentDashboard = (params = {}) =>
  useQuery({
    queryKey: ['dashboard', 'agent', params],
    queryFn:  () => dashboardService.getAgentDashboard(params),
    staleTime: STALE,
  });

export const useAdminDashboard = (params = {}) =>
  useQuery({
    queryKey: ['dashboard', 'admin', params],
    queryFn:  () => dashboardService.getAdminDashboard(params),
    staleTime: STALE,
  });

export const useUpcomingDues = (params = {}) =>
  useQuery({
    queryKey: ['dashboard', 'upcoming-dues', params],
    queryFn:  () => dashboardService.getUpcomingDues(params),
    staleTime: STALE,
  });

export const useRecoveryRate = (params = {}) =>
  useQuery({
    queryKey: ['dashboard', 'recovery-rate', params],
    queryFn:  () => dashboardService.getRecoveryRate(params),
    staleTime: STALE,
  });