import React from 'react';

function Debug() {
  return (
    <div className="p-8 text-white font-mono bg-gray-900 min-h-screen">
      <h1 className="text-2xl mb-4">Vercel Environment Variables Check</h1>
      <p className="mb-4 text-gray-400">This page shows the values Vercel is using. If any value is 'undefined' or incorrect, that's our bug.</p>
      <div className="bg-gray-800 p-4 rounded">
        <pre>VITE_TMDB_API_KEY: {import.meta.env.VITE_TMDB_API_KEY}</pre>
        <pre>VITE_FIREBASE_API_KEY: {import.meta.env.VITE_FIREBASE_API_KEY}</pre>
        <pre>VITE_FIREBASE_AUTH_DOMAIN: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}</pre>
        <pre>VITE_FIREBASE_PROJECT_ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID}</pre>
        <pre>VITE_FIREBASE_STORAGE_BUCKET: {import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}</pre>
        <pre>VITE_FIREBASE_MESSAGING_SENDER_ID: {import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID}</pre>
        <pre>VITE_FIREBASE_APP_ID: {import.meta.env.VITE_FIREBASE_APP_ID}</pre>
      </div>
    </div>
  );
}

export default Debug;