import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ latency: '24ms', activeUsers: 0, serverStatus: 'Operational' });
  const [stocks, setStocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // Fetch All System Transactions
        const { data: orderData } = await axios.get('http://localhost:8000/api/orders/admin', config);
        setTransactions(orderData);

        // Fetch Tracked Stocks
        const { data: stockData } = await axios.get('http://localhost:8000/api/stocks', config);
        setStocks(stockData);

        setLoading(false);
      } catch (error) {
        toast.error("Failed to load admin telemetry.");
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [user]);

  const handleHaltStock = (symbol) => {
    toast.warning(`Trading halted for ${symbol}`);
    // Logic for updating stock status in DB
  };

  return (
    <div className="flex bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      {/* Sidebar - Use your provided classes */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">A</div>
          <div>
            <h1 className="text-sm font-bold leading-tight">Admin Center</h1>
            <p className="text-xs text-slate-500">Stock MERN Console</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-bold text-sm">
            <span className="material-symbols-outlined">dashboard</span> Global Overview
          </button>
          {/* Add other buttons matching your UI */}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* System Health Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <HealthCard title="API Latency" value={stats.latency} icon="speed" color="emerald" />
          <HealthCard title="Server Status" value={stats.serverStatus} icon="dns" color="primary" />
          <HealthCard title="Active Users" value="1,284" icon="group" color="amber" />
          <HealthCard title="Failed Requests" value="0.02%" icon="error" color="rose" />
        </section>

        <div className="grid grid-cols-12 gap-6">
          {/* Stock Management */}
          <div className="col-span-12 lg:col-span-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">monitoring</span> Stock Management
            </h3>
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="pb-3 font-medium">Ticker</th>
                  <th className="pb-3 font-medium">Exchange</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stocks.map((s, i) => (
                  <tr key={i}>
                    <td className="py-4 font-bold">{s.symbol}</td>
                    <td className="py-4 text-slate-500">{s.exchange}</td>
                    <td className="py-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-custom/10 text-emerald-custom">Active</span>
                    </td>
                    <td className="py-4 text-right">
                      <button onClick={() => handleHaltStock(s.symbol)} className="text-rose-custom hover:underline font-bold text-xs">Halt</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Global Transaction Ledger */}
          <div className="col-span-12 lg:col-span-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">receipt_long</span> Recent Ledger
            </h3>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((t, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold">{t.orderType.toUpperCase()} {t.symbol}</p>
                    <p className="text-[10px] text-slate-500">{t.user}</p>
                  </div>
                  <p className="text-xs font-black">₹{t.totalPrice.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-component for health cards
const HealthCard = ({ title, value, icon, color }) => (
  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-4">
    <div className={`size-12 rounded-lg bg-${color}-500/10 text-${color}-500 flex items-center justify-center`}>
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;