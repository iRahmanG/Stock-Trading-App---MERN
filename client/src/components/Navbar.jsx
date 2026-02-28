import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. Theme Persistence Logic
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

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
    toast.success("Admin session ended safely.");
  };
  
  // Hide Navbar on Landing Page
  if (location.pathname === '/') return null;

  const initials = user?.username ? user.username.charAt(0).toUpperCase() : 'A';

  return (
    <header className="bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center gap-8">
            {/* Logo links back to Admin if user is Admin, else Dashboard */}
            <Link to={user?.isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-3xl">show_chart</span>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight italic">Trading App</h2>
            </Link>

            <nav className="hidden md:flex gap-6 text-sm font-bold items-center">
              {/* CONDITIONAL RENDERING: Only show trader links if NOT an admin */}
              {!user?.isAdmin ? (
                <>
                  <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'text-primary' : 'text-slate-500 hover:text-primary'}>Dashboard</Link>
                  <Link to="/portfolio" className={location.pathname === '/portfolio' ? 'text-primary' : 'text-slate-500 hover:text-primary'}>Portfolio</Link>
                </>
              ) : (
                /* Only show Admin Center link for admins */
                <Link 
                  to="/admin" 
                  className={`flex items-center gap-1 font-black px-4 py-2 rounded-lg transition-all ${
                    location.pathname === '/admin' 
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                    : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                  Command Center
                </Link>
              )}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-amber-500 rounded-full transition-colors">
              <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>

            {/* Only show balance to regular traders */}
            {user && !user.isAdmin && (
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