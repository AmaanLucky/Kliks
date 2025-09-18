import React from 'react';
import { Heart } from 'lucide-react';

const PhotoCard = ({ 
  photo, 
  onPhotoClick,  
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
      <div className="absolute inset-0 bg-yellow-900 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
        <div className="w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-lg mb-1">{photo.title}</h3>
          <p className="text-white text-sm opacity-90">{photo.location}</p>
        </div>
      </div>
     
    </div>
  );
};

export default PhotoCard;