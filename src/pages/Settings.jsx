import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { UserAvatar } from "@/components/ui/shared";
import { Camera, Key, Shield, Bell, Users, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { useAuthStore } from "@/store/AuthStore";
import { toast } from "sonner";

const tabs = ["Profile", "Security", "Notifications", "Team"];

const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: async () => (await axiosInstance.get("/auth/me")).data.data.user,
    staleTime: 5 * 60 * 1000,
  });

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const qc = useQueryClient();
  const { data: me, isLoading } = useMe();
  const refreshUser = useAuthStore(s => s.refreshUser);
  const setup2FA    = useAuthStore(s => s.setup2FA);

  // Profile form state
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [passwords, setPasswords]   = useState({ current: "", newPass: "", confirm: "" });
  const [showPw, setShowPw]         = useState(false);
  const [twoFAData, setTwoFAData]   = useState(null);

  useEffect(() => {
    if (me) setProfile({ name: me.name ?? "", email: me.email ?? "", phone: me.phone ?? "" });
  }, [me]);

  const saveProfile = useMutation({
    mutationFn: () => axiosInstance.patch("/auth/me", { name: profile.name, phone: profile.phone }),
    onSuccess: () => { toast.success("Profile updated"); refreshUser(); qc.invalidateQueries({ queryKey: ["me"] }); },
    onError:   (e) => toast.error(e.response?.data?.message ?? "Update failed"),
  });

  const changePassword = useMutation({
    mutationFn: () => axiosInstance.patch("/auth/password", {
      currentPassword: passwords.current,
      newPassword:     passwords.newPass,
    }),
    onSuccess: () => { toast.success("Password changed"); setPasswords({ current: "", newPass: "", confirm: "" }); },
    onError:   (e) => toast.error(e.response?.data?.message ?? "Password change failed"),
  });

  const handle2FASetup = async () => {
    const result = await setup2FA();
    if (result.success) setTwoFAData(result.data);
    else toast.error(result.message ?? "2FA setup failed");
  };

  const pwValid = passwords.newPass.length >= 8 && passwords.newPass === passwords.confirm && passwords.current.length > 0;

  return (
    <AppLayout>
      <Header title="Settings" subtitle="Manage your account and preferences" />
      <main className="p-6 animate-fade-in">
        <div className="flex gap-1 border-b border-border mb-6">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* -- PROFILE TAB ------------------------------------------- */}
        {activeTab === "Profile" && (
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
                  {isLoading ? "…" : (me?.name?.[0] ?? "?").toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground shadow-sm">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <h3 className="font-semibold">{isLoading ? "Loading…" : me?.name}</h3>
                <p className="text-sm text-muted-foreground">{me?.email}</p>
                <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 mt-1 inline-block capitalize">{me?.role}</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input value={profile.email} disabled
                  className="w-full rounded-lg border border-input bg-muted px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone</label>
                <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email Verified</label>
                <div className="flex items-center gap-2 mt-2">
                  {me?.isEmailVerified
                    ? <><CheckCircle2 className="h-4 w-4 text-green-500" /><span className="text-sm text-green-600">Verified</span></>
                    : <span className="text-sm text-yellow-600">Not verified — check your inbox</span>}
                </div>
              </div>
            </div>

            <button
              onClick={() => saveProfile.mutate()}
              disabled={saveProfile.isPending || !profile.name.trim()}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50">
              {saveProfile.isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}

        {/* -- SECURITY TAB ------------------------------------------- */}
        {activeTab === "Security" && (
          <div className="max-w-2xl space-y-8">
            {/* Password Change */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Change Password</h3>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Current Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={passwords.current}
                    onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                    className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-ring" />
                  <button onClick={() => setShowPw(v => !v)} className="absolute right-3 top-2.5 text-muted-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">New Password</label>
                <input type="password" value={passwords.newPass}
                  onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
                <input type="password" value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-card ${passwords.confirm && passwords.confirm !== passwords.newPass ? "border-destructive" : "border-input"}`} />
                {passwords.confirm && passwords.confirm !== passwords.newPass && (
                  <p className="text-xs text-destructive mt-1">Passwords do not match</p>
                )}
              </div>
              <button onClick={() => changePassword.mutate()} disabled={!pwValid || changePassword.isPending}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm disabled:opacity-50">
                {changePassword.isPending ? "Changing…" : "Change Password"}
              </button>
            </div>

            {/* 2FA Setup */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Two-Factor Authentication</h3>
              </div>
              {me?.twoFactorEnabled ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" /> 2FA is enabled on your account
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security using an authenticator app (Google Authenticator, Authy, etc.)</p>
                  {!twoFAData ? (
                    <button onClick={handle2FASetup}
                      className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                      <Shield className="h-4 w-4" /> Enable 2FA
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Scan this QR code with your authenticator app:</p>
                      {twoFAData.qrCode && <img src={twoFAData.qrCode} alt="2FA QR Code" className="rounded-lg border border-border" />}
                      {twoFAData.secret && (
                        <div className="rounded-lg bg-muted p-3">
                          <p className="text-xs text-muted-foreground mb-1">Manual entry key:</p>
                          <p className="font-mono text-sm break-all">{twoFAData.secret}</p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">After scanning, verify using the code from your app on your next login.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* -- NOTIFICATIONS TAB ------------------------------------ */}
        {activeTab === "Notifications" && (
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Email Notification Preferences</h3>
            </div>
            {[
              { label: "Payment received",   desc: "Get notified when a customer makes a payment" },
              { label: "Invoice overdue",    desc: "Alert when an invoice passes its due date" },
              { label: "Customer reply",     desc: "Notify when a customer responds to a reminder" },
              { label: "Weekly digest",      desc: "Summary of collection performance each week" },
              { label: "System alerts",      desc: "Platform health and critical account notices" },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <button className="relative h-6 w-11 rounded-full bg-primary transition-colors">
                  <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-primary-foreground transition-transform" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* -- TEAM TAB ----------------------------------------------- */}
        {activeTab === "Team" && (
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Team Members</h3>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm">
                <Key className="h-4 w-4" /> Invite Member
              </button>
            </div>
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium">Team management coming soon</p>
              <p className="text-xs text-muted-foreground mt-1">Invite team members and manage roles from here.</p>
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
