import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync theme with system or local storage on mount
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
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out. See you soon!");
  };
  
  // Hide Navbar on Landing Page
  if (location.pathname === '/') return null;

  const initials = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <header className="bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-primary dark:text-blue-400">
              <span className="material-symbols-outlined text-3xl">show_chart</span>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Trading App</h2>
            </Link>
            
            <nav className="hidden md:flex gap-6">
              <Link to="/dashboard" className={`font-bold text-sm transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}>Dashboard</Link>
              <Link to="/portfolio" className={`font-bold text-sm transition-colors ${location.pathname === '/portfolio' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}>Portfolio</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {user && (
              <div className="hidden sm:flex flex-col text-right mr-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Buying Power</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{user.balance?.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                </span>
              </div>
            )}

            <button onClick={handleLogout} title="Logout" className="text-slate-500 hover:text-rose-500 dark:text-slate-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">logout</span>
            </button>
            
            <Link to="/profile" className="h-9 w-9 ml-2 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-800 cursor-pointer hover:ring-primary transition-all" title="View Profile">
              {initials}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;