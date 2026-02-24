import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Trade = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext); // Added setUser to update balance
  const chartContainerRef = useRef(null); // Reference for the TradingView chart
  
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [orderType, setOrderType] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [orderStatus, setOrderStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Fetch the specific stock data based on the URL
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/api/stocks');
        const foundStock = data.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
        setStock(foundStock);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock:", error);
        setLoading(false);
      }
    };
    fetchStockData();
  }, [symbol]);

  // 2. Load the TradingView Widget once we have the stock data
  useEffect(() => {
    if (!stock || !chartContainerRef.current) return;

    // Clear the container first to prevent duplicate charts if you switch pages
    chartContainerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    
    // Formatting the symbol for TradingView (e.g., NASDAQ:AAPL or NSE:RELIANCE)
    const exchangePrefix = stock.stockExchange === 'NSE' || stock.stockExchange === 'BSE' ? 'BSE' : 'NASDAQ';
    
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `${exchangePrefix}:${stock.symbol}`,
      interval: "D",
      timezone: "Asia/Kolkata", // Indian Standard Time
      theme: "light",
      style: "1",
      locale: "in",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: true,
      save_image: false,
      support_host: "https://www.tradingview.com"
    });

    chartContainerRef.current.appendChild(script);
  }, [stock]);

  // Handle Order Submission
  const handleOrder = async () => {
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }
    
    setIsProcessing(true);
    setOrderStatus('');

    const orderData = {
      user: user.email,
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      count: Number(quantity),
      totalPrice: stock.price * quantity,
      stockType: 'delivery',
      orderType: orderType,
      orderStatus: 'Completed'
    };

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      const { data } = await axios.post('http://localhost:8000/api/orders', orderData, config);
      
      // Update global AuthContext and LocalStorage so the Navbar balance drops instantly!
      if (data.newBalance !== undefined) {
        const updatedUser = { ...user, balance: data.newBalance };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      }

      setOrderStatus(`Successfully placed ${orderType} order for ${quantity} shares of ${stock.symbol}!`);
      setQuantity(1);
      
      setTimeout(() => navigate('/portfolio'), 2000);

    } catch (error) {
      setOrderStatus(error.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading stock data...</div>;
  if (!stock) return <div className="p-12 text-center text-rose-500 font-bold">Stock not found!</div>;

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
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">₹{stock.price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
            <p className="text-emerald-600 font-bold flex items-center md:justify-end gap-1 mt-1">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
              Live Market
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* TradingView Chart Area */}
        <section className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-[450px] flex flex-col relative overflow-hidden">
            {/* The widget injects itself into this ref div */}
            <div className="tradingview-widget-container h-full w-full" ref={chartContainerRef}>
              <div className="tradingview-widget-container__widget h-full w-full"></div>
            </div>
          </div>
        </section>

        {/* Order Entry Box */}
        <aside className="w-full lg:w-1/3">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6">Place Order</h3>
            
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-6">
              <button 
                onClick={() => setOrderType('buy')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${orderType === 'buy' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Buy
              </button>
              <button 
                onClick={() => setOrderType('sell')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${orderType === 'sell' ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Sell
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Quantity (Shares)</label>
                <input 
                  type="number" 
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-500">Estimated Cost</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    ₹{(stock.price * quantity).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Available Funds</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    ₹{user?.balance?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </span>
                </div>
              </div>

              {/* Status Message */}
              {orderStatus && (
                <div className={`p-3 rounded-lg text-sm font-bold text-center ${orderStatus.includes('failed') || orderStatus.includes('Insufficient') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {orderStatus}
                </div>
              )}

              <button 
                onClick={handleOrder}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transition-all mt-2 disabled:opacity-50 ${orderType === 'buy' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'}`}
              >
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