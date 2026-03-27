import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Header    from '@/components/layout/Header';
import { useCustomers, useCreateCustomer, useDeleteCustomer } from '@/hooks/useCustomers';
import { formatDate } from '@/utils/formatters';
import { Plus, Search, Users, Mail, Phone, MoreHorizontal, Loader2, AlertCircle, Building2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const STATUS_COLORS = {
  active:   'bg-green-500/10 text-green-400 border-green-500/20',
  inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  overdue:  'bg-destructive/10 text-destructive border-destructive/20',
};

export default function Customers() {
  const { toast } = useToast();
  const [search,  setSearch]  = useState('');
  const [page,    setPage]    = useState(1);
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    preferredChannels: ['email'], currency: 'USD',
  });

  const { data, isLoading, isError, error } = useCustomers({ page, search: search || undefined, limit: 20 });
  const createCustomer = useCreateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const customers  = data?.customers  || [];
  const totalPages = data?.pages       || 1;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    try {
      await createCustomer.mutateAsync(form);
      setShowAdd(false);
      setForm({ name: '', email: '', phone: '', company: '', preferredChannels: ['email'], currency: 'USD' });
      toast({ title: 'Customer created', description: `${form.name} has been added.` });
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to create customer.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await deleteCustomer.mutateAsync(id);
      toast({ title: 'Deleted', description: `${name} has been removed.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete customer.', variant: 'destructive' });
    }
  };

  return (
    <AppLayout>
      <Header title="Customers" subtitle={`${data?.total ?? '—'} total customers`}>
        <button
          onClick={() => setShowAdd(true)}
          className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Customer
        </button>
      </Header>

      <main className="p-6 animate-fade-in space-y-4">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, company…"
            className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
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
            {error?.response?.data?.message || 'Failed to load customers. Please refresh.'}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && customers.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
            <Users className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium">{search ? 'No customers found' : 'No customers yet'}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search ? 'Try a different search term.' : 'Add your first customer to get started.'}
            </p>
            {!search && (
              <button onClick={() => setShowAdd(true)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4" /> Add Customer
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {!isLoading && customers.length > 0 && (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Channels</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Added</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/customers/${c._id}`} className="flex items-center gap-3 group">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                          {c.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">{c.name}</p>
                          {c.company && <p className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" />{c.company}</p>}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3.5 w-3.5" />{c.email}</p>
                        {c.phone && <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="h-3.5 w-3.5" />{c.phone}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {(c.preferences?.channels || ['email']).map((ch) => (
                          <span key={ch} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">{ch}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground hidden lg:table-cell">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/customers/${c._id}`} className="rounded-md px-3 py-1.5 text-xs font-medium border border-border hover:bg-muted transition-colors">
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(c._id, c.name)}
                          className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
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

      {/* Add Customer Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Add Customer</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Name *</label>
                  <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="John Doe" required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Company</label>
                  <input value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} placeholder="Acme Inc." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="john@acme.com" required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+1234567890" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Preferred Channels</label>
                <div className="flex gap-2">
                  {['email','sms','whatsapp'].map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setForm((p) => ({
                        ...p,
                        preferredChannels: p.preferredChannels.includes(ch)
                          ? p.preferredChannels.filter((c) => c !== ch)
                          : [...p.preferredChannels, ch],
                      }))}
                      className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors capitalize ${
                        form.preferredChannels.includes(ch)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 rounded-lg border border-border py-2 text-sm hover:bg-muted">Cancel</button>
                <button type="submit" disabled={createCustomer.isPending} className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                  {createCustomer.isPending ? 'Creating…' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}