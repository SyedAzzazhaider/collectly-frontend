import { useState } from 'react';
import AppLayout  from '@/components/layout/AppLayout';
import Header     from '@/components/layout/Header';
import { UserAvatar } from '@/components/ui/shared';
import { useInbox, useSendMessage, useMarkAsRead } from '@/hooks/useConversations';
import { Search, Send, Mail, Smartphone, MessageSquare, Loader2, AlertCircle, InboxIcon } from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';

const CHANNEL_ICON = {
  email:    <Mail className="h-3.5 w-3.5" />,
  sms:      <Smartphone className="h-3.5 w-3.5" />,
  whatsapp: <MessageSquare className="h-3.5 w-3.5" />,
};

const CHANNEL_COLOR = {
  email:    'text-blue-400 bg-blue-400/10',
  sms:      'text-green-400 bg-green-400/10',
  whatsapp: 'text-emerald-400 bg-emerald-400/10',
};

export default function Inbox() {
  const { toast }      = useToast();
  const [selected, setSelected] = useState(null);
  const [reply, setReply]       = useState('');
  const [filter, setFilter]     = useState('all'); // all | unread

  const { data, isLoading, isError } = useInbox();
  const sendMessage = useSendMessage();
  const markAsRead  = useMarkAsRead();

  const messages = data?.messages || [];
  const filtered = filter === 'unread' ? messages.filter((m) => !m.isRead) : messages;

  const handleSelect = async (msg) => {
    setSelected(msg);
    setReply('');
    if (!msg.isRead) {
      try { await markAsRead.mutateAsync(msg._id); } catch { /* silent */ }
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selected) return;

    try {
      await sendMessage.mutateAsync({
        customerId: selected.customerId?._id || selected.customerId,
        channel:    selected.channel || 'email',
        body:       reply.trim(),
        direction:  'outbound',
      });
      setReply('');
      toast({ title: 'Message sent' });
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to send.', variant: 'destructive' });
    }
  };

  return (
    <AppLayout>
      <Header title="Inbox" subtitle="Customer conversations" />
      <main className="animate-fade-in" style={{ height: 'calc(100vh - 73px)' }}>
        <div className="flex h-full">
          {/* Left panel */}
          <div className="w-full sm:w-[340px] border-r border-border flex flex-col bg-card">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input placeholder="Search conversations…" className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div className="flex gap-1 p-3 border-b border-border">
              {['all','unread'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>{f}</button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {isError && (
                <div className="p-4 text-xs text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Failed to load inbox
                </div>
              )}

              {!isLoading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <InboxIcon className="mb-3 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">{filter === 'unread' ? 'No unread messages' : 'No messages yet'}</p>
                </div>
              )}

              {filtered.map((msg) => (
                <button
                  key={msg._id}
                  onClick={() => handleSelect(msg)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-border hover:bg-muted/50 transition-colors ${selected?._id === msg._id ? 'bg-accent' : ''}`}
                >
                  <div className="relative shrink-0">
                    <UserAvatar name={msg.customerId?.name || 'C'} size="sm" />
                    {!msg.isRead && (
                      <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-medium truncate">{msg.customerId?.name || 'Customer'}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{formatDate(msg.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium ${CHANNEL_COLOR[msg.channel] || 'text-gray-400 bg-gray-400/10'}`}>
                        {CHANNEL_ICON[msg.channel] || <Mail className="h-3 w-3" />}
                        {msg.channel}
                      </span>
                      <p className="text-xs text-muted-foreground truncate">{msg.body}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="hidden sm:flex flex-1 flex-col">
            {!selected ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <InboxIcon className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">Select a conversation</p>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                  <UserAvatar name={selected.customerId?.name || 'C'} size="md" />
                  <div>
                    <p className="font-medium">{selected.customerId?.name || 'Customer'}</p>
                    <p className="text-sm text-muted-foreground">{selected.customerId?.email}</p>
                  </div>
                  <div className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${CHANNEL_COLOR[selected.channel] || ''}`}>
                    {CHANNEL_ICON[selected.channel]}
                    {selected.channel}
                  </div>
                </div>

                {/* Message body */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className={`max-w-lg rounded-2xl px-4 py-3 text-sm ${selected.direction === 'inbound' ? 'bg-muted' : 'ml-auto bg-primary text-primary-foreground'}`}>
                    {selected.body}
                    <p className={`mt-1 text-xs ${selected.direction === 'inbound' ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                      {formatDate(selected.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Reply box */}
                <form onSubmit={handleSend} className="border-t border-border p-4">
                  <div className="flex items-end gap-3 rounded-xl border border-border bg-background p-3">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSend(e); }}
                      placeholder={`Reply via ${selected.channel}…`}
                      rows={2}
                      className="flex-1 resize-none bg-transparent text-sm focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!reply.trim() || sendMessage.isPending}
                      className="rounded-lg bg-primary p-2 text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
                    >
                      {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}