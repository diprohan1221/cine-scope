import React, { useState, useEffect } from 'react';
// 1. Import searchMovies again
import { fetchPopularMovies, searchMovies } from '../api/tmdb';
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';

// 2. Accept searchQuery as a prop
function MovieList({ searchQuery }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [headerText, setHeaderText] = useState('Popular Movies');

  // 3. This useEffect now handles both popular movies AND searching
  useEffect(() => {
    const getMovies = async () => {
      try {
        setIsLoading(true);
        let results;
        // If there is no search query, get popular movies
        if (searchQuery.trim() === '') {
          setHeaderText('Popular Movies');
          results = await fetchPopularMovies();
        } else {
          // Otherwise, search for movies
          setHeaderText(`Results for "${searchQuery}"`);
          results = await searchMovies(searchQuery);
        }
        setMovies(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a debounce timer to avoid too many API calls
    const timerId = setTimeout(getMovies, 300);

    return () => clearTimeout(timerId);

  }, [searchQuery]); // 4. The effect re-runs whenever searchQuery changes

  if (isLoading) { return <div className="p-8 text-center text-white">Loading movies...</div>; }
  if (error) { return <div className="p-8 text-center text-red-500">Error: {error}</div>; }

  return (
    <>
      <div className="p-4 md:px-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-300">{headerText}</h2>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onCardClick={() => setSelectedMovie(movie)} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-white">No movies found.</div>
        )}
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  );
}

export default MovieList;