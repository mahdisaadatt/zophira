import React from 'react';
import StarIcon from './StarIcon';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5, className }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={index}
            className={`w-5 h-5 ${rating >= starValue ? 'text-yellow-400' : 'text-gray-300'}`}
            isFilled={rating >= starValue}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
