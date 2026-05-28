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
    <section className="bg-white border border-gray-200 rounded-2xl mt-6 overflow-hidden shadow-card">
      <div className="flex flex-col xl:flex-row p-3 sm:p-4 gap-4">
        {/* Left Categories */}
        <div className="w-full xl:w-64 xl:flex-shrink-0">
          <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-1 gap-2 xl:gap-0">
            {categories.map((cat, index) => (
              <li
                key={cat}
                onClick={() => setPage('listing', { category: cat })}
                className={`px-3 sm:px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 text-sm sm:text-base ${currentSlide === index ? 'bg-primary-50 font-bold text-primary border-l-2 border-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 bg-gray-50/50 xl:bg-transparent'}`}
              >
                {cat}
              </li>
            ))}
            {categories.length === 0 && (
              <li className="px-4 py-2 text-gray-400">No categories available</li>
            )}
          </ul>
        </div>

        {/* Main Banner Carousel */}
        <div
          className="flex-1 relative rounded-xl p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-cover bg-no-repeat bg-center min-h-[260px] sm:min-h-[320px] transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url("${bannerImages[currentSlide % bannerImages.length]}")` }}
        >
          {/* Gradient Overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/30 to-transparent rounded-xl"></div>

          <div className="relative z-10 w-full sm:w-2/3 lg:w-1/2 animate-fadeIn">
            <h1 className="text-xl sm:text-2xl font-normal text-gray-900 mb-1">Latest trending</h1>
            <h2 className="text-[28px] sm:text-[32px] font-bold text-gray-900 leading-tight mb-6 uppercase tracking-tight">
              {categories[currentSlide] || 'Electronic items'}
            </h2>
            <button
              onClick={() => setPage('listing', { category: categories[currentSlide] || 'Electronics' })}
              className="btn-primary inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
              aria-label={`Learn more about ${categories[currentSlide] || 'Electronics'}`}
            >
              Learn more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" role="tablist" aria-label="Slide navigation">
            {categories.slice(0, bannerImages.length).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                role="tab"
                aria-selected={currentSlide === i}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${currentSlide === i ? 'bg-primary w-8 h-2.5' : 'bg-gray-300 hover:bg-gray-400 w-2.5 h-2.5'}`}
              ></button>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-60 flex flex-col sm:flex-row xl:flex-col gap-3">
          {/* Welcome Box */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl sm:flex-1 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-primary-600 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-800 text-sm font-medium">Hi, user</p>
                <p className="text-gray-500 text-xs">let's get started</p>
              </div>
            </div>
            <button
              onClick={() => {
                setPage('profile');
                window.dispatchEvent(new CustomEvent('setAuthMode', { detail: 'signup' }));
              }}
              className="w-full btn-primary text-sm py-2 mb-2"
              aria-label="Create a new account"
            >Join now</button>
            <button
              onClick={() => {
                setPage('profile');
                window.dispatchEvent(new CustomEvent('setAuthMode', { detail: 'login' }));
              }}
              className="w-full bg-white text-primary py-2 rounded-lg text-sm font-semibold border border-primary/20 hover:bg-primary-50 transition-all duration-200 shadow-sm active:scale-[0.97]"
              aria-label="Log in to your account"
            >Log in</button>
          </div>

          {/* Promo 1 */}
          <div
            onClick={() => setPage('promo-modal')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setPage('promo-modal'); }}
            className="bg-gradient-to-br from-warning to-orange-500 p-4 rounded-xl flex-1 text-white bg-cover bg-no-repeat bg-center cursor-pointer hover:opacity-95 transition-all duration-300 shadow-md hover:shadow-lg min-h-[120px] flex items-end group"
            style={{ backgroundImage: `url("${promo1}")` }}
            aria-label="Get Rs. 1000 off with a new supplier"
          >
            <p className="text-sm font-bold leading-tight w-2/3 group-hover:translate-x-1.5 transition-transform duration-300 drop-shadow-sm">Get Rs. 1000 off with a new supplier</p>
          </div>

          {/* Promo 2 */}
          <div
            onClick={() => setShowQuoteForm(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowQuoteForm(true); }}
            className="bg-gradient-to-br from-success to-green-600 p-4 rounded-xl flex-1 text-white bg-cover bg-no-repeat bg-center cursor-pointer hover:opacity-95 transition-all duration-300 shadow-md hover:shadow-lg min-h-[120px] flex items-end group"
            style={{ backgroundImage: `url("${promo2}")` }}
            aria-label="Send quotes with supplier preferences"
          >
            <p className="text-sm font-bold leading-tight w-2/3 group-hover:translate-x-1.5 transition-transform duration-300 drop-shadow-sm">Send quotes with supplier preferences</p>
          </div>
        </div>
      </div>

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full mx-4 shadow-modal animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Send Quote</h3>
              <button onClick={() => setShowQuoteForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input type="text" value={quoteData.name} onChange={(e) => setQuoteData({ ...quoteData, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Quote</label>
                <textarea value={quoteData.quote} onChange={(e) => setQuoteData({ ...quoteData, quote: e.target.value })} className="input-field" rows="3" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Supplier Reference</label>
                <input type="text" value={quoteData.supplierRef} onChange={(e) => setQuoteData({ ...quoteData, supplierRef: e.target.value })} className="input-field" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Submit</button>
                <button type="button" onClick={() => setShowQuoteForm(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
