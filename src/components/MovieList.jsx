import React, { useState, useEffect, useRef } from 'react';
import { fetchPopularMovies, searchMovies, getMoviesByGenre } from '../api/tmdb';
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';
import SkeletonCard from './SkeletonCard';

function MovieList({ searchQuery, selectedGenre }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [headerText, setHeaderText] = useState('Popular Movies');
  const isNewFilter = useRef(false);

  useEffect(() => {
    isNewFilter.current = true;
    setPage(1);
    setMovies([]);
  }, [searchQuery, selectedGenre]);

  useEffect(() => {
    const getMovies = async () => {
      try {
        setIsLoading(true);
        let results;
        let header = '';
        if (searchQuery.trim() !== '') {
          header = `Results for "${searchQuery}"`;
          results = await searchMovies(searchQuery, page);
        } else if (selectedGenre) {
          header = 'Filtered by Genre';
          results = await getMoviesByGenre(selectedGenre, page);
        } else {
          header = 'Popular Movies';
          results = await fetchPopularMovies(page);
        }
        setHeaderText(header);
        if (page === 1 || isNewFilter.current) {
          setMovies(results);
          isNewFilter.current = false;
        } else {
          setMovies(prevMovies => [...prevMovies, ...results]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getMovies();
  }, [searchQuery, selectedGenre, page]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  if (isLoading && movies.length === 0) {
    return (
      <div className="p-4 md:px-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-300">{headerText}...</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => ( <SkeletonCard key={index} /> ))}
        </div>
      </div>
    );
  }

  if (error) { return <div className="p-8 text-center text-red-500">Error: {error}</div>; }

  return (
    <>
      <div className="p-4 md:px-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-300">{headerText}</h2>
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onCardClick={() => setSelectedMovie(movie)} />
            ))}
          </div>
        ) : ( !isLoading && <div className="p-8 text-center text-gray-600 dark:text-gray-400">No movies found.</div> )}

        {movies.length > 0 && (
          // --- THIS IS THE UPDATED BUTTON SECTION ---
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="group flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3 px-8 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <span>Click here to see more</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
      {selectedMovie && ( <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} /> )}
    </>
  );
}

export default MovieList;