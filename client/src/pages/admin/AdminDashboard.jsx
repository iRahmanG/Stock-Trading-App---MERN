import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({ stocks: [], transactions: [], users: [], logs: [], activeUsers: 0, serverStatus: 'Operational', latency: '24ms' });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (user?.isAdmin) fetchAdminData();
  }, [user]);

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
      toast.success("Stock updated");
      fetchAdminData();
    } catch (err) { toast.error("Stock update failed"); }
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
        {activeTab === 'users' && <UserTab users={data.users} onUpdateUser={onUpdateUser} />}
        {activeTab === 'stocks' && <StockTab stocks={data.stocks} onUpdateStock={onUpdateStock} />}
        {activeTab === 'ledger' && <LedgerTab transactions={data.transactions} />}
        {activeTab === 'settings' && <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">Settings Module: API Keys and System Toggles</div>}
        {activeTab === 'logs' && <LogTab logs={data.logs} />}
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

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
const onSearchUsers = async (searchString) => {
    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data: telemetry } = await axios.get(`http://localhost:8000/api/admin/telemetry?search=${searchString}`, config);
        setData(telemetry);
    } catch (error) {
        toast.error("Search failed.");
    }
};
const UserTab = ({ users, onUpdateUser, onSearchUsers }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Debounced search to prevent excessive API calls
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (onSearchUsers) onSearchUsers(searchTerm);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearchUsers]);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500">group</span> User Management
        </h3>

        {/* Search Input Field */}
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary transition-all text-slate-900 dark:text-white"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {users.length > 0 ? (
          users.map((u, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-slate-200 transition-all">
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
                      if (bal) onUpdateUser(u._id, { balance: Number(bal) });
                    }}
                    className="text-[10px] text-primary font-bold hover:underline"
                  >
                    Edit Balance
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  {/* Role Toggle */}
                  <button
                    onClick={() => onUpdateUser(u._id, { isAdmin: !u.isAdmin })}
                    className="text-[10px] font-bold text-slate-400 hover:text-primary text-right"
                  >
                    {u.isAdmin ? 'Demote to Trader' : 'Make Admin'}
                  </button>

                  {/* Status Toggle (Ban/Unban) */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to ${u.status === 'Suspended' ? 'unban' : 'ban'} ${u.username}?`)) {
                        onUpdateUser(u._id, { status: u.status === 'Suspended' ? 'Active' : 'Suspended' });
                      }
                    }}
                    className={`text-[10px] font-bold text-right ${u.status === 'Suspended' ? 'text-emerald-500' : 'text-rose-500'}`}
                  >
                    {u.status === 'Suspended' ? 'Unban Account' : 'Ban Account'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">No users found matching your search.</div>
        )}
      </div>
    </div>
  );
};

const StockTab = ({ stocks, onUpdateStock }) => (
  <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
    <h3 className="font-bold mb-4 flex items-center gap-2">
      <span className="material-symbols-outlined text-primary">monitoring</span> Stock Management
    </h3>
    <table className="w-full text-left text-sm">
      <thead className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
        <tr>
          <th className="pb-3">Ticker</th>
          <th className="pb-3">Exchange</th>
          <th className="pb-3">Live Price</th>
          <th className="pb-3">Status</th>
          <th className="pb-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((s, i) => (
          <tr key={i} className="border-b border-slate-50 dark:border-slate-800">
            <td className="py-3 font-bold">{s.symbol}</td>
            <td className="py-3 text-slate-500">{s.stockExchange || s.exchange}</td>
            <td className="py-3 font-mono">₹{s.price}</td>
            <td className="py-3">
               <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.status === 'Halted' ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                 {s.status || 'Active'}
               </span>
            </td>
            <td className="py-3 text-right">
               {/* Only Halt/Resume functionality remains */}
               <button 
                 onClick={() => onUpdateStock(s.symbol, { status: s.status === 'Halted' ? 'Active' : 'Halted' })} 
                 className={`text-xs font-bold ${s.status === 'Halted' ? 'text-emerald-500' : 'text-rose-500 hover:underline'}`}
               >
                 {s.status === 'Halted' ? 'Resume Trading' : 'Halt Trading'}
               </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const LedgerTab = ({ transactions, onFilterLedger }) => {
  const [filterUser, setFilterUser] = React.useState('');

  // Trigger filter when admin types a username
  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onFilterLedger(filterUser);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [filterUser]);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">history</span> Transaction Ledger
        </h3>
        
        {/* User Filter Input */}
        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">person_search</span>
          <input 
            type="text"
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary"
            placeholder="Filter by Username..."
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {transactions.length > 0 ? transactions.map((t, i) => (
          <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg flex items-center justify-between border border-transparent hover:border-slate-200 transition-all">
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${t.orderType === 'buy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {t.orderType}
              </span>
              <div>
                <p className="text-xs font-bold">{t.symbol} x {t.count}</p>
                <p className="text-[10px] text-slate-500">Trader: {t.user}</p> {/* Shows username from ledger */}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-slate-900 dark:text-white">₹{t.totalPrice?.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400">{new Date(t.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
        )) : (
          <div className="py-10 text-center text-slate-500 text-xs">No transactions found for user "{filterUser}"</div>
        )}
      </div>
    </div>
  );
};

const LogTab = ({ logs }) => (
  <div className="p-6 bg-black text-emerald-500 font-mono text-xs rounded-xl border border-slate-800 overflow-y-auto max-h-[500px]">
    {logs.map((log) => (
      <p key={log.id} className="mb-1">[{new Date(log.time).toLocaleTimeString()}] SYSTEM::{log.event} - STATUS::{log.status}</p>
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