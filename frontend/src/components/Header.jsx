import React, { useState, useEffect, useRef } from 'react';
import { User, MessageSquare, Heart, ShoppingCart, Menu, ChevronDown, HelpCircle, Truck, RotateCcw, Bell } from 'lucide-react';
import flagDE from '../assets/Layout1/Image/flags/DE@2x.png';
import { api } from '../lib/api';

const Header = ({ setPage, cartCount, favoritesCount, confirmedOrdersCount, isAdmin, userProfile }) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const [showShipToDropdown, setShowShipToDropdown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState(['Electronics', 'Clothing', 'Home', 'Sports']);
  const [selectedCountry, setSelectedCountry] = useState({ code: 'DE', name: 'Germany', flag: flagDE });
  const dropdownRef = useRef(null);
  const helpRef = useRef(null);
  const shipToRef = useRef(null);

  const countries = [
    { code: 'DE', name: 'Germany', flag: flagDE },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'FR', name: 'France' },
  ];

  const helpItems = [
    'Help Center',
    'Contact Us',
    'Shipping Info',
    'Returns',
    'FAQ',
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.products.getCategories();
      if (data && data.length > 0) {
        const uniqueCategories = data.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase());
        if (uniqueCategories.length > 0) {
          setCategories(uniqueCategories);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelpDropdown(false);
      }
      if (shipToRef.current && !shipToRef.current.contains(event.target)) {
        setShowShipToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);
  return (
    <header className="bg-white border-b border-shade-border lg:sticky top-0 z-50 shadow-sm">
      {/* Top Header */}
      <div className="container py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center justify-center lg:justify-start gap-6 w-full lg:w-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
            <span className="text-primary font-bold text-lg sm:text-xl">Core Collective</span>
          </div>
        </div>

        <div className="w-full lg:flex-1 lg:max-w-2xl flex flex-col sm:flex-row border-2 border-primary rounded-lg" role="search">
          <label htmlFor="header-search" className="sr-only">Search products</label>
          <input
            id="header-search"
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setPage('listing', { category: null, query: searchText.trim() });
              }
            }}
            className="flex-1 px-4 py-3 sm:py-2 outline-none min-w-0 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
            aria-label="Search products"
          />
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center sm:border-l px-4 py-2 bg-white cursor-pointer hover:bg-gray-50 h-full"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <span className="text-sm">All Categories</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </div>
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full sm:w-48 bg-gray-50 border border-gray-200 rounded-md shadow-lg z-10 max-h-[50vh] overflow-y-auto">
                {categories.map((cat, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setShowCategoryDropdown(false);
                      setPage('listing', { category: cat });
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            className="bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-3 sm:py-2 font-medium transition-colors w-full sm:w-auto rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none"
            onClick={() => setPage('listing', { category: null, query: searchText.trim() })}
            aria-label="Search products"
          >
            Search
          </button>
        </div>

        <div className="grid grid-cols-4 sm:flex items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
          <div className="flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors min-w-0" onClick={() => setPage('profile')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setPage('profile'); }} aria-label={userProfile ? `Profile: ${userProfile.name}` : 'Profile'}>
            <User className="w-5 h-5 mb-1" />
            <span className="text-[11px] sm:text-xs text-center truncate max-w-full">{userProfile ? (userProfile.name || 'Profile') : 'Profile'}</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors min-w-0" onClick={() => setPage('message')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setPage('message'); }} aria-label="Messages">
            <MessageSquare className="w-5 h-5 mb-1" />
            <span className="text-[11px] sm:text-xs text-center">Message</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors relative min-w-0" onClick={() => setPage('favorites')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setPage('favorites'); }} aria-label={`Favorites${favoritesCount > 0 ? `, ${favoritesCount} items` : ''}`}>
            <Heart className="w-5 h-5 mb-1" />
            <span className="text-[11px] sm:text-xs text-center">Favorites</span>
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm" aria-hidden="true">
                {favoritesCount}
              </span>
            )}
          </div>
          <div className="flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors relative min-w-0" onClick={() => setPage('cart')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setPage('cart'); }} aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}>
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-[11px] sm:text-xs text-center">My cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#00B517] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Header */}
      <div className="border-t border-shade-border bg-white lg:overflow-visible no-scrollbar">
        <div className="container py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between whitespace-nowrap gap-3 sm:gap-4">
          <nav className="flex flex-wrap items-center gap-4 sm:gap-6 font-medium text-dark text-sm sm:text-base w-full pb-1 sm:pb-0">
            <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors" onClick={() => setPage('listing')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setPage('listing'); }} aria-label="All categories">
              <Menu className="w-5 h-5" />
              <span>All Categories</span>
            </div>
            <a href="#" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); setPage('hot-offers'); }} aria-label="View hot offers">Hot Offers</a>
            <a href="#" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); setPage('gift-boxes'); }} aria-label="View gift boxes">Gift Boxes</a>
            <a href="#" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); setPage('projects'); }} aria-label="View projects">Projects</a>
            <a href="#" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); setPage('menu-items'); }} aria-label="View menu items">Menu Items</a>
            {isAdmin && (
              <span
                className="bg-primary/10 text-primary px-3 py-1 rounded-md font-bold cursor-pointer hover:bg-primary/20 transition-all border border-primary/20 flex items-center"
                onClick={() => setPage('admin')}
              >
                Admin
              </span>
            )}
            <div className="relative" ref={helpRef}>
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                onClick={() => setShowHelpDropdown(!showHelpDropdown)}
              >
                <span>Help</span>
                <ChevronDown className={`w-4 h-4 transform transition-transform ${showHelpDropdown ? 'rotate-180' : ''}`} />
              </div>
              {showHelpDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-[50vh] overflow-y-auto">
                  {helpItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2 transition-colors"
                      onClick={() => {
                        setShowHelpDropdown(false);
                        if (idx === 0) setPage('help-center');
                        else if (idx === 1) setPage('contact-us');
                        else if (idx === 2) setPage('shipping-info');
                        else if (idx === 3) setPage('returns-info');
                        else setPage('faq');
                      }}
                    >
                      {idx === 0 && <HelpCircle className="w-4 h-4" />}
                      {idx === 1 && <MessageSquare className="w-4 h-4" />}
                      {idx === 2 && <Truck className="w-4 h-4" />}
                      {idx === 3 && <RotateCcw className="w-4 h-4" />}
                      {idx === 4 && <HelpCircle className="w-4 h-4" />}
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center justify-end gap-4 sm:gap-6 font-medium text-dark w-full sm:w-auto text-sm sm:text-base">
            {/* Notification Bell */}
            <div
              className="relative cursor-pointer hover:text-primary transition-colors group"
              onClick={() => setPage('notifications')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setPage('notifications'); }}
              aria-label={`Notifications${confirmedOrdersCount > 0 ? `, ${confirmedOrdersCount} unread` : ''}`}
            >
              <Bell className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
              {confirmedOrdersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FA3434] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm border border-white" aria-hidden="true">
                  {confirmedOrdersCount}
                </span>
              )}
            </div>

            <div className="relative" ref={shipToRef}>
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                onClick={() => setShowShipToDropdown(!showShipToDropdown)}
              >
                <span>Ship to</span>
                {selectedCountry.flag ? (
                  <img src={selectedCountry.flag} alt={selectedCountry.code} className="w-5 h-3 rounded-sm shadow-sm" />
                ) : (
                  <span className="text-sm font-medium">{selectedCountry.code}</span>
                )}
                <ChevronDown className={`w-4 h-4 text-secondary transform transition-transform ${showShipToDropdown ? 'rotate-180' : ''}`} />
              </div>
              {showShipToDropdown && (
                <div className="absolute top-full left-0 sm:right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-[50vh] overflow-y-auto">
                  {countries.map((country, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2 transition-colors"
                      onClick={() => {
                        setSelectedCountry(country);
                        setShowShipToDropdown(false);
                      }}
                    >
                      {country.flag && <img src={country.flag} alt={country.code} className="w-5 h-3 rounded-sm shadow-sm" />}
                      <span>{country.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
