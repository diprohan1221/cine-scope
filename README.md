🎬 CineScope - A Movie Review & Rating Platform
I developed CineScope as a major project for an internship. The goal was to build a complete, full-stack web application using modern technologies like React and Firebase. I was inspired to create a clean, fast, and user-friendly alternative to existing movie sites, focusing on a great experience for discovering, saving, and reviewing movies.

Live Demo: https://cine-scope-murex.vercel.app/

[CineScope Screenshot] 
(https://github.com/user-attachments/assets/6dcc9cfa-ab6a-430d-8306-198cd9ac849c,
https://github.com/user-attachments/assets/73da273a-b44a-4ff4-8429-676956d85b14)

✨ Features
CineScope is packed with features to provide a complete and engaging user experience.

Movie Discovery
Live Data: Fetches real-time movie data from The Movie Database (TMDB) API.

Dynamic Search: A debounced search bar to find any movie.

Genre Filtering: Filter the movie list by a specific genre from a dropdown menu.

"Load More" Pagination: A custom-styled "Load More" button to seamlessly browse through pages of results.

Safe Browsing: Adult content is explicitly filtered out of all API results.

Personalization & Interaction
Secure Authentication: Full Google Sign-In functionality powered by Firebase Authentication, complete with a confirmation modal for signing out.

Favorites System: Logged-in users can add or remove movies from their personal, persistent favorites list.

Profile Page: A dedicated, private page for users to view a grid of all their saved favorite movies, with a manual refresh option.

Full Review System: Logged-in users can write, submit, and delete their own star-rated reviews for any movie.

Professional UI/UX
Modern Design: A clean, beautiful UI built with Tailwind CSS.

Light & Dark Mode: A theme toggle that saves the user's preference in their browser's local storage.

Polished Animations: Smooth page transitions and modal animations powered by Framer Motion.

Detailed Modals: A professional, tabbed modal view (using Headless UI) for Movie Details, Cast, and Reviews.

User Feedback: Skeleton loaders for loading states and toast notifications for user actions (e.g., "Added to favorites!").

Full Responsiveness: The layout is optimized for all screen sizes, from mobile to desktop.

Robust Routing: A complete multi-page experience with a custom 404 "Page Not Found" page, managed by React Router.

🛠️ Technology Stack
Frontend: React, Vite, Tailwind CSS

Backend & Database: Firebase (Authentication & Firestore)

Movie Data: TMDB API

Deployment: Vercel

Routing: React Router DOM

Animations: Framer Motion

UI Libraries: Headless UI, React Icons, React Hot Toast

🚀 Running the Project Locally
Clone the repository:
git clone https://github.com/diprohan1221/cine-scope.git

Navigate to the project directory:
cd cine-scope

Install dependencies:
npm install

Create a .env.local file in the root of the project and add your TMDB and Firebase API keys:
VITE_TMDB_API_KEY=your_tmdb_key_here
VITE_FIREBASE_API_KEY=your_firebase_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
# ... and all other Firebase variables

Start the development server:
npm run dev

Thanks for checking out my project!
