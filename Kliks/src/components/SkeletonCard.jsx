import React from 'react';

const HEIGHTS = [75, 110, 85, 125, 95, 60, 115, 80, 100, 70, 90, 130];

const SkeletonCard = ({ darkMode, index = 0 }) => (
  <div
    className={`rounded-lg overflow-hidden animate-pulse ${
      darkMode ? 'bg-yellow-950' : 'bg-gray-200'
    }`}
    style={{ paddingBottom: `${HEIGHTS[index % HEIGHTS.length]}%` }}
  />
);

export default SkeletonCard;
