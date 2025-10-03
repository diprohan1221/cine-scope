import React, { useState } from 'react';
import { auth } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import ConfirmationModal from './ConfirmationModal';

function Auth() {
  const user = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Signed in successfully!');
    } catch (error) {
      toast.error('Could not complete sign in.');
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully!');
    } catch (error) {
      toast.error('Could not sign out.');
      console.error(error);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      {user ? (
        <div className="flex items-center gap-3">
          <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
          {/* --- FIX: Added text color for light/dark modes --- */}
          <span className="text-sm font-medium hidden md:block text-gray-700 dark:text-gray-300">{user.displayName}</span>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded-md text-sm"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button 
          onClick={handleGoogleSignIn}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded"
        >
          Sign In with Google
        </button>
      )}

      <ConfirmationModal 
        isOpen={isModalOpen}
        message="Are you sure you want to log out?"
        onConfirm={handleSignOut}
        onCancel={() => setIsModalOpen(false)}
        confirmText="Log Out"
      />
    </>
  );
}

export default Auth;