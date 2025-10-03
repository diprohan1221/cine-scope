import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Auth from './components/Auth';
import ThemeToggle from './components/ThemeToggle';
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
          className: 'dark:bg-gray-700 dark:text-white',
          style: {
            background: '#fff',
            color: '#333',
          },
        }}
      />
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen font-sans transition-colors duration-300">

        <header className="bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="text-2xl font-bold text-cyan-500 dark:text-cyan-400">
              CineScope 🎬
            </Link>
            <div className="flex items-center gap-4">
              {/* --- FIX: Updated text colors for light/dark modes --- */}
              <Link to="/profile" className="font-medium text-gray-700 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400">
                My Profile
              </Link>
              <Auth />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;