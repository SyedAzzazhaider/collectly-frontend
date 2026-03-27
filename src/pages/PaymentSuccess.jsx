import { CheckCircle2, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card py-4">
        <div className="mx-auto max-w-lg px-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">C</div>
          <span className="text-lg font-bold">Collectly</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center animate-fade-in">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 mb-6">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="mt-3 text-muted-foreground">Your payment has been processed successfully. A confirmation email has been sent to your inbox.</p>

          <div className="mt-8 rounded-xl border border-border bg-card p-6 text-left">
            <h3 className="text-sm font-semibold mb-4 text-center">Payment Details</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: "Transaction ID", value: "TXN-2024-0001" },
                { label: "Amount Paid", value: "$500.00" },
                { label: "Date & Time", value: "Feb 25, 2024 at 2:30 PM" },
                { label: "Payment Method", value: "Visa ending in 4242" },
                { label: "Invoice", value: "INV-001" },
              ].map(d => (
                <div key={d.label} className="flex justify-between">
                  <span className="text-muted-foreground">{d.label}</span>
                  <span className="font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
              <Download className="h-4 w-4" /> Download Receipt
            </button>
            <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors">
              <ArrowLeft className="h-4 w-4" /> Return to Homepage
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">📧 A receipt has been sent to john@example.com</p>
        </div>
      </main>
    </div>
  );
}
