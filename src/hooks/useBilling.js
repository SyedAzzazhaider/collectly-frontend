import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingService } from '../services/billingService';

export const BILLING_KEY = 'billing';

export const useBilling = () =>
  useQuery({
    queryKey: [BILLING_KEY],
    queryFn:  billingService.getBilling,
  });

export const useBillingPlans = () =>
  useQuery({
    queryKey: [BILLING_KEY, 'plans'],
    queryFn:  billingService.getPlans,
    staleTime: 10 * 60 * 1000, // plans rarely change
  });

export const useBillingUsage = () =>
  useQuery({
    queryKey: [BILLING_KEY, 'usage'],
    queryFn:  billingService.getUsage,
    staleTime: 60 * 1000,
  });

export const useBillingInvoices = () =>
  useQuery({
    queryKey: [BILLING_KEY, 'invoices'],
    queryFn:  billingService.getInvoices,
  });

export const useSubscribe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: billingService.subscribe,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [BILLING_KEY] }),
  });
};

export const useChangePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: billingService.changePlan,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [BILLING_KEY] }),
  });
};

export const useCancelBilling = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: billingService.cancel,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [BILLING_KEY] }),
  });
};