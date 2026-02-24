import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Main Content Layout */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Trending Stocks (1/3) */}
          <aside className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* Trending Card */}
            <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">trending_up</span>
                  Trending Stocks
                </h3>
                <a className="text-xs font-semibold text-primary hover:text-blue-700" href="#">View All</a>
              </div>
              <div className="flex flex-col">
                {/* Stock Item 1 */}
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs">TSLA</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">Tesla Inc</p>
                      <p className="text-xs text-slate-500 font-medium">Auto Manufacturers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">$245.30</p>
                    <div className="flex items-center justify-end gap-1 text-emerald-600 text-xs font-bold">
                      <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                      3.2%
                    </div>
                  </div>
                </div>
                {/* Stock Item 2 */}
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs">AAPL</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">Apple Inc</p>
                      <p className="text-xs text-slate-500 font-medium">Consumer Electronics</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">$182.10</p>
                    <div className="flex items-center justify-end gap-1 text-rose-500 text-xs font-bold">
                      <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                      0.5%
                    </div>
                  </div>
                </div>
                {/* Stock Item 3 */}
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs">NVDA</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">NVIDIA Corp</p>
                      <p className="text-xs text-slate-500 font-medium">Semiconductors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">$460.15</p>
                    <div className="flex items-center justify-end gap-1 text-emerald-600 text-xs font-bold">
                      <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                      1.2%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Summary Card */}
            <div className="bg-primary text-white rounded-xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-9xl">public</span>
              </div>
              <h3 className="font-bold text-lg mb-4 relative z-10">Market Status</h3>
              <div className="flex items-center gap-2 mb-1 relative z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-sm font-medium">Market is Open</span>
              </div>
              <p className="text-blue-100 text-xs mb-6 relative z-10">Closes in 4h 30m</p>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-blue-100 text-xs mb-1">S&P 500</p>
                  <p className="font-bold text-lg">4,500.12</p>
                  <span className="text-emerald-300 text-xs font-bold">+0.45%</span>
                </div>
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-blue-100 text-xs mb-1">Nasdaq</p>
                  <p className="font-bold text-lg">14,200.50</p>
                  <span className="text-emerald-300 text-xs font-bold">+0.82%</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Watchlist (2/3) */}
          <section className="w-full lg:w-2/3 flex flex-col gap-6">
            
            {/* Watchlist Header & Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">My Watchlist</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Track your favorite stocks and market movements.</p>
              </div>
              <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400">search</span>
                </div>
                <input className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-[#1a202c] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out" placeholder="Search for symbols, e.g. NVDA" type="text" />
              </div>
            </div>

            {/* Watchlist Grid */}
            <div className="grid grid-cols-1 gap-4">
              
              {/* Watchlist Item 1 */}
              <div className="bg-white dark:bg-[#1a202c] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-500">phone_iphone</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">AAPL</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wide">NASDAQ</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Apple Inc.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-lg text-slate-900 dark:text-white">$182.10</p>
                    <p className="text-rose-500 text-sm font-bold flex items-center sm:justify-end gap-1">
                      <span className="material-symbols-outlined text-[16px]">trending_down</span>
                      -0.5%
                    </p>
                  </div>
                  <button className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shadow-blue-200 dark:shadow-none whitespace-nowrap">
                    View Chart
                  </button>
                </div>
              </div>

              {/* Watchlist Item 2 */}
              <div className="bg-white dark:bg-[#1a202c] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                    <div className="text-slate-700 dark:text-slate-300 font-bold text-lg">F</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">F</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wide">NYSE</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Ford Motor Co.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-lg text-slate-900 dark:text-white">$12.05</p>
                    <p className="text-emerald-600 text-sm font-bold flex items-center sm:justify-end gap-1">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                      +1.5%
                    </p>
                  </div>
                  <button className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shadow-blue-200 dark:shadow-none whitespace-nowrap">
                    View Chart
                  </button>
                </div>
              </div>

              {/* Watchlist Item 3 */}
              <div className="bg-white dark:bg-[#1a202c] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-500">grid_view</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">MSFT</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wide">NASDAQ</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Microsoft Corp</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-lg text-slate-900 dark:text-white">$330.50</p>
                    <p className="text-emerald-600 text-sm font-bold flex items-center sm:justify-end gap-1">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                      +0.9%
                    </p>
                  </div>
                  <button className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shadow-blue-200 dark:shadow-none whitespace-nowrap">
                    View Chart
                  </button>
                </div>
              </div>

            </div>

            {/* Add New Button */}
            <button className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 hover:text-primary hover:border-primary hover:bg-blue-50 dark:hover:bg-slate-800 transition-all font-bold flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">add_circle</span>
              Add Symbol to Watchlist
            </button>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Home;