import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  // Don't show this specific navbar on the Landing page
  if (location.pathname === '/') return null;

  return (
    <header className="bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 text-primary dark:text-blue-400">
              <span className="material-symbols-outlined text-3xl">show_chart</span>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Trading App</h2>
            </Link>
            
            {/* Nav Links */}
            <nav className="hidden md:flex gap-6">
              <Link to="/dashboard" className={`font-bold text-sm transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}>Dashboard</Link>
              <Link to="/portfolio" className={`font-bold text-sm transition-colors ${location.pathname === '/portfolio' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}>Portfolio</Link>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 font-medium text-sm transition-colors">Markets</a>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 font-medium text-sm transition-colors">History</a>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-800 cursor-pointer">
              MT
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;