import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { StatusBadge, UserAvatar, StatCard } from "@/components/ui/shared";
import { MOCK_CUSTOMERS, MOCK_INVOICES } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ArrowLeft, FileText, DollarSign, AlertTriangle, Mail, Phone, Building2, Globe } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

const tabs = ["Overview", "Invoices", "Communication"];

export default function CustomerDetail() {
  const { id } = useParams();
  const customer = MOCK_CUSTOMERS.find(c => c.id === Number(id)) || MOCK_CUSTOMERS[0];
  const customerInvoices = MOCK_INVOICES.filter(inv => inv.customerId === customer.id);
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <AppLayout>
      <Header title="">
        <Link to="/customers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mr-auto">
          <ArrowLeft className="h-4 w-4" /> Back to Customers
        </Link>
      </Header>
      <main className="p-6 animate-fade-in">
        {/* Customer Header */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
          <UserAvatar name={customer.name} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              <StatusBadge status={customer.status} />
            </div>
            <p className="text-muted-foreground">{customer.company}</p>
          </div>
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Edit Customer</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-6">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t}</button>
          ))}
        </div>

        {activeTab === "Overview" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Total Invoices" value={String(customerInvoices.length)} icon={<FileText className="h-5 w-5" />} />
                <StatCard label="Total Paid" value={formatCurrency(customerInvoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0))} icon={<DollarSign className="h-5 w-5" />} />
                <StatCard label="Overdue" value={formatCurrency(customerInvoices.filter(i => i.status === "overdue").reduce((s, i) => s + i.amount, 0))} icon={<AlertTriangle className="h-5 w-5" />} />
              </div>
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="px-6 py-4 border-b border-border"><h3 className="font-semibold">Recent Invoices</h3></div>
                {customerInvoices.length > 0 ? (
                  <div className="divide-y divide-border">
                    {customerInvoices.map(inv => (
                      <div key={inv.id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors">
                        <div>
                          <Link to={`/invoices/${inv.id}`} className="text-sm font-medium text-primary hover:underline">{inv.number}</Link>
                          <p className="text-xs text-muted-foreground">Due {formatDate(inv.dueDate)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{formatCurrency(inv.amount)}</span>
                          <StatusBadge status={inv.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="px-6 py-8 text-sm text-muted-foreground text-center">No invoices found</p>
                )}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm h-fit">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                {[
                  { icon: Mail, label: customer.email },
                  { icon: Phone, label: customer.phone },
                  { icon: Building2, label: customer.company },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-3 text-sm">
                    <c.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Invoices" && (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="px-6 py-3 font-medium">Invoice</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Due Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr></thead>
              <tbody>
                {customerInvoices.map(inv => (
                  <tr key={inv.id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-6 py-3"><Link to={`/invoices/${inv.id}`} className="font-medium text-primary hover:underline">{inv.number}</Link></td>
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
            {[
              { date: "Feb 25, 2024", channel: "Email", content: "Payment reminder sent for INV-001", status: "Delivered" },
              { date: "Feb 20, 2024", channel: "SMS", content: "Follow-up reminder sent", status: "Delivered" },
              { date: "Feb 15, 2024", channel: "Email", content: "Initial invoice sent", status: "Opened" },
            ].map((c, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  {i < 2 && <div className="w-0.5 flex-1 bg-border" />}
                </div>
                <div className="flex-1 rounded-xl border border-border bg-card p-4 mb-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{c.content}</p>
                    <StatusBadge status={c.status.toLowerCase()} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{c.date} · {c.channel}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
}
