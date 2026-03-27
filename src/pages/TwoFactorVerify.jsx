import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function TwoFactorVerify() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { verify2FA, isLoading, error, clearError } = useAuthStore();

  const [code, setCode] = useState('');

  // Expect preAuthToken + userId passed via navigation state from Login
  const preAuthToken = location.state?.preAuthToken;
  const from         = location.state?.from?.pathname || '/dashboard';

  // If user navigates here directly without state, redirect to login
  useEffect(() => {
    if (!preAuthToken) navigate('/login', { replace: true });
    return () => clearError();
  }, [preAuthToken, navigate, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return;

    const result = await verify2FA({ preAuthToken, totpCode: code });
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e1127] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Two-Factor Auth</h1>
            <p className="mt-1.5 text-sm text-gray-400">
              Enter the 6-digit code from your authenticator app.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Authentication Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full rounded-lg border border-[#1f2035] bg-[#161929] px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] text-white placeholder:text-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
              autoComplete="one-time-code"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Verifying…' : 'Verify Code'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link to="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}