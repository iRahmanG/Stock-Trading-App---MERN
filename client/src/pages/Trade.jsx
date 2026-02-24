import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Trade = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Grab the logged-in user and their token
  
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [orderType, setOrderType] = useState('buy'); // 'buy' or 'sell'
  const [quantity, setQuantity] = useState(1);
  const [orderStatus, setOrderStatus] = useState(''); // To show success/error messages
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch the specific stock data based on the URL
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/api/stocks');
        // Find the specific stock from the database that matches the URL symbol
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

  // Handle Order Submission
  const handleOrder = async () => {
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }
    
    setIsProcessing(true);
    setOrderStatus('');

    const orderData = {
      user: user.email, // Tracking by email
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      count: Number(quantity),
      totalPrice: stock.price * quantity,
      stockType: 'delivery', // Defaulting to delivery for now
      orderType: orderType,
      orderStatus: 'Completed'
    };

    try {
      // Send the secure POST request with the JWT token
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      await axios.post('http://localhost:8000/api/orders', orderData, config);
      
      setOrderStatus(`Successfully placed ${orderType} order for ${quantity} shares of ${stock.symbol}!`);
      setQuantity(1); // Reset the form
      
      // Optional: Redirect back to portfolio after a short delay
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
        {/* Chart Area */}
        <section className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 h-[400px] flex flex-col relative overflow-hidden">
            <div className="flex-grow flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <p className="text-slate-400 font-medium flex items-center gap-2">
                <span className="material-symbols-outlined">monitoring</span>
                Live Chart Data for {stock.symbol}
              </p>
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
                    ₹{user?.balance?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Status Message */}
              {orderStatus && (
                <div className={`p-3 rounded-lg text-sm font-bold text-center ${orderStatus.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
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