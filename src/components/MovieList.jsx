import React, { useState, useEffect, useRef } from 'react';
import { fetchPopularMovies, searchMovies, getMoviesByGenre } from '../api/tmdb'; // 1. Import getMoviesByGenre
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';
import SkeletonCard from './SkeletonCard';

// 2. Accept selectedGenre as a prop
function MovieList({ searchQuery, selectedGenre }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [headerText, setHeaderText] = useState('Popular Movies');
  const isNewFilter = useRef(false);

  // This effect resets the page and movies when a new search or genre is selected
  useEffect(() => {
    isNewFilter.current = true;
    setPage(1);
    setMovies([]);
  }, [searchQuery, selectedGenre]);

  // This effect now handles all 3 cases: popular, search, and genre
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
          // We'll set a more descriptive header in the next step
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

  if (isLoading && page === 1) { /* ... same skeleton loading logic ... */ }
  if (error) { /* ... same error logic ... */ }

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
        ) : (
          !isLoading && <div className="p-8 text-center text-gray-600 dark:text-gray-400">No movies found.</div>
        )}
        {movies.length > 0 && (
            <div className="flex justify-center mt-8">
            <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Loading...' : 'Load More'}
            </button>
            </div>
        )}
      </div>
      {selectedMovie && ( <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} /> )}
    </>
  );
}

export default MovieList;