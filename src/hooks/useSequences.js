import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sequenceService } from '../services/sequenceService';

export const SEQUENCES_KEY = 'sequences';

export const useSequences    = (filters = {}) => useQuery({ queryKey: [SEQUENCES_KEY, filters], queryFn: () => sequenceService.list(filters) });
export const useSequence     = (id)           => useQuery({ queryKey: [SEQUENCES_KEY, id],      queryFn: () => sequenceService.getById(id),   enabled: !!id });
export const useDefaultSeq   = ()             => useQuery({ queryKey: [SEQUENCES_KEY, 'default'], queryFn: sequenceService.getDefault });

export const useCreateSequence = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: sequenceService.create, onSuccess: () => qc.invalidateQueries({ queryKey: [SEQUENCES_KEY] }) });
};
export const useUpdateSequence = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, ...p }) => sequenceService.update(id, p), onSuccess: () => qc.invalidateQueries({ queryKey: [SEQUENCES_KEY] }) });
};
export const useDeleteSequence = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: sequenceService.remove, onSuccess: () => qc.invalidateQueries({ queryKey: [SEQUENCES_KEY] }) });
};
export const useAssignSequence = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: sequenceService.assign, onSuccess: () => qc.invalidateQueries({ queryKey: [SEQUENCES_KEY] }) });
};