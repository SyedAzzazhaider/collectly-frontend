import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { StatusBadge } from "@/components/ui/shared";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ArrowLeft, Send, LinkIcon, CheckCircle2, Mail, Smartphone, MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useInvoice, useRecordPayment } from "@/hooks/useInvoices";
import { toast } from "sonner";

const channelIcon = { email: Mail, sms: Smartphone, whatsapp: MessageSquare };

export default function InvoiceDetail() {
  const { id } = useParams();
  const { data: invoice, isLoading } = useInvoice(id);
  const recordPayment = useRecordPayment();

  const handleMarkPaid = () => {
    if (!invoice) return;
    recordPayment.mutate(
      { id: invoice._id, amount: invoice.amount, method: "manual", paidAt: new Date().toISOString() },
      {
        onSuccess: () => toast.success("Invoice marked as paid"),
        onError:   (err) => toast.error(err.response?.data?.message ?? "Failed to mark as paid"),
      }
    );
  };

  if (isLoading) {
    return (
      <AppLayout>
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
        </main>
      </AppLayout>
    );
  }

  if (!invoice) {
    return (
      <AppLayout>
        <main className="p-6">
          <p className="text-sm text-muted-foreground">Invoice not found.</p>
          <Link to="/invoices" className="text-sm text-primary hover:underline mt-2 inline-block">? Back to Invoices</Link>
        </main>
      </AppLayout>
    );
  }

  const lineItems    = invoice.lineItems ?? [];
  const timeline     = invoice.notificationHistory ?? [];
  const totalTax     = invoice.taxAmount ?? 0;
  const subtotal     = invoice.subtotal ?? invoice.amount;

  return (
    <AppLayout>
      <Header title="">
        <Link to="/invoices" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mr-auto">
          <ArrowLeft className="h-4 w-4" /> Back to Invoices
        </Link>
      </Header>
      <main className="p-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{invoice.invoiceNumber}</h1>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="text-muted-foreground mt-1">Issued to {invoice.customer?.name ?? "—"}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              <Send className="h-4 w-4" /> Send Reminder
            </button>
            <Link to="/pay" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              <LinkIcon className="h-4 w-4" /> Payment Link
            </Link>
            {invoice.status !== "paid" && (
              <button
                onClick={handleMarkPaid}
                disabled={recordPayment.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" /> {recordPayment.isPending ? "Saving…" : "Mark as Paid"}
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Invoice Card */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Bill To</p>
                  <p className="font-medium">{invoice.customer?.name ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">{invoice.customer?.company ?? ""}</p>
                  <p className="text-sm text-muted-foreground">{invoice.customer?.email ?? ""}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Invoice Date</p>
                  <p className="text-sm">{formatDate(invoice.issueDate ?? invoice.createdAt)}</p>
                  <p className="text-xs text-muted-foreground mb-1 mt-2">Due Date</p>
                  <p className="text-sm">{formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>

            {lineItems.length > 0 ? (
              <>
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
                    <th className="px-6 py-3 font-medium">Description</th>
                    <th className="px-6 py-3 font-medium text-right">Qty</th>
                    <th className="px-6 py-3 font-medium text-right">Rate</th>
                    <th className="px-6 py-3 font-medium text-right">Amount</th>
                  </tr></thead>
                  <tbody>
                    {lineItems.map((item, i) => (
                      <tr key={item._id ?? i} className="border-t border-border">
                        <td className="px-6 py-3">{item.description}</td>
                        <td className="px-6 py-3 text-right text-muted-foreground">{item.quantity ?? item.qty ?? 1}</td>
                        <td className="px-6 py-3 text-right text-muted-foreground">{formatCurrency(item.unitPrice ?? item.rate ?? 0)}</td>
                        <td className="px-6 py-3 text-right font-medium">{formatCurrency(item.amount ?? (item.quantity * item.unitPrice) ?? 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="border-t border-border p-6">
                  <div className="flex flex-col items-end gap-1 text-sm">
                    <div className="flex gap-8"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                    {totalTax > 0 && <div className="flex gap-8"><span className="text-muted-foreground">Tax</span><span>{formatCurrency(totalTax)}</span></div>}
                    <div className="flex gap-8 text-lg font-bold mt-2"><span>Total</span><span>{formatCurrency(invoice.amount)}</span></div>
                    {invoice.paidAmount > 0 && <div className="flex gap-8 text-green-600"><span>Paid</span><span>{formatCurrency(invoice.paidAmount)}</span></div>}
                  </div>
                </div>
              </>
            ) : (
              <div className="border-t border-border p-6">
                <div className="flex flex-col items-end gap-1 text-sm">
                  <div className="flex gap-8 text-lg font-bold"><span>Total</span><span>{formatCurrency(invoice.amount)}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm h-fit">
            <h3 className="font-semibold mb-4">Payment Timeline</h3>
            {timeline.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reminders sent yet</p>
            ) : (
              <div className="space-y-4">
                {timeline.map((t, i) => {
                  const Icon = channelIcon[t.channel] ?? Mail;
                  return (
                    <div key={t._id ?? i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full p-1.5 bg-primary/10 text-primary">
                          <Icon className="h-3 w-3" />
                        </div>
                        {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium">{t.action ?? t.content ?? `${t.channel} sent`}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(t.sentAt ?? t.createdAt)}</p>
                        {t.status && <StatusBadge status={t.status} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
