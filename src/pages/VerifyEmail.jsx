import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import { useAuthStore } from '../store/AuthStore';

export default function VerifyEmail() {
  const params         = useParams();
  const [searchParams] = useSearchParams();

  // Token from route param (/auth/verify-email/:token) or query (?token=xxx)
  const token = params.token || searchParams.get('token') || '';

  const { verifyEmail } = useAuthStore();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found. Please request a new verification email.');
      return;
    }

    verifyEmail(token).then((result) => {
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setMessage(result.message || 'Verification failed. The link may have expired.');
      }
    });
  }, [token, verifyEmail]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e1127] px-4">
      <div className="w-full max-w-sm text-center">
        <Link to="/" className="mb-10 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d7b3ff] text-[#0e1127] font-bold text-sm">C</div>
          <span className="text-xl font-bold text-white">Collectly</span>
        </Link>

        {status === 'loading' && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white">Verifying your email…</h2>
            <p className="mt-2 text-sm text-gray-400">This will just take a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-white">Email verified!</h2>
            <p className="mt-2 text-sm text-gray-400">Your account is now fully activated.</p>
            <Link
              to="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Continue to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <XCircle className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-white">Verification failed</h2>
            <p className="mt-2 text-sm text-gray-400">{message}</p>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Go to Login
              </Link>
              <p className="text-xs text-gray-500">
                After logging in, go to Settings to resend the verification email.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}