// src/api/tmdb.js

import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// NEW: Add the base URL for images
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const fetchPopularMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

// NEW: Add the function to get details for one movie
export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    // This endpoint returns the full movie object directly
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for movie ${movieId}:`, error);
    // Return null or throw the error, depending on how you want to handle it
    return null;
  }
};
// NEW: Add this function to get movie videos (trailers)
export const getMovieVideos = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    // Find the official trailer on YouTube from the results
    const officialTrailer = response.data.results.find(
      video => video.site === 'YouTube' && video.type === 'Trailer'
    );
    // Return the YouTube key if a trailer is found
    return officialTrailer ? officialTrailer.key : null;
  } catch (error) {
    console.error(`Error fetching videos for movie ${movieId}:`, error);
    return null;
  }
};