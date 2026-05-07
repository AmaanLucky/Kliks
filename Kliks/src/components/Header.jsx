import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Camera, Menu, X, Sun, Moon } from 'lucide-react';

const Header = ({
  darkMode,
  toggleDarkMode,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      darkMode ? 'bg-yellow-900/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'
    } shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Camera className={`h-8 w-8 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Kliks
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('gallery')}
              className={`transition-colors ${
                darkMode ? 'text-gray-300 hover:text-black' : 'text-gray-700 hover:text-black'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`transition-colors ${
                darkMode ? 'text-gray-300 hover:text-black' : 'text-gray-700 hover:text-black'
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`transition-colors ${
                darkMode ? 'text-gray-300 hover:text-black' : 'text-gray-700 hover:text-black'
              }`}
            >
              Contact
            </button>

            <Link
              to="/admin"
              className={`transition-colors text-m font-small px-2 py-1.5 rounded-lg ${
                darkMode
                  ? 'text-gray-300 hover:bg-yellow-950'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-black'
              }`}
            >
              Admin
            </Link>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-black hover:bg-yellow-900 text-yellow-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </nav>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-500 ${
                darkMode
                  ? 'bg-black hover:bg-white text-yellow-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden absolute top-16 left-0 right-0 transition-all duration-300 ${
            darkMode ? 'bg-yellow-900/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'
          } shadow-lg`}>
            <nav className="px-4 py-4 space-y-4">
              <button
                onClick={() => scrollToSection('gallery')}
                className={`block w-full text-left py-2 transition-colors hover:text-black ${
                  darkMode ? 'text-gray-300 hover:text-black' : 'text-gray-700'
                }`}
              >
                Gallery
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className={`block w-full text-left py-2 transition-colors hover:text-blue-600 ${
                  darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700'
                }`}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`block w-full text-left py-2 transition-colors hover:text-blue-600 ${
                  darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700'
                }`}
              >
                Contact
              </button>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left py-2 transition-colors text-sm font-medium ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}
              >
                Admin
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;