import React, { useEffect, useState } from 'react';
import bannerImg from '../assets/Image/backgrounds/Banner-board-800x420 2.png';
import promo1 from '../assets/Image/backgrounds/Group 969.png';
import promo2 from '../assets/Image/backgrounds/Group 982.png';
import banner1 from '../assets/Image/backgrounds/image 106.png';
import banner2 from '../assets/Image/backgrounds/image 107.png';
import banner3 from '../assets/Image/backgrounds/image 98.png';
import banner4 from '../assets/Image/backgrounds/Mask group.png';
import banner5 from '../assets/Image/backgrounds/Mask group (1).png';
import { api } from '../lib/api';

const Hero = ({ setPage }) => {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quoteData, setQuoteData] = useState({
    name: '',
    quote: '',
    supplierRef: ''
  });

  const bannerImages = [bannerImg, banner1, banner2, banner3, banner4, banner5];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.products.getCategories();
        setCategories((data || []).slice(0, 9));
      } catch (error) {
        console.error('Error fetching hero categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(categories.length, bannerImages.length));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [categories]);

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    console.log('Quote submitted:', quoteData);
    alert('Quote submitted successfully!');
    setShowQuoteForm(false);
    setQuoteData({ name: '', quote: '', supplierRef: '' });
  };

  return (
    <section className="bg-white border border-shade-border rounded-lg mt-6 overflow-hidden">
      <div className="flex flex-col xl:flex-row p-3 sm:p-4 gap-4">
        {/* Left Categories */}
        <div className="w-full xl:w-64 xl:flex-shrink-0">
          <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-1 gap-2 xl:space-y-1 xl:gap-0">
            {categories.map((cat, index) => (
              <li
                key={cat}
                onClick={() => setPage('listing', { category: cat })}
                className={`px-3 sm:px-4 py-2 rounded-md cursor-pointer transition-colors text-sm sm:text-base ${currentSlide === index ? 'bg-primary-light font-bold text-primary' : 'text-dark-light hover:bg-shade bg-[#F7F7F7]/60 xl:bg-transparent'}`}
              >
                {cat}
              </li>
            ))}
            {categories.length === 0 && (
              <li className="px-4 py-2 text-dark-light">No categories available</li>
            )}
          </ul>
        </div>

        {/* Main Banner Carousel */}
        <div
          className="flex-1 relative rounded-lg p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-cover bg-no-repeat bg-center min-h-[260px] sm:min-h-[320px] transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url("${bannerImages[currentSlide % bannerImages.length]}")` }}
        >
          {/* Gradient Overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/40 to-transparent rounded-lg"></div>

          <div className="relative z-10 w-full sm:w-2/3 lg:w-1/2 animate-fadeIn">
            <h3 className="text-xl sm:text-2xl font-normal text-dark mb-1">Latest trending</h3>
            <h2 className="text-[28px] sm:text-[32px] font-bold text-dark leading-tight mb-6 uppercase tracking-tight">
              {categories[currentSlide] || 'Electronic items'}
            </h2>
            <button
              onClick={() => setPage('listing', { category: categories[currentSlide] || 'Electronics' })}
              className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark transition-all shadow-lg active:scale-95 transform"
              aria-label={`Learn more about ${categories[currentSlide] || 'Electronics'}`}
            >
              Learn more
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3" role="tablist" aria-label="Slide navigation">
            {categories.slice(0, bannerImages.length).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                role="tab"
                aria-selected={currentSlide === i}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-3 h-3 min-w-[12px] min-h-[12px] rounded-full transition-all ${currentSlide === i ? 'bg-primary w-7' : 'bg-gray-300 hover:bg-gray-400'}`}
              ></button>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-60 flex flex-col sm:flex-row xl:flex-col gap-3">
          {/* Welcome Box */}
          <div className="bg-[#E3F0FF] p-4 rounded-lg sm:flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C3D9FF] flex items-center justify-center text-secondary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <div className="flex flex-col">
                <p className="text-dark text-sm font-medium">Hi, user</p>
                <p className="text-dark-light text-xs">let's get started</p>
              </div>
            </div>
            <button
              onClick={() => {
                setPage('profile');
                window.dispatchEvent(new CustomEvent('setAuthMode', { detail: 'signup' }));
              }}
              className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md mb-2 text-sm font-bold transition-all shadow-md active:scale-95"
              aria-label="Create a new account"
            >Join now</button>
            <button
              onClick={() => {
                setPage('profile');
                window.dispatchEvent(new CustomEvent('setAuthMode', { detail: 'login' }));
              }}
              className="w-full bg-white text-primary py-2 rounded-md text-sm font-bold border border-primary/20 hover:bg-primary/5 transition-all shadow-sm active:scale-95"
              aria-label="Log in to your account"
            >Log in</button>
          </div>

          {/* Promo 1 */}
          <div
            onClick={() => setPage('promo-modal')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setPage('promo-modal'); }}
            className="bg-orange p-4 rounded-lg flex-1 text-white bg-cover bg-no-repeat bg-center cursor-pointer hover:opacity-90 transition-all shadow-md min-h-[120px] flex items-end group"
            style={{ backgroundImage: `url("${promo1}")` }}
            aria-label="Get Rs. 1000 off with a new supplier"
          >
            <p className="text-sm font-bold leading-tight w-2/3 group-hover:translate-x-1 transition-transform">Get Rs. 1000 off with a new supplier</p>
          </div>

          {/* Promo 2 */}
          <div
            onClick={() => setShowQuoteForm(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowQuoteForm(true); }}
            className="bg-teal p-4 rounded-lg flex-1 text-white bg-cover bg-no-repeat bg-center cursor-pointer hover:opacity-90 transition-all shadow-md min-h-[120px] flex items-end group"
            style={{ backgroundImage: `url("${promo2}")` }}
            aria-label="Send quotes with supplier preferences"
          >
            <p className="text-sm font-bold leading-tight w-2/3 group-hover:translate-x-1 transition-transform">Send quotes with supplier preferences</p>
          </div>
        </div>
      </div>

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Send Quote with Supplier Reference</h3>
            <form onSubmit={handleQuoteSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={quoteData.name}
                  onChange={(e) => setQuoteData({ ...quoteData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Quote</label>
                <textarea
                  value={quoteData.quote}
                  onChange={(e) => setQuoteData({ ...quoteData, quote: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows="3"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Supplier Reference</label>
                <input
                  type="text"
                  value={quoteData.supplierRef}
                  onChange={(e) => setQuoteData({ ...quoteData, supplierRef: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Submit</button>
                <button type="button" onClick={() => setShowQuoteForm(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
