// src/components/Auth.jsx
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function Auth() {
  const [user, setUser] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-Out Error:", error.message);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full" />
        <span className="font-semibold">{user.displayName}</span>
        <button onClick={handleSignOut} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleGoogleSignIn} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Sign In with Google
    </button>
  );
}
