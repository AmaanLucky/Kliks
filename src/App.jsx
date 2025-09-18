import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MasonryGrid from './components/MasonryGrid';
import Lightbox from './components/Lightbox';
import About from './components/About';
import Contact from './components/Contact';
import { photos } from './data/photos';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [likedPhotos, setLikedPhotos] = useLocalStorage('likedPhotos', []);
  const [photosWithLikes, setPhotosWithLikes] = useState(photos);


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseLightbox = () => {
    setSelectedPhoto(null);
  };

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photosWithLikes.findIndex(p => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % photosWithLikes.length;
    setSelectedPhoto(photosWithLikes[nextIndex]);
  };

  const handlePreviousPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photosWithLikes.findIndex(p => p.id === selectedPhoto.id);
    const previousIndex = (currentIndex - 1 + photosWithLikes.length) % photosWithLikes.length;
    setSelectedPhoto(photosWithLikes[previousIndex]);
  };


  const getCurrentPhotoIndex = () => {
    if (!selectedPhoto) return -1;
    return photosWithLikes.findIndex(p => p.id === selectedPhoto.id);
  };

  const hasNext = getCurrentPhotoIndex() < photosWithLikes.length - 1;
  const hasPrevious = getCurrentPhotoIndex() > 0;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode ? 'bg-yellow-900' : 'bg-white'
    }`}>
      <div
  className={`
    fixed inset-0 opacity-5 
    ${darkMode
      ? 'bg-gray-800 bg-[linear-gradient(90deg,#ffffff_3px,transparent_4px),linear-gradient(180deg,#ffffff_3px,transparent_4px)]'
      : 'bg-gray-100 bg-[linear-gradient(90deg,#000000_3px,transparent_4px),linear-gradient(180deg,#000000_3px,transparent_4px)]'}
    bg-[length:60px_60px]
  `}
/>
      <Header darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-5xl md:text-7xl pt-10 font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome to
            <span className="block bg-gradient-to-r from-black to-black bg-clip-text text-transparent">
              Kliks
            </span>
          </h1>
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Capturing the breathtaking moments of our natural world through the lens of passion and patience.
          </p>
          <button
            onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-950 transition-colors duration-500 shadow-xl hover:shadow-xl transform hover:scale-105"
          >
            Explore Gallery
          </button>
        </div>
      </section>

      <section id="gallery" className={`py-20 transition-colors duration-300 ${
        darkMode ? 'bg-yellow-900' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Photo Gallery
            </h2>
            <p className={`text-xl ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              A collection of nature's most stunning moments
            </p>
            <div className="w-20 h-1 bg-black mx-auto rounded-full mt-4"></div>
          </div>

          <MasonryGrid
            photos={photosWithLikes}
            onPhotoClick={handlePhotoClick}
            darkMode={darkMode}
          />
        </div>
      </section>

      <About darkMode={darkMode} />
      <Contact darkMode={darkMode} />

      <Lightbox
        photo={selectedPhoto}
        onClose={handleCloseLightbox}
        onNext={handleNextPhoto}
        onPrevious={handlePreviousPhoto}
        isLiked={selectedPhoto ? likedPhotos.includes(selectedPhoto.id) : false}
        darkMode={darkMode}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      />

    </div>
  );
}

export default App;