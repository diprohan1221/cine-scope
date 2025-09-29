// src/components/MovieModal.jsx
import React, { useEffect, useState } from 'react';
import { getMovieDetails, IMAGE_BASE } from '../api/tmdb';

export default function MovieModal({ movieId, onClose }) {
  const [details, setDetails] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // get movie details
        const movie = await getMovieDetails(movieId);

        // fetch videos (trailers)
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
        );
        const videos = await res.json();

        // prefer official YouTube trailer
        const yt = (videos.results || []).find(
          v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        );

        if (mounted) {
          setDetails(movie);
          setVideoKey(yt ? yt.key : null);
          setLoading(false);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Failed to load details');
        setLoading(false);
      }
    };

    load();

    // close on ESC
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);

    return () => {
      mounted = false;
      window.removeEventListener('keydown', onKey);
    };
  }, [movieId, onClose]);

  if (!movieId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg max-w-4xl w-full overflow-hidden shadow-2xl">
        <div className="flex justify-between items-start p-4 border-b">
          <div>
            <h3 className="text-xl font-bold">
              {details ? details.title : 'Loading...'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {details ? `${details.release_date?.slice(0,4) || ''} • ${details.runtime || ''} min` : ''}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-800 ml-4"
          >
            ✕
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            {loading ? (
              <div className="bg-gray-200 h-80 w-full" />
            ) : details?.poster_path ? (
              <img
                src={`${IMAGE_BASE}${details.poster_path}`}
                alt={details.title}
                className="w-full h-80 object-cover rounded"
              />
            ) : (
              <div className="bg-gray-200 h-80 w-full flex items-center justify-center">No image</div>
            )}
          </div>

          <div className="md:col-span-2">
            {loading ? (
              <p className="text-gray-500">Loading details…</p>
            ) : error ? (
              <p className="text-red-600">Error: {error}</p>
            ) : (
              <>
                <p className="text-gray-700 mb-3">{details.overview}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {details.genres?.map(g => (
                    <span key={g.id} className="text-xs bg-gray-100 px-2 py-1 rounded">{g.name}</span>
                  ))}
                </div>

                <div className="mb-4">
                  <strong className="mr-2">Rating:</strong> <span>{details.vote_average}</span>
                  <span className="mx-3">•</span>
                  <strong className="mr-2">Votes:</strong> <span>{details.vote_count}</span>
                </div>

                {videoKey ? (
                  <div className="aspect-video w-full">
                    <iframe
                      title="Trailer"
                      src={`https://www.youtube.com/embed/${videoKey}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-64"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Trailer not available.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
