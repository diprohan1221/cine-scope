import React, { useState, useEffect } from 'react';
import { getMovieDetails, IMAGE_BASE_URL, getMovieVideos } from '../api/tmdb';
import { useAuth } from '../hooks/useAuth';
import { addFavorite, removeFavorite, isFavorite } from '../api/firestore';

function MovieModal({ movie, onClose }) {
  const user = useAuth();
  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!movie?.id) return;
      setIsLoading(true);
      const [movieDetails, movieTrailerKey, favoriteStatus] = await Promise.all([
        getMovieDetails(movie.id),
        getMovieVideos(movie.id),
        user ? isFavorite(user.uid, movie.id) : Promise.resolve(false)
      ]);
      setDetails(movieDetails);
      setTrailerKey(movieTrailerKey);
      setIsFavorited(favoriteStatus);
      setIsLoading(false);
    };
    fetchAllData();
  }, [movie, user]);

  const handleFavoriteClick = async () => {
    if (!user) { alert("Please sign in to add favorites!"); return; }
    if (isFavorited) {
      await removeFavorite(user.uid, movie.id);
      setIsFavorited(false);
    } else {
      await addFavorite(user.uid, movie);
      setIsFavorited(true);
    }
  };

  const handleBackdropClick = (e) => { if (e.target.id === 'modal-backdrop') { onClose(); } };

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image'; // Slightly smaller placeholder

  return (
    <div id="modal-backdrop" onClick={handleBackdropClick} className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 text-white w-full max-w-4xl max-h-[90vh] rounded-lg overflow-hidden relative flex flex-col animate-slide-up">
        <button onClick={onClose} className="absolute top-2 right-4 text-3xl font-bold text-white hover:text-cyan-400 z-20">&times;</button>

        <div className="p-6 overflow-y-auto"> {/* This will be the main scrollable content area */}
          {/* LAYOUT: Poster on left, Details on right (for larger screens) */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Movie Poster */}
            <div className="flex-shrink-0 mx-auto md:mx-0 w-2/3 md:w-1/3"> {/* Adjust width for responsiveness */}
              <img src={posterUrl} alt={movie.title} className="w-full h-auto rounded-lg shadow-lg" />
            </div>

            {/* Movie Details (Text) */}
            <div className="flex-grow">
              <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
              {user && (
                <button onClick={handleFavoriteClick} className={`mb-4 px-4 py-2 rounded-lg font-semibold transition-colors ${isFavorited ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-500 hover:bg-cyan-600'}`}>
                  {isFavorited ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                </button>
              )}

              {isLoading ? (
                <p className="text-gray-400">Loading details...</p>
              ) : details ? (
                <>
                  <p className="mb-4 text-gray-400 italic">{details.tagline}</p>
                  <p className="mb-4 text-gray-300">{details.overview}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm">
                    <span><strong>Rating:</strong> ⭐ {details.vote_average?.toFixed(1)} / 10</span>
                    <span><strong>Runtime:</strong> ⏳ {details.runtime} minutes</span>
                    <span><strong>Released:</strong> 🗓️ {details.release_date}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <strong>Genres:</strong>
                    {details.genres?.map(genre => (
                      <span key={genre.id} className="bg-gray-700 rounded-full px-3 py-1 text-sm">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-red-500">Could not load movie details.</p>
              )}
            </div>
          </div>

          {/* TRAILER SECTION (Full width at the bottom, no autoplay) */}
          {trailerKey && (
            <div className="mt-6"> {/* Add some top margin to separate from details */}
              <h3 className="text-xl font-semibold mb-3">Trailer</h3>
              <div className="relative w-full aspect-video bg-black flex-shrink-0 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  // Removed autoplay=1
                  src={`https://www.youtube.com/embed/${trailerKey}?mute=1&modestbranding=1&rel=0`} 
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieModal;