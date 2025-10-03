import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// ======================= MODIFIED FUNCTION =======================
// Now uses the /discover endpoint for more powerful filtering
export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        page: page,
        include_adult: false,
        sort_by: 'popularity.desc',
        'certification_country': 'US',
        'certification.lte': 'PG-13' // Filter for PG-13 and below
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

// Search is unchanged because the API does not support rating filters on search
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}&include_adult=false`);
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

// ======================= MODIFIED FUNCTION =======================
// Also added the certification filter here for consistency
export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        page: page,
        with_genres: genreId,
        include_adult: false,
        sort_by: 'popularity.desc',
        'certification_country': 'US',
        'certification.lte': 'PG-13' // Filter for PG-13 and below
      }
    });
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error);
    return [];
  }
};

// --- No changes to the functions below ---

export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for movie ${movieId}:`, error);
    return null;
  }
};

export const getMovieVideos = async (movieId) => {
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

export const getGenres = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

export const getMovieCredits = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
    return response.data.cast;
  } catch (error) {
    console.error(`Error fetching credits for movie ${movieId}:`, error);
    return [];
  }
};