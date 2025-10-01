import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';
import AnimatedPage from '../components/AnimatedPage';
import { getGenres } from '../api/tmdb';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      const genreList = await getGenres();
      setGenres(genreList);
    };
    fetchGenres();
  }, []);

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    setSearchQuery('');
  };
  
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setSelectedGenre('');
  }

  return (
    <AnimatedPage>
      <div>
        <div className="p-4 md:px-6 flex flex-col md:flex-row gap-4 items-center">
          <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearchChange} />
          
          <div className="relative w-full md:w-auto">
            <select
              value={selectedGenre}
              onChange={handleGenreChange}
              className="appearance-none w-full md:w-auto bg-gray-100 dark:bg-gray-800 border-transparent focus:border-cyan-500 focus:ring-0 rounded-full pl-4 pr-10 py-2"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>

        <MovieList searchQuery={searchQuery} selectedGenre={selectedGenre} />
      </div>
    </AnimatedPage>
  );
}

export default HomePage;