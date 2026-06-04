import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { login } from "@/lib/api/auth.functions";
import { getAgentDashboardData, updateDeliveryStatus } from "@/lib/api/agent.functions";
import {
  Truck,
  CheckCircle,
  XCircle,
  Navigation,
  Phone,
  RefreshCw,
  LogOut,
  Lock,
  Mail,
  Sun,
  Moon,
  ChevronRight,
  User,
  AlertCircle,
  Search,
} from "lucide-react";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/agent")({
  component: AgentLayout,
});

function AgentLayout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [shiftFilter, setShiftFilter] = useState<"morning" | "evening">("morning");

  // Auth Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Skip Dialog state
  const [skipDeliveryId, setSkipDeliveryId] = useState<string | null>(null);
  const [skipReason, setSkipReason] = useState("");
  const [skipSubmitLoading, setSkipSubmitLoading] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const cached = localStorage.getItem("pd_agent_session");
    if (cached) {
      setSession(JSON.parse(cached));
    }
    setLoading(false);
  }, []);

  const loadAgentDashboard = async (userId: string) => {
    setDbLoading(true);
    try {
      const res = await getAgentDashboardData({ data: { userId } });
      setDashboard(res);
    } catch (err: any) {
      toast.error(err.message || "Failed to load agent checklist");
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadAgentDashboard(session.userId);
    }
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await login({ data: { email, password } });
      if (res.success && res.session?.role === "agent") {
        setSession(res.session);
        localStorage.setItem("pd_agent_session", JSON.stringify(res.session));
        toast.success("Login Successful. Drive safely today.");
      } else if (res.success) {
        toast.error("Access Denied: Not registered as agent.");
      } else {
        toast.error(res.error || "Credentials invalid.");
      }
    } catch (err) {
      toast.error("Authentication servers offline.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem("pd_agent_session");
    setDashboard(null);
    toast.info("Logged out.");
  };

  const handleDeliveryAction = async (deliveryId: string, status: "delivered" | "skipped") => {
    try {
      const res = await updateDeliveryStatus({
        data: {
          deliveryId,
          status,
          skipReason: status === "skipped" ? skipReason : undefined,
        },
      });
      if (res.success) {
        if (status === "delivered") {
          toast.success("Delivery marked! Customer balance updated.");
        } else {
          toast.info("Delivery skipped.");
        }
        setSkipDeliveryId(null);
        setSkipReason("");
        if (session) loadAgentDashboard(session.userId);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy text-cream">
        <RefreshCw className="size-8 animate-spin text-yellow" />
      </div>
    );
  }

  // 1. LOGIN UI
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy px-6">
        <Toaster theme="dark" position="top-right" />
        <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-cream/15 bg-cream/5 p-6 backdrop-blur-md shadow-elevated">
          <div className="text-center">
            <span className="font-serif text-3xl text-cream font-medium tracking-tight">Pure Drop</span>
            <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-yellow">Delivery Portal</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-cream/60">Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-cream/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@puredrop.com"
                  required
                  className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 pl-10 pr-4 text-xs text-cream outline-none focus:border-yellow"
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-cream/60">PIN / Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-cream/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 pl-10 pr-4 text-xs text-cream outline-none focus:border-yellow"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-yellow font-semibold text-navy transition-all hover:bg-cream disabled:opacity-50"
            >
              {authLoading ? <RefreshCw className="size-4 animate-spin" /> : "Access Shift Routes"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. CHECKLIST UI
  const checklist = dashboard?.checklist || [];
  const summary = dashboard?.summary || {};
  const agent = dashboard?.agent || {};

  // Filter lists based on selected shift
  const filteredChecklist = checklist.filter((item: any) => {
    const matchesShift = item.shift === shiftFilter || (item.shift === "both");
    const matchesSearch = item.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.customer?.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesShift && matchesSearch;
  });

  const totalAssignedInShift = checklist.filter((item: any) => item.shift === shiftFilter || item.shift === "both").length;
  const completedInShift = checklist.filter((item: any) => (item.shift === shiftFilter || item.shift === "both") && item.status === "delivered").length;
  const progressPercent = totalAssignedInShift > 0 ? Math.round((completedInShift / totalAssignedInShift) * 100) : 0;

  return (
    <div className="min-h-screen bg-navy text-cream pb-8">
      <Toaster theme="dark" position="top-right" />

      {/* Mobile App Header */}
      <header className="sticky top-0 z-20 border-b border-cream/10 bg-navy/90 p-4 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="size-5 text-yellow" />
          <div>
            <h1 className="text-sm font-bold text-cream leading-tight">{agent.name || "Delivery Driver"}</h1>
            <p className="text-[9px] font-medium text-cream/40">{agent.vehicleInfo || "E-Loader Truck"}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex size-9 items-center justify-center rounded-full bg-cream/5 text-cream/60 hover:text-yellow">
          <LogOut className="size-4" />
        </button>
      </header>

      {/* Main Checklist Frame */}
      <main className="max-w-md mx-auto px-4 mt-6 space-y-6">
        
        {/* Progress Tracker Card */}
        <div className="rounded-xl border border-cream/10 bg-cream/5 p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-cream/60">Shift Route Progress</span>
            <span className="font-bold text-yellow">{completedInShift} / {totalAssignedInShift} Done ({progressPercent}%)</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
            <div className="h-full bg-yellow transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Filters Controls */}
        <div className="space-y-3">
          {/* Shift selector buttons */}
          <div className="grid grid-cols-2 gap-2 bg-cream/5 p-1 rounded-lg border border-cream/10">
            <button
              onClick={() => setShiftFilter("morning")}
              className={`flex h-9 items-center justify-center gap-2 rounded-md text-xs font-semibold transition-all ${shiftFilter === "morning" ? "bg-yellow text-navy" : "text-cream/70"}`}
            >
              <Sun className="size-3.5" /> Morning Shift
            </button>
            <button
              onClick={() => setShiftFilter("evening")}
              className={`flex h-9 items-center justify-center gap-2 rounded-md text-xs font-semibold transition-all ${shiftFilter === "evening" ? "bg-yellow text-navy" : "text-cream/70"}`}
            >
              <Moon className="size-3.5" /> Evening Shift
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-cream/35" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer address..."
              className="h-9 w-full rounded-lg border border-cream/10 bg-cream/5 pl-9 pr-4 text-xs text-cream outline-none focus:border-yellow"
            />
          </div>
        </div>

        {/* Sync Button */}
        <div className="flex justify-between items-center text-[10px] text-cream/45 px-1">
          <span>Active Route Sheet for Today</span>
          <button
            onClick={() => loadAgentDashboard(session.userId)}
            disabled={dbLoading}
            className="flex items-center gap-1 hover:text-yellow disabled:opacity-50"
          >
            <RefreshCw className={`size-3 ${dbLoading ? "animate-spin" : ""}`} /> Sync checklist
          </button>
        </div>

        {/* Checklist List */}
        <div className="space-y-4">
          {filteredChecklist.map((item: any) => {
            const isPending = item.status === "pending";
            const isDelivered = item.status === "delivered";
            const isSkipped = item.status === "skipped" || item.status === "cancelled";

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 transition-all bg-cream/5 ${
                  isDelivered
                    ? "border-emerald-500/35 bg-emerald-500/5"
                    : isSkipped
                    ? "border-red-500/35 bg-red-500/5"
                    : "border-cream/10"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-cream">{item.customer?.name}</h3>
                    <p className="text-[10px] text-cream/40 mt-0.5 max-w-[28ch]">{item.customer?.address}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="inline-block bg-yellow/15 text-yellow text-[9px] font-bold px-2 py-0.5 rounded border border-yellow/20 uppercase">
                        {item.quantity}L {item.milkType} milk
                      </span>
                    </div>
                  </div>

                  {/* Navigator shortcut button */}
                  {item.customer?.lat && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${item.customer.lat},${item.customer.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-9 items-center justify-center rounded-full bg-cream/10 hover:bg-yellow hover:text-navy text-cream"
                      title="Navigate"
                    >
                      <Navigation className="size-4" />
                    </a>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-cream/5">
                  {isPending ? (
                    <>
                      <button
                        onClick={() => handleDeliveryAction(item.id, "delivered")}
                        className="flex-1 flex h-8 items-center justify-center gap-1.5 rounded-full bg-emerald-500 text-xs font-semibold text-white hover:bg-emerald-600"
                      >
                        <CheckCircle className="size-3.5" /> Mark Delivered
                      </button>
                      <button
                        onClick={() => setSkipDeliveryId(item.id)}
                        className="flex-1 flex h-8 items-center justify-center gap-1.5 rounded-full border border-cream/15 text-xs font-semibold text-cream/80 hover:bg-cream/5"
                      >
                        <XCircle className="size-3.5" /> Skip
                      </button>
                    </>
                  ) : isDelivered ? (
                    <div className="flex-1 flex items-center justify-between text-xs text-emerald-400 font-semibold px-1">
                      <span className="flex items-center gap-1.5"><CheckCircle className="size-4" /> Completed</span>
                      <button onClick={() => handleDeliveryAction(item.id, "pending")} className="text-[10px] text-cream/40 underline">Undo</button>
                    </div>
                  ) : (
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between text-xs text-red-400 font-semibold px-1">
                        <span className="flex items-center gap-1.5"><XCircle className="size-4" /> Skipped</span>
                        <button onClick={() => handleDeliveryAction(item.id, "pending")} className="text-[10px] text-cream/40 underline">Undo</button>
                      </div>
                      {item.skipReason && <p className="text-[10px] text-cream/45 pl-1 italic">Reason: {item.skipReason}</p>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredChecklist.length === 0 && (
            <div className="border border-dashed border-cream/15 rounded-xl p-12 text-center text-xs text-cream/40">
              <AlertCircle className="size-5 mx-auto text-cream/30 mb-2" />
              No assigned deliveries for this shift or matching query.
            </div>
          )}
        </div>
      </main>

      {/* Skip Dialog Pop-up */}
      {skipDeliveryId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="absolute inset-0" onClick={() => setSkipDeliveryId(null)} />
          <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-cream/15 bg-navy p-5 shadow-elevated text-xs">
            <h3 className="font-bold text-cream text-sm flex items-center gap-1.5"><AlertCircle className="size-4 text-yellow" /> Reason for skipping?</h3>
            <div className="mt-4">
              <select
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-2 text-cream outline-none focus:border-yellow"
              >
                <option value="">Select reason...</option>
                <option value="Customer absent / door locked">Customer absent / locked</option>
                <option value="Milk refused by customer">Milk refused</option>
                <option value="Vacation pause / skipped">Vacation pause</option>
                <option value="Shortage / logistical issue">Logistical delay</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-cream/5">
              <button onClick={() => setSkipDeliveryId(null)} className="h-8 px-4 rounded-full border border-cream/10 font-semibold hover:bg-cream/5">Cancel</button>
              <button
                disabled={!skipReason}
                onClick={() => handleDeliveryAction(skipDeliveryId, "skipped")}
                className="h-8 px-5 rounded-full bg-yellow font-semibold text-navy hover:bg-cream disabled:opacity-30"
              >
                Confirm skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
