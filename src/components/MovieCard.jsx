import React from 'react';
import { IMAGE_BASE_URL } from '../api/tmdb';

function MovieCard({ movie, onCardClick }) {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    // --- CHANGES ARE ON THIS LINE ---
    <div 
      onClick={onCardClick} 
      className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      <img src={posterUrl} alt={movie.title} className="w-full h-auto" />
      <div className="p-3">
        {/* --- AND THESE LINES --- */}
        <h3 className="text-gray-900 dark:text-white font-semibold truncate">{movie.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
      </div>
    </div>
  );
}

export default MovieCard;