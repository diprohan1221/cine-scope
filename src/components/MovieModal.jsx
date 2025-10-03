import React, { useState, useEffect } from 'react';
import { getMovieDetails, IMAGE_BASE_URL, getMovieVideos, getMovieCredits } from '../api/tmdb';
import { useAuth } from '../hooks/useAuth';
import { addFavorite, removeFavorite, isFavorite, addOrUpdateReview, getReviewsForMovie, deleteReview } from '../api/firestore';
import toast from 'react-hot-toast';
import StarRating from './StarRating';
import { Tabs, Tab } from './Tabs';
import ConfirmationModal from './ConfirmationModal';

function MovieModal({ movie, onClose }) {
  const user = useAuth();
  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [cast, setCast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!movie?.id) return;
      setIsLoading(true);
      try {
        const [movieDetails, movieTrailerKey, movieCast, favoriteStatus, movieReviews] = await Promise.all([
          getMovieDetails(movie.id),
          getMovieVideos(movie.id),
          getMovieCredits(movie.id),
          user ? isFavorite(user.uid, movie.id) : Promise.resolve(false),
          getReviewsForMovie(movie.id)
        ]);
        setDetails(movieDetails);
        setTrailerKey(movieTrailerKey);
        setCast(movieCast);
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
    const promise = isFavorited ? removeFavorite(user.uid, movie.id) : addFavorite(user.uid, { id: movie.id, title: movie.title, poster_path: movie.poster_path });
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

  const handleDeleteReview = async () => {
    if (!user) return;
    const promise = deleteReview(movie.id, user.uid).then(() => {
      getReviewsForMovie(movie.id).then(setReviews);
    });
    toast.promise(promise, {
      loading: 'Deleting review...',
      success: 'Review deleted!',
      error: 'Could not delete review.',
    });
    setIsDeleteModalOpen(false);
  };

  const handleBackdropClick = (e) => { if (e.target.id === 'modal-backdrop') { onClose(); } };
  const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image';
  const profileBaseUrl = 'https://image.tmdb.org/t/p/w185';

  return (
    <>
      <div id="modal-backdrop" onClick={handleBackdropClick} className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-start z-50 p-4 pt-12 overflow-y-auto animate-fade-in">
        <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden relative flex flex-col animate-slide-up my-auto max-h-[90vh]">
          <div className="flex-shrink-0 px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold truncate">{movie.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-800 dark:text-gray-500 dark:hover:text-white text-3xl font-bold">&times;</button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <Tabs>
                <Tab label="Details">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0 mx-auto md:mx-0 w-full sm:w-1/2 md:w-2/5">
                      <img src={posterUrl} alt={movie.title} className="w-full h-auto rounded-lg shadow-lg" />
                    </div>
                    <div className="flex-grow">
                      {isLoading ? ( <p className="text-gray-400 dark:text-gray-300">Loading details...</p> ) : details ? (
                        <>
                          {details.tagline && <p className="mb-4 italic text-gray-600 dark:text-gray-400">{details.tagline}</p>}
                          <p className="mb-4 text-gray-800 dark:text-gray-300 leading-relaxed">{details.overview}</p>
                          
                          {user && (
                            isFavorited ? (
                              <button onClick={handleFavoriteClick} className="mb-4 px-4 py-2 rounded-lg font-semibold transition-colors bg-red-600 hover:bg-red-700 text-white">
                                ❤️ Remove from Favorites
                              </button>
                            ) : (
                              <button onClick={handleFavoriteClick} className="mb-4 px-4 py-2 rounded-lg font-semibold transition-colors bg-cyan-500 hover:bg-cyan-600 text-white">
                                🤍 Add to Favorites
                              </button>
                            )
                          )}

                          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                            <span><strong>Rating:</strong> ⭐ <span className="text-gray-900 dark:text-white font-semibold">{details.vote_average?.toFixed(1)}</span> / 10</span>
                            {details.runtime > 0 && <span><strong>Runtime:</strong> ⏳ <span className="text-gray-900 dark:text-white font-semibold">{details.runtime}</span> minutes</span>}
                            <span><strong>Released:</strong> 🗓️ <span className="text-gray-900 dark:text-white font-semibold">{details.release_date}</span></span>
                          </div>
                          <div className="flex flex-wrap gap-2 items-center">
                            <strong className="text-gray-600 dark:text-gray-400">Genres:</strong> 
                            {details.genres?.map(genre => ( 
                              <span key={genre.id} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full px-3 py-1 text-sm">
                                {genre.name}
                              </span> 
                            ))}
                          </div>
                        </>
                      ) : ( <p className="text-red-500">Could not load movie details.</p> )}
                    </div>
                  </div>
                  {trailerKey && (
                    <div className="mt-12">
                      <h3 className="text-xl font-semibold mb-3">Trailer</h3>
                      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg"><iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${trailerKey}?mute=1&modestbranding=1&rel=0`} title="YouTube video player" frameBorder="0" allowFullScreen></iframe></div>
                    </div>
                  )}
                </Tab>

                <Tab label="Cast">
                  {isLoading ? ( <p className="text-gray-400 dark:text-gray-300">Loading cast...</p> ) : cast && cast.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {cast.slice(0, 15).map(member => (
                        member.profile_path && (
                          <div key={member.cast_id} className="text-center">
                            <img src={`${profileBaseUrl}${member.profile_path}`} alt={member.name} className="rounded-lg shadow-md mb-2 w-full object-cover aspect-[2/3]" loading="lazy"/>
                            <p className="font-semibold text-sm">{member.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.character}</p>
                          </div>
                        )
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Cast information is not available.</p>
                  )}
                </Tab>

                <Tab label="Reviews">
                  {user && ( 
                    <div className="pt-4"> 
                      <h3 className="text-xl font-semibold mb-3">Your Review</h3> 
                      <form onSubmit={handleReviewSubmit}> 
                        <StarRating rating={newRating} onRatingChange={setNewRating} /> 
                        <textarea value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)} className="w-full h-24 p-2 mt-4 rounded bg-gray-100 dark:bg-gray-700 border-transparent focus:border-cyan-500 focus:ring-0" placeholder="Write your thoughts..."></textarea> 
                        <button type="submit" className="mt-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">Submit Review</button> 
                      </form> 
                    </div> 
                  )}
                  <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4"> 
                    <h3 className="text-xl font-semibold mb-4">Community Reviews</h3> 
                    {reviews.length > 0 ? ( 
                      <div className="space-y-4 max-h-48 overflow-y-auto pr-2">{reviews.map(review => ( 
                        <div key={review.id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"> 
                          <div className="flex items-start justify-between"> 
                            <div className="flex items-center mb-2"> 
                              <img src={review.authorImage} alt={review.authorName} className="w-8 h-8 rounded-full mr-3" /> 
                              <div> 
                                <p className="font-semibold">{review.authorName}</p> 
                                <StarRating rating={review.rating} size={16} isEditable={false} /> 
                              </div> 
                            </div> 
                            {user && review.id === user.uid && ( 
                              <button onClick={() => setIsDeleteModalOpen(true)} className="text-xs text-gray-500 hover:text-red-500 font-semibold"> DELETE </button> 
                            )} 
                          </div> 
                          {review.text && <p className="text-gray-700 dark:text-gray-300 text-sm">{review.text}</p>} 
                        </div>
                      ))}
                      </div> 
                    ) : ( 
                      !isLoading && <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to write one!</p> 
                    )} 
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={handleDeleteReview}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete"
      />
    </>
  );
}

export default MovieModal;