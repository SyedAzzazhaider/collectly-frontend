import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../services/invoiceService';

export const INVOICES_KEY = 'invoices';

export const useInvoices = (filters = {}) =>
  useQuery({
    queryKey: [INVOICES_KEY, filters],
    queryFn:  () => invoiceService.list(filters),
    staleTime: 2 * 60 * 1000,
  });

export const useOverdueInvoices = () =>
  useQuery({
    queryKey: [INVOICES_KEY, 'overdue'],
    queryFn:  invoiceService.getOverdue,
    staleTime: 60 * 1000,
  });

export const useInvoice = (id) =>
  useQuery({
    queryKey: [INVOICES_KEY, id],
    queryFn:  () => invoiceService.getById(id),
    enabled:  !!id,
  });

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: invoiceService.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [INVOICES_KEY] }),
  });
};

export const useUpdateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => invoiceService.update(id, payload),
    onSuccess:  (_, { id }) => {
      qc.invalidateQueries({ queryKey: [INVOICES_KEY] });
      qc.invalidateQueries({ queryKey: [INVOICES_KEY, id] });
    },
  });
};

export const useRecordPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => invoiceService.recordPayment(id, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [INVOICES_KEY] }),
  });
};