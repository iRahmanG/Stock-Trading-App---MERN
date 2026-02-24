import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/api/market');
        setStocks(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  return (
    <div className="flex flex-col w-full bg-slate-50 dark:bg-[#0f172a] min-h-screen transition-colors duration-300">
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Sleek Search Header */}
        <div className="flex flex-col md:flex-row justify-end items-center mb-10 gap-6">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary">search</span>
            </div>
            <input 
              className="block w-full pl-12 pr-4 py-3.5 border-none rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary dark:text-white transition-all" 
              placeholder="Search Ticker (e.g. TSLA, RELIANCE.NS)..." 
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/trade/${e.target.value.toUpperCase().trim()}`)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Market Watchlist - Left Column */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">monitoring</span> Live Watchlist
              </h3>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-700">
              {loading ? (
                <div className="p-10 text-center text-slate-400 animate-pulse font-medium">Syncing live feed...</div>
              ) : (
                stocks.map((stock) => (
                  <Link to={`/trade/${stock._id}`} key={stock._id} className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-bold text-primary">{stock.symbol[0]}</div>
                      <div><p className="font-bold text-slate-900 dark:text-white text-sm">{stock.symbol}</p></div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900 dark:text-white text-sm">
                        {stock.stockExchange === 'NSE' ? '₹' : '$'}{stock.price.toLocaleString()}
                      </p>
                      <p className={`text-[11px] font-black ${stock.changePercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Top Row: Liquidity and Exposure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-center">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Available Liquidity</h4>
                <p className="text-4xl font-black text-slate-900 dark:text-white mb-4">₹{user?.balance?.toLocaleString('en-IN')}</p>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${Math.min((user?.balance / 10000) * 100, 100)}%` }}></div>
                </div>
              </div>

              <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Sector Exposure</h4>
                <div className="space-y-4">
                  {[
                    { name: 'Technology', val: '40%' },
                    { name: 'Finance', val: '30%' },
                    { name: 'Energy', val: '20%' }
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] font-bold"><span>{s.name}</span><span>{s.val}</span></div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="bg-white/40 h-full" style={{ width: s.val }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: Enlarged Global Index Performance */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Index Performance</h4>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-1 rounded-md font-bold tracking-tighter uppercase">Market Open</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'Nifty 50', val: '22,142.50', chg: '+0.45%', up: true },
                  { name: 'S&P 500', val: '5,102.35', chg: '+1.02%', up: true },
                  { name: 'Sensex', val: '73,158.24', chg: '-0.12%', up: false },
                  { name: 'Nasdaq', val: '16,041.64', chg: '+2.96%', up: true }
                ].map((idx, i) => (
                  <div 
                    key={i} 
                    className="group bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary/50 hover:shadow-md transition-all duration-300"
                  >
                    <p className="text-[11px] font-black text-slate-500 uppercase mb-3 tracking-wider group-hover:text-primary transition-colors">{idx.name}</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{idx.val}</p>
                    <div className={`flex items-center gap-1 text-sm font-black ${idx.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                      <span className="material-symbols-outlined text-sm font-black">
                        {idx.up ? 'north_east' : 'south_east'}
                      </span>
                      {idx.chg}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;