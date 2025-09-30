import React, { useEffect, useRef } from 'react';

// This is now a "controlled component." Its state is managed by its parent, App.jsx.
function SearchBar({ searchQuery, setSearchQuery }) {
  const inputRef = useRef(null);

  // Keyboard shortcut effect ('/')
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
    <div className="relative w-full max-w-xs">
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a movie..."
        className="bg-gray-800 text-white rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;