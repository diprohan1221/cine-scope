import React, { useEffect, useRef } from 'react';

function SearchBar({ searchQuery, setSearchQuery }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a movie..."
        // Added pr-10 to give space for the button
        className="w-full bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
      />
      {searchQuery && (
        // --- THIS BUTTON IS UPDATED ---
        <button
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
          aria-label="Clear search"
        >
          {/* Using an SVG for a perfect 'X' icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBar;