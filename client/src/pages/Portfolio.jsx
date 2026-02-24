import React from 'react';

const Portfolio = () => {
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
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Total Portfolio Value</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$124,502.00</h3>
          </div>
          <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+2.4%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-emerald-600">moving</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Day's Gain</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">+$2,450.32</h3>
          </div>
          <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+1.8%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-slate-500">payments</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Total Cash</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$15,200.00</h3>
          </div>
          <div className="mt-2 text-sm text-slate-400">Available for trade</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-blue-400">bolt</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Buying Power</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$45,000.00</h3>
          </div>
          <div className="mt-2 text-sm text-slate-400">Includes margin</div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-32">Exchange</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-40">Symbol</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[200px]">Stock Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Quantity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Current Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Total Value</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center w-40">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {/* Row 1: AAPL */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">NASDAQ</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-bold text-slate-900 dark:text-white">AAPL</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                      <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
                    </div>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Apple Inc.</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-slate-700 dark:text-slate-300 font-medium font-mono">150</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-slate-900 dark:text-white font-bold font-mono">$175.50</div>
                  <div className="text-emerald-600 text-xs font-medium flex justify-end items-center">
                    <span className="material-symbols-outlined text-[12px] mr-0.5">arrow_upward</span> 1.2%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-slate-900 dark:text-white font-bold font-mono">$26,325.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button className="inline-flex items-center justify-center px-3 py-1.5 border border-primary text-primary hover:bg-primary hover:text-white rounded-md text-xs font-bold transition-all shadow-sm">
                    View Chart
                  </button>
                </td>
              </tr>
              {/* Add more rows here as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Portfolio;