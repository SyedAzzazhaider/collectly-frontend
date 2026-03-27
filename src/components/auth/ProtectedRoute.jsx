import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';

/**
 * Wraps any route that requires authentication.
 * Shows a spinner while checkAuth is resolving on app boot.
 * Redirects to /login with `from` state preserved for post-login redirect.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const location = useLocation();

  // Still resolving initial auth state — show neutral loader
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-border border-t-primary" />
          <p className="text-sm text-muted-foreground">Authenticating…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}