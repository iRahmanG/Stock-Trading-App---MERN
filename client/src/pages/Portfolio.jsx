import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Portfolio = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!user) return;
      
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        // Fetch the user's orders from the backend
        const { data } = await axios.get('http://localhost:8000/api/orders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError('Failed to load your portfolio.');
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user]);

  // Calculate Total Invested based on the orders
  const totalInvested = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading your portfolio...</div>;
  if (!user) return <div className="p-12 text-center text-rose-500 font-bold">Please log in to view your portfolio.</div>;

  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-6 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Portfolio</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of your current holdings and performance.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Market Open</span>
          <span className="mx-2">•</span>
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-primary">account_balance_wallet</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Total Invested</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              ₹{totalInvested.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-slate-500">payments</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Available Cash</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              ₹{user.balance?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </h3>
          </div>
          <div className="mt-2 text-sm text-slate-400">Ready to trade</div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-emerald-600">receipt_long</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Total Orders</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{orders.length}</h3>
          </div>
          <div className="mt-2 text-sm text-slate-400">Completed transactions</div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {error && <div className="p-4 bg-red-100 text-red-700 font-bold">{error}</div>}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-32">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-40">Symbol</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[200px]">Stock Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Quantity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Purchase Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Total Value</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center w-40">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500 font-medium">
                    You haven't made any trades yet. Go to the dashboard to find stocks!
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${order.orderType === 'buy' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {order.orderType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 dark:text-white">{order.symbol}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{order.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-slate-700 dark:text-slate-300 font-bold font-mono">
                      {order.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-slate-900 dark:text-white font-medium font-mono">
                      ₹{order.price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-slate-900 dark:text-white font-bold font-mono">
                      ₹{order.totalPrice.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Link to={`/trade/${order.symbol}`} className="inline-flex items-center justify-center px-3 py-1.5 border border-primary text-primary hover:bg-primary hover:text-white rounded-md text-xs font-bold transition-all shadow-sm">
                        Trade Again
                      </Link>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Portfolio;