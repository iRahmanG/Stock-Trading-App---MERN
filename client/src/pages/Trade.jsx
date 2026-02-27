import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify'; // Import toast

const Trade = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext); 
  const chartContainerRef = useRef(null); 
  
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Fetch live stock data
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:8000/api/market/${symbol}`);
        setStock(data);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching live market data."); // Notify error
        setLoading(false);
      }
    };
    fetchStockData();
  }, [symbol]);

  // 2. Enhanced TradingView Widget Loader
  useEffect(() => {
    if (!stock || !chartContainerRef.current) return;
    chartContainerRef.current.innerHTML = '';
    
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    
    const exchangeMap = {
      'NSE': 'NSE',
      'BSE': 'BSE',
      'NMS': 'NASDAQ',
      'NYE': 'NYSE'
    };
    
    const tvExchange = exchangeMap[stock.stockExchange] || 'NASDAQ';
    
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `${tvExchange}:${stock.symbol}`,
      interval: "D",
      timezone: "Asia/Kolkata", 
      theme: document.documentElement.classList.contains('dark') ? "dark" : "light",
      style: "1",
      locale: "in",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      container_id: "tradingview_chart",
      support_host: "https://www.tradingview.com"
    });
    
    chartContainerRef.current.appendChild(script);
  }, [stock]);

  const handleOrder = async () => {
    if (!user) return toast.info("Please log in to place an order."); // Use toast instead of alert

    // --- WHOLE NUMBER VALIDATION (Maintained) ---
    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return toast.warning("Whole shares only. Fractional trading is not supported."); // Use toast warning
    }

    setIsProcessing(true);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const orderData = {
        user: user.email,
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        count: parsedQuantity, // Sending whole number
        totalPrice: stock.price * parsedQuantity,
        stockType: 'delivery',
        orderType: orderType,
        orderStatus: 'Completed',
        stockExchange: stock.stockExchange
      };

      const { data } = await axios.post('http://localhost:8000/api/orders', orderData, config);
      
      if (data.newBalance !== undefined) {
        const updatedUser = { ...user, balance: data.newBalance };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      }

      toast.success(`Successfully placed ${orderType} order for ${parsedQuantity} shares!`); // Use toast success
      setTimeout(() => navigate('/portfolio'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed.'); // Use toast error
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading Live Market Data...</div>;
  if (!stock) return <div className="p-12 text-center text-rose-500 font-bold">Stock Not Found</div>;

  return (
    <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <Link to="/dashboard" className="text-primary hover:text-blue-700 text-sm font-bold flex items-center gap-1 w-fit mb-4 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{stock.symbol}</h1>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wide">{stock.stockExchange}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{stock.name}</p>
          </div>
          <div className="text-left md:text-right">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {stock.stockExchange === 'NSE' ? '₹' : '$'}{stock.price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </h2>
            <p className={`font-bold flex items-center md:justify-end gap-1 mt-1 ${stock.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              <span className="material-symbols-outlined text-[18px]">
                {stock.changePercent >= 0 ? 'trending_up' : 'trending_down'}
              </span>
              Live Market ({stock.changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <section className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-[550px] flex flex-col relative overflow-hidden">
            <div className="tradingview-widget-container h-full w-full" ref={chartContainerRef}>
              <div id="tradingview_chart" className="h-full w-full"></div>
            </div>
          </div>
        </section>

        <aside className="w-full lg:w-1/3">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6">Place Order</h3>
            
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-6">
              <button onClick={() => setOrderType('buy')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${orderType === 'buy' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Buy</button>
              <button onClick={() => setOrderType('sell')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${orderType === 'sell' ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm' : 'text-slate-500'}`}>Sell</button>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Quantity (Whole Shares)</label>
                <input 
                  type="number" 
                  min="1" 
                  step="1" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-primary" 
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                <div className="flex justify-between items-center mb-2 text-sm font-medium text-slate-500">Estimated Total <span className="text-lg font-bold text-slate-900 dark:text-white">{stock.stockExchange === 'NSE' ? '₹' : '$'}{(stock.price * Number(quantity)).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                <div className="flex justify-between items-center text-sm font-medium text-slate-500">Available Funds <span className="font-bold text-slate-900 dark:text-white">₹{user?.balance?.toLocaleString('en-IN')}</span></div>
              </div>

              {/* Status text removed in favor of professional toast popups */}

              <button onClick={handleOrder} disabled={isProcessing} className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transition-all mt-2 disabled:opacity-50 ${orderType === 'buy' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'}`}>
                {isProcessing ? 'Processing...' : `${orderType === 'buy' ? 'Buy' : 'Sell'} ${stock.symbol}`}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Trade;