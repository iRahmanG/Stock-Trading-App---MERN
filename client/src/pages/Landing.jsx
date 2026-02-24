import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="w-full bg-[#0a2e7a] dark:bg-slate-900 border-b border-white/10 px-6 py-4 lg:px-12">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
              <span className="material-symbols-outlined text-2xl">ssid_chart</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Trading App</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium text-white/80 hover:text-white transition-colors" href="#">Features</a>
            <a className="text-sm font-medium text-white/80 hover:text-white transition-colors" href="#">Market Data</a>
            <a className="text-sm font-medium text-white/80 hover:text-white transition-colors" href="#">About</a>
          </nav>
          <div className="flex items-center gap-4">
            <a className="hidden sm:block text-sm font-medium text-white/80 hover:text-white transition-colors" href="#">Support</a>
            <button className="flex items-center justify-center rounded-lg bg-white px-5 py-2 text-sm font-bold text-[#0a2e7a] hover:bg-slate-100 transition-colors">
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 lg:p-12">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Hero Text & Login */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                  Experience seamless <span className="text-primary">stock market</span> trading.
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-lg">
                  Master the market without the risk. Join thousands of traders on our professional paper trading platform.
                </p>
              </div>

              {/* Login Card */}
              <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Sign in to your account to continue trading.</p>
                </div>
                <form className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-200" htmlFor="email">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                      </div>
                      <input className="block w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary pl-10 py-3 text-sm transition-all shadow-sm" id="email" placeholder="name@company.com" type="email" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-900 dark:text-slate-200" htmlFor="password">Password</label>
                      <a className="text-xs font-semibold text-primary hover:text-blue-700 dark:hover:text-blue-400" href="#">Forgot Password?</a>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                      </div>
                      <input className="block w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary pl-10 py-3 text-sm transition-all shadow-sm" id="password" placeholder="••••••••" type="password" />
                    </div>
                  </div>
                  <button className="mt-2 flex w-full items-center justify-center rounded-lg bg-primary py-3 px-4 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all" type="button">
                    Sign In
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account? <a className="font-bold text-primary hover:text-blue-700 dark:hover:text-blue-400 transition-colors" href="#">Register for free</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Illustration */}
            <div className="lg:col-span-7 h-full flex flex-col justify-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating Stat Card 1 */}
                <div className="absolute top-12 -left-4 lg:left-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-600 animate-pulse hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <span className="material-symbols-outlined">trending_up</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Portfolio Growth</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">+24.5%</p>
                    </div>
                  </div>
                </div>

                {/* Floating Stat Card 2 */}
                <div className="absolute bottom-12 right-4 lg:right-12 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-600 hidden sm:block">
                  <div className="flex items-center gap-4 min-w-[180px]">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">AAPL</p>
                        <span className="text-xs font-medium text-green-500">+1.2%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[70%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-6 text-center text-sm text-slate-400">
        <p>© 2026 Trading App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;