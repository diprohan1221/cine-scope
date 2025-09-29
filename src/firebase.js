// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvRUVsmaUJpPkdaicrsOa3iDRc21qOgU8",
  authDomain: "cine-scope-73def.firebaseapp.com",
  projectId: "cine-scope-73def",
  storageBucket: "cine-scope-73def.appspot.com",
  messagingSenderId: "1035758786355",
  appId: "1:1035758786355:web:d7b1521fa6753be9485046",
  measurementId: "G-3LKWBW6YW5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth instance for use in Auth.jsx
export const auth = getAuth(app);
