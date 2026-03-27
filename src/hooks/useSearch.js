import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/searchService';

export const SEARCH_KEY = 'search';

/**
 * Fires only when query string is non-empty (min 2 chars).
 * enabled: false prevents a spurious request on mount.
 */
export const useSearch = ({ q, type = 'all', page = 1, limit = 20 }) =>
  useQuery({
    queryKey: [SEARCH_KEY, q, type, page],
    queryFn:  () => searchService.search({ q, type, page, limit }),
    enabled:  Boolean(q && q.trim().length >= 2),
    staleTime: 30 * 1000, // 30 s — search results can be slightly stale
    keepPreviousData: true, // smooth pagination
  });