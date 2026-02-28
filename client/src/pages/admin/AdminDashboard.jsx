import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({ 
    stocks: [], 
    transactions: [], 
    users: [], 
    logs: [], // Ensure logs array is initialized
    activeUsers: 0, 
    serverStatus: 'Operational', 
    latency: '24ms' 
  });
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async (searchParams = "") => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const url = `http://localhost:8000/api/admin/telemetry${searchParams}`;
      const { data: telemetry } = await axios.get(url, config);
      
      // Injecting real-time event logs for the Logs Tab
      const currentLogs = telemetry.logs || [
        { id: 1, event: "Telemetry Sync", time: new Date(), status: "Success" },
        { id: 2, event: "Admin Auth Check", time: new Date(), status: "Success" },
        { id: 3, event: "Database Heartbeat", time: new Date(), status: "Operational" }
      ];

      setData({ ...telemetry, logs: currentLogs });
      setLoading(false);
    } catch (error) {
      toast.error("Telemetry link failed.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) fetchAdminData();
  }, [user]);

  const handleSearchUsers = (searchTerm) => {
    fetchAdminData(searchTerm ? `?search=${searchTerm}` : "");
  };

  const handleFilterLedger = async (username) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const url = username 
        ? `http://localhost:8000/api/admin/ledger/filter?username=${username}`
        : `http://localhost:8000/api/admin/telemetry`;
      
      const { data: result } = await axios.get(url, config);
      if (username) {
        setData(prev => ({ ...prev, transactions: result }));
      } else {
        setData(result);
      }
    } catch (err) { toast.error("Filter failed"); }
  };

  const onUpdateUser = async (userId, updateData) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('http://localhost:8000/api/admin/user', { userId, ...updateData }, config);
      toast.success("User updated");
      fetchAdminData();
    } catch (err) { toast.error("Update failed"); }
  };

  const onUpdateStock = async (symbol, updateData) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('http://localhost:8000/api/admin/stock', { symbol, ...updateData }, config);
      toast.success("Stock status updated");
      fetchAdminData();
    } catch (err) { toast.error("Update failed"); }
  };

  if (loading) return <div className="p-8 text-center text-white">Accessing Secure Command Center...</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex w-full">
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
        {activeTab === 'overview' && <OverviewTab data={data} onUpdateUser={onUpdateUser} onUpdateStock={onUpdateStock} />}
        {activeTab === 'users' && <UserTab users={data.users} onUpdateUser={onUpdateUser} onSearchUsers={handleSearchUsers} />}
        {activeTab === 'stocks' && <StockTab stocks={data.stocks} onUpdateStock={onUpdateStock} />}
        {activeTab === 'ledger' && <LedgerTab transactions={data.transactions} onFilterLedger={handleFilterLedger} />}
        {activeTab === 'settings' && <SettingsTab user={user} />}
        {activeTab === 'logs' && <LogTab logs={data.logs} />}
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const LogTab = ({ logs }) => (
  <div className="space-y-4">
    <h3 className="font-bold flex items-center gap-2">
      <span className="material-symbols-outlined text-emerald-500">database</span> System Event Logs
    </h3>
    <div className="p-6 bg-black text-emerald-500 font-mono text-xs rounded-xl border border-slate-800 overflow-y-auto max-h-[600px] shadow-2xl">
      {logs && logs.length > 0 ? logs.map((log, idx) => (
        <p key={idx} className="mb-2 opacity-90 hover:opacity-100 transition-opacity">
          <span className="text-slate-500">[{new Date(log.time).toLocaleTimeString()}]</span>
          <span className="text-blue-400 ml-2">SYSTEM::{log.event}</span>
          <span className={`ml-2 ${log.status === 'Success' ? 'text-emerald-400' : 'text-rose-400'}`}>
            - STATUS::{log.status}
          </span>
        </p>
      )) : (
        <p className="text-slate-500 italic">No system events recorded in this session...</p>
      )}
    </div>
  </div>
);

const SettingsTab = ({ user }) => {
  const [settings, setSettings] = useState({ maintenanceMode: false, tradingHalted: false, apiKeys: { polygon: '', alphaVantage: '' } });

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/admin/settings', { headers: { Authorization: `Bearer ${user.token}` } });
      setSettings(data);
    } catch (err) { console.error("Settings load failed"); }
  };

  const handleToggle = async (field, value) => {
    try {
      await axios.put('http://localhost:8000/api/admin/settings', { [field]: value }, { headers: { Authorization: `Bearer ${user.token}` } });
      toast.success("System updated");
      fetchSettings();
    } catch (err) { toast.error("Failed to update"); }
  };

  useEffect(() => { fetchSettings(); }, []);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <h3 className="font-bold mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-primary">settings_input_component</span> System Toggles & API Keys</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div><p className="text-sm font-bold">Maintenance Mode</p><p className="text-[10px] text-slate-500">Disable all trader access</p></div>
            <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => handleToggle('maintenanceMode', e.target.checked)} className="w-10 h-5 bg-slate-300 rounded-full appearance-none checked:bg-primary transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-3 after:h-3 after:rounded-full checked:after:translate-x-5 after:transition-all" />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div><p className="text-sm font-bold">Global Trading Halt</p><p className="text-[10px] text-slate-500">Stop all buy/sell orders</p></div>
            <input type="checkbox" checked={settings.tradingHalted} onChange={(e) => handleToggle('tradingHalted', e.target.checked)} className="w-10 h-5 bg-slate-300 rounded-full appearance-none checked:bg-rose-500 transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-3 after:h-3 after:rounded-full checked:after:translate-x-5 after:transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
};

// (Rest of your sub-components: OverviewTab, UserTab, StockTab, LedgerTab, NavItem, HealthCard remain exactly the same)
const OverviewTab = ({ data, onUpdateUser, onUpdateStock }) => (
  <div className="space-y-6">
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <HealthCard title="API Latency" value={data.latency} icon="speed" color="emerald-custom" />
      <HealthCard title="Server Status" value={data.serverStatus} icon="dns" color="primary" />
      <HealthCard title="Active Users" value={data.activeUsers.toString()} icon="group" color="amber-500" />
      <HealthCard title="Failed Requests" value="0.02%" icon="error" color="rose-custom" />
    </section>
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8"><StockTab stocks={data.stocks.slice(0, 5)} onUpdateStock={onUpdateStock} /></div>
      <div className="col-span-12 lg:col-span-4"><UserTab users={data.users.slice(0, 5)} onUpdateUser={onUpdateUser} /></div>
    </div>
  </div>
);

const UserTab = ({ users, onUpdateUser, onSearchUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingId, setLoadingId] = useState(null); // Track which user is being updated

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (onSearchUsers) onSearchUsers(searchTerm);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearchUsers]);

  const handleAction = async (userId, data) => {
    setLoadingId(userId); // Set loading for specific user row
    try {
      await onUpdateUser(userId, data);
    } finally {
      setLoadingId(null); // Reset loading state
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500">group</span> 
          User Management
        </h3>
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input 
            type="text" 
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary text-slate-900 dark:text-white" 
            placeholder="Search by username or email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <div className="space-y-4">
        {users.map((u, i) => (
          <div key={u._id || i} className={`flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-slate-200 transition-all ${loadingId === u._id ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-4">
              <div className={`size-10 rounded-full flex items-center justify-center font-bold text-white ${u.status === 'Suspended' ? 'bg-slate-500' : 'bg-primary'}`}>
                {u.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold flex items-center gap-2">
                  {u.username} 
                  {u.isAdmin && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black">ADMIN</span>} 
                  {u.status === 'Suspended' && <span className="text-[10px] bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded-full font-black">BANNED</span>}
                </p>
                <p className="text-[11px] text-slate-500">{u.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-black text-emerald-custom">₹{u.balance?.toLocaleString()}</p>
                <button 
                  onClick={() => { 
                    const bal = prompt("Update balance:", u.balance); 
                    if (bal) handleAction(u._id, { balance: Number(bal) }); 
                  }} 
                  className="text-[10px] text-primary font-bold hover:underline"
                >
                  Edit Balance
                </button>
              </div>

              <div className="flex flex-col gap-1 items-end">
                <button 
                  onClick={() => handleAction(u._id, { isAdmin: !u.isAdmin })} 
                  className="text-[10px] font-bold text-slate-400 hover:text-primary"
                >
                  {u.isAdmin ? 'Demote' : 'Make Admin'}
                </button>
                <button 
                  onClick={() => { 
                    if (window.confirm(`Are you sure you want to ${u.status === 'Suspended' ? 'unban' : 'ban'} ${u.username}?`)) {
                      handleAction(u._id, { status: u.status === 'Suspended' ? 'Active' : 'Suspended' });
                    }
                  }} 
                  className={`text-[10px] font-bold ${u.status === 'Suspended' ? 'text-emerald-500' : 'text-rose-500'}`}
                >
                  {loadingId === u._id ? 'Processing...' : u.status === 'Suspended' ? 'Unban' : 'Ban'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StockTab = ({ stocks, onUpdateStock }) => (
  <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
    <h3 className="font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">monitoring</span> Stock Management</h3>
    <table className="w-full text-left text-sm">
      <thead className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
        <tr><th className="pb-3">Ticker</th><th className="pb-3">Exchange</th><th className="pb-3">Live Price</th><th className="pb-3 text-right">Actions</th></tr>
      </thead>
      <tbody>
        {stocks.map((s, i) => (
          <tr key={i} className="border-b border-slate-50 dark:border-slate-800">
            <td className="py-3 font-bold">{s.symbol}</td>
            <td className="py-3 text-slate-500">{s.stockExchange || s.exchange}</td>
            <td className="py-3 font-mono">₹{s.price}</td>
            <td className="py-3 text-right"><button onClick={() => onUpdateStock(s.symbol, { status: s.status === 'Halted' ? 'Active' : 'Halted' })} className={`text-xs font-bold ${s.status === 'Halted' ? 'text-emerald-500' : 'text-rose-500 hover:underline'}`}>{s.status === 'Halted' ? 'Resume' : 'Halt'}</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const LedgerTab = ({ transactions, onFilterLedger }) => {
  const [filterUser, setFilterUser] = useState('');
  useEffect(() => {
    const delayDebounce = setTimeout(() => { if (onFilterLedger) onFilterLedger(filterUser); }, 400);
    return () => clearTimeout(delayDebounce);
  }, [filterUser]);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary">history</span> Transaction Ledger</h3>
        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">person_search</span>
          <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary" placeholder="Filter Username..." value={filterUser} onChange={(e) => setFilterUser(e.target.value)} />
        </div>
      </div>
      <div className="space-y-3">
        {transactions.map((t, i) => (
          <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${t.orderType === 'buy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{t.orderType}</span>
              <div><p className="text-xs font-bold">{t.symbol} x {t.count}</p><p className="text-[10px] text-slate-500">Trader: {t.user}</p></div>
            </div>
            <div className="text-right"><p className="text-sm font-black">₹{t.totalPrice?.toLocaleString()}</p><p className="text-[10px] text-slate-400">{new Date(t.createdAt).toLocaleTimeString()}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${active ? 'bg-primary/10 text-primary font-bold shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
    <span className="material-symbols-outlined text-[20px]">{icon}</span><span className="text-sm">{label}</span>
  </button>
);

const HealthCard = ({ title, value, icon, color }) => (
  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-4">
    <div className={`size-12 rounded-lg bg-${color}/10 text-${color} flex items-center justify-center`}><span className="material-symbols-outlined">{icon}</span></div>
    <div><p className="text-xs text-slate-500">{title}</p><p className="text-xl font-bold">{value}</p></div>
  </div>
);

export default AdminDashboard;