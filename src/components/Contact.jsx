import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    await emailjs.send(
      'service_herfqvr',    
      'template_oj8gvmj',   
      {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      },
      'GW3FyIAi55zfoJRE2'   
    );

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => setIsSubmitted(false), 5000);
  } catch (error) {
    console.error('Error sending email:', error);
    setIsSubmitting(false);
    alert('Failed to send message. Please try again later.');
  }
};

  return (
    <section id="contact" className={`py-20 transition-colors duration-300 ${
      darkMode ? 'bg-yellow-900' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
                Get In Touch
          </h2>
          <p className={`text-xl ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
                Let's discuss your photography needs or collaborations
          </p>
          <div className="w-20 h-1 bg-black mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h3 className={`text-2xl font-bold mb-8 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
                  Let's Connect
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${
                  darkMode ? 'bg-black' : 'bg-white'
                }`}>
                  <Mail className={`h-6 w-6 ${
                    darkMode ? 'text-yellow-700' : 'text-black'
                  }`} />
                </div>
                <div>
                  <h4 className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Email
                  </h4>
                  <p className={`${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    amaanahmed2405@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${
                  darkMode ? 'bg-black' : 'bg-white'
                }`}>
                  <Phone className={`h-6 w-6 ${
                    darkMode ? 'text-yellow-700' : 'text-black'
                  }`} />
                </div>
                <div>
                  <h4 className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Phone
                  </h4>
                  <p className={`${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    +91 99895 83343
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${
                  darkMode ? 'bg-black' : 'bg-white'
                }`}>
                  <MapPin className={`h-6 w-6 ${
                    darkMode ? 'text-yellow-700' : 'text-black'
                  }`} />
                </div>
                <div>
                  <h4 className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Location
                  </h4>
                  <p className={`${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Hyderabad, India  
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className={`font-bold text-xl mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Response Time
              </h4>
              <p className={`${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                I typically respond to all inquiries within 24 hours. For urgent matters, 
                feel free to call directly.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`p-8 rounded-2xl z-0 ${
            darkMode ? 'bg-yellow-900 ring-1 ring-black' : 'bg-gray-400'
          }`}>
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-black mx-auto mb-4" />
                <h3 className={`text-2xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Message Sent!
                </h3>
                <p className={`${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Thank you for reaching out. I'll get back to you soon!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-black'
                    }`}>
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? 'bg-white border-gray-600 text-black placeholder-black' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-black'
                    }`}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? 'bg-white border-gray-600 text-black placeholder-black' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-black'
                  }`}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-white border-gray-600 text-black placeholder-black' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-black'
                  }`}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      darkMode 
                        ? 'bg-white border-gray-600 text-black placeholder-black' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Tell me about your project or inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-8 py-3 bg-black text-white font-semibold rounded-lg transition-all duration-300 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                    darkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;