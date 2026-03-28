import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/AuthStore';

export default function ResetPassword() {
  const navigate      = useNavigate();
  const params        = useParams();
  const [searchParams] = useSearchParams();

  // Token can come from route param (/auth/reset-password/:token) or query string
  const token = params.token || searchParams.get('token') || '';

  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [form, setForm]       = useState({ password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [localErr, setLocalErr] = useState('');
  const [success, setSuccess]   = useState(false);

  useEffect(() => {
    clearError();
    if (!token) navigate('/forgot-password', { replace: true });
  }, [clearError, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErr('');

    if (!form.password)              return setLocalErr('Password is required.');
    if (form.password.length < 8)   return setLocalErr('Password must be at least 8 characters.');
    if (form.password !== form.confirm) return setLocalErr('Passwords do not match.');

    const result = await resetPassword({ token, newPassword: form.password, confirmPassword: form.confirm });
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e1127] px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Password updated</h2>
          <p className="mt-2 text-sm text-gray-400">Redirecting you to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e1127] px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d7b3ff] text-[#0e1127] font-bold text-sm">C</div>
          <span className="text-xl font-bold text-white">Collectly</span>
        </Link>

        <h1 className="text-2xl font-bold text-white">Set new password</h1>
        <p className="mt-2 text-sm text-gray-400">Choose a strong password for your account.</p>

        {(localErr || error) && (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {localErr || error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                className="w-full rounded-lg border border-[#1f2035] bg-[#161929] py-3 pl-10 pr-11 text-sm text-white placeholder:text-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-[#1f2035] bg-[#161929] py-3 pl-10 pr-11 text-sm text-white placeholder:text-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {form.confirm && form.password === form.confirm && (
                <CheckCircle2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}