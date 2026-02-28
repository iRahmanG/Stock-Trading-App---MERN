import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({
    stocks: [],
    transactions: [],
    users: [],
    activeUsers: 0,
    serverStatus: 'Operational',
    latency: '24ms'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data: telemetry } = await axios.get('http://localhost:8000/api/admin/telemetry', config);
        setData(telemetry);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load admin telemetry.");
        setLoading(false);
      }
    };
    if (user && user.isAdmin) fetchAdminData();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-white">Initializing Command Center...</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex w-full">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900/50 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">terminal</span>
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">Admin Center</h1>
            <p className="text-xs text-slate-500">Stock Trade MERN</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon="dashboard" label="Global Overview" active />
          <NavItem icon="group" label="User Management" />
          <NavItem icon="monitoring" label="Stock Management" />
          <NavItem icon="receipt_long" label="Transaction Ledger" />
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">System</div>
          <NavItem icon="settings" label="Settings" />
          <NavItem icon="database" label="Logs" />
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user.username}</p>
              <p className="text-[10px] text-slate-500 truncate">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-lg font-bold tracking-tight">Command Center</h2>
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all" placeholder="Search commands, tickers or users..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-sm">add</span> New Asset
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* System Health Header */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <HealthCard title="API Latency" value={data.latency} icon="speed" trend="arrow_downward" trendValue="12%" color="emerald-custom" />
            <HealthCard title="Server Status" value={data.serverStatus} icon="dns" trendValue="99.99%" color="primary" />
            <HealthCard title="Active Users" value={data.activeUsers.toString()} icon="group" trend="arrow_upward" trendValue="5.2%" color="amber-500" />
            <HealthCard title="Failed Requests" value="0.02%" icon="error" trendValue="Last 24h" color="rose-custom" />
          </section>

          {/* Bento Box Grid */}
          <div className="grid grid-cols-12 gap-4">
            {/* Stock Management */}
            <div className="col-span-12 lg:col-span-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">show_chart</span> Stock Management
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      <th className="pb-3 font-medium">Ticker</th>
                      <th className="pb-3 font-medium">Exchange</th>
                      <th className="pb-3 font-medium">Price</th>
                      <th className="pb-3 font-medium text-center">Status</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.stocks.map((s, i) => (
                      <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 font-bold">{s.symbol}</td>
                        <td className="py-4 text-slate-500">{s.stockExchange}</td>
                        <td className="py-4 font-mono">₹{s.price}</td>
                        <td className="py-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-custom/10 text-emerald-custom border border-emerald-custom/20">Active</span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="text-primary hover:underline font-semibold text-xs">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Directory */}
            <div className="col-span-12 lg:col-span-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">group</span> User Directory
              </h3>
              <div className="space-y-4 overflow-y-auto max-h-[400px]">
                {data.users.map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div>
                      <p className="text-xs font-bold">{u.username}</p>
                      <p className="text-[10px] text-slate-500">{u.email}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-custom">₹{u.balance.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction Ledger */}
            <div className="col-span-12 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span> Global Transaction Ledger
              </h3>
              <div className="space-y-3">
                {data.transactions.map((t, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`size-9 rounded-full flex items-center justify-center ${t.orderType === 'buy' ? 'bg-emerald-custom/10 text-emerald-custom' : 'bg-rose-custom/10 text-rose-custom'}`}>
                        <span className="material-symbols-outlined text-lg">{t.orderType === 'buy' ? 'shopping_cart' : 'sell'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase">{t.orderType} {t.symbol} x {t.count}</p>
                        <p className="text-[10px] text-slate-500">Trader ID: {t.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">₹{t.totalPrice.toLocaleString()}</p>
                      <p className={`text-[10px] font-semibold ${t.orderType === 'buy' ? 'text-emerald-custom' : 'text-rose-custom'}`}>Confirmed</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components for clean structure
const NavItem = ({ icon, label, active = false }) => (
  <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} href="#">
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </a>
);

const HealthCard = ({ title, value, icon, color, trend, trendValue }) => (
  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-4">
    <div className={`size-12 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `var(--${color}-bg)`, color: `var(--${color})` }}>
       {/* Note: In production, map these colors to specific Tailwind classes or inline styles */}
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{title}</p>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[10px] text-slate-400 flex items-center gap-0.5">
        {trend && <span className="material-symbols-outlined text-[12px]">{trend}</span>}
        {trendValue}
      </p>
    </div>
  </div>
);

export default AdminDashboard;