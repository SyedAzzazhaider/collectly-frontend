import { useEffect } from "react";
import { Toaster }           from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider }   from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore }  from "./store/AuthStore";
import ProtectedRoute    from "./components/auth/ProtectedRoute";

// Pages � Public
import Landing           from "./pages/Landing";
import Login             from "./pages/Login";
import Signup            from "./pages/Signup";
import TwoFactorVerify   from "./pages/TwoFactorVerify";
import VerifyEmail       from "./pages/VerifyEmail";
import ForgotPassword    from "./pages/ForgotPassword";
import ResetPassword     from "./pages/ResetPassword";
import OAuthCallback     from "./pages/OAuthCallback";
import PaymentPortal     from "./pages/PaymentPortal";
import PaymentSuccess    from "./pages/PaymentSuccess";
import PaymentFailure    from "./pages/PaymentFailure";
import NotFound          from "./pages/NotFound";

// Pages � Protected
import Dashboard         from "./pages/Dashboard";
import Customers         from "./pages/Customers";
import CustomerDetail    from "./pages/CustomerDetail";
import Invoices          from "./pages/Invoices";
import InvoiceDetail     from "./pages/InvoiceDetail";
import Sequences         from "./pages/Sequences";
import SequenceBuilder   from "./pages/SequenceBuilder";
import Inbox             from "./pages/Inbox";
import Analytics         from "./pages/Analytics";
import Templates         from "./pages/Templates";
import TemplateEditor    from "./pages/TemplateEditor";
import PaymentLinks      from "./pages/PaymentLinks";
import Settings          from "./pages/Settings";
import Billing           from "./pages/Billing";
import AdminDashboard    from "./pages/AdminDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries:   { retry: 1, staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});

function AppRoutes() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [checkAuth]);

  return (
    <Routes>
      {/* -- Public ----------------------------------------------------- */}
      <Route path="/"                             element={<Landing />} />
      <Route path="/login"                        element={<Login />} />
      <Route path="/signup"                       element={<Signup />} />
      <Route path="/2fa-verify"                   element={<TwoFactorVerify />} />

      {/* Email verification � both formats backend may send */}
      <Route path="/auth/verify-email/:token"     element={<VerifyEmail />} />
      <Route path="/verify-email"                 element={<VerifyEmail />} />

      {/* Password reset � both formats backend may send */}
      <Route path="/auth/reset-password/:token"   element={<ResetPassword />} />
      <Route path="/reset-password/:token"        element={<ResetPassword />} />
      <Route path="/reset-password"               element={<ResetPassword />} />

      {/* Google OAuth callback � backend redirects here after auth */}
      <Route path="/auth/oauth/callback"          element={<OAuthCallback />} />

      {/* Backend error redirect aliases � backend sends /auth/login on failure */}
      <Route path="/auth/login"                   element={<Navigate to="/login"  replace />} />
      <Route path="/auth/signup"                  element={<Navigate to="/signup" replace />} />

      {/* Payment portal � public */}
      <Route path="/pay"                          element={<PaymentPortal />} />
      <Route path="/payment-success"              element={<PaymentSuccess />} />
      <Route path="/payment-failure"              element={<PaymentFailure />} />

      {/* -- Protected -------------------------------------------------- */}
      <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/customers"     element={<ProtectedRoute><Customers /></ProtectedRoute>} />
      <Route path="/customers/:id" element={<ProtectedRoute><CustomerDetail /></ProtectedRoute>} />
      <Route path="/invoices"      element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
      <Route path="/invoices/:id"  element={<ProtectedRoute><InvoiceDetail /></ProtectedRoute>} />
      <Route path="/sequences"     element={<ProtectedRoute><Sequences /></ProtectedRoute>} />
      <Route path="/sequences/:id" element={<ProtectedRoute><SequenceBuilder /></ProtectedRoute>} />
      <Route path="/inbox"         element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
      <Route path="/analytics"     element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/templates"     element={<ProtectedRoute><Templates /></ProtectedRoute>} />
      <Route path="/templates/:id" element={<ProtectedRoute><TemplateEditor /></ProtectedRoute>} />
      <Route path="/payment-links" element={<ProtectedRoute><PaymentLinks /></ProtectedRoute>} />
      <Route path="/settings"      element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/billing"       element={<ProtectedRoute><Billing /></ProtectedRoute>} />
      <Route path="/admin"         element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

      <Route path="*"              element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
