import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';

// ======================= CORRECTED FUNCTION =======================
export const addFavorite = async (userId, movie) => {
  const favoriteRef = doc(db, 'users', userId, 'favorites', String(movie.id));
  // FIX: We now only save the title and poster_path, which we know are available.
  await setDoc(favoriteRef, {
    title: movie.title,
    poster_path: movie.poster_path,
  });
};
// ================================================================

export const removeFavorite = async (userId, movieId) => {
  const favoriteRef = doc(db, 'users', userId, 'favorites', String(movieId));
  await deleteDoc(favoriteRef);
};

export const isFavorite = async (userId, movieId) => {
  const favoriteRef = doc(db, 'users', userId, 'favorites', String(movieId));
  const docSnap = await getDoc(favoriteRef);
  return docSnap.exists();
};

export const getFavorites = async (userId) => {
  const favoritesCollectionRef = collection(db, 'users', userId, 'favorites');
  const querySnapshot = await getDocs(favoritesCollectionRef);
  const favorites = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return favorites;
};

export const addOrUpdateReview = async (movieId, user, rating, text) => {
  const reviewRef = doc(db, 'movies', String(movieId), 'reviews', user.uid);
  await setDoc(reviewRef, {
    authorName: user.displayName,
    authorImage: user.photoURL,
    rating: rating,
    text: text,
    createdAt: serverTimestamp(),
  });
};

export const getReviewsForMovie = async (movieId) => {
  const reviewsCollectionRef = collection(db, 'movies', String(movieId), 'reviews');
  const querySnapshot = await getDocs(reviewsCollectionRef);
  const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return reviews;
};

export const deleteReview = async (movieId, userId) => {
  const reviewRef = doc(db, 'movies', String(movieId), 'reviews', userId);
  await deleteDoc(reviewRef);
};