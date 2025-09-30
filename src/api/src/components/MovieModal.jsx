import React, { useState, useEffect } from 'react';
import { getMovieDetails, IMAGE_BASE_URL } from '../api/tmdb';

function MovieModal({ movie, onClose }) {
  // State to hold the rich details we fetch from the API
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use useEffect to fetch details when the modal opens
  useEffect(() => {
    // A function to fetch the movie details
    const fetchDetails = async () => {
      setIsLoading(true);
      const movieDetails = await getMovieDetails(movie.id);
      setDetails(movieDetails);
      setIsLoading(false);
    };

    // Only fetch if we have a movie ID
    if (movie?.id) {
      fetchDetails();
    }
  }, [movie]); // Re-run this effect if the movie prop changes

  // Handle the "click outside" to close the modal
  const handleBackdropClick = (e) => {
    if (e.target.id === 'modal-backdrop') {
      onClose();
    }
  };
  
  // Use a placeholder image if the movie has no poster
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div
      id="modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in"
    >
      <div className="bg-gray-800 text-white w-full max-w-4xl max-h-[90vh] rounded-lg overflow-hidden relative flex flex-col md:flex-row animate-slide-up">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-4 text-3xl font-bold text-white hover:text-cyan-400 z-10"
        >
          &times;
        </button>
        
        <img src={posterUrl} alt={movie.title} className="w-full md:w-1/3 object-cover" />

        <div className="p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
          
          {isLoading ? (
            <p className="text-gray-400">Loading details...</p>
          ) : details ? (
            <>
              <p className="mb-4 text-gray-400 italic">{details.tagline}</p>
              <p className="mb-4 text-gray-300">{details.overview}</p>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <span><strong>Rating:</strong> ⭐ {details.vote_average?.toFixed(1)} / 10</span>
                <span><strong>Runtime:</strong> ⏳ {details.runtime} minutes</span>
                <span><strong>Released:</strong> 🗓️ {details.release_date}</span>
                <span><strong>Status:</strong> {details.status}</span>
              </div>
              <div className="flex flex-wrap gap-2">
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
    </div>
  );
}

export default MovieModal;