import React, { useEffect, useState } from 'react';
import PhotoCard from './PhotoCard';
import SkeletonCard from './SkeletonCard';

const loadingMessages = [
  "Our servers are doing their best impression of a loading screen 🎬",
  "Tiny internet gremlins detected… fixing things now 👾",
  "Please wait while we untangle some digital noodles 🍜",
  "Loading… fueled by caffeine and questionable optimism ☕",
  "Good vibes are buffering… please stand by 🌈",
  "We’re polishing the pixels for maximum shine ✨",
  "Hold tight — the data is taking the scenic route 🛣️",
  "Summoning your content from the cloud kingdom ☁️",
  "The bits and bytes are having a team meeting 🤝",
  "Still loading… the electrons are warming up ⚡",
  "Our servers blinked twice and asked for a second 😅",
  "Downloading happiness… estimated time: very soon 🎉",
  "Please wait while the internet remembers where it kept your data 🧠",
  "We’re busy making things look effortless 😎",
  "One sec… the backend is fighting dragons 🐉",
  "Loading… because perfection refuses to rush 💫",
  "The code monkeys are typing as fast as they can 🐒",
  "Fetching your content from somewhere deep in cyberspace 🌌",
  "Just a moment… we’re aligning the digital stars ⭐",
  "Things are loading slower than our Monday mornings 😴",
  "Please hold while we negotiate with the servers 🤖",
  "Your experience is being handcrafted pixel by pixel 🎨",
  "Loading… inserting dramatic pause for effect 🎭",
  "Our servers are jogging, not sprinting today 🏃",
  "The internet tubes are a little crowded right now 🚰",
  "Cooking up your content fresh out of the server oven 🍕",
  "This wait is temporary. The awesomeness is permanent 🚀",
  "Please wait… we accidentally used too much awesome 💥",
  "Loading at the speed of ‘just one more second’ ⏳",
  "We promise something cool is on the way 😄"
];

const MasonryGrid = ({ photos, loading, onPhotoClick, darkMode, slowLoad }) => {
  const [columns, setColumns] = useState(4);
  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setColumns(4);
      else if (window.innerWidth >= 1024) setColumns(3);
      else if (window.innerWidth >= 768) setColumns(2);
      else setColumns(1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const randomMessage =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

    setLoadingText(randomMessage);
  }, [loading]);

  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }[columns];

  const skeletonCount = columns * 3;

  if (loading) {
    const skeletonCols = Array.from({ length: columns }, () => []);

    Array.from({ length: skeletonCount }).forEach((_, i) => {
      skeletonCols[i % columns].push(i);
    });

    return (
      <div className="w-full">
        {slowLoad && (
          <p
            className={`text-center text-sm mb-6 animate-pulse ${
              darkMode ? 'text-yellow-200' : 'text-gray-400'
            }`}
          >
            {loadingText}
          </p>
        )}

        <div className={`grid gap-4 ${gridClass}`}>
          {skeletonCols.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-4">
              {col.map(i => (
                <SkeletonCard
                  key={i}
                  index={i}
                  darkMode={darkMode}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const photoColumns = Array.from({ length: columns }, () => []);

  photos.forEach((photo, i) => {
    photoColumns[i % columns].push(photo);
  });

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