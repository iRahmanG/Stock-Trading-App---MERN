import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Trade from './pages/Trade';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard'; // IMPORT ADMIN PANEL

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
          <Navbar />
          
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/trade/:symbol" element={<Trade />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} /> {/* ADMIN ROUTE */}
          </Routes>

          <ToastContainer 
            position="top-center" 
            autoClose={2500} 
            hideProgressBar={false}
            newestOnTop={true} 
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;