import React from 'react';

function SkeletonCard() {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      {/* This div mimics the movie poster */}
      <div className="w-full h-auto aspect-[2/3] bg-gray-700 animate-pulse"></div>
      <div className="p-3">
        {/* This div mimics the movie title */}
        <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse mb-2"></div>
        {/* This div mimics the movie rating */}
        <div className="h-3 bg-gray-700 rounded w-1/4 animate-pulse"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;