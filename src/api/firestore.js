import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, getDocs } from 'firebase/firestore';

export const addFavorite = async (userId, movie) => {
  const favoriteRef = doc(db, 'users', userId, 'favorites', String(movie.id));
  await setDoc(favoriteRef, {
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average
  });
};

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

  const favorites = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return favorites;
};