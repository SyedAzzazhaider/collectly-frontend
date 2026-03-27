import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { StatusBadge, UserAvatar, StatCard } from "@/components/ui/shared";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ArrowLeft, FileText, DollarSign, AlertTriangle, Mail, Phone, Building2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useCustomer, useCustomerSummary } from "@/hooks/useCustomers";
import { useInvoices } from "@/hooks/useInvoices";
import { useThread } from "@/hooks/useConversations";

const tabs = ["Overview", "Invoices", "Communication"];

export default function CustomerDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");

  const { data: customer, isLoading: loadingCustomer } = useCustomer(id);
  const { data: summary }                              = useCustomerSummary(id);
  const { data: invoiceData, isLoading: loadingInvoices } = useInvoices({ customerId: id, limit: 50 });
  const { data: thread, isLoading: loadingThread }     = useThread(id);
  
  const customerInvoices = invoiceData?.invoices ?? [];
  const messages         = thread?.messages ?? [];

  if (loadingCustomer) {
    return (
      <AppLayout>
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
        </main>
      </AppLayout>
    );
  }

  if (!customer) {
    return (
      <AppLayout>
        <main className="p-6">
          <p className="text-sm text-muted-foreground">Customer not found.</p>
          <Link to="/customers" className="text-sm text-primary hover:underline mt-2 inline-block">← Back to Customers</Link>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header title="">
        <Link to="/customers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mr-auto">
          <ArrowLeft className="h-4 w-4" /> Back to Customers
        </Link>
      </Header>
      <main className="p-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
          <UserAvatar name={customer.name} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              <StatusBadge status={customer.isActive ? "active" : "inactive"} />
            </div>
            <p className="text-muted-foreground">{customer.company}</p>
          </div>
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Edit Customer</button>
        </div>

        <div className="flex gap-1 border-b border-border mb-6">
          {tabs.map(t => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t)} 
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === "Overview" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Total Invoices"  value={String(summary?.totalInvoices  ?? customerInvoices.length)} icon={<FileText className="h-5 w-5" />} />
                <StatCard label="Total Paid"      value={formatCurrency(summary?.totalPaid     ?? 0)} icon={<DollarSign className="h-5 w-5" />} />
                <StatCard label="Overdue"         value={formatCurrency(summary?.totalOverdue  ?? 0)} icon={<AlertTriangle className="h-5 w-5" />} />
              </div>
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="px-6 py-4 border-b border-border"><h3 className="font-semibold">Recent Invoices</h3></div>
                {loadingInvoices ? (
                  <p className="px-6 py-8 text-sm text-muted-foreground text-center">Loading…</p>
                ) : customerInvoices.length === 0 ? (
                  <p className="px-6 py-8 text-sm text-muted-foreground text-center">No invoices found</p>
                ) : (
                  <div className="divide-y divide-border">
                    {customerInvoices.slice(0, 5).map(inv => (
                      <div key={inv._id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors">
                        <div>
                          <Link to={`/invoices/${inv._id}`} className="text-sm font-medium text-primary hover:underline">{inv.invoiceNumber}</Link>
                          <p className="text-xs text-muted-foreground">Due {formatDate(inv.dueDate)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{formatCurrency(inv.amount)}</span>
                          <StatusBadge status={inv.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm h-fit">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                {[
                  { icon: Mail,      label: customer.email },
                  { icon: Phone,     label: customer.phone },
                  { icon: Building2, label: customer.company },
                ].filter(c => c.label).map(c => (
                  <div key={c.label} className="flex items-center gap-3 text-sm">
                    <c.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
              {customer.tags?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {customer.tags.map(tag => (
                      <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "Invoices" && (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="px-6 py-3 font-medium">Invoice</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Due Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingInvoices ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-muted-foreground">Loading…</td></tr>
                ) : customerInvoices.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-muted-foreground">No invoices found</td></tr>
                ) : customerInvoices.map(inv => (
                  <tr key={inv._id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-6 py-3"><Link to={`/invoices/${inv._id}`} className="font-medium text-primary hover:underline">{inv.invoiceNumber}</Link></td>
                    <td className="px-6 py-3 font-medium">{formatCurrency(inv.amount)}</td>
                    <td className="px-6 py-3 text-muted-foreground">{formatDate(inv.dueDate)}</td>
                    <td className="px-6 py-3"><StatusBadge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Communication" && (
          <div className="space-y-4">
            {loadingThread ? (
              <p className="text-sm text-muted-foreground">Loading messages…</p>
            ) : messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No communication history yet</p>
            ) : messages.map((msg, i) => (
              <div key={msg._id ?? i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  {i < messages.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
                </div>
                <div className="flex-1 rounded-xl border border-border bg-card p-4 mb-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{msg.content ?? msg.body}</p>
                    <StatusBadge status={msg.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(msg.createdAt)} · {msg.channel}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
}