import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Header    from '@/components/layout/Header';
import { EmptyState } from '@/components/ui/shared';
import {
  useDncList,
  useAddDnc,
  useRemoveDnc,
  useConsentList,
  useGdprExport,
} from '@/hooks/useCompliance';
import { formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import {
  ShieldCheck, PhoneOff, CheckSquare, Download,
  Loader2, Plus, Trash2, X,
} from 'lucide-react';

const TABS = [
  { key: 'dnc',     label: 'Do Not Contact', icon: PhoneOff },
  { key: 'consent', label: 'Consent Records', icon: CheckSquare },
  { key: 'gdpr',    label: 'GDPR Export',     icon: Download },
];

// ── Add DNC Modal ─────────────────────────────────────────────────────────

function AddDncModal({ onClose, onAdd, isPending }) {
  const [form, setForm] = useState({ identifier: '', type: 'phone', reason: '' });

  const handleSubmit = async () => {
    if (!form.identifier.trim()) {
      toast.error('Identifier is required');
      return;
    }
    const res = await onAdd(form);
    if (res) {
      toast.success('Entry added to DNC list');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg">Add to Do Not Contact</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              {form.type === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              type={form.type === 'email' ? 'email' : 'tel'}
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              placeholder={form.type === 'email' ? 'name@example.com' : '+1 (555) 000-0000'}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Reason <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="e.g. Customer requested opt-out"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border bg-card py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Add to DNC
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DNC Tab ───────────────────────────────────────────────────────────────

function DncTab() {
  const [page, setPage]         = useState(1);
  const [showModal, setShowModal] = useState(false);
  const LIMIT = 20;

  const { data, isLoading } = useDncList({ page, limit: LIMIT });
  const addDnc    = useAddDnc();
  const removeDnc = useRemoveDnc();

  const list       = data?.entries ?? data?.dnc ?? [];
  const total      = data?.total   ?? list.length;
  const totalPages = Math.ceil(total / LIMIT);

  const handleAdd = async (form) => {
    try {
      await addDnc.mutateAsync(form);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to add entry');
      return false;
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeDnc.mutateAsync(id);
      toast.success('Entry removed from DNC list');
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to remove entry');
    }
  };

  return (
    <>
      {showModal && (
        <AddDncModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
          isPending={addDnc.isPending}
        />
      )}

      <div className="space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {total} entr{total !== 1 ? 'ies' : 'y'} on the Do Not Contact list
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Empty */}
        {!isLoading && list.length === 0 && (
          <EmptyState
            icon={<PhoneOff className="h-8 w-8" />}
            title="No DNC entries"
            description="Phone numbers and email addresses you add here will never receive reminders."
            action={
              <button
                onClick={() => setShowModal(true)}
                className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Add First Entry
              </button>
            }
          />
        )}

        {/* Table */}
        {!isLoading && list.length > 0 && (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Identifier</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Reason</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Added</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((entry) => (
                  <tr key={entry._id ?? entry.id} className="bg-card hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium">{entry.identifier}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {entry.reason || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {entry.createdAt ? formatDate(entry.createdAt) : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleRemove(entry._id ?? entry.id)}
                        disabled={removeDnc.isPending && removeDnc.variables === (entry._id ?? entry.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                        title="Remove from DNC"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Consent Tab ───────────────────────────────────────────────────────────

function ConsentTab() {
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const { data, isLoading } = useConsentList({ page, limit: LIMIT });

  const records    = data?.records  ?? data?.consent ?? [];
  const total      = data?.total    ?? records.length;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {total} consent record{total !== 1 ? 's' : ''}
      </p>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && records.length === 0 && (
        <EmptyState
          icon={<CheckSquare className="h-8 w-8" />}
          title="No consent records"
          description="Consent records are automatically created when customers opt in to communications."
        />
      )}

      {!isLoading && records.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Customer</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Channel</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Consented At</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {records.map((r) => (
                <tr key={r._id ?? r.id} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium">
                    {r.customer?.name ?? r.customerName ?? r.customerId ?? '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                      {r.channel ?? r.type ?? '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        r.status === 'granted'
                          ? 'bg-success/10 text-success'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {r.status ?? 'unknown'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {r.consentedAt ? formatDate(r.consentedAt) : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">
                    {r.ipAddress ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── GDPR Tab ──────────────────────────────────────────────────────────────

function GdprTab() {
  const [customerId, setCustomerId] = useState('');
  const gdprExport = useGdprExport();

  const handleExport = async () => {
    if (!customerId.trim()) {
      toast.error('Customer ID is required');
      return;
    }
    try {
      await gdprExport.mutateAsync(customerId.trim());
      toast.success('GDPR data export requested. The customer will receive their data via email.');
      setCustomerId('');
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'GDPR export request failed');
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      {/* Info banner */}
      <div className="rounded-xl border border-info/30 bg-info/5 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-info shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">GDPR Data Export</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Under GDPR Article 20, customers have the right to receive their personal data in a
              structured, machine-readable format. Enter the customer ID below to trigger a data
              export — the customer will receive their data package via email within 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Export form */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold">Request Data Export</h3>

        <div>
          <label className="block text-sm font-medium mb-1.5">Customer ID</label>
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="e.g. 64f1b2c3d4e5f6789abc1234"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground font-mono"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            You can find the Customer ID on the customer's detail page URL.
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={gdprExport.isPending || !customerId.trim()}
          className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {gdprExport.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Request Export
        </button>
      </div>

      {/* Compliance note */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold mb-3">Compliance Obligations</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            Data export requests must be fulfilled within 30 days under GDPR Article 12.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            All export requests are logged with timestamp and requesting user for audit trail.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            Customers on the DNC list will still receive their data export via a one-time communication.
          </li>
        </ul>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function Compliance() {
  const [activeTab, setActiveTab] = useState('dnc');

  return (
    <AppLayout>
      <Header
        title="Compliance"
        subtitle="Manage DNC lists, consent records, and GDPR requests"
      />

      <main className="p-6 space-y-6 animate-fade-in">

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-border">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'dnc'     && <DncTab />}
        {activeTab === 'consent' && <ConsentTab />}
        {activeTab === 'gdpr'    && <GdprTab />}
      </main>
    </AppLayout>
  );
}