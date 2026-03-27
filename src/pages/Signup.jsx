import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/AuthStore';

export default function Signup() {
  const navigate   = useNavigate();
  const { signup, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  const [form, setForm]           = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass]   = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    clearError();
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [clearError, isAuthenticated, navigate]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    if (!form.name.trim())           return 'Name is required.';
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!form.email.trim())          return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address.';
    if (!form.password)              return 'Password is required.';
    if (form.password.length < 8)   return 'Password must be at least 8 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    const validationError = validate();
    if (validationError) return setLocalError(validationError);

    const result = await signup({
      name:     form.name.trim(),
      email:    form.email.trim().toLowerCase(),
      password: form.password,
    });

    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    const strong = p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p);
    const medium = p.length >= 8;
    return strong ? 'strong' : medium ? 'medium' : 'weak';
  };

  const strength    = passwordStrength();
  const displayError = localError || error;

  return (
    <div className="flex min-h-screen bg-[#0e1127]">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d7b3ff] text-[#0e1127] font-bold text-sm">C</div>
            <span className="text-xl font-bold text-white">Collectly</span>
          </Link>

          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-gray-400">Start automating your payment collections today.</p>

          {displayError && (
            <div className="mt-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {displayError}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Alex Morgan"
                  autoComplete="name"
                  className="w-full rounded-lg border border-[#1f2035] bg-[#161929] py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-[#1f2035] bg-[#161929] py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-[#1f2035] bg-[#161929] py-3 pl-10 pr-11 text-sm text-white placeholder:text-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {strength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    {['weak','medium','strong'].map((s, i) => (
                      <div key={s} className={`h-1 w-8 rounded-full transition-colors ${
                        (strength === 'weak'   && i === 0) ? 'bg-destructive' :
                        (strength === 'medium' && i <= 1) ? 'bg-yellow-500' :
                        (strength === 'strong' && i <= 2) ? 'bg-green-500' : 'bg-[#1f2035]'
                      }`} />
                    ))}
                  </div>
                  <span className={`text-xs capitalize ${
                    strength === 'strong' ? 'text-green-400' :
                    strength === 'medium' ? 'text-yellow-400' : 'text-destructive'
                  }`}>{strength}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  placeholder="Re-enter your password"
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
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-[#080c1f] border-l border-[#1a1e3a]">
        <div className="max-w-md px-12 text-center">
          <h2 className="text-2xl font-bold text-white">Join 1,200+ businesses</h2>
          <p className="mt-3 leading-relaxed text-gray-400">Reduce overdue balances by up to 60% with automated multi-channel reminders.</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[['78%','Recovery Rate'],['60%','Faster Payments'],['3x','Collection Speed']].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-[#1a1e3a] bg-[#0d1024] p-4">
                <p className="text-2xl font-bold text-primary">{v}</p>
                <p className="mt-1 text-xs text-gray-400">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}