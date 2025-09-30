import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getFavorites } from '../api/firestore';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';

function Profile() {
  const user = useAuth();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    // Fetch favorites only if the user is logged in
    if (user) {
      const fetchFavorites = async () => {
        setIsLoading(true);
        const movies = await getFavorites(user.uid);
        setFavoriteMovies(movies);
        setIsLoading(false);
      };
      fetchFavorites();
    } else {
      // If no user, stop loading and show an empty list
      setIsLoading(false);
      setFavoriteMovies([]);
    }
  }, [user]); // Re-run this effect when the user logs in or out

  if (isLoading) {
    return <div className="p-8 text-center text-white">Loading your profile...</div>;
  }

  // If the user is not logged in, prompt them to sign in
  if (!user) {
    return <div className="p-8 text-center text-white">Please sign in to see your favorite movies.</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 text-white">
        <h1 className="text-4xl font-bold mb-6">My Favorite Movies</h1>

        {favoriteMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favoriteMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onCardClick={() => setSelectedMovie(movie)} />
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-400">You haven't added any favorites yet. Go find some movies!</p>
        )}
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  );
}

export default Profile;