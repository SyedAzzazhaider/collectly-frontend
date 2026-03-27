import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';

export const NOTIFICATIONS_KEY = 'notifications';

export const useNotifications = (filters = {}) =>
  useQuery({
    queryKey: [NOTIFICATIONS_KEY, filters],
    queryFn:  () => notificationService.list(filters),
  });

export const useNotificationStats = () =>
  useQuery({
    queryKey: [NOTIFICATIONS_KEY, 'stats'],
    queryFn:  notificationService.getStats,
    staleTime: 60 * 1000,
  });

export const useDeliveryStats = () =>
  useQuery({
    queryKey: [NOTIFICATIONS_KEY, 'delivery-stats'],
    queryFn:  notificationService.getDeliveryStats,
    staleTime: 60 * 1000,
  });

export const useSendNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationService.send,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] }),
  });
};