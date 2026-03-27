import AppLayout from '@/components/layout/AppLayout';
import Header    from '@/components/layout/Header';
import { StatusBadge } from '@/components/ui/shared';
import { useSequences, useDeleteSequence } from '@/hooks/useSequences';
import { Plus, GitBranch, MoreHorizontal, Loader2, AlertCircle, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/utils/formatters';

export default function Sequences() {
  const { toast }                           = useToast();
  const { data, isLoading, isError, error } = useSequences();
  const deleteSeq                           = useDeleteSequence();

  const sequences = data?.sequences || [];

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete sequence "${name}"?`)) return;
    try {
      await deleteSeq.mutateAsync(id);
      toast({ title: 'Sequence deleted' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' });
    }
  };

  return (
    <AppLayout>
      <Header title="Sequences" subtitle="Automate your collection process">
        <Link
          to="/sequences/new"
          className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Create Sequence
        </Link>
      </Header>

      <main className="p-6 animate-fade-in">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error?.response?.data?.message || 'Failed to load sequences.'}
          </div>
        )}

        {!isLoading && sequences.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
            <Layers className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium">No sequences yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Create your first escalation sequence.</p>
            <Link to="/sequences/new" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4" /> Create Sequence
            </Link>
          </div>
        )}

        {!isLoading && sequences.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sequences.map((seq) => (
              <div key={seq._id} className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <GitBranch className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusBadge status={seq.isDefault ? 'active' : 'draft'} />
                    <button onClick={() => handleDelete(seq._id, seq.name)} className="p-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Link to={`/sequences/${seq._id}`}>
                  <h3 className="mt-4 font-semibold hover:text-primary transition-colors">{seq.name}</h3>
                </Link>
                {seq.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{seq.description}</p>}
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{seq.phases?.length ?? 0} phases</span>
                  <span>Updated {formatDate(seq.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
}