import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages & Components
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
        {/* The Navbar will automatically hide itself on the Landing page */}
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;