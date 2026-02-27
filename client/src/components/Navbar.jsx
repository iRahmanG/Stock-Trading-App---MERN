import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // 1. Theme Logic
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  // 2. Fetch Watchlist Updates for Notifications
  useEffect(() => {
    const fetchWatchlistAlerts = async () => {
      const savedWatchlist = JSON.parse(localStorage.getItem('user_watchlist')) || [];
      if (savedWatchlist.length === 0) return;

      try {
        const updates = await Promise.all(
          savedWatchlist.slice(0, 4).map(async (stock) => {
            const { data } = await axios.get(`http://localhost:8000/api/market/${stock.symbol}`);
            return {
              symbol: data.symbol,
              price: data.price,
              change: data.changePercent,
              exchange: data.stockExchange
            };
          })
        );
        setAlerts(updates);
      } catch (err) {
        console.error("Notification sync failed");
      }
    };

    if (user) {
      fetchWatchlistAlerts();
      const interval = setInterval(fetchWatchlistAlerts, 30000); // Update every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      root.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out. See you soon!");
  };
  
  if (location.pathname === '/') return null;

  const initials = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <header className="bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-3xl">show_chart</span>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight italic">Trading App</h2>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-bold">
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'text-primary' : 'text-slate-500 hover:text-primary'}>Dashboard</Link>
              <Link to="/portfolio" className={location.pathname === '/portfolio' ? 'text-primary' : 'text-slate-500 hover:text-primary'}>Portfolio</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Watchlist Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative"
              >
                <span className="material-symbols-outlined">notifications</span>
                {alerts.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 font-bold text-xs uppercase tracking-widest text-slate-400">Watchlist Updates</div>
                  <div className="divide-y divide-slate-50 dark:divide-slate-700">
                    {alerts.length > 0 ? alerts.map((a, i) => (
                      <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-black text-slate-900 dark:text-white text-xs">{a.symbol}</span>
                          <span className={`text-[10px] font-bold ${a.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {a.change >= 0 ? '▲' : '▼'} {Math.abs(a.change).toFixed(2)}%
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">{a.exchange === 'NSE' ? '₹' : '$'}{a.price.toLocaleString()}</p>
                      </div>
                    )) : <div className="p-8 text-center text-xs text-slate-400">No stocks pinned yet</div>}
                  </div>
                  <Link to="/dashboard" onClick={() => setShowNotifications(false)} className="block p-3 text-center text-[10px] font-bold text-primary bg-slate-50 dark:bg-slate-900 hover:underline">Manage Watchlist</Link>
                </div>
              )}
            </div>

            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-amber-500 rounded-full transition-colors">
              <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>

            {user && (
              <div className="hidden sm:flex flex-col text-right px-4 border-l border-slate-200 dark:border-slate-800">
                <span className="text-[9px] font-black text-slate-400 uppercase">Balance</span>
                <span className="text-xs font-bold text-emerald-600 tracking-tight">₹{user.balance?.toLocaleString('en-IN')}</span>
              </div>
            )}

            <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-rose-500 rounded-full transition-colors">
              <span className="material-symbols-outlined">logout</span>
            </button>
            
            <Link to="/profile" className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs hover:ring-2 hover:ring-primary/50 transition-all">{initials}</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;