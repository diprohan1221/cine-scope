import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';

function HomePage() {
  // This page component will now manage the search query state
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      {/* Container for the search bar */}
      <div className="p-4 md:p-6">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* MovieList will now receive the search query as a prop */}
      <MovieList searchQuery={searchQuery} />
    </div>
  );
}

export default HomePage;