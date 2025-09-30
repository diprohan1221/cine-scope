import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';
import AnimatedPage from '../components/AnimatedPage'; // 1. Import the wrapper

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    // 2. Wrap the page's content with AnimatedPage
    <AnimatedPage>
      <div>
        <div className="p-4 md:px-6">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <MovieList searchQuery={searchQuery} />
      </div>
    </AnimatedPage>
  );
}

export default HomePage;