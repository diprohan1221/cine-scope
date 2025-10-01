import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`);
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getMovieDetails = async (movieId) => {
  // ... (this function is unchanged)
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for movie ${movieId}:`, error);
    return null;
  }
};

export const getMovieVideos = async (movieId) => {
  // ... (this function is unchanged)
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    const officialTrailer = response.data.results.find(
      video => video.site === 'YouTube' && video.type === 'Trailer'
    );
    return officialTrailer ? officialTrailer.key : null;
  } catch (error) {
    console.error(`Error fetching videos for movie ${movieId}:`, error);
    return null;
  }
};

// --- NEW FUNCTIONS BELOW ---

/**
 * Fetches the official list of movie genres from TMDB.
 * @returns {Array} - An array of genre objects e.g., {id: 28, name: 'Action'}
 */
export const getGenres = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    return response.data.genres; // The list is under the 'genres' key
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

/**
 * Fetches movies based on a selected genre ID.
 * @param {number} genreId - The ID of the genre to filter by.
 * @param {number} page - The page number to fetch.
 * @returns {Array} - An array of movie objects.
 */
export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error);
    return [];
  }
};