// src/api/tmdb.js
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

async function fetchFromTMDB(path, params = {}) {
  if (!API_KEY) throw new Error('Missing TMDB API key. Check .env.local and restart dev server.');
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.href);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`TMDB API error ${res.status}: ${text}`);
  }
  return res.json();
}

export const fetchPopularMovies = (page = 1) =>
  fetchFromTMDB('/movie/popular', { language: 'en-US', page });

export const searchMovies = (query, page = 1) =>
  fetchFromTMDB('/search/movie', { query, page, language: 'en-US' });

export const getMovieDetails = (id) =>
  fetchFromTMDB(`/movie/${id}`, { language: 'en-US' });
