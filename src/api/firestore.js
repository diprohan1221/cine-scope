import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, getDocs } from 'firebase/firestore';

/**
 * Adds a movie to a user's favorites list in Firestore.
 * @param {string} userId - The ID of the user.
 * @param {object} movie - The movie object from TMDB.
 */
export const addFavorite = async (userId, movie) => {
  const favoriteRef = doc(db, 'users', userId, 'favorites', String(movie.id));
  await setDoc(favoriteRef, {
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average // This line is now included
  });
};

/**
 * Removes a movie from a user's favorites list.
 * @param {string} userId - The ID of the user.
 * @param {string} movieId - The ID of the movie to remove.
 */
export const removeFavorite = async (userId, movieId) => {
  const favoriteRef = doc(db, 'users', userId, 'favorites', String(movieId));
  await deleteDoc(favoriteRef);
};

/**
 * Checks if a specific movie is in a user's favorites.
 * @param {string} userId - The ID of the user.
 * @param {string} movieId - The ID of the movie to check.
 * @returns {boolean} - True if the movie is a favorite, false otherwise.
 */
export const isFavorite = async (userId, movieId) => {
  const favoriteRef = doc(db, 'users', userId, 'favorites', String(movieId));
  const docSnap = await getDoc(favoriteRef);
  return docSnap.exists();
};

/**
 * Retrieves all favorite movies for a given user.
 * @param {string} userId - The ID of the user.
 * @returns {Array} - An array of favorite movie objects.
 */
export const getFavorites = async (userId) => {
  const favoritesCollectionRef = collection(db, 'users', userId, 'favorites');
  const querySnapshot = await getDocs(favoritesCollectionRef);

  const favorites = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return favorites;
};