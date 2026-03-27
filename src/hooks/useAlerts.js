import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService } from '../services/alertService';

export const ALERTS_KEY = 'alerts';

export const useAlerts = ({ page = 1, limit = 20, unreadOnly = false } = {}) =>
  useQuery({
    queryKey: [ALERTS_KEY, page, unreadOnly],
    queryFn:  () => alertService.getAlerts({ page, limit, unreadOnly }),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // poll every 60 s for new alerts
  });

export const useMarkAlertRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: alertService.markRead,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [ALERTS_KEY] }),
  });
};

export const useMarkAllAlertsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: alertService.markAllRead,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [ALERTS_KEY] }),
  });
};

export const useDeleteAlert = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: alertService.deleteAlert,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [ALERTS_KEY] }),
  });
};