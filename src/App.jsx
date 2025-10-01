import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import Auth from './components/Auth';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();

  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
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
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;