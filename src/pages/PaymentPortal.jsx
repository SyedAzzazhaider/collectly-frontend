import { CreditCard, Building2, Wallet, Shield, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const methods = [
  { id: "card", label: "Credit Card", icon: CreditCard },
  { id: "paypal", label: "PayPal", icon: Wallet },
  { id: "ach", label: "Bank Transfer", icon: Building2 },
];

export default function PaymentPortal() {
  const [method, setMethod] = useState("card");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card py-4">
        <div className="mx-auto max-w-lg px-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">C</div>
          <span className="text-lg font-bold">Collectly</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-border bg-card shadow-xl p-8">
            <h1 className="text-2xl font-bold text-center">Pay Invoice</h1>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Invoice #INV-001</p>
              <p className="text-4xl font-bold mt-2">$500.00</p>
              <p className="text-sm text-muted-foreground mt-1">Due: March 1, 2024</p>
            </div>

            {/* Payment Method */}
            <div className="mt-8">
              <p className="text-sm font-medium mb-3">Payment Method</p>
              <div className="grid grid-cols-3 gap-2">
                {methods.map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)} className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${method === m.id ? "border-primary bg-accent text-primary" : "border-border hover:bg-muted text-muted-foreground"}`}>
                    <m.icon className="h-5 w-5" />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {method === "card" && (
              <form className="mt-6 space-y-4" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input placeholder="1234 5678 9012 3456" className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Expiry</label>
                    <input placeholder="MM/YY" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">CVC</label>
                    <input placeholder="123" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Name on Card</label>
                  <input placeholder="John Doe" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </form>
            )}

            {method === "paypal" && (
              <div className="mt-6 rounded-xl border border-border bg-muted/50 p-8 text-center">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">You will be redirected to PayPal to complete your payment.</p>
              </div>
            )}

            {method === "ach" && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Routing Number</label>
                  <input placeholder="021000021" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Account Number</label>
                  <input placeholder="1234567890" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
            )}

            <Link to="/payment-success" className="mt-6 flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-base font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
              <Lock className="h-4 w-4 mr-2" /> Pay $500.00
            </Link>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> SSL Secure</span>
              <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> PCI Compliant</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
