import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { login } from "@/lib/api/auth.functions";
import {
  getAdminDashboardData,
  getMilkPricing,
  updateMilkPricing,
  getCattleList,
  addCattle,
  updateCattleStatus,
  recordMilkYield,
  getDeliveryAgentsList,
  addDeliveryAgent,
  getCustomersList,
  assignCustomerToAgent,
  getCustomerMessages,
  updateMessageStatus,
  getAdminNotes,
  updateAdminNotes,
} from "@/lib/api/admin.functions";
import {
  LayoutDashboard,
  Coins,
  Milk,
  Users,
  Inbox,
  NotebookPen,
  History,
  TrendingUp,
  ClipboardList,
  PlusCircle,
  Plus,
  RefreshCw,
  LogOut,
  MapPin,
  Lock,
  Mail,
  Phone,
  CheckCircle,
  UserCheck,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { toast, Toaster } from "sonner";
import type { Cattle, MilkPricing, DeliveryAgent } from "@/lib/db.server";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

type TabType = "dashboard" | "pricing" | "cattle" | "agents" | "customers" | "inbox" | "notes";

function AdminLayout() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [loading, setLoading] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("pd_admin_session");
    if (cached) {
      setSession(JSON.parse(cached));
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await login({ data: { email, password } });
      if (res.success && res.session?.role === "admin") {
        setSession(res.session);
        localStorage.setItem("pd_admin_session", JSON.stringify(res.session));
        toast.success("Welcome back, Administrator.");
      } else if (res.success) {
        toast.error("Access Denied: Unprivileged account.");
      } else {
        toast.error(res.error || "Invalid credentials.");
      }
    } catch (err) {
      toast.error("Authentication server offline.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem("pd_admin_session");
    toast.info("Logged out successfully.");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy text-cream">
        <RefreshCw className="size-8 animate-spin text-yellow" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy px-6">
        <Toaster theme="dark" position="top-right" />
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-cream/15 bg-cream/5 p-8 backdrop-blur-md shadow-elevated">
          <div className="text-center">
            <span className="font-serif text-3xl text-cream font-medium tracking-tight">Pure Drop</span>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow">Enterprise OS Admin</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Email</label>
              <div className="relative mt-2">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-cream/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@puredrop.com"
                  required
                  className="h-11 w-full rounded-lg border border-cream/10 bg-cream/5 pl-11 pr-4 text-sm text-cream outline-none focus:border-yellow"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-cream/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 w-full rounded-lg border border-cream/10 bg-cream/5 pl-11 pr-4 text-sm text-cream outline-none focus:border-yellow"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-yellow font-semibold text-navy transition-all hover:bg-cream disabled:opacity-50"
            >
              {authLoading ? <RefreshCw className="size-4 animate-spin" /> : "Access Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-navy text-cream">
      <Toaster theme="dark" position="top-right" />
      
      {/* Sidebar Navigation */}
      <aside className="fixed bottom-0 left-0 top-0 z-20 flex w-64 flex-col border-r border-cream/10 bg-dark/40 px-5 py-6">
        <div className="px-3">
          <span className="font-serif text-2xl text-cream tracking-tight font-medium">Pure Drop</span>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-yellow">Admin Workspace</p>
        </div>

        <nav className="mt-10 flex-1 space-y-1">
          <SidebarBtn active={activeTab === "dashboard"} icon={LayoutDashboard} label="Dashboard" onClick={() => setActiveTab("dashboard")} />
          <SidebarBtn active={activeTab === "pricing"} icon={Coins} label="Milk Pricing" onClick={() => setActiveTab("pricing")} />
          <SidebarBtn active={activeTab === "cattle"} icon={Milk} label="Cattle & Yields" onClick={() => setActiveTab("cattle")} />
          <SidebarBtn active={activeTab === "agents"} icon={Users} label="Delivery Agents" onClick={() => setActiveTab("agents")} />
          <SidebarBtn active={activeTab === "customers"} icon={History} label="Customer Ledger" onClick={() => setActiveTab("customers")} />
          <SidebarBtn active={activeTab === "inbox"} icon={Inbox} label="Messages Inbox" onClick={() => setActiveTab("inbox")} />
          <SidebarBtn active={activeTab === "notes"} icon={NotebookPen} label="Notepad" onClick={() => setActiveTab("notes")} />
        </nav>

        <div className="border-t border-cream/10 pt-4">
          <div className="flex items-center justify-between rounded-lg bg-cream/5 px-3 py-3">
            <div className="overflow-hidden">
              <p className="truncate text-xs font-semibold text-cream">hq@puredropfarms.com</p>
              <p className="text-[9px] font-medium text-yellow uppercase tracking-wider">Super Administrator</p>
            </div>
            <button onClick={handleLogout} className="text-cream/50 hover:text-yellow hover:scale-105 transition-transform" aria-label="Sign out">
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="ml-64 flex-1 p-10">
        <AnimateTab tab={activeTab} />
      </main>
    </div>
  );
}

function SidebarBtn({ active, icon: Icon, label, onClick }: { active: boolean; icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-medium transition-colors ${
        active
          ? "bg-yellow text-navy"
          : "text-cream/70 hover:bg-cream/5 hover:text-cream"
      }`}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </button>
  );
}

function AnimateTab({ tab }: { tab: TabType }) {
  switch (tab) {
    case "dashboard":
      return <DashboardView />;
    case "pricing":
      return <PricingView />;
    case "cattle":
      return <CattleView />;
    case "agents":
      return <AgentsView />;
    case "customers":
      return <CustomersView />;
    case "inbox":
      return <InboxView />;
    case "notes":
      return <NotesView />;
  }
}

/* ==========================================================================
   TAB VIEWS
   ========================================================================== */

// 1. DASHBOARD VIEW
function DashboardView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await getAdminDashboardData();
      setData(res);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <RefreshIndicator />;

  const stats = data?.stats || {};

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-cream font-medium">Dashboard Overview</h1>
          <p className="text-xs text-cream/50 mt-1">Real-time aggregate data across farm activities.</p>
        </div>
        <button onClick={loadData} className="flex h-9 items-center gap-2 rounded-full border border-cream/10 px-4 text-xs font-semibold hover:bg-cream/5">
          <RefreshCw className="size-3.5" /> Sync Data
        </button>
      </div>

      {/* Grid Counters */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Subscribers" value={stats.activeSubscribers} icon={UserCheck} info="Active monthly accounts" />
        <StatCard title="Today's Yield (Liters)" value={`${stats.todayYield} L`} icon={Milk} info="Across all milking cattle" />
        <StatCard title="Unread Messages" value={stats.unreadMessages} icon={Inbox} info="Pending customer actions" highlight={stats.unreadMessages > 0} />
        <StatCard title="Wallet Balances" value={`₹${stats.totalWalletCapital.toLocaleString()}`} icon={DollarSign} info="Float money in user accounts" />
      </div>

      {stats.lowBalanceAlerts > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-yellow/20 bg-yellow/5 p-4 text-yellow text-xs">
          <AlertTriangle className="size-4 shrink-0" />
          <span><strong>Capital Alert:</strong> There are {stats.lowBalanceAlerts} subscriber wallets below ₹500. Subscriptions may pause automatically.</span>
        </div>
      )}

      {/* Yield Chart Section */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-cream/10 bg-cream/5 p-6 lg:col-span-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-cream/70 flex items-center gap-2">
              <TrendingUp className="size-4 text-yellow" /> Milk Production Trend (Last 7 Days)
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-yellow bg-yellow/10 px-2 py-1 rounded">Liters Yielded</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.yieldChartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD447" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#FFD447" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBuf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(250,250,250,0.05)" />
                <XAxis dataKey="date" stroke="rgba(250,250,250,0.4)" fontSize={10} tickLine={false} />
                <YAxis stroke="rgba(250,250,250,0.4)" fontSize={10} tickLine={false} />
                <ChartTooltip contentStyle={{ backgroundColor: "#0B1F3A", borderColor: "rgba(250,250,250,0.1)", color: "#FAFAFA" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Area type="monotone" dataKey="cow" name="Cow Milk" stroke="#FFD447" fillOpacity={1} fill="url(#colorCow)" strokeWidth={2} />
                <Area type="monotone" dataKey="buffalo" name="Buffalo Milk" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorBuf)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Wallet Operations */}
        <div className="rounded-xl border border-cream/10 bg-cream/5 p-6 lg:col-span-4 flex flex-col">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-cream/70 flex items-center gap-2 mb-6">
            <ClipboardList className="size-4 text-yellow" /> Wallet Log Activity
          </h3>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-72 pr-1">
            {data?.recentTransactions?.map((t: any) => (
              <div key={t.id} className="flex justify-between items-start text-xs border-b border-cream/5 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-cream">{t.description}</p>
                  <p className="text-[10px] text-cream/40 mt-1">{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`font-semibold font-mono ${t.amount < 0 ? "text-red-400" : "text-emerald-400"}`}>
                  {t.amount < 0 ? "-" : "+"}&#8377;{Math.abs(t.amount)}
                </span>
              </div>
            ))}
            {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
              <p className="text-xs text-cream/35 text-center my-12">No recent financial actions logged.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, info, highlight = false }: { title: string; value: any; icon: any; info: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border bg-cream/5 p-5 transition-shadow hover:shadow-lg ${highlight ? "border-yellow/45" : "border-cream/10"}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-cream/60">{title}</span>
        <Icon className={`size-4 ${highlight ? "text-yellow" : "text-cream/50"}`} />
      </div>
      <p className="mt-3 font-serif text-3xl text-cream font-medium">{value}</p>
      <p className="mt-1.5 text-[10px] text-cream/40">{info}</p>
    </div>
  );
}

// 2. PRICING VIEW
function PricingView() {
  const [pricing, setPricing] = useState<MilkPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [cowPrice, setCowPrice] = useState(70);
  const [buffaloPrice, setBuffaloPrice] = useState(90);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const res = await getMilkPricing();
      setPricing(res);
      const cow = res.find((p) => p.cattleType === "cow")?.basePricePerLiter || 70;
      const buf = res.find((p) => p.cattleType === "buffalo")?.basePricePerLiter || 90;
      setCowPrice(cow);
      setBuffaloPrice(buf);
    } catch (err) {
      toast.error("Failed to load pricing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateMilkPricing({ data: { cowPrice, buffaloPrice } });
      if (res.success) {
        toast.success("Pricing updated successfully.");
        loadData();
      } else {
        toast.error("Failed to update pricing.");
      }
    } catch (err) {
      toast.error("Network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <RefreshIndicator />;

  return (
    <div className="max-w-2xl space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-4xl text-cream font-medium">Milk Pricing Settings</h1>
        <p className="text-xs text-cream/50 mt-1">Configure base prices used to compute client billings during delivery cycles.</p>
      </div>

      <div className="rounded-xl border border-cream/10 bg-cream/5 p-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Cow Milk Rate (&#8377; / Liter)</label>
              <input
                type="number"
                value={cowPrice}
                onChange={(e) => setCowPrice(parseFloat(e.target.value))}
                min={1}
                required
                className="h-11 w-full rounded-lg border border-cream/10 bg-cream/5 px-4 text-sm text-cream outline-none focus:border-yellow mt-2"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Buffalo Milk Rate (&#8377; / Liter)</label>
              <input
                type="number"
                value={buffaloPrice}
                onChange={(e) => setBuffaloPrice(parseFloat(e.target.value))}
                min={1}
                required
                className="h-11 w-full rounded-lg border border-cream/10 bg-cream/5 px-4 text-sm text-cream outline-none focus:border-yellow mt-2"
              />
            </div>
          </div>

          <div className="border-t border-cream/5 pt-6 flex items-center justify-between text-xs text-cream/40">
            <span>Billing equations calculate daily based on actual liters delivered.</span>
            <button
              type="submit"
              disabled={saving}
              className="flex h-10 items-center justify-center rounded-full bg-yellow px-6 font-semibold text-navy transition-all hover:bg-cream disabled:opacity-50"
            >
              {saving ? "Updating..." : "Save Pricing Configuration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. CATTLE & YIELD VIEW
function CattleView() {
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms modal
  const [openCattleModal, setOpenCattleModal] = useState(false);
  const [openYieldModal, setOpenYieldModal] = useState(false);
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null);

  // Cattle Form States
  const [tag, setTag] = useState("");
  const [breed, setBreed] = useState("");
  const [type, setType] = useState<"cow" | "buffalo">("cow");
  const [dob, setDob] = useState("");
  const [status, setStatus] = useState<any>("milking");

  // Yield Form States
  const [yieldLiters, setYieldLiters] = useState("");
  const [shift, setShift] = useState<"morning" | "evening">("morning");
  const [fat, setFat] = useState("4.2");
  const [snf, setSnf] = useState("8.5");

  const loadData = async () => {
    try {
      const res = await getCattleList();
      setCattle(res);
    } catch (err) {
      toast.error("Failed to load cattle data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCattle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addCattle({
        data: { tagNumber: tag, cattleType: type, breed, dob, status }
      });
      if (res.success) {
        toast.success("New animal profile saved.");
        setOpenCattleModal(false);
        setTag("");
        setBreed("");
        loadData();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add profile");
    }
  };

  const handleLogYield = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCattle) return;
    try {
      const res = await recordMilkYield({
        data: {
          cattleId: selectedCattle.id,
          yieldLiters: parseFloat(yieldLiters),
          shift,
          fatPercentage: parseFloat(fat),
          snfPercentage: parseFloat(snf),
        }
      });
      if (res.success) {
        toast.success(`Yield successfully recorded for ${selectedCattle.tagNumber}.`);
        setOpenYieldModal(false);
        setYieldLiters("");
        loadData();
      }
    } catch (err) {
      toast.error("Failed to log yield values");
    }
  };

  const handleStatusChange = async (id: string, newStatus: any) => {
    try {
      const res = await updateCattleStatus({ data: { id, status: newStatus } });
      if (res.success) {
        toast.success("Cattle status updated.");
        loadData();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <RefreshIndicator />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-cream font-medium">Cattle Yield Registers</h1>
          <p className="text-xs text-cream/50 mt-1">Manage animal profiles and log fat/SNF milk collections daily.</p>
        </div>
        <button
          onClick={() => setOpenCattleModal(true)}
          className="flex h-10 items-center gap-2 rounded-full bg-yellow px-5 text-xs font-semibold text-navy hover:bg-cream"
        >
          <PlusCircle className="size-4" /> Add Animal Profile
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-cream/10 bg-cream/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-cream/10 bg-dark/20 text-[10px] font-bold uppercase tracking-widest text-cream/60">
              <th className="px-6 py-4">Tag Code</th>
              <th className="px-6 py-4">Type / Breed</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Avg daily Yield</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-cream/5">
            {cattle.map((cat) => (
              <tr key={cat.id} className="hover:bg-cream/5 transition-colors">
                <td className="px-6 py-4.5 font-mono font-bold text-yellow">{cat.tagNumber}</td>
                <td className="px-6 py-4.5 capitalize">
                  <span className="font-semibold block">{cat.cattleType}</span>
                  <span className="text-[10px] text-cream/40 block mt-0.5">{cat.breed}</span>
                </td>
                <td className="px-6 py-4.5">
                  <select
                    value={cat.status}
                    onChange={(e) => handleStatusChange(cat.id, e.target.value as any)}
                    className="h-8 rounded bg-navy border border-cream/10 text-cream px-2 outline-none text-xs focus:border-yellow"
                  >
                    <option value="milking">Milking</option>
                    <option value="dry">Dry</option>
                    <option value="pregnant">Pregnant</option>
                    <option value="medical">Medical Check</option>
                  </select>
                </td>
                <td className="px-6 py-4.5 text-right font-mono font-medium">{cat.avgDailyYield} L</td>
                <td className="px-6 py-4.5 text-center">
                  <button
                    disabled={cat.status !== "milking"}
                    onClick={() => {
                      setSelectedCattle(cat);
                      setOpenYieldModal(true);
                    }}
                    className="h-8 rounded-full border border-cream/10 px-3 hover:bg-cream/5 text-[10px] font-bold uppercase tracking-wider text-yellow disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    Log Yield
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Profile Form Modal */}
      {openCattleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="absolute inset-0" onClick={() => setOpenCattleModal(false)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cream/15 bg-navy p-6 shadow-elevated">
            <h3 className="font-serif text-2xl text-cream font-medium">Add Cattle Record</h3>
            <form onSubmit={handleAddCattle} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Tag Identifier Code</label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="PD-COW-005"
                  required
                  className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-3 text-cream outline-none focus:border-yellow mt-1.5 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-3 text-cream outline-none focus:border-yellow mt-1.5"
                  >
                    <option value="cow">Cow</option>
                    <option value="buffalo">Buffalo</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Breed</label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="Jersey / Murrah"
                    required
                    className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-3 text-cream outline-none focus:border-yellow mt-1.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-3 text-cream outline-none focus:border-yellow mt-1.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-3 text-cream outline-none focus:border-yellow mt-1.5"
                  >
                    <option value="milking">Milking</option>
                    <option value="dry">Dry</option>
                    <option value="pregnant">Pregnant</option>
                    <option value="medical">Medical Check</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-cream/5">
                <button type="button" onClick={() => setOpenCattleModal(false)} className="h-10 px-5 rounded-full border border-cream/10 font-semibold hover:bg-cream/5">Cancel</button>
                <button type="submit" className="h-10 px-6 rounded-full bg-yellow font-semibold text-navy hover:bg-cream">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Yield Modal */}
      {openYieldModal && selectedCattle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="absolute inset-0" onClick={() => setOpenYieldModal(false)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cream/15 bg-navy p-6 shadow-elevated">
            <h3 className="font-serif text-2xl text-cream font-medium">Log Yield Details</h3>
            <p className="text-[10px] text-cream/50 mt-1 font-mono uppercase tracking-wider">Logging for: <span className="text-yellow">{selectedCattle.tagNumber}</span></p>
            <form onSubmit={handleLogYield} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Shift</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-3 text-cream outline-none focus:border-yellow mt-1.5"
                  >
                    <option value="morning">Morning Shift</option>
                    <option value="evening">Evening Shift</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Yield Quantity (Liters)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={yieldLiters}
                    onChange={(e) => setYieldLiters(e.target.value)}
                    placeholder="12.4"
                    required
                    className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-3 text-cream outline-none focus:border-yellow mt-1.5 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Fat Percentage (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="1"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    placeholder="4.2"
                    required
                    className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-3 text-cream outline-none focus:border-yellow mt-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">SNF Percentage (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="1"
                    value={snf}
                    onChange={(e) => setSnf(e.target.value)}
                    placeholder="8.5"
                    required
                    className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-3 text-cream outline-none focus:border-yellow mt-1.5 font-mono"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-cream/5">
                <button type="button" onClick={() => setOpenYieldModal(false)} className="h-10 px-5 rounded-full border border-cream/10 font-semibold hover:bg-cream/5">Cancel</button>
                <button type="submit" className="h-10 px-6 rounded-full bg-yellow font-semibold text-navy hover:bg-cream">Save yield log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. DELIVERY AGENTS VIEW
function AgentsView() {
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  // Agent Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loadData = async () => {
    try {
      const res = await getDeliveryAgentsList();
      setAgents(res);
    } catch (err) {
      toast.error("Failed to load agent logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addDeliveryAgent({
        data: { name, phone, vehicleInfo: vehicle, email, password }
      });
      if (res.success) {
        toast.success("New delivery agent credentials generated.");
        setOpenModal(false);
        setName("");
        setPhone("");
        setVehicle("");
        setEmail("");
        setPassword("");
        loadData();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add agent.");
    }
  };

  if (loading) return <RefreshIndicator />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-cream font-medium">Delivery Agent Roster</h1>
          <p className="text-xs text-cream/50 mt-1">Manage delivery crew profiles and secure access credentials.</p>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="flex h-10 items-center gap-2 rounded-full bg-yellow px-5 text-xs font-semibold text-navy hover:bg-cream"
        >
          <PlusCircle className="size-4" /> Create Agent Portal Account
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((ag) => (
          <div key={ag.id} className="rounded-xl border border-cream/10 bg-cream/5 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif text-xl font-medium text-cream">{ag.name}</h3>
                <span className="text-[10px] text-yellow font-mono uppercase mt-0.5 block">{ag.id}</span>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${ag.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-cream/5 text-cream/50"}`}>
                {ag.status}
              </span>
            </div>
            <div className="space-y-2 text-xs text-cream/70 border-t border-cream/5 pt-4">
              <p className="flex items-center gap-2"><Phone className="size-3.5 text-cream/40" /> {ag.phone}</p>
              <p className="flex items-center gap-2"><ClipboardList className="size-3.5 text-cream/40" /> {ag.vehicleInfo}</p>
            </div>
          </div>
        ))}
        {agents.length === 0 && (
          <div className="col-span-full border border-dashed border-cream/15 rounded-xl p-12 text-center text-xs text-cream/40">No agents registered.</div>
        )}
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="absolute inset-0" onClick={() => setOpenModal(false)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cream/15 bg-navy p-6 shadow-elevated">
            <h3 className="font-serif text-2xl text-cream font-medium">Create Agent Credentials</h3>
            <form onSubmit={handleAdd} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ramesh Kumar"
                  required
                  className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-3 text-cream outline-none focus:border-yellow mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99999 00000"
                    required
                    className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-3 text-cream outline-none focus:border-yellow mt-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Vehicle Allocation Info</label>
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="E-Rickshaw DL3C-123"
                    required
                    className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-3 text-cream outline-none focus:border-yellow mt-1.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Agent Login Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@puredrop.com"
                    required
                    className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-3 text-cream outline-none focus:border-yellow mt-1.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Portal Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    minLength={6}
                    required
                    className="h-10 w-full rounded-lg border border-cream/10 bg-cream/5 px-3 text-cream outline-none focus:border-yellow mt-1.5 font-mono"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-cream/5">
                <button type="button" onClick={() => setOpenModal(false)} className="h-10 px-5 rounded-full border border-cream/10 font-semibold hover:bg-cream/5">Cancel</button>
                <button type="submit" className="h-10 px-6 rounded-full bg-yellow font-semibold text-navy hover:bg-cream">Register Agent</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 5. CUSTOMER LEDGER VIEW (Assign customers, wallet manager)
function CustomersView() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const custRes = await getCustomersList();
      setCustomers(custRes);
      const agRes = await getDeliveryAgentsList();
      setAgents(agRes);
    } catch (err) {
      toast.error("Failed to load customer list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRouteAssign = async (customerId: string, agentId: string) => {
    try {
      const res = await assignCustomerToAgent({ data: { customerId, agentId } });
      if (res.success) {
        toast.success("Delivery route updated.");
        loadData();
      }
    } catch (err) {
      toast.error("Failed to re-assign agent");
    }
  };

  if (loading) return <RefreshIndicator />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-4xl text-cream font-medium">Customer Ledger & Route Assignments</h1>
        <p className="text-xs text-cream/50 mt-1">Audit customer wallets, active subscriptions, and assign them to delivery agents.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-cream/10 bg-cream/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-cream/10 bg-dark/20 text-[10px] font-bold uppercase tracking-widest text-cream/60">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Contact & Location</th>
              <th className="px-6 py-4">Wallet Balance</th>
              <th className="px-6 py-4">Route Assignment</th>
              <th className="px-6 py-4">Subscriptions</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-cream/5">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-cream/5 transition-colors">
                <td className="px-6 py-4.5">
                  <span className="font-semibold block text-sm">{c.name}</span>
                  <span className="text-[10px] text-cream/40 block mt-0.5">Status: <span className="text-yellow capitalize">{c.status}</span></span>
                </td>
                <td className="px-6 py-4.5">
                  <p className="font-medium text-cream">{c.phone}</p>
                  <p className="text-[10px] text-cream/40 mt-1 max-w-[28ch] truncate" title={c.address}>{c.address}</p>
                </td>
                <td className="px-6 py-4.5 font-mono text-sm font-semibold">
                  <span className={c.walletBalance < 500 ? "text-yellow" : "text-cream"}>
                    &#8377;{c.walletBalance.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4.5">
                  <select
                    value={c.assignedAgentId}
                    onChange={(e) => handleRouteAssign(c.id, e.target.value)}
                    className="h-8 rounded bg-navy border border-cream/10 text-cream px-2 outline-none text-xs focus:border-yellow w-40"
                  >
                    <option value="unassigned">Unassigned</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4.5">
                  <div className="space-y-1">
                    {c.subscriptions?.map((sub: any) => (
                      <div key={sub.id} className="inline-flex items-center gap-1.5 bg-yellow/10 text-yellow text-[9px] font-bold px-2 py-0.5 rounded border border-yellow/20 uppercase tracking-wide">
                        {sub.quantityLiters}L {sub.milkType} ({sub.shift})
                      </div>
                    ))}
                    {(!c.subscriptions || c.subscriptions.length === 0) && (
                      <span className="text-cream/30 text-[10px]">No active subscription</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 6. INBOX VIEW
function InboxView() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await getCustomerMessages();
      setMessages(res);
    } catch (err) {
      toast.error("Failed to load message log feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatus = async (id: string, status: "unread" | "read" | "replied") => {
    try {
      const res = await updateMessageStatus({ data: { id, status } });
      if (res.success) {
        toast.success(`Message marked as ${status}.`);
        loadData();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <RefreshIndicator />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-4xl text-cream font-medium">Customer Messages Inbox</h1>
        <p className="text-xs text-cream/50 mt-1">Review inquiries received from the public website contact form.</p>
      </div>

      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`rounded-xl border bg-cream/5 p-6 transition-shadow hover:shadow ${m.status === "unread" ? "border-yellow/30" : "border-cream/10"}`}>
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-lg font-medium text-cream">{m.name}</h3>
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${m.status === "unread" ? "bg-yellow/15 text-yellow" : m.status === "read" ? "bg-cream/10 text-cream/70" : "bg-emerald-500/10 text-emerald-400"}`}>
                    {m.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream/45 font-medium">
                  <span className="flex items-center gap-1"><Mail className="size-3.5" /> {m.email}</span>
                  {m.phone && <span className="flex items-center gap-1"><Phone className="size-3.5" /> {m.phone}</span>}
                  <span>Received: {new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {m.status !== "read" && (
                  <button onClick={() => handleStatus(m.id, "read")} className="h-8 rounded-full border border-cream/10 px-3 hover:bg-cream/5 text-[10px] font-bold uppercase tracking-wider">
                    Mark Read
                  </button>
                )}
                {m.status !== "replied" && (
                  <button onClick={() => handleStatus(m.id, "replied")} className="h-8 rounded-full bg-yellow px-3 text-[10px] font-bold uppercase tracking-wider text-navy hover:bg-cream">
                    Mark Replied
                  </button>
                )}
              </div>
            </div>
            <p className="mt-4 text-xs text-cream/80 leading-relaxed max-w-[70ch]">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="border border-dashed border-cream/15 rounded-xl p-12 text-center text-xs text-cream/40">Inbox is empty. No customer messages found.</div>
        )}
      </div>
    </div>
  );
}

// 7. NOTES VIEW
function NotesView() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const res = await getAdminNotes();
        setContent(res);
      } catch (err) {
        toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    loadNotes();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateAdminNotes({ data: { content } });
      if (res.success) {
        toast.success("Notes saved successfully.");
      }
    } catch (err) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <RefreshIndicator />;

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-cream font-medium">Administration Notepad</h1>
          <p className="text-xs text-cream/50 mt-1">Jot down operational check-lists, daily cattle schedules, and reminders.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex h-10 items-center justify-center rounded-full bg-yellow px-6 font-semibold text-navy transition-all hover:bg-cream disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Scratchpad"}
        </button>
      </div>

      <div className="rounded-xl border border-cream/10 bg-cream/5 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          placeholder="Jot down farm schedules or shift reminders here..."
          className="w-full bg-transparent p-6 outline-none text-sm text-cream font-sans leading-relaxed resize-none h-[420px]"
        />
      </div>
    </div>
  );
}

function RefreshIndicator() {
  return (
    <div className="flex h-64 items-center justify-center text-cream">
      <RefreshCw className="size-6 animate-spin text-yellow" />
    </div>
  );
}
