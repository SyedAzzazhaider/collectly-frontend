import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { StatusBadge } from "@/components/ui/shared";
import { MOCK_PAYMENT_LINKS } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Plus, Copy, Send, ExternalLink } from "lucide-react";

export default function PaymentLinks() {
  return (
    <AppLayout>
      <Header title="Payment Links" subtitle="Manage and track payment links">
        <button className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm">
          <Plus className="h-4 w-4" /> Generate New Link
        </button>
      </Header>
      <main className="p-6 animate-fade-in">
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="px-6 py-3 font-medium">Invoice</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium hidden md:table-cell">Created</th>
              <th className="px-6 py-3 font-medium hidden md:table-cell">Expires</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {MOCK_PAYMENT_LINKS.map(pl => (
                <tr key={pl.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-3 font-medium">{pl.invoiceNumber}</td>
                  <td className="px-6 py-3 text-muted-foreground">{pl.customer}</td>
                  <td className="px-6 py-3 font-medium">{formatCurrency(pl.amount)}</td>
                  <td className="px-6 py-3 text-muted-foreground hidden md:table-cell">{formatDate(pl.created)}</td>
                  <td className="px-6 py-3 text-muted-foreground hidden md:table-cell">{formatDate(pl.expires)}</td>
                  <td className="px-6 py-3"><StatusBadge status={pl.status} /></td>
                  <td className="px-6 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Copy link"><Copy className="h-4 w-4" /></button>
                      <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Resend"><Send className="h-4 w-4" /></button>
                      <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Open"><ExternalLink className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </AppLayout>
  );
}
