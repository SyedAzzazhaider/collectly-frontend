import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/AuthStore';

export default function ForgotPassword() {
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [localErr, setLocalErr] = useState('');

  useEffect(() => { clearError(); }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErr('');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      return setLocalErr('Enter a valid email address.');
    }
    const result = await forgotPassword(email.trim().toLowerCase());
    if (result.success) setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e1127] px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d7b3ff] text-[#0e1127] font-bold text-sm">C</div>
          <span className="text-xl font-bold text-white">Collectly</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-white">Check your inbox</h2>
            <p className="mt-2 text-sm text-gray-400">
              If an account exists for <strong className="text-gray-200">{email}</strong>, we've sent a password reset link.
            </p>
            <p className="mt-2 text-xs text-gray-500">The link expires in 60 minutes.</p>
            <Link to="/login" className="mt-8 block text-sm text-primary hover:underline">Back to sign in</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white">Reset password</h1>
            <p className="mt-2 text-sm text-gray-400">Enter your email and we'll send a reset link.</p>

            {(localErr || error) && (
              <div className="mt-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {localErr || error}
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-lg border border-[#1f2035] bg-[#161929] py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isLoading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}