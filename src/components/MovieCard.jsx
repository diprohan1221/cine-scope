// src/components/MovieCard.jsx
import React from 'react';

function highlightText(text = '', query = '') {
  if (!query) return text;
  const lcText = text.toLowerCase();
  const lcQuery = query.toLowerCase();
  const parts = [];
  let lastIndex = 0;
  let idx = lcText.indexOf(lcQuery, lastIndex);

  while (idx !== -1) {
    // push preceding text
    if (idx > lastIndex) parts.push(text.slice(lastIndex, idx));
    // push highlighted part
    parts.push(
      <mark key={idx} className="bg-yellow-200 text-yellow-900 font-semibold">
        {text.slice(idx, idx + query.length)}
      </mark>
    );
    lastIndex = idx + query.length;
    idx = lcText.indexOf(lcQuery, lastIndex);
  }

  // push remaining text
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function MovieCard({ movie, highlight = '' }) {
  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const title = movie.title || 'Untitled';
  const rating = (movie.vote_average !== undefined && movie.vote_average !== null)
    ? movie.vote_average
    : 'N/A';

  return (
    <article
      className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
      aria-label={title}
      role="article"
    >
      <img
        src={posterUrl}
        alt={title}
        loading="lazy"
        className="w-full h-72 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {highlight ? highlightText(title, highlight) : title}
        </h2>
        <p className="text-sm text-gray-600 mt-1">⭐ <span className="font-medium">{rating}</span></p>
      </div>
    </article>
  );
}
