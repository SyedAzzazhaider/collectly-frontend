import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/AuthStore";
import { setAccessToken } from "@/utils/axiosInstance";

export default function OAuthCallback() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const refreshUser = useAuthStore(s => s.refreshUser);

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      navigate("/login?error=oauth_failed", { replace: true });
      return;
    }

    // Store access token in memory (same as normal login flow)
    setAccessToken(token);

    // Fetch user profile to hydrate AuthStore
    refreshUser().then(user => {
      if (user) {
        useAuthStore.setState({ isAuthenticated: true, isInitialized: true, user });
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login?error=oauth_failed", { replace: true });
      }
    });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e1127]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-border border-t-primary" />
        <p className="text-sm text-gray-400">Completing sign in…</p>
      </div>
    </div>
  );
}
