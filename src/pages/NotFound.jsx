import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';

function NotFound() {
  return (
    <AnimatedPage>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-8xl font-bold text-cyan-400 dark:text-cyan-500 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </AnimatedPage>
  );
}

export default NotFound;