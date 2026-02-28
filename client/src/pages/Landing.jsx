import React, { useState, useContext } from 'react'; // Added useContext
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import context

const Landing = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use login from context
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Use the centralized login function from AuthContext
        const success = await login(email, password);
        
        if (success) {
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          
          // ROLE-BASED REDIRECTION
          if (userInfo && userInfo.isAdmin) {
            navigate('/admin'); 
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        const { data } = await axios.post('http://localhost:8000/api/users/register', {
          username,
          email,
          password,
          usertype: 'user' 
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      {/* ... (rest of the Landing UI remains unchanged) ... */}
      <header className="w-full bg-[#0a2e7a] dark:bg-slate-900 border-b border-white/10 px-6 py-4 lg:px-12">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
              <span className="material-symbols-outlined text-2xl">ssid_chart</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Trading App</h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="flex items-center justify-center rounded-lg bg-white px-5 py-2 text-sm font-bold text-[#0a2e7a] hover:bg-slate-100 transition-colors"
            >
              {isLogin ? 'Register' : 'Sign In'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 lg:p-12">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                  Experience seamless <span className="text-primary">stock market</span> trading.
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-lg">
                  Master the market without the risk. Join thousands of traders on our professional paper trading platform.
                </p>
              </div>

              <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {isLogin ? 'Welcome Back' : 'Create an Account'}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                    {isLogin ? 'Sign in to your account to continue trading.' : 'Start your paper trading journey today.'}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {!isLogin && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Username</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[20px]">person</span>
                        </div>
                        <input 
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="block w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary pl-10 py-3 text-sm transition-all shadow-sm" 
                          placeholder="trader_john" 
                          type="text" 
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                      </div>
                      <input 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary pl-10 py-3 text-sm transition-all shadow-sm" 
                        placeholder="name@company.com" 
                        type="email" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Password</label>
                      {isLogin && <a className="text-xs font-semibold text-primary hover:text-blue-700 transition-colors" href="#">Forgot Password?</a>}
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                      </div>
                      <input 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary pl-10 py-3 text-sm transition-all shadow-sm" 
                        placeholder="••••••••" 
                        type="password" 
                      />
                    </div>
                  </div>
                  
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="mt-2 flex w-full items-center justify-center rounded-lg bg-primary py-3 px-4 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-70"
                  >
                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError(''); 
                      }}
                      className="font-bold text-primary hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                    >
                      {isLogin ? 'Register for free' : 'Sign In here'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 h-full flex flex-col justify-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;