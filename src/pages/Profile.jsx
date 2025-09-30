import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getFavorites } from '../api/firestore';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import AnimatedPage from '../components/AnimatedPage'; // 1. Import the wrapper

function Profile() {
  const user = useAuth();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        setIsLoading(true);
        const movies = await getFavorites(user.uid);
        setFavoriteMovies(movies);
        setIsLoading(false);
      };
      fetchFavorites();
    } else {
      setIsLoading(false);
      setFavoriteMovies([]);
    }
  }, [user]);

  return (
    // 2. Wrap the page's content with AnimatedPage
    <AnimatedPage>
      <>
        <div className="container mx-auto px-4 py-8 text-white">
          <h1 className="text-4xl font-bold mb-6">My Favorite Movies</h1>
          {isLoading ? ( <div className="text-center">Loading your profile...</div> ) :
           !user ? ( <div className="text-center">Please sign in to see your favorite movies.</div> ) :
           favoriteMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {favoriteMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onCardClick={() => setSelectedMovie(movie)} />
              ))}
            </div>
          ) : ( <p className="text-lg text-gray-400">You haven't added any favorites yet.</p> )}
        </div>

        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        )}
      </>
    </AnimatedPage>
  );
}

export default Profile;