import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// 1. Import HomePage instead of MovieList
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';

import Auth from './components/Auth';

function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center border-b border-gray-700">
          <Link to="/" className="text-2xl font-bold text-cyan-400">
            CineScope 🎬
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="text-gray-300 hover:text-white">
              My Profile
            </Link>
            <Auth />
          </div>
        </div>
      </header>

      <main>
        <Routes>
          {/* 2. Use HomePage for the main route */}
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;