import React from 'react';
import { Camera, Award, Globe, Heart } from 'lucide-react';

const About = ({ darkMode }) => {
  return (
    <section id="about" className={`py-20 transition-colors duration-300 ${darkMode ? 'bg-yellow-900' : 'bg-white'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
            }`}>
            About Me
          </h2>
          <div className="w-20 h-1 bg-black mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className={`aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl ${darkMode ? 'ring-1 ring-gray-700' : 'ring-1 ring-gray-200'
              }`}>
              <img
                src="https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG_20250917_220105.jpg?updatedAt=1758126883537"
                alt="Nature photographer in action"
                className="w-full h-100 object-cover"
              />
            </div>
          </div>

          <div>
            <h3 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Moments matter, and I capture them
            </h3>

            <p className={`text-lg mb-6 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Photography has always been a way for me to capture the little things that often go unnoticed.
              I enjoy taking photos of random moments, objects, and scenes that tell a story of their own.
              Mountains and greenery inspire me the most, as nature’s beauty brings me peace and clarity.
            </p>

            <p className={`text-lg mb-8 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Though I work as a software developer, photography is the hobby that keeps my creativity alive.
              Every time I click a photo, it feels like freezing a small piece of happiness forever.Traveling the world and experiencing different landscapes is one of my biggest dreams.
              I hope to capture unique places, cultures, and moments before my journey in this life ends.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;