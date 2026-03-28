import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAccessToken } from "@/utils/axiosInstance";
import { useAuthStore } from "@/store/AuthStore";
import axiosInstance from "@/utils/axiosInstance";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const token = params.get("token");

      if (!token) {
        navigate("/login?error=oauth_failed", { replace: true });
        return;
      }

      try {
        // 1. Store the access token in memory
        setAccessToken(token);

        // 2. Fetch the user profile directly
        const res  = await axiosInstance.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data?.data?.user;

        if (!user) throw new Error("No user returned");

        // 3. Manually set Zustand store state
        useAuthStore.setState({
          user,
          isAuthenticated: true,
          isInitialized:   true,
          isLoading:       false,
          error:           null,
        });

        // 4. Navigate to dashboard
        navigate("/dashboard", { replace: true });

      } catch (err) {
        console.error("OAuth callback error:", err);
        setAccessToken(null);
        navigate("/login?error=oauth_failed", { replace: true });
      }
    };

    run();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e1127]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-border border-t-primary" />
        <p className="text-sm text-gray-400">Completing Google sign in…</p>
      </div>
    </div>
  );
}
