import React from 'react';
import { Heart } from 'lucide-react';

const PhotoCard = ({ 
  photo, 
  onPhotoClick, 
  onLike, 
  // isLiked, 
  darkMode 
}) => {
  return (
    <div 
      className={`group relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
      onClick={() => onPhotoClick(photo)}
    >
      <div className="aspect-w-4 aspect-h-3">
        <img
          src={photo.src}
          alt={photo.alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
        <div className="w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-lg mb-1">{photo.title}</h3>
          <p className="text-white text-sm opacity-90">{photo.location}</p>
        </div>
      </div>

      {/* Like Button */}
      {/* <button
        onClick={handleLikeClick}
        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
          isLiked 
            ? 'bg-red-500 text-white scale-110' 
            : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-110'
        } backdrop-blur-sm shadow-lg`}
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      </button> */}

      {/* Like Count */}
      {/* {photo.likes > 0 && (
        <div className={`absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-900/80 text-white' 
            : 'bg-white/80 text-gray-700'
        } backdrop-blur-sm`}>
          {photo.likes} likes
        </div>
      )} */}
    </div>
  );
};

export default PhotoCard;