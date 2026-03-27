import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { StatusBadge } from "@/components/ui/shared";
import { MOCK_INVOICES } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ArrowLeft, Send, LinkIcon, CheckCircle2, Mail, Smartphone, MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const lineItems = [
  { description: "Web Development Services", qty: 40, rate: 150, amount: 6000 },
  { description: "UI/UX Design", qty: 20, rate: 120, amount: 2400 },
  { description: "Project Management", qty: 10, rate: 100, amount: 1000 },
];

const timeline = [
  { date: "Feb 25, 2024", channel: "email", action: "Payment reminder sent", status: "delivered" },
  { date: "Feb 20, 2024", channel: "sms", action: "SMS follow-up sent", status: "delivered" },
  { date: "Feb 15, 2024", channel: "email", action: "Invoice sent", status: "opened" },
  { date: "Feb 01, 2024", channel: "email", action: "Invoice created", status: "delivered" },
];

export default function InvoiceDetail() {
  const { id } = useParams();
  const invoice = MOCK_INVOICES.find(i => i.id === Number(id)) || MOCK_INVOICES[0];

  return (
    <AppLayout>
      <Header title="">
        <Link to="/invoices" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mr-auto">
          <ArrowLeft className="h-4 w-4" /> Back to Invoices
        </Link>
      </Header>
      <main className="p-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{invoice.number}</h1>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="text-muted-foreground mt-1">Issued to {invoice.customer}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"><Send className="h-4 w-4" /> Send Reminder</button>
            <Link to="/pay" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"><LinkIcon className="h-4 w-4" /> Payment Link</Link>
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm"><CheckCircle2 className="h-4 w-4" /> Mark as Paid</button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Invoice Card */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Bill To</p>
                  <p className="font-medium">{invoice.customer}</p>
                  <p className="text-sm text-muted-foreground">123 Business Ave, Suite 100</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Invoice Date</p>
                  <p className="text-sm">{formatDate(invoice.issueDate)}</p>
                  <p className="text-xs text-muted-foreground mb-1 mt-2">Due Date</p>
                  <p className="text-sm">{formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium text-right">Qty</th>
                <th className="px-6 py-3 font-medium text-right">Rate</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
              </tr></thead>
              <tbody>
                {lineItems.map(item => (
                  <tr key={item.description} className="border-t border-border">
                    <td className="px-6 py-3">{item.description}</td>
                    <td className="px-6 py-3 text-right text-muted-foreground">{item.qty}</td>
                    <td className="px-6 py-3 text-right text-muted-foreground">{formatCurrency(item.rate)}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-border p-6">
              <div className="flex flex-col items-end gap-1 text-sm">
                <div className="flex gap-8"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(9400)}</span></div>
                <div className="flex gap-8"><span className="text-muted-foreground">Tax (10%)</span><span>{formatCurrency(940)}</span></div>
                <div className="flex gap-8 text-lg font-bold mt-2"><span>Total</span><span>{formatCurrency(invoice.amount)}</span></div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm h-fit">
            <h3 className="font-semibold mb-4">Payment Timeline</h3>
            <div className="space-y-4">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full p-1.5 bg-primary/10 text-primary">
                      {t.channel === "email" ? <Mail className="h-3 w-3" /> : t.channel === "sms" ? <Smartphone className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                    </div>
                    {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">{t.action}</p>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
