import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import Header    from '@/components/layout/Header';
import { EmptyState, StatusBadge } from '@/components/ui/shared';
import { useSearch } from '@/hooks/useSearch';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  Search as SearchIcon, Users, FileText, GitBranch,
  Loader2, X,
} from 'lucide-react';

const TYPE_TABS = [
  { key: 'all',       label: 'All' },
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'invoices',  label: 'Invoices',  icon: FileText },
  { key: 'sequences', label: 'Sequences', icon: GitBranch },
];

// ── Result renderers ───────────────────────────────────────────────────────

function CustomerRow({ item, navigate }) {
  return (
    <button
      onClick={() => navigate(`/customers/${item._id}`)}
      className="w-full flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-4 text-left hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
        {(item.name || '?').charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{item.name}</p>
        <p className="text-sm text-muted-foreground truncate">{item.email}</p>
      </div>
      {item.status && <StatusBadge status={item.status} />}
      <span className="text-xs text-muted-foreground shrink-0">Customer</span>
    </button>
  );
}

function InvoiceRow({ item, navigate }) {
  return (
    <button
      onClick={() => navigate(`/invoices/${item._id}`)}
      className="w-full flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-4 text-left hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        <FileText className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">
          {item.invoiceNumber || item._id}
        </p>
        <p className="text-sm text-muted-foreground truncate">
          {item.customer?.name ?? item.customerName ?? '—'}
        </p>
      </div>
      {item.amount != null && (
        <p className="text-sm font-semibold text-foreground shrink-0">
          {formatCurrency(item.amount)}
        </p>
      )}
      {item.status && <StatusBadge status={item.status} />}
      <span className="text-xs text-muted-foreground shrink-0">Invoice</span>
    </button>
  );
}

function SequenceRow({ item, navigate }) {
  return (
    <button
      onClick={() => navigate(`/sequences/${item._id}`)}
      className="w-full flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-4 text-left hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        <GitBranch className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{item.name}</p>
        <p className="text-sm text-muted-foreground truncate">
          {item.steps?.length ?? 0} steps
          {item.createdAt ? ` · Created ${formatDate(item.createdAt)}` : ''}
        </p>
      </div>
      {item.status && <StatusBadge status={item.status} />}
      <span className="text-xs text-muted-foreground shrink-0">Sequence</span>
    </button>
  );
}

function ResultSection({ title, icon: Icon, items, type, navigate }) {
  if (!items?.length) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        <span className="ml-1 text-xs text-muted-foreground">({items.length})</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const key = item._id ?? item.id ?? Math.random();
          if (type === 'customers') return <CustomerRow key={key} item={item} navigate={navigate} />;
          if (type === 'invoices')  return <InvoiceRow  key={key} item={item} navigate={navigate} />;
          if (type === 'sequences') return <SequenceRow key={key} item={item} navigate={navigate} />;
          return null;
        })}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function Search() {
  const navigate = useNavigate();

  const [query,    setQuery]    = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Debounce query input — 400 ms
  const handleQueryChange = useCallback((value) => {
    setQuery(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const t = setTimeout(() => setDebouncedQ(value), 400);
    setDebounceTimer(t);
  }, [debounceTimer]);

  const { data, isLoading, isFetching } = useSearch({
    q:    debouncedQ,
    type: activeType,
  });

  const customers = data?.customers ?? [];
  const invoices  = data?.invoices  ?? [];
  const sequences = data?.sequences ?? [];
  const total     = data?.total ?? (customers.length + invoices.length + sequences.length);

  const hasResults = customers.length + invoices.length + sequences.length > 0;
  const hasQuery   = debouncedQ.trim().length >= 2;

  return (
    <AppLayout>
      <Header
        title="Search"
        subtitle="Search across customers, invoices, and sequences"
      />

      <main className="p-6 space-y-6 animate-fade-in">

        {/* Search Input */}
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search customers, invoices, sequences…"
            className="w-full rounded-xl border border-border bg-card pl-10 pr-10 py-3 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setDebouncedQ(''); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Type Filter Tabs */}
        <div className="flex gap-1 border-b border-border">
          {TYPE_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveType(key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeType === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Loading spinner */}
        {(isLoading || isFetching) && hasQuery && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching…
          </div>
        )}

        {/* Empty / pre-search state */}
        {!hasQuery && !isLoading && (
          <EmptyState
            icon={<SearchIcon className="h-8 w-8" />}
            title="Start searching"
            description="Type at least 2 characters to search across your data."
          />
        )}

        {/* No results */}
        {hasQuery && !isLoading && !isFetching && !hasResults && (
          <EmptyState
            icon={<SearchIcon className="h-8 w-8" />}
            title="No results found"
            description={`No matches for "${debouncedQ}". Try a different search term.`}
          />
        )}

        {/* Results */}
        {hasResults && !isLoading && (
          <div className="space-y-8">
            {/* Result count */}
            <p className="text-sm text-muted-foreground">
              {total} result{total !== 1 ? 's' : ''} for{' '}
              <span className="font-medium text-foreground">"{debouncedQ}"</span>
            </p>

            {(activeType === 'all' || activeType === 'customers') && (
              <ResultSection
                title="Customers"
                icon={Users}
                items={customers}
                type="customers"
                navigate={navigate}
              />
            )}

            {(activeType === 'all' || activeType === 'invoices') && (
              <ResultSection
                title="Invoices"
                icon={FileText}
                items={invoices}
                type="invoices"
                navigate={navigate}
              />
            )}

            {(activeType === 'all' || activeType === 'sequences') && (
              <ResultSection
                title="Sequences"
                icon={GitBranch}
                items={sequences}
                type="sequences"
                navigate={navigate}
              />
            )}
          </div>
        )}
      </main>
    </AppLayout>
  );
}