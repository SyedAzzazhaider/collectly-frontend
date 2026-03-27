import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationService } from '../services/conversationService';

export const INBOX_KEY = 'inbox';

export const useInbox = (filters = {}) =>
  useQuery({
    queryKey: [INBOX_KEY, filters],
    queryFn:  () => conversationService.getInbox(filters),
    refetchInterval: 30 * 1000, // poll every 30s for new messages
  });

export const useThread = (customerId) =>
  useQuery({
    queryKey: [INBOX_KEY, 'thread', customerId],
    queryFn:  () => conversationService.getThread(customerId),
    enabled:  !!customerId,
    refetchInterval: 15 * 1000,
  });

export const useSendMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: conversationService.sendMessage,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [INBOX_KEY] }),
  });
};

export const useMarkAsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: conversationService.markAsRead,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [INBOX_KEY] }),
  });
};

export const useCannedReplies = () =>
  useQuery({
    queryKey: ['canned-replies'],
    queryFn:  conversationService.getCannedReplies,
    staleTime: 10 * 60 * 1000,
  });