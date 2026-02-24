import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the user's order history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:8000/api/orders', config);
        
        // Sort orders by newest first (assuming MongoDB creates an _id with a timestamp)
        const sortedOrders = data.sort((a, b) => (a._id < b._id ? 1 : -1));
        setOrders(sortedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error);
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (!user) return <div className="p-12 text-center font-bold">Please log in.</div>;

  const initials = user.username ? user.username.charAt(0).toUpperCase() : '?';
  const totalInvested = orders.filter(o => o.orderType === 'buy').reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  return (
    <main className="flex-grow w-full max-w-[1000px] mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-8">My Profile</h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: User Info Card */}
        <aside className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-4xl shadow-md mb-4 ring-4 ring-blue-50 dark:ring-slate-800">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.username}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{user.email}</p>
            
            <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-6 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-slate-500 font-medium text-sm">Buying Power</span>
                <span className="font-bold text-emerald-600">₹{user.balance?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium text-sm">Total Invested</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{totalInvested.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
            </div>

            <button onClick={logout} className="w-full py-2.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-900/20 font-bold text-sm transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Right Column: Transaction History */}
        <section className="w-full md:w-2/3">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                Transaction History
              </h3>
            </div>
            
            <div className="flex flex-col">
              {loading ? (
                <div className="p-8 text-center text-slate-500 animate-pulse">Loading history...</div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No transactions found.</div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
                  {orders.map((order, index) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${order.orderType === 'buy' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30'}`}>
                          <span className="material-symbols-outlined text-[20px]">
                            {order.orderType === 'buy' ? 'shopping_cart' : 'payments'}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white capitalize flex items-center gap-2">
                            {order.orderType} {order.symbol}
                          </p>
                          <p className="text-xs text-slate-500">{order.count} shares @ ₹{order.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${order.orderType === 'buy' ? 'text-slate-900 dark:text-white' : 'text-emerald-600'}`}>
                          {order.orderType === 'buy' ? '-' : '+'}₹{order.totalPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                        </p>
                        <p className="text-xs text-slate-400">Completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Profile;