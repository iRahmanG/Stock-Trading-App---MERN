import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview'); // State for sidebar functionality
  const [data, setData] = useState({ stocks: [], transactions: [], users: [], logs: [], activeUsers: 0, serverStatus: 'Operational', latency: '24ms' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data: telemetry } = await axios.get('http://localhost:8000/api/admin/telemetry', config);
        setData(telemetry);
        setLoading(false);
      } catch (error) {
        toast.error("Telemetry link failed.");
        setLoading(false);
      }
    };
    if (user?.isAdmin) fetchAdminData();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-white">Accessing Secure Command Center...</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex w-full">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900/50 h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white"><span className="material-symbols-outlined">terminal</span></div>
          <div><h1 className="text-sm font-bold">Admin Center</h1><p className="text-xs text-slate-500">v1.0.4-stable</p></div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon="dashboard" label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem icon="group" label="User Management" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <NavItem icon="monitoring" label="Stock Management" active={activeTab === 'stocks'} onClick={() => setActiveTab('stocks')} />
          <NavItem icon="receipt_long" label="Transaction Ledger" active={activeTab === 'ledger'} onClick={() => setActiveTab('ledger')} />
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">System</div>
          <NavItem icon="settings" label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <NavItem icon="database" label="Logs" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
        </nav>
      </aside>

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Dynamic Content Rendering based on activeTab */}
        {activeTab === 'overview' && <OverviewTab data={data} />}
        {activeTab === 'users' && <UserTab users={data.users} />}
        {activeTab === 'stocks' && <StockTab stocks={data.stocks} />}
        {activeTab === 'ledger' && <LedgerTab transactions={data.transactions} />}
        {activeTab === 'settings' && <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">Settings Module: API Keys and System Toggles</div>}
        {activeTab === 'logs' && <LogTab logs={data.logs} />}
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS FOR MODULES ---

const OverviewTab = ({ data }) => (
  <div className="space-y-6">
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <HealthCard title="API Latency" value={data.latency} icon="speed" color="emerald-custom" />
      <HealthCard title="Server Status" value={data.serverStatus} icon="dns" color="primary" />
      <HealthCard title="Active Users" value={data.activeUsers.toString()} icon="group" color="amber-500" />
      <HealthCard title="Failed Requests" value="0.02%" icon="error" color="rose-custom" />
    </section>
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8"><StockTab stocks={data.stocks.slice(0, 5)} /></div>
      <div className="col-span-12 lg:col-span-4"><UserTab users={data.users.slice(0, 5)} /></div>
    </div>
  </div>
);

const UserTab = ({ users }) => (
  <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
    <h3 className="font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-amber-500">group</span> User Management</h3>
    <div className="space-y-3">
      {users.map((u, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <div><p className="text-xs font-bold">{u.username}</p><p className="text-[10px] text-slate-500">{u.email}</p></div>
          <span className="text-xs font-black text-emerald-custom">₹{u.balance?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  </div>
);

const StockTab = ({ stocks }) => (
  <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
    <h3 className="font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">monitoring</span> Stock Management</h3>
    <table className="w-full text-left text-sm">
      <thead className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
        <tr><th className="pb-3">Ticker</th><th className="pb-3">Exchange</th><th className="pb-3">Price</th><th className="pb-3 text-right">Actions</th></tr>
      </thead>
      <tbody>
        {stocks.map((s, i) => (
          <tr key={i} className="border-b border-slate-50 dark:border-slate-800">
            <td className="py-3 font-bold">{s.symbol}</td>
            <td className="py-3 text-slate-500">{s.stockExchange || s.exchange}</td>
            <td className="py-3 font-mono">₹{s.price}</td>
            <td className="py-3 text-right"><button className="text-primary text-xs font-bold">Edit</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const LedgerTab = ({ transactions }) => (
  <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
    <h3 className="font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">history</span> Transaction Ledger</h3>
    <div className="space-y-2">
      {transactions.map((t, i) => (
        <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg text-xs">
          <span className={`font-bold uppercase ${t.orderType === 'buy' ? 'text-emerald-500' : 'text-rose-500'}`}>{t.orderType}</span>
          <span className="font-medium">{t.symbol} x {t.count}</span>
          <span className="text-slate-400">{new Date(t.createdAt).toLocaleString()}</span>
          <span className="font-black">₹{t.totalPrice?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  </div>
);

const LogTab = ({ logs }) => (
  <div className="p-6 bg-black text-emerald-500 font-mono text-xs rounded-xl border border-slate-800 overflow-y-auto max-h-[500px]">
    {logs.map((log) => (
      <p key={log.id} className="mb-1">[{log.time.toLocaleTimeString()}] SYSTEM::{log.event} - STATUS::{log.status}</p>
    ))}
  </div>
);

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${active ? 'bg-primary/10 text-primary font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const HealthCard = ({ title, value, icon, color }) => (
  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-4">
    <div className={`size-12 rounded-lg bg-${color}/10 text-${color} flex items-center justify-center`}><span className="material-symbols-outlined">{icon}</span></div>
    <div><p className="text-xs text-slate-500">{title}</p><p className="text-xl font-bold">{value}</p></div>
  </div>
);

export default AdminDashboard;