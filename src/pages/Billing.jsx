import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { CheckCircle2, CreditCard, Download } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";

const useBilling    = () => useQuery({ queryKey: ["billing"],        queryFn: async () => (await axiosInstance.get("/billing")).data.data,          staleTime: 60000 });
const useUsage      = () => useQuery({ queryKey: ["billing-usage"],  queryFn: async () => (await axiosInstance.get("/billing/usage")).data.data,     staleTime: 60000 });
const useBillHistory = () => useQuery({ queryKey: ["billing-invoices"], queryFn: async () => (await axiosInstance.get("/billing/invoices")).data.data, staleTime: 60000 });
const usePlans      = () => useQuery({ queryKey: ["billing-plans"],  queryFn: async () => (await axiosInstance.get("/billing/plans")).data.data,     staleTime: 300000 });

export default function Billing() {
  const qc = useQueryClient();
  const { data: billing,  isLoading: loadingBilling  } = useBilling();
  const { data: usage,    isLoading: loadingUsage    } = useUsage();
  const { data: history,  isLoading: loadingHistory  } = useBillHistory();
  const { data: plansData, isLoading: loadingPlans   } = usePlans();

  const changePlan = useMutation({
    mutationFn: (planId) => axiosInstance.patch("/billing/plan", { planId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["billing"] });
      toast.success("Plan updated successfully");
    },
    onError: (err) => toast.error(err.response?.data?.message ?? "Plan change failed"),
  });

  const plans     = plansData?.plans ?? [];
  const currentPlanId = billing?.subscription?.planId ?? billing?.plan;
  const usedCount = usage?.used ?? 0;
  const limitCount = usage?.limit ?? 0;
  const usagePct  = limitCount > 0 ? Math.min((usedCount / limitCount) * 100, 100) : 0;
  const invoices  = history?.invoices ?? history ?? [];

  return (
    <AppLayout>
      <Header title="Billing" subtitle="Manage your subscription and payments" />
      <main className="p-6 space-y-6 animate-fade-in">

        {/* Current Plan */}
        <div className="rounded-xl border border-primary/20 bg-accent p-6">
          {loadingBilling ? (
            <p className="text-sm text-muted-foreground">Loading subscription�</p>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-primary">Current Plan</p>
                <h2 className="text-2xl font-bold mt-1 capitalize">{billing?.subscription?.planName ?? billing?.planName ?? "�"}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {billing?.subscription?.status === "active" ? "Active subscription" : billing?.subscription?.status ?? ""}
                  {billing?.subscription?.currentPeriodEnd ? ` � Renews ${formatDate(billing.subscription.currentPeriodEnd)}` : ""}
                </p>
              </div>
              {limitCount > 0 && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Reminders used this month</p>
                  <p className="text-lg font-bold mt-1">{loadingUsage ? "�" : usedCount.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/ {limitCount.toLocaleString()}</span></p>
                  <div className="mt-2 h-2 w-48 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${usagePct}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Payment Method</h3>
          {loadingBilling ? (
            <p className="text-sm text-muted-foreground">Loading�</p>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2.5"><CreditCard className="h-5 w-5 text-muted-foreground" /></div>
                <div>
                  <p className="text-sm font-medium">
                    {billing?.paymentMethod?.last4 ? `���� ���� ���� ${billing.paymentMethod.last4}` : "No card on file"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {billing?.paymentMethod?.expMonth ? `Expires ${billing.paymentMethod.expMonth}/${billing.paymentMethod.expYear}` : ""}
                  </p>
                </div>
              </div>
              <button className="text-sm font-medium text-primary hover:underline">Update</button>
            </div>
          )}
        </div>

        {/* Plans */}
        <div>
          <h3 className="font-semibold mb-4">Change Plan</h3>
          {loadingPlans ? (
            <p className="text-sm text-muted-foreground">Loading plans�</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {plans.map(plan => {
                const isCurrent = currentPlanId
                ? (plan.id === currentPlanId || plan.name?.toLowerCase() === currentPlanId?.toLowerCase())
                : false;
                return (
                  <div key={plan._id ?? plan.name} className={`rounded-xl border p-6 ${isCurrent ? "border-primary bg-accent" : "border-border bg-card"}`}>
                    <h4 className="font-semibold capitalize">{plan.name}</h4>
                    <div className="mt-2"><span className="text-3xl font-bold">${plan.price ?? plan.amount}</span><span className="text-muted-foreground">/mo</span></div>
                    <ul className="mt-4 space-y-2">
                      {(plan.features ?? []).map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" />{f}</li>
                      ))}
                    </ul>
                    <button
                      disabled={isCurrent || changePlan.isPending}
                      onClick={() => !isCurrent && changePlan.mutate(plan._id)}
                      className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${isCurrent ? "bg-primary/10 text-primary cursor-default" : "border border-border hover:bg-muted disabled:opacity-50"}`}
                    >
                      {isCurrent ? "Current Plan" : `Switch to ${plan.name}`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
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
              {loadingHistory ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-muted-foreground">Loading�</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-muted-foreground">No billing history yet</td></tr>
              ) : invoices.map(b => (
                <tr key={b.id ?? b._id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-3 text-muted-foreground">{formatDate(b.date ?? b.created)}</td>
                  <td className="px-6 py-3">{b.description ?? b.lines?.data?.[0]?.description ?? "Subscription"}</td>
                  <td className="px-6 py-3 font-medium">{formatCurrency((b.amount ?? b.total ?? 0) / 100)}</td>
                  <td className="px-6 py-3">
                    {b.invoicePdf || b.hosted_invoice_url ? (
                      <a href={b.invoicePdf ?? b.hosted_invoice_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline text-xs">
                        <Download className="h-3.5 w-3.5" /> PDF
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">�</span>
                    )}
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
