import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch LIVE stocks from your new Yahoo Finance endpoint
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/api/market');
        setStocks(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load live market data.');
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Trending Stocks (1/3) */}
          <aside className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* Trending Card */}
            <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">trending_up</span>
                  Live Market
                </h3>
              </div>
              <div className="flex flex-col">
                {/* Dynamic Stock List */}
                {loading ? (
                  <div className="p-6 text-center text-slate-500 font-medium animate-pulse">Fetching live prices from Yahoo Finance...</div>
                ) : error ? (
                  <div className="p-6 text-center text-rose-500 font-medium">{error}</div>
                ) : stocks.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 font-medium">No stocks available in the market right now.</div>
                ) : (
                  stocks.map((stock) => {
                    // Logic for UI polish!
                    const isPositive = stock.changePercent >= 0;
                    const currencySymbol = stock.stockExchange === 'NSE' ? '₹' : '$';

                    return (
                      <Link 
                        to={`/trade/${stock.symbol}`} 
                        key={stock._id} 
                        className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                            {stock.symbol.substring(0, 4)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]" title={stock.name}>{stock.name}</p>
                            <p className="text-xs text-slate-500 font-medium">{stock.stockExchange}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {currencySymbol}{stock.price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </p>
                          <div className={`flex items-center justify-end gap-1 text-xs font-bold mt-0.5 ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                            <span className="material-symbols-outlined text-[14px]">
                              {isPositive ? 'arrow_upward' : 'arrow_downward'}
                            </span>
                            {Math.abs(stock.changePercent).toFixed(2)}%
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          {/* Right Column: Watchlist (2/3) - Keeping static for now */}
          <section className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">My Watchlist</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Track your favorite stocks and market movements.</p>
              </div>
              <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400">search</span>
                </div>
                <input className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-[#1a202c] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out" placeholder="Search for symbols..." type="text" />
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 dark:bg-slate-800/50 dark:border-slate-700 rounded-xl p-8 text-center flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-primary mb-3">star</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Watchlist feature coming soon!</h3>
                <p className="text-slate-500 text-sm max-w-md mt-2">You will be able to search and pin your favorite live stocks here in the next update.</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Home;