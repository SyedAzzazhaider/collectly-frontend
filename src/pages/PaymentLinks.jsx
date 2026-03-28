import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { Plus, LinkIcon } from "lucide-react";

export default function PaymentLinks() {
  return (
    <AppLayout>
      <Header title="Payment Links" subtitle="Generate and share Stripe payment links">
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm">
          <Plus className="h-4 w-4" /> New Payment Link
        </button>
      </Header>
      <main className="p-6 animate-fade-in">
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <LinkIcon className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm font-medium">No payment links yet</p>
          <p className="text-xs text-muted-foreground mt-1">Create a shareable Stripe payment link directly from any invoice.</p>
        </div>
      </main>
    </AppLayout>
  );
}
