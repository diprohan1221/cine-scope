import React, { useState, useEffect } from 'react';
import { fetchPopularMovies, searchMovies } from '../api/tmdb';
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';
import SkeletonCard from './SkeletonCard'; // 1. Import the new component

function MovieList({ searchQuery }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [headerText, setHeaderText] = useState('Popular Movies');

  useEffect(() => {
    const getMovies = async () => {
      try {
        setIsLoading(true);
        let results;
        if (searchQuery.trim() === '') {
          setHeaderText('Popular Movies');
          results = await fetchPopularMovies();
        } else {
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
    const timerId = setTimeout(getMovies, 300);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // 2. THIS IS THE NEW LOADING STATE LOGIC
  if (isLoading) {
    return (
      <div className="p-4 md:px-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-300">
          {headerText}...
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Create an array of 10 items to map over for the skeletons */}
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

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