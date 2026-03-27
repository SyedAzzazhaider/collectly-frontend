import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complianceService } from '../services/complianceService';

export const COMPLIANCE_KEY = 'compliance';

// ── DNC ──────────────────────────────────────────────────────────────────

export const useDncList = ({ page = 1, limit = 20 } = {}) =>
  useQuery({
    queryKey: [COMPLIANCE_KEY, 'dnc', page],
    queryFn:  () => complianceService.getDncList({ page, limit }),
    staleTime: 2 * 60 * 1000,
  });

export const useAddDnc = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: complianceService.addDnc,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [COMPLIANCE_KEY, 'dnc'] }),
  });
};

export const useRemoveDnc = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: complianceService.removeDnc,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [COMPLIANCE_KEY, 'dnc'] }),
  });
};

// ── Consent ───────────────────────────────────────────────────────────────

export const useConsentList = ({ page = 1, limit = 20 } = {}) =>
  useQuery({
    queryKey: [COMPLIANCE_KEY, 'consent', page],
    queryFn:  () => complianceService.getConsentList({ page, limit }),
    staleTime: 2 * 60 * 1000,
  });

// ── GDPR ─────────────────────────────────────────────────────────────────

export const useGdprExport = () => {
  return useMutation({
    mutationFn: complianceService.requestGdprExport,
    // No cache invalidation needed — this is a trigger, not a read
  });
};