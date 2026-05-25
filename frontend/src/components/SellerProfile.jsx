import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Globe, MapPin, Calendar, Mail, Phone, MessageSquare, ChevronRight, Filter, Search, Grid, List as ListIcon } from 'lucide-react';
import { api } from '../lib/api';

const SellerProfile = ({ setPage, handleBack, sellerData, addToCart, toggleFavorite, favorites }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('grid');
  const [activeCategory, setActiveCategory] = useState('All');

  const seller = sellerData || {
    name: 'Guanjhou Trading Co.',
    location: 'Germany, Berlin',
    verified: true,
    memberSince: '2022',
    rating: 4.8,
    reviews: 1250,
    responseRate: '98%',
    deliveryTime: '3-5 days'
  };

  useEffect(() => {
    fetchSellerProducts();
    window.scrollTo(0, 0);
  }, []);

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      const data = await api.products.getSellerProducts(12);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching seller products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-12">
      {/* Header Banner */}
      <div className="bg-primary h-32 sm:h-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-[#005ADE] opacity-90"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        
        {/* Back Button */}
        <div className="container relative h-full flex items-center">
            <button
                onClick={handleBack}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Back
            </button>
        </div>
      </div>


      <div className="container -mt-16 sm:-mt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Seller Stats */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#DEE2E7]">
              <div className="p-6 text-center border-b border-[#F0F2F5]">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-[#E3F0FF] flex items-center justify-center text-primary font-bold text-4xl sm:text-5xl uppercase mx-auto mb-4 shadow-inner border-4 border-white">
                  {seller.name.charAt(0)}
                </div>
                <h1 className="text-xl font-bold text-[#1C1C1C] mb-1">{seller.name}</h1>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="flex items-center gap-1 text-[#FF9017]">
                    <Star size={16} className="fill-current" />
                    <span className="font-bold">{seller.rating}</span>
                  </div>
                  <span className="text-[#8B96A5] text-sm">({seller.reviews} reviews)</span>
                </div>
                {seller.verified && (
                  <div className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    <ShieldCheck size={14} />
                    Verified Seller
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95">
                    Contact Seller
                  </button>
                  <button className="w-12 bg-white border border-[#DEE2E7] hover:bg-gray-50 text-primary flex items-center justify-center rounded-xl transition-all">
                    <MessageSquare size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[#505050]">
                    <MapPin size={18} className="text-[#8B96A5]" />
                    <span className="text-sm">{seller.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#505050]">
                    <Calendar size={18} className="text-[#8B96A5]" />
                    <span className="text-sm">Member since {seller.memberSince}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#505050]">
                    <Globe size={18} className="text-[#8B96A5]" />
                    <span className="text-sm">Global Shipping</span>
                  </div>
                </div>

                <div className="h-[1px] bg-[#F0F2F5]"></div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-[#8B96A5] mb-1">
                      <span>Response Rate</span>
                      <span className="font-bold text-[#1C1C1C]">{seller.responseRate}</span>
                    </div>
                    <div className="h-1.5 bg-[#F0F2F5] rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: seller.responseRate }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-[#8B96A5] mb-1">
                      <span>On-time Delivery</span>
                      <span className="font-bold text-[#1C1C1C]">95%</span>
                    </div>
                    <div className="h-1.5 bg-[#F0F2F5] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00B517]" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg mt-6 p-6 border border-[#DEE2E7]">
              <h3 className="font-bold text-[#1C1C1C] mb-4">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#8B96A5]">
                    <Mail size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#8B96A5] uppercase font-bold tracking-widest">Email</span>
                    <span className="text-sm text-[#1C1C1C]">contact@{seller.name.toLowerCase().split(' ')[0]}.com</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#8B96A5]">
                    <Phone size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#8B96A5] uppercase font-bold tracking-widest">Phone</span>
                    <span className="text-sm text-[#1C1C1C]">+49 30 12345678</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Products */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg border border-[#DEE2E7] mb-6 overflow-hidden">
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-[#1C1C1C]">Products</h2>
                  <span className="text-sm text-[#8B96A5] bg-gray-100 px-3 py-1 rounded-full">{filteredProducts.length} items</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setViewType('grid')}
                      className={`p-1.5 rounded-md transition-all ${viewType === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-[#8B96A5] hover:text-[#1C1C1C]'}`}
                    >
                      <Grid size={18} />
                    </button>
                    <button 
                      onClick={() => setViewType('list')}
                      className={`p-1.5 rounded-md transition-all ${viewType === 'list' ? 'bg-white shadow-sm text-primary' : 'text-[#8B96A5] hover:text-[#1C1C1C]'}`}
                    >
                      <ListIcon size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Filters */}
              <div className="px-4 sm:px-6 pb-4 flex gap-2 overflow-x-auto no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-[#505050] hover:bg-gray-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-lg border border-[#DEE2E7]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-[#8B96A5]">Loading seller's products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-lg border border-[#DEE2E7]">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-[#8B96A5] mb-4">
                  <Search size={32} />
                </div>
                <p className="text-[#8B96A5] font-medium">No products found in this category</p>
              </div>
            ) : (
              <div className={viewType === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
                : "space-y-4"
              }>
                {filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    className={`group bg-white border border-[#DEE2E7] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer ${viewType === 'list' ? 'flex items-center p-4' : ''}`}
                    onClick={() => setPage('details', product)}
                  >
                    {/* Image */}
                    <div className={`relative bg-[#F7F8FA] overflow-hidden ${viewType === 'list' ? 'w-32 h-32 sm:w-40 sm:h-40 rounded-xl flex-shrink-0' : 'aspect-square'}`}>
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-4"
                      />
                      <button 
                        className={`absolute top-3 right-3 p-2 rounded-full shadow-lg backdrop-blur-md transition-all ${favorites.some(f => f.id === product.id) ? 'bg-primary text-white scale-110' : 'bg-white/80 text-[#8B96A5] hover:text-primary hover:bg-white'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product);
                        }}
                      >
                        <Star size={16} className={favorites.some(f => f.id === product.id) ? 'fill-current' : ''} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className={`p-4 ${viewType === 'list' ? 'flex-1 pl-6' : ''}`}>
                      <div className="flex items-center gap-1 mb-1">
                        <div className="flex text-[#FF9017]">
                          <Star size={12} className="fill-current" />
                        </div>
                        <span className="text-[10px] font-bold text-[#FF9017]">{product.rating}</span>
                      </div>
                      <h3 className={`text-[#1C1C1C] font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors ${viewType === 'list' ? 'text-lg' : 'text-sm'}`}>
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className={`text-primary font-bold ${viewType === 'list' ? 'text-xl' : 'text-base'}`}>
                          Rs. {product.price}
                        </span>
                        {viewType === 'list' && (
                          <button 
                            className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary hover:text-white transition-all active:scale-95"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
