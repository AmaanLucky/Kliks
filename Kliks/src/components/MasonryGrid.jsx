import React, { useEffect, useState } from 'react';
import PhotoCard from './PhotoCard';
import SkeletonCard from './SkeletonCard';

const MasonryGrid = ({ photos, loading, onPhotoClick, darkMode, slowLoad }) => {
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280)      setColumns(4);
      else if (window.innerWidth >= 1024) setColumns(3);
      else if (window.innerWidth >= 768)  setColumns(2);
      else                                setColumns(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gridClass = {1:'grid-cols-1', 2:'grid-cols-2', 3:'grid-cols-3', 4:'grid-cols-4'}[columns];
  const skeletonCount = columns * 3;

  if (loading) {
    const skeletonCols = Array.from({ length: columns }, () => []);
    Array.from({ length: skeletonCount }).forEach((_, i) => {
      skeletonCols[i % columns].push(i);
    });
    return (
      <div className="w-full">
        {slowLoad && (
          <p className={`text-center text-sm mb-6 animate-pulse ${darkMode ? 'text-yellow-200' : 'text-gray-400'}`}>
            Server is waking up, hang tight…
          </p>
        )}
        <div className={`grid gap-4 ${gridClass}`}>
          {skeletonCols.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-4">
              {col.map(i => <SkeletonCard key={i} index={i} darkMode={darkMode} />)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const photoColumns = Array.from({ length: columns }, () => []);
  photos.forEach((photo, i) => photoColumns[i % columns].push(photo));

  return (
    <div className="w-full">
      <div className={`grid gap-4 ${gridClass}`}>
        {photoColumns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-4">
            {col.map(photo => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onPhotoClick={onPhotoClick}
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
