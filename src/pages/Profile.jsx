import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getFavorites } from '../api/firestore';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import AnimatedPage from '../components/AnimatedPage';
import { FiRefreshCw } from 'react-icons/fi';

function Profile() {
  const user = useAuth();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // --- THIS FUNCTION HAS BEEN UPDATED WITH TRY/CATCH ---
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      setFavoriteMovies([]);
      return;
    }

    setIsLoading(true);
    try {
      const movies = await getFavorites(user.uid);
      // Add a fallback to ensure we always have an array
      setFavoriteMovies(movies || []);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      // On error, reset to an empty array to prevent crash
      setFavoriteMovies([]);
    } finally {
      // This block runs whether it succeeds or fails
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <AnimatedPage>
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">My Favorite Movies</h1>
            {user && (
              <button
                onClick={fetchFavorites}
                disabled={isLoading}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Refresh favorites"
              >
                <FiRefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>

          {isLoading && favoriteMovies.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading your favorites...</div>
          ) : !user ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Please sign in to see your favorite movies.</div>
          ) : (favoriteMovies && favoriteMovies.length > 0) ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {favoriteMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onCardClick={() => setSelectedMovie(movie)} />
              ))}
            </div>
          ) : (
            <p className="text-lg text-gray-600 dark:text-gray-400">You haven't added any favorites yet.</p>
          )}
        </div>

        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        )}
      </>
    </AnimatedPage>
  );
}

export default Profile;