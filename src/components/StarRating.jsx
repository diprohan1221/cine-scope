import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // We'll use the star icon from the library

function StarRating({ rating = 0, onRatingChange, size = 24, isEditable = true }) {
  const [hover, setHover] = useState(null);

  // This makes the component usable in non-editable "display only" mode
  const handleMouseEvents = isEditable ? {
    onMouseEnter: (ratingValue) => setHover(ratingValue),
    onMouseLeave: () => setHover(null),
    onClick: (ratingValue) => onRatingChange(ratingValue),
  } : {};

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              className="hidden" // We hide the actual radio button
            />
            <FaStar
              className={isEditable ? "cursor-pointer" : ""}
              size={size}
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => handleMouseEvents.onMouseEnter?.(ratingValue)}
              onMouseLeave={() => handleMouseEvents.onMouseLeave?.()}
              onClick={() => handleMouseEvents.onClick?.(ratingValue)}
            />
          </label>
        );
      })}
    </div>
  );
}

export default StarRating;