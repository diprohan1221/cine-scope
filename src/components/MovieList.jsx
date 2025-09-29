// src/components/MovieList.jsx
import React, { useEffect, useRef, useState } from 'react';
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';
import { fetchPopularMovies, searchMovies } from '../api/tmdb';

export default function MovieList({
  compact = false,
  queryProp = undefined,
  onQueryChange = undefined,
}) {
  // Controlled vs uncontrolled search value
  const [internalQuery, setInternalQuery] = useState('');
  const query = queryProp !== undefined ? queryProp : internalQuery;
  const setQuery = onQueryChange || setInternalQuery;

  // data & ui state (only used in non-compact mode)
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [visible, setVisible] = useState(false); // for entrance animation
  const [searching, setSearching] = useState(false);

  const debounceRef = useRef(null);
  const searchInputRef = useRef(null);

  // "/" shortcut focuses the search input (works in both compact and full)
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== '/') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const active = document.activeElement;
      const tag = active && active.tagName && active.tagName.toLowerCase();
      if (active?.isContentEditable || tag === 'input' || tag === 'textarea') return;
      e.preventDefault();
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // If compact mode — render only the small search input (no network calls)
  if (compact) {
    return (
      <div className="relative">
        <label htmlFor="movie-search-compact" className="sr-only">Search movies</label>
        <input
          id="movie-search-compact"
          ref={searchInputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies (press / to focus)"
          className="w-full sm:w-96 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm"
          aria-label="Search movies"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 hover:bg-gray-100"
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  // ---------- Non-compact mode: full grid with fetching/search ----------
  // Effect: fetch popular when query is empty
  useEffect(() => {
    let mounted = true;

    const loadPopular = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPopularMovies();
        if (!mounted) return;
        setMovies(data.results || []);
        setLoading(false);
        setTimeout(() => mounted && setVisible(true), 30);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Failed to load popular movies.');
        setLoading(false);
      }
    };

    if (!query) {
      loadPopular();
    }

    return () => {
      mounted = false;
    };
  }, [query]);

  // Effect: debounced search when query has value
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query) {
      setSearching(false);
      return; // popular effect will run
    }

    setSearching(true);
    setLoading(true);
    setError(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchMovies(query);
        setMovies(data.results || []);
        setLoading(false);
        setSearching(false);
        setTimeout(() => setVisible(true), 30);
      } catch (err) {
        setError(err.message || 'Search failed.');
        setLoading(false);
        setSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const onClear = () => {
    setQuery('');
    setError(null);
    searchInputRef.current?.focus();
  };

  return (
    <section className="p-6 max-w-7xl mx-auto" aria-labelledby="movies-heading">
      <h2 id="movies-heading" className="sr-only">Movies</h2>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <label htmlFor="movie-search" className="sr-only">Search movies</label>
          <div className="relative">
            <input
              id="movie-search"
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies (press / to focus)"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              aria-label="Search movies"
            />
            {query && (
              <button
                aria-label="Clear search"
                onClick={onClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 hover:bg-gray-100"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="w-full sm:w-auto text-sm text-gray-600">
          {searching ? (
            <span>Searching for “{query}”…</span>
          ) : query ? (
            <span>Results for “{query}”</span>
          ) : (
            <span>Popular movies</span>
          )}
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-72 w-full mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center text-red-600 my-6">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* No results */}
      {!loading && !error && movies.length === 0 && (
        <div className="p-6 max-w-3xl mx-auto text-center">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">No movies found</h3>
            <p className="text-sm text-gray-600 mb-4">
              We couldn't find any movies matching <span className="font-medium text-gray-800">"{query}"</span>.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setQuery('')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Back to Popular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className={`transform transition duration-500 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <div onClick={() => setSelectedId(movie.id)}>
                <MovieCard movie={movie} highlight={query} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedId && (
        <MovieModal movieId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </section>
  );
}
