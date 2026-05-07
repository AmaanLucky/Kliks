import React, { useState } from 'react';

const PhotoCard = ({ photo, onPhotoClick, darkMode }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`group relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        darkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}
      onClick={() => onPhotoClick(photo)}
    >
      {!loaded && (
        <div
          className={`absolute inset-0 animate-pulse ${darkMode ? 'bg-yellow-950' : 'bg-black'}`}
          style={{ paddingBottom: '75%' }}
        />
      )}

      <div className="aspect-w-4 aspect-h-3">
        <img
          src={photo.src}
          alt={photo.title}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
        <div className="w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-lg">{photo.title}</h3>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
