import { db } from '../firebase';
// Import the 'serverTimestamp' function
import { doc, setDoc, deleteDoc, getDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';

// ... (your existing functions: addFavorite, removeFavorite, isFavorite, getFavorites) ...
export const addFavorite = async (userId, movie) => { /* ... */ };
export const removeFavorite = async (userId, movieId) => { /* ... */ };
export const isFavorite = async (userId, movieId) => { /* ... */ };
export const getFavorites = async (userId) => { /* ... */ };


// --- NEW FUNCTIONS FOR REVIEWS ---

/**
 * Adds or updates a user's review for a specific movie.
 * @param {string} movieId - The ID of the movie being reviewed.
 * @param {object} user - The current user object from Firebase auth.
 * @param {number} rating - The star rating (1-5).
 * @param {string} text - The review text.
 */
export const addOrUpdateReview = async (movieId, user, rating, text) => {
  // The review is stored using the user's ID as the document key.
  // This ensures a user can only have one review per movie.
  const reviewRef = doc(db, 'movies', String(movieId), 'reviews', user.uid);
  await setDoc(reviewRef, {
    authorName: user.displayName,
    authorImage: user.photoURL,
    rating: rating,
    text: text,
    createdAt: serverTimestamp(), // Use the server's time for consistency
  });
};

/**
 * Fetches all reviews for a given movie.
 * @param {string} movieId - The ID of the movie.
 * @returns {Array} - An array of review objects.
 */
export const getReviewsForMovie = async (movieId) => {
  const reviewsCollectionRef = collection(db, 'movies', String(movieId), 'reviews');
  const querySnapshot = await getDocs(reviewsCollectionRef);

  const reviews = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return reviews;
};