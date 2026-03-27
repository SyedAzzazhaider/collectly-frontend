import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';

export const CUSTOMERS_KEY = 'customers';

export const useCustomers = (filters = {}) =>
  useQuery({
    queryKey: [CUSTOMERS_KEY, filters],
    queryFn:  () => customerService.list(filters),
    staleTime: 2 * 60 * 1000,
  });

export const useCustomer = (id) =>
  useQuery({
    queryKey: [CUSTOMERS_KEY, id],
    queryFn:  () => customerService.getById(id),
    enabled:  !!id,
  });

export const useCustomerSummary = (id) =>
  useQuery({
    queryKey: [CUSTOMERS_KEY, id, 'summary'],
    queryFn:  () => customerService.getSummary(id),
    enabled:  !!id,
  });

export const useCreateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: customerService.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY] }),
  });
};

export const useUpdateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => customerService.update(id, payload),
    onSuccess:  (_, { id }) => {
      qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
      qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY, id] });
    },
  });
};

export const useDeleteCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: customerService.remove,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY] }),
  });
};