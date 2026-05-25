import React, { useState, useEffect } from 'react';
import { Star, Heart, ChevronRight, Tag, ArrowLeft } from 'lucide-react';

const hotOfferProducts = [];

const HotOffers = ({ setPage }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterCategory, setFilterCategory] = useState('All');
  const categories = ['All', 'Electronics', 'Home', 'Sports', 'Beauty', 'Fashion'];

  const filteredProducts = filterCategory === 'All'
    ? hotOfferProducts
    : hotOfferProducts.filter(p => p.category === filterCategory);

  return (
    <div className="container py-6">
      {/* Back Button */}
      <button
        onClick={() => setPage('home')}
        className="flex items-center gap-2 text-[#8B96A5] hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </button>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[#8B96A5] text-sm mb-6">
        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setPage('home')}>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1C1C1C] font-normal">Hot offers</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange to-orange-light rounded-lg p-8 mb-6">
        <div className="flex items-center gap-4">
          <Tag className="w-12 h-12 text-white" />
          <div>
            <h1 className="text-3xl font-bold text-white">Hot Offers</h1>
            <p className="text-white/80">Up to 50% off on selected items</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${filterCategory === cat
                ? 'bg-primary text-white'
                : 'bg-white border border-shade-border text-dark hover:bg-shade'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Count */}
      <div className="mb-4">
        <span className="text-dark font-semibold">{filteredProducts.length} hot offers found</span>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-[#DEE2E7] rounded-lg p-4 hover:shadow-lg transition-shadow group cursor-pointer relative"
            onClick={() => setPage('details', product)}
          >
            {/* Discount Badge */}
            <div className="absolute top-2 left-2 bg-[#FA3434] text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discount}%
            </div>

            {/* Wishlist Button */}
            <button
              className="absolute top-2 right-2 w-8 h-8 bg-white border border-[#DEE2E7] rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart size={16} />
            </button>

            {/* Product Image */}
            <div className="aspect-square flex items-center justify-center mb-4 bg-[#F7F7F7] rounded-lg p-4">
              <img
                src={product.image_url}
                alt={product.name}
                className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <span className="text-xs text-secondary">{product.category}</span>
              <h3 className="font-medium text-dark line-clamp-2">{product.name}</h3>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} size={12} className={i < Math.floor(product.rating) ? "fill-[#FF9017] text-[#FF9017]" : "text-[#D1D3D3]"} />
                  ))}
                </div>
                <span className="text-xs text-secondary">({product.reviews_count})</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#FA3434]">Rs. {product.price}</span>
                <span className="text-sm text-secondary line-through">Rs. {product.oldPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotOffers;