import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

/**
 * A custom hook that listens to Firebase auth state changes.
 * @returns {object|null} The current user object or null if not logged in.
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // onAuthStateChanged returns a function to unsubscribe from the listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // When the component using this hook unmounts, we clean up the listener
    return () => unsubscribe();
  }, []); // The empty array means this effect runs only once on mount

  return user;
};