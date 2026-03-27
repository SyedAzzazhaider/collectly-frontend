import { XCircle, RefreshCw, ArrowLeft, CreditCard, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentFailure() {
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
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold">Payment Failed</h1>
          <p className="mt-3 text-muted-foreground">We weren't able to process your payment. Don't worry, no charges were made.</p>

          <div className="mt-8 rounded-xl border border-border bg-card p-6 text-left">
            <h3 className="text-sm font-semibold mb-3">What might have happened?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-destructive mt-0.5">•</span>Card was declined by your bank</li>
              <li className="flex items-start gap-2"><span className="text-destructive mt-0.5">•</span>Insufficient funds in the account</li>
              <li className="flex items-start gap-2"><span className="text-destructive mt-0.5">•</span>Incorrect card details entered</li>
              <li className="flex items-start gap-2"><span className="text-destructive mt-0.5">•</span>Card has expired or is inactive</li>
            </ul>
            <div className="mt-4 rounded-lg bg-destructive/5 p-3 text-sm">
              <p className="text-destructive font-medium">Error: Card declined - insufficient funds</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link to="/pay" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
              <RefreshCw className="h-4 w-4" /> Try Again
            </Link>
            <Link to="/pay" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors">
              <CreditCard className="h-4 w-4" /> Try Different Method
            </Link>
            <a href="#" className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="h-4 w-4" /> Contact Support
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
