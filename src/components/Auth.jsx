import React, { useState } from 'react';
import { auth } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import ConfirmationModal from './ConfirmationModal'; // 1. Import our new modal

function Auth() {
  const user = useAuth();
  // 2. Add state to manage the modal's visibility
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
    // This function now handles the actual sign-out logic
    try {
      await signOut(auth);
      toast.success('Signed out successfully!');
    } catch (error) {
      toast.error('Could not sign out.');
      console.error(error);
    }
    setIsModalOpen(false); // Close modal after action
  };

  return (
    <>
      {user ? (
        <div className="flex items-center gap-2">
          <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
          <span className="text-sm hidden md:block">{user.displayName}</span>
          {/* 3. This button now just opens the modal */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button 
          onClick={handleGoogleSignIn}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign In with Google
        </button>
      )}

      {/* 4. We render the modal here */}
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