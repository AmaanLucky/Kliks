import React from 'react';

const SkeletonCard = ({ darkMode }) => (
  <div
    className={`rounded-lg overflow-hidden animate-pulse ${
      darkMode ? 'bg-yellow-950' : 'bg-gray-200'
    }`}
    style={{ paddingBottom: `${75 + Math.random() * 50}%` }}
  />
);

export default SkeletonCard;
