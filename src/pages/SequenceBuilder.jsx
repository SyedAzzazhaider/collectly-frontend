import { useState, useEffect }   from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout                  from '@/components/layout/AppLayout';
import Header                     from '@/components/layout/Header';
import {
  ArrowLeft, Plus, Mail, Smartphone, MessageSquare,
  Clock, Save, Trash2, Loader2, AlertCircle,
} from 'lucide-react';
import { Link }      from 'react-router-dom';
import { useToast }  from '@/hooks/use-toast';
import {
  useSequence, useCreateSequence, useUpdateSequence,
} from '@/hooks/useSequences';

const CHANNELS    = ['email', 'sms', 'whatsapp'];
const PHASE_TYPES = ['pre-due', 'due-day', 'first-overdue', 'follow-up', 'final-notice'];

const CHANNEL_ICON = {
  email:    <Mail className="h-4 w-4" />,
  sms:      <Smartphone className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
};

const blankPhase = (number) => ({
  phaseNumber:      number,
  phaseType:        'first-overdue',
  reminderType:     'scheduled',
  channels:         ['email'],
  isEnabled:        true,
  triggerRule:      { daysOffset: number === 1 ? -3 : number, maxRepeats: null },
  messageTemplates: [{ channel: 'email', subject: '', body: '' }],
});

export default function SequenceBuilder() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { toast }  = useToast();
  const isNew      = id === 'new';

  const { data: existing, isLoading, isError } = useSequence(isNew ? null : id);
  const createSeq = useCreateSequence();
  const updateSeq = useUpdateSequence();

  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [isDefault,   setIsDefault]   = useState(false);
  const [phases,      setPhases]      = useState([blankPhase(1)]);

  // Populate form when editing an existing sequence
  useEffect(() => {
    if (existing) {
      setName(existing.name        || '');
      setDescription(existing.description || '');
      setIsDefault(existing.isDefault     || false);
      setPhases(existing.phases?.length ? existing.phases : [blankPhase(1)]);
    }
  }, [existing]);

  // ── Phase helpers ──────────────────────────────────────────────────────────
  const addPhase = () => setPhases((p) => [...p, blankPhase(p.length + 1)]);

  const removePhase = (idx) =>
    setPhases((p) => p.filter((_, i) => i !== idx).map((ph, i) => ({ ...ph, phaseNumber: i + 1 })));

  const updatePhase = (idx, field, value) =>
    setPhases((p) => p.map((ph, i) => i === idx ? { ...ph, [field]: value } : ph));

  const updateTemplate = (phaseIdx, tmplIdx, field, value) =>
    setPhases((p) =>
      p.map((ph, i) => {
        if (i !== phaseIdx) return ph;
        const tpl = ph.messageTemplates.map((t, ti) =>
          ti === tmplIdx ? { ...t, [field]: value } : t
        );
        return { ...ph, messageTemplates: tpl };
      })
    );

  const toggleChannel = (phaseIdx, ch) =>
    setPhases((p) =>
      p.map((ph, i) => {
        if (i !== phaseIdx) return ph;
        const has  = ph.channels.includes(ch);
        const next = has ? ph.channels.filter((c) => c !== ch) : [...ph.channels, ch];
        const tpls = next.map(
          (c) => ph.messageTemplates.find((t) => t.channel === c) || { channel: c, subject: '', body: '' }
        );
        return { ...ph, channels: next, messageTemplates: tpls };
      })
    );

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: 'Name required', variant: 'destructive' });
      return;
    }
    if (phases.some((ph) => ph.channels.length === 0)) {
      toast({ title: 'Each phase needs at least one channel', variant: 'destructive' });
      return;
    }

    const payload = { name: name.trim(), description: description.trim(), isDefault, phases };

    try {
      if (isNew) {
        const seq = await createSeq.mutateAsync(payload);
        toast({ title: 'Sequence created' });
        navigate(`/sequences/${seq._id}`, { replace: true });
      } else {
        await updateSeq.mutateAsync({ id, ...payload });
        toast({ title: 'Sequence saved' });
      }
    } catch (err) {
      toast({
        title:       'Save failed',
        description: err.response?.data?.message || 'Please try again.',
        variant:     'destructive',
      });
    }
  };

  const isSaving = createSeq.isPending || updateSeq.isPending;

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!isNew && isLoading) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!isNew && isError) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            Failed to load sequence.
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header title="">
        <Link
          to="/sequences"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mr-auto"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Sequences
        </Link>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isNew ? 'Create Sequence' : 'Save Changes'}
        </button>
      </Header>

      <main className="p-6 animate-fade-in">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Name + meta */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sequence Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Standard Collection Sequence"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded border-input"
              />
              <span className="text-sm font-medium">Set as default sequence</span>
            </label>
          </div>

          {/* Phases */}
          <div className="space-y-0">
            {phases.map((phase, idx) => (
              <div key={idx}>
                {idx > 0 && (
                  <div className="flex items-center gap-3 ml-6 py-2">
                    <div className="w-0.5 h-8 bg-border" />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {phase.triggerRule.daysOffset < 0
                        ? `${Math.abs(phase.triggerRule.daysOffset)} days before due`
                        : phase.triggerRule.daysOffset === 0
                        ? 'On due date'
                        : `${phase.triggerRule.daysOffset} days after due`}
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="mt-4 w-6 shrink-0 text-center text-xs font-bold text-muted-foreground">{idx + 1}</div>
                  <div className="flex-1 rounded-xl border border-border bg-card p-5 shadow-sm">
                    {/* Phase header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold">Phase {idx + 1}</span>
                      {phases.length > 1 && (
                        <button
                          onClick={() => removePhase(idx)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Phase type */}
                      <div>
                        <label className="text-xs text-muted-foreground">Phase Type</label>
                        <select
                          value={phase.phaseType}
                          onChange={(e) => updatePhase(idx, 'phaseType', e.target.value)}
                          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {PHASE_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      {/* Days offset */}
                      <div>
                        <label className="text-xs text-muted-foreground">Days offset (negative = before due)</label>
                        <input
                          type="number"
                          value={phase.triggerRule.daysOffset}
                          onChange={(e) => updatePhase(idx, 'triggerRule', { ...phase.triggerRule, daysOffset: parseInt(e.target.value) || 0 })}
                          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>

                    {/* Channels */}
                    <div className="mb-4">
                      <label className="text-xs text-muted-foreground">Channels</label>
                      <div className="mt-1.5 flex gap-2">
                        {CHANNELS.map((ch) => (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => toggleChannel(idx, ch)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                              phase.channels.includes(ch)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            {CHANNEL_ICON[ch]} {ch}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Templates */}
                    {phase.messageTemplates.map((tpl, ti) => (
                      <div key={tpl.channel} className="mt-3 rounded-lg bg-muted/50 p-3 space-y-2">
                        <p className="text-xs font-medium capitalize flex items-center gap-1.5">
                          {CHANNEL_ICON[tpl.channel]} {tpl.channel} template
                        </p>
                        {tpl.channel === 'email' && (
                          <input
                            value={tpl.subject}
                            onChange={(e) => updateTemplate(idx, ti, 'subject', e.target.value)}
                            placeholder="Subject line"
                            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                        )}
                        <textarea
                          value={tpl.body}
                          onChange={(e) => updateTemplate(idx, ti, 'body', e.target.value)}
                          placeholder={`Message body — use {{customerName}}, {{invoiceNumber}}, {{amount}}, {{dueDate}}`}
                          rows={3}
                          className="w-full resize-none rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add phase */}
          <div className="flex items-center gap-3 ml-6">
            <div className="w-0.5 h-8 bg-border" />
          </div>
          <button
            onClick={addPhase}
            className="ml-9 inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-border px-6 py-4 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors w-[calc(100%-36px)]"
          >
            <Plus className="h-4 w-4" /> Add Phase
          </button>
        </div>
      </main>
    </AppLayout>
  );
}