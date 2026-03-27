import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { MOCK_BILLING_HISTORY } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { CheckCircle2, CreditCard, Download } from "lucide-react";

const plans = [
  { name: "Starter", price: 19, features: ["50 customers", "500 reminders/mo", "Email only"], current: false },
  { name: "Pro", price: 49, features: ["Unlimited customers", "5,000 reminders/mo", "All channels", "Analytics"], current: true },
  { name: "Enterprise", price: 149, features: ["Everything in Pro", "Unlimited reminders", "API access", "White-label"], current: false },
];

export default function Billing() {
  return (
    <AppLayout>
      <Header title="Billing" subtitle="Manage your subscription and payments" />
      <main className="p-6 space-y-6 animate-fade-in">
        {/* Current Plan */}
        <div className="rounded-xl border border-primary/20 bg-accent p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">Current Plan</p>
              <h2 className="text-2xl font-bold mt-1">Pro Plan</h2>
              <p className="text-sm text-muted-foreground mt-1">$49/month · Billed monthly · Renews Mar 1, 2024</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Reminders used this month</p>
              <p className="text-lg font-bold mt-1">1,234 <span className="text-sm font-normal text-muted-foreground">/ 5,000</span></p>
              <div className="mt-2 h-2 w-48 rounded-full bg-border overflow-hidden">
                <div className="h-full w-[25%] rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Payment Method</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2.5"><CreditCard className="h-5 w-5 text-muted-foreground" /></div>
              <div>
                <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <button className="text-sm font-medium text-primary hover:underline">Update</button>
          </div>
        </div>

        {/* Plans */}
        <div>
          <h3 className="font-semibold mb-4">Change Plan</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map(plan => (
              <div key={plan.name} className={`rounded-xl border p-6 ${plan.current ? "border-primary bg-accent" : "border-border bg-card"}`}>
                <h4 className="font-semibold">{plan.name}</h4>
                <div className="mt-2"><span className="text-3xl font-bold">${plan.price}</span><span className="text-muted-foreground">/mo</span></div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-3.5 w-3.5 text-success" />{f}</li>
                  ))}
                </ul>
                <button className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${plan.current ? "bg-primary/10 text-primary cursor-default" : "border border-border hover:bg-muted"}`}>
                  {plan.current ? "Current Plan" : "Switch to " + plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold">Billing History</h3>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Invoice</th>
            </tr></thead>
            <tbody>
              {MOCK_BILLING_HISTORY.map(b => (
                <tr key={b.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-3 text-muted-foreground">{formatDate(b.date)}</td>
                  <td className="px-6 py-3">{b.description}</td>
                  <td className="px-6 py-3 font-medium">{formatCurrency(b.amount)}</td>
                  <td className="px-6 py-3"><button className="inline-flex items-center gap-1 text-primary hover:underline text-xs"><Download className="h-3.5 w-3.5" /> PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </AppLayout>
  );
}
