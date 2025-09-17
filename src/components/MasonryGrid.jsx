import React, { useEffect, useState } from 'react';
import PhotoCard from './PhotoCard';

const MasonryGrid = ({ 
  photos, 
  onPhotoClick, 
  onLike, 
  likedPhotos, 
  darkMode 
}) => {
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setColumns(4);
      } else if (window.innerWidth >= 1024) {
        setColumns(3);
      } else if (window.innerWidth >= 768) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const distributePhotos = () => {
    const columnArrays = Array.from({ length: columns }, () => []);
    
    photos.forEach((photo, index) => {
      const columnIndex = index % columns;
      columnArrays[columnIndex].push(photo);
    });
    
    return columnArrays;
  };

  const photoColumns = distributePhotos();

  return (
    <div className="w-full">
      <div className={`grid gap-4 ${
        columns === 1 ? 'grid-cols-1' :
        columns === 2 ? 'grid-cols-2' :
        columns === 3 ? 'grid-cols-3' : 'grid-cols-4'
      }`}>
        {photoColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onPhotoClick={onPhotoClick}
                onLike={onLike}
                isLiked={likedPhotos.has(photo.id)}
                darkMode={darkMode}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryGrid;