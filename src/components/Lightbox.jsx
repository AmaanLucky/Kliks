import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, MapPin } from 'lucide-react';

const Lightbox = ({
  photo,
  onClose,
  onNext,
  onPrevious,
  darkMode,
  hasNext,
  hasPrevious,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!photo) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrevious) onPrevious();
          break;
        case 'ArrowRight':
          if (hasNext) onNext();
          break;
      }
    };

    if (photo) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [photo, onClose, onNext, onPrevious, hasNext, hasPrevious]);

  if (!photo) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-yellow-900 bg-opacity-90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-yellow-900 bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation Buttons */}
      {hasPrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-6 z-10 p-3 rounded-full bg-yellow-900 bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-6 z-10 p-3 rounded-full bg-yellow-900 bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}

      {/* Main Content */}
      <div className="max-w-7xl max-h-full mx-auto px-4 flex flex-col items-center justify-center">
        <div className="relative">
          <img
            src={photo.src}
            alt={photo.alt}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Photo Info */}
        <div className={`mt-6 text-center max-w-2xl px-4 ${
          darkMode ? 'text-white' : 'text-white'
        }`}>
          <h2 className="text-2xl font-bold mb-2">{photo.title}</h2>
          <div className="flex items-center justify-center space-x-4 text-gray-300 mb-4">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{photo.location}</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Lightbox;