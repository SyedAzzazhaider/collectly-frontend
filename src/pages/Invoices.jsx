import { useState } from 'react';
import AppLayout      from '@/components/layout/AppLayout';
import Header         from '@/components/layout/Header';
import { StatusBadge } from '@/components/ui/shared';
import { useInvoices, useCreateInvoice, useRecordPayment } from '@/hooks/useInvoices';
import { useCustomers }  from '@/hooks/useCustomers';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Plus, Search, FileText, Loader2, AlertCircle, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const STATUS_FILTERS = ['all', 'pending', 'overdue', 'paid', 'partial', 'cancelled'];

export default function Invoices() {
  const { toast } = useToast();
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('all');
  const [page,     setPage]     = useState(1);
  const [showAdd,  setShowAdd]  = useState(false);

  const [form, setForm] = useState({
    customerId: '', invoiceNumber: '', amount: '', currency: 'USD',
    dueDate: '', description: '',
  });

  const { data, isLoading, isError, error } = useInvoices({
    page,
    status: status === 'all' ? undefined : status,
    search: search || undefined,
    limit:  20,
  });

  const { data: customersData } = useCustomers({ limit: 100 });
  const createInvoice  = useCreateInvoice();

  const invoices   = data?.invoices   || [];
  const totalPages = data?.pages       || 1;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.customerId || !form.invoiceNumber || !form.amount || !form.dueDate) return;
    try {
      await createInvoice.mutateAsync({
        ...form,
        amount: parseFloat(form.amount),
      });
      setShowAdd(false);
      setForm({ customerId: '', invoiceNumber: '', amount: '', currency: 'USD', dueDate: '', description: '' });
      toast({ title: 'Invoice created', description: `${form.invoiceNumber} has been created.` });
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to create invoice.', variant: 'destructive' });
    }
  };

  return (
    <AppLayout>
      <Header title="Invoices" subtitle={`${data?.total ?? '—'} total invoices`}>
        <button
          onClick={() => setShowAdd(true)}
          className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Create Invoice
        </button>
      </Header>

      <main className="p-6 animate-fade-in space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search invoice number…"
              className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  status === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error?.response?.data?.message || 'Failed to load invoices.'}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && invoices.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
            <FileText className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium">{search || status !== 'all' ? 'No invoices found' : 'No invoices yet'}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search || status !== 'all' ? 'Try adjusting your filters.' : 'Create your first invoice to get started.'}
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading && invoices.length > 0 && (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv._id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/invoices/${inv._id}`} className="font-medium hover:text-primary transition-colors">
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                      {inv.customerId?.name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{formatCurrency(inv.amount, inv.currency)}</p>
                        {inv.amountPaid > 0 && inv.amountPaid < inv.amount && (
                          <p className="text-xs text-muted-foreground">Paid: {formatCurrency(inv.amountPaid, inv.currency)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground hidden lg:table-cell text-sm">
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/invoices/${inv._id}`} className="rounded-md px-3 py-1.5 text-xs font-medium border border-border hover:bg-muted transition-colors">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-6 py-3">
                <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-border px-3 py-1.5 text-xs disabled:opacity-50 hover:bg-muted">Prev</button>
                  <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-border px-3 py-1.5 text-xs disabled:opacity-50 hover:bg-muted">Next</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Invoice Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Create Invoice</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Customer *</label>
                <select value={form.customerId} onChange={(e) => setForm((p) => ({ ...p, customerId: e.target.value }))} required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select customer…</option>
                  {(customersData?.customers || []).map((c) => (
                    <option key={c._id} value={c._id}>{c.name} {c.company ? `— ${c.company}` : ''}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Invoice # *</label>
                  <input value={form.invoiceNumber} onChange={(e) => setForm((p) => ({ ...p, invoiceNumber: e.target.value }))} placeholder="INV-001" required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Currency</label>
                  <select value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    {['USD','EUR','GBP','PKR','INR'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Amount *</label>
                  <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} placeholder="0.00" required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Due Date *</label>
                  <input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} placeholder="Optional notes…" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 rounded-lg border border-border py-2 text-sm hover:bg-muted">Cancel</button>
                <button type="submit" disabled={createInvoice.isPending} className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                  {createInvoice.isPending ? 'Creating…' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}