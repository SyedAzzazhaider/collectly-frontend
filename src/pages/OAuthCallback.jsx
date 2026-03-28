import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAccessToken } from "@/utils/axiosInstance";
import { useAuthStore } from "@/store/AuthStore";
import axiosInstance from "@/utils/axiosInstance";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const run = async () => {
      const token = params.get("token");

      if (!token) {
        navigate("/login?error=oauth_failed", { replace: true });
        return;
      }

      try {
        // Set token in memory FIRST
        setAccessToken(token);

        // Fetch user with explicit Authorization header
        const res = await axiosInstance.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data?.data?.user;
        if (!user) throw new Error("No user returned from /auth/me");

        // Directly mutate Zustand store — no setState batching issues
        const store = useAuthStore.getState();
        store.user            = user;
        store.isAuthenticated = true;
        store.isInitialized   = true;
        store.isLoading       = false;
        store.error           = null;

        // Use setState to trigger subscriber re-renders
        useAuthStore.setState({
          user,
          isAuthenticated: true,
          isInitialized:   true,
          isLoading:       false,
          error:           null,
        });

        // Navigate within React — NO full page reload
        // This keeps the in-memory access token alive
        navigate("/dashboard", { replace: true });

      } catch (err) {
        console.error("OAuthCallback error:", err?.response?.data ?? err.message);
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
