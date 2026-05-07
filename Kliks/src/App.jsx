import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MasonryGrid from './components/MasonryGrid';
import Lightbox from './components/Lightbox';
import About from './components/About';
import Contact from './components/Contact';
import AdminPage from './pages/AdminPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getImages } from './api/images';

function Gallery({ darkMode }) {
  const [photos, setPhotos]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [likedPhotos]                     = useLocalStorage('likedPhotos', []);

  const loadPage = useCallback(async (p) => {
    setLoading(true);
    setFetchError(false);
    try {
      const data = await getImages(p);
      if (data.error) throw new Error(data.error);
      setPhotos(prev => p === 1 ? data.images : [...prev, ...data.images]);
      setHasMore(p < data.pages);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPage(1); }, [loadPage]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    loadPage(next);
  };

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const idx = photos.findIndex(p => p.id === selectedPhoto.id);
    setSelectedPhoto(photos[(idx + 1) % photos.length]);
  };

  const handlePreviousPhoto = () => {
    if (!selectedPhoto) return;
    const idx = photos.findIndex(p => p.id === selectedPhoto.id);
    setSelectedPhoto(photos[(idx - 1 + photos.length) % photos.length]);
  };

  const currentIndex = selectedPhoto ? photos.findIndex(p => p.id === selectedPhoto.id) : -1;

  return (
    <>
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-5xl md:text-7xl pt-10 font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
            Welcome to
            <span className="block bg-gradient-to-r from-black to-black bg-clip-text text-transparent">
              Kliks
            </span>
          </h1>
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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

      <section id="gallery" className={`py-20 transition-colors duration-300 ${darkMode ? 'bg-yellow-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Photo Gallery
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              A collection of nature's most stunning moments
            </p>
            <div className="w-20 h-1 bg-black mx-auto rounded-full mt-4" />
          </div>

          {fetchError ? (
            <div className="text-center py-20">
              <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Could not load photos. Is the server running?
              </p>
              <button
                onClick={() => loadPage(1)}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <MasonryGrid
                photos={photos}
                loading={loading && page === 1}
                onPhotoClick={setSelectedPhoto}
                darkMode={darkMode}
              />

              {!loading && hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Load More
                  </button>
                </div>
              )}

              {loading && page > 1 && (
                <div className={`text-center mt-8 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Loading more…
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <About darkMode={darkMode} />
      <Contact darkMode={darkMode} />

      <Lightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onNext={handleNextPhoto}
        onPrevious={handlePreviousPhoto}
        isLiked={selectedPhoto ? likedPhotos.includes(selectedPhoto.id) : false}
        darkMode={darkMode}
        hasNext={currentIndex < photos.length - 1}
        hasPrevious={currentIndex > 0}
      />
    </>
  );
}

function App() {
  const [darkMode, setDarkMode]           = useLocalStorage('darkMode', false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-yellow-900' : 'bg-white'}`}>
      <div
        className={`fixed inset-0 opacity-5 pointer-events-none ${
          darkMode
            ? 'bg-gray-800 bg-[linear-gradient(90deg,#ffffff_3px,transparent_4px),linear-gradient(180deg,#ffffff_3px,transparent_4px)]'
            : 'bg-gray-100 bg-[linear-gradient(90deg,#000000_3px,transparent_4px),linear-gradient(180deg,#000000_3px,transparent_4px)]'
        } bg-[length:60px_60px]`}
      />
      <Header
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <Routes>
        <Route path="/" element={<Gallery darkMode={darkMode} />} />
        <Route path="/admin" element={<AdminPage darkMode={darkMode} />} />
      </Routes>
    </div>
  );
}

export default App;
