import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify'; // Import toast

const Profile = () => {
  const { user, logout, loading: authLoading } = useContext(AuthContext); // Get authLoading
  const navigate = useNavigate(); // Initialize navigate
  const [orders, setOrders] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. PROTECTED ROUTE LOGIC: Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.info("Please log in to view your profile.");
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // 2. Fetch Profile and Financial Data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // Fetch Order History
        const { data: orderData } = await axios.get('http://localhost:8000/api/orders', config);
        const sortedOrders = orderData.sort((a, b) => (a._id < b._id ? 1 : -1));
        setOrders(sortedOrders);

        // Calculate Current Holdings
        const holdings = orderData.reduce((acc, order) => {
          const qty = order.orderType === 'buy' ? order.count : -order.count;
          acc[order.symbol] = (acc[order.symbol] || 0) + qty;
          return acc;
        }, {});

        // Fetch Live Prices for Holdings
        let currentMarketValueINR = 0;
        const conversionRate = 83.0; 

        for (const symbol in holdings) {
          if (holdings[symbol] > 0) {
            try {
              const { data: liveStock } = await axios.get(`http://localhost:8000/api/market/${symbol}`);
              const priceInINR = (liveStock.stockExchange === 'NSE' || liveStock.stockExchange === 'BSE') 
                  ? liveStock.price 
                  : liveStock.price * conversionRate;
              
              currentMarketValueINR += holdings[symbol] * priceInINR;
            } catch (err) {
              console.error(`Could not update live price for ${symbol}`);
            }
          }
        }

        setPortfolioValue(currentMarketValueINR);
        setLoading(false);
      } catch (error) {
        console.error("Profile Load Error:", error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  // Handle local sign out with notification
  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully. Have a great day!");
    navigate('/');
  };

  // Prevent flash of content while checking auth
  if (authLoading || (!user && loading)) {
    return <div className="p-12 text-center font-bold animate-pulse">Verifying Session...</div>;
  }

  if (!user) return null;

  const netWorth = (user?.balance || 0) + portfolioValue;
  const initials = user.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-8">My Financial Overview</h1>

      {/* Net Worth Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-xl p-6 text-white shadow-lg border border-blue-400/20">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Total Net Worth</p>
          <h3 className="text-3xl font-black">₹{netWorth.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h3>
          <p className="text-blue-200 text-[10px] mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            Live Market Valuation
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a202c] rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Available Cash</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₹{user.balance?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h3>
        </div>

        <div className="bg-white dark:bg-[#1a202c] rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Holdings Value</p>
          <h3 className="text-2xl font-bold text-emerald-600">₹{portfolioValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h3>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: User Card */}
        <aside className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary font-bold text-3xl mb-4 border-2 border-primary/20">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.username}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{user.email}</p>
            
            <button onClick={handleSignOut} className="w-full py-2.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-900/20 font-bold text-sm transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Right Column: Transaction History */}
        <section className="w-full md:w-2/3">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                Transaction Ledger
              </h3>
            </div>
            
            <div className="flex flex-col">
              {loading ? (
                <div className="p-12 text-center text-slate-500 animate-pulse">Calculating net worth...</div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center text-slate-500 italic">Your transaction history is empty.</div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[400px] overflow-y-auto">
                  {orders.map((order, index) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${order.orderType === 'buy' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/20'}`}>
                          <span className="material-symbols-outlined text-[20px]">
                            {order.orderType === 'buy' ? 'add_shopping_cart' : 'sell'}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white uppercase text-sm tracking-wide">
                            {order.orderType} {order.symbol}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">{order.count} shares • ₹{order.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${order.orderType === 'buy' ? 'text-slate-900 dark:text-white' : 'text-emerald-600'}`}>
                          {order.orderType === 'buy' ? '-' : '+'}₹{order.totalPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Settled</p>
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