import React, { useState, useEffect } from 'react';
import { getMovieDetails, IMAGE_BASE_URL, getMovieVideos } from '../api/tmdb';
import { useAuth } from '../hooks/useAuth';
import { addFavorite, removeFavorite, isFavorite, addOrUpdateReview, getReviewsForMovie } from '../api/firestore';
import toast from 'react-hot-toast';
import StarRating from './StarRating';

function MovieModal({ movie, onClose }) {
  const user = useAuth();
  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!movie?.id) return;
      setIsLoading(true);
      try {
        const [movieDetails, movieTrailerKey, favoriteStatus, movieReviews] = await Promise.all([
          getMovieDetails(movie.id),
          getMovieVideos(movie.id),
          user ? isFavorite(user.uid, movie.id) : Promise.resolve(false),
          getReviewsForMovie(movie.id)
        ]);
        setDetails(movieDetails);
        setTrailerKey(movieTrailerKey);
        setIsFavorited(favoriteStatus);
        setReviews(movieReviews);
      } catch (error) {
        console.error("Error fetching modal data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [movie, user]);
  
  const handleFavoriteClick = async () => {
    if (!user) { toast.error("Please sign in to add favorites!"); return; }
    const promise = isFavorited ? removeFavorite(user.uid, movie.id) : addFavorite(user.uid, movie);
    toast.promise(promise, {
      loading: isFavorited ? 'Removing from favorites...' : 'Adding to favorites...',
      success: () => { setIsFavorited(!isFavorited); return isFavorited ? 'Removed from favorites!' : 'Added to favorites!'; },
      error: 'Could not update favorites.',
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newRating === 0) { toast.error('Please select a star rating before submitting.'); return; }
    const promise = addOrUpdateReview(movie.id, user, newRating, newReviewText).then(() => { getReviewsForMovie(movie.id).then(setReviews); });
    toast.promise(promise, {
      loading: 'Submitting your review...',
      success: 'Review submitted successfully!',
      error: 'There was an error submitting your review.',
    });
    setNewRating(0);
    setNewReviewText('');
  };

  const handleBackdropClick = (e) => { if (e.target.id === 'modal-backdrop') { onClose(); } };
  const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <div id="modal-backdrop" onClick={handleBackdropClick} className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-start z-50 p-4 pt-12 overflow-y-auto animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden relative flex flex-col animate-slide-up my-auto"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold truncate">{movie.title}</h2>
          <button onClick={onClose} className="text-3xl font-bold hover:text-cyan-400">&times;</button>
        </div>
  
        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-shrink-0 mx-auto md:mx-0 w-2/3 md:w-1/3">
                <img src={posterUrl} alt={movie.title} className="w-full h-auto rounded-lg shadow-lg" />
              </div>
              <div className="flex-grow">
                {isLoading ? ( <p className="text-gray-400 dark:text-gray-300">Loading details...</p> ) : details ? (
                  <>
                    <p className="mb-4 italic text-gray-500 dark:text-gray-400">{details.tagline}</p>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">{details.overview}</p>
                    {user && ( <button onClick={handleFavoriteClick} className={`mb-4 px-4 py-2 rounded-lg font-semibold transition-colors ${isFavorited ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-cyan-500 hover:bg-cyan-600 text-white'}`}> {isFavorited ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'} </button> )}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm">
                      <span><strong>Rating:</strong> ⭐ {details.vote_average?.toFixed(1)} / 10</span>
                      <span><strong>Runtime:</strong> ⏳ {details.runtime} minutes</span>
                      <span><strong>Released:</strong> 🗓️ {details.release_date}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center"><strong>Genres:</strong> {details.genres?.map(genre => ( <span key={genre.id} className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm"> {genre.name} </span> ))} </div>
                  </>
                ) : ( <p className="text-red-500">Could not load movie details.</p> )}
              </div>
            </div>
  
            {user && ( <div className="border-t border-gray-200 dark:border-gray-700 pt-4"> <h3 className="text-xl font-semibold mb-3">Your Review</h3> <form onSubmit={handleReviewSubmit}> <StarRating rating={newRating} onRatingChange={setNewRating} /> <textarea value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)} className="w-full h-24 p-2 mt-4 rounded bg-gray-100 dark:bg-gray-700 border-transparent focus:border-cyan-500 focus:ring-0" placeholder="Write your thoughts..."></textarea> <button type="submit" className="mt-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">Submit Review</button> </form> </div> )}
            
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4"> <h3 className="text-xl font-semibold mb-4">Community Reviews</h3> {reviews.length > 0 ? ( <div className="space-y-4 max-h-48 overflow-y-auto pr-2">{reviews.map(review => ( <div key={review.id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"> <div className="flex items-center mb-2"> <img src={review.authorImage} alt={review.authorName} className="w-8 h-8 rounded-full mr-3" /> <div> <p className="font-semibold">{review.authorName}</p> <StarRating rating={review.rating} size={16} isEditable={false} /> </div> </div> {review.text && <p className="text-gray-700 dark:text-gray-300 text-sm">{review.text}</p>} </div>))} </div> ) : ( !isLoading && <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to write one!</p> )} </div>
  
            {trailerKey && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Trailer</h3>
                <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"><iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${trailerKey}?mute=1&modestbranding=1&rel=0`} title="YouTube video player" frameBorder="0" allowFullScreen></iframe></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;