import React, { useState, useEffect } from 'react';
import { Star, Heart, ChevronRight, Menu, List, Grid, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';

const MenuItems = ({ setPage, handleBack }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterCategory, setFilterCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.products.getAll();

      if (data && data.length > 0) {
        const formattedProducts = data.map(product => ({
          ...product,
          image_url: product.image_url || product.image || ''
        }));
        setProducts(formattedProducts);

        const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
        setCategories(['All', ...uniqueCategories]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = filterCategory === 'All'
    ? products
    : products.filter(item => item.category === filterCategory);

  return (
    <div className="container py-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-[#8B96A5] hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[#8B96A5] text-sm mb-6">
        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setPage('home')}>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1C1C1C] font-normal">Menu items</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FF9017] to-orange-light rounded-lg p-8 mb-6">
        <div className="flex items-center gap-4">
          <Menu className="w-12 h-12 text-white" />
          <div>
            <h1 className="text-3xl font-bold text-white">Menu Items</h1>
            <p className="text-white/80">Browse all product categories</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${filterCategory === cat
                  ? 'bg-[#FF9017] text-white'
                  : 'bg-white border border-shade-border text-dark hover:bg-shade'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex border border-[#DEE2E7] rounded-md overflow-hidden">
          <div
            className={`p-2 cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-[#EFF2F4]' : 'hover:bg-shade'}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={18} className="text-[#1C1C1C]" />
          </div>
          <div
            className={`p-2 cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-[#EFF2F4]' : 'hover:bg-shade'}`}
            onClick={() => setViewMode('list')}
          >
            <List size={18} className="text-[#1C1C1C]" />
          </div>
        </div>
      </div>

      {/* Items Count */}
      <div className="mb-4">
        <span className="text-dark font-semibold">{filteredItems.length} menu items available</span>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9017]"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#8B96A5] text-lg">No items found</p>
        </div>
      ) : (
        /* Products Grid/List View */
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#DEE2E7] rounded-lg p-4 hover:shadow-lg transition-shadow group cursor-pointer relative"
                onClick={() => setPage('details', item)}
              >
                {/* Category Badge */}
                <div className="absolute top-2 left-2 bg-[#8B96A5] text-white text-xs font-bold px-2 py-1 rounded">
                  {item.category}
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
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-[#8B96A5]">No image</div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-medium text-dark line-clamp-2">{item.name}</h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} size={12} className={i < Math.floor(item.rating || 0) ? "fill-[#FF9017] text-[#FF9017]" : "text-[#D1D3D3]"} />
                      ))}
                    </div>
                    <span className="text-xs text-secondary">({item.reviews_count || 0})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#1C1C1C]">Rs. {item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#DEE2E7] rounded-lg p-4 hover:shadow-md transition-shadow group cursor-pointer flex gap-4"
                onClick={() => setPage('details', item)}
              >
                {/* Product Image */}
                <div className="w-[120px] h-[120px] flex-shrink-0 bg-[#F7F7F7] rounded-lg p-4 flex items-center justify-center">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-[#8B96A5]">No image</div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-xs text-secondary">{item.category}</span>
                      <h3 className="font-medium text-dark">{item.name}</h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex gap-0.5">
                          {Array(5).fill(0).map((_, i) => (
                            <Star key={i} size={12} className={i < Math.floor(item.rating || 0) ? "fill-[#FF9017] text-[#FF9017]" : "text-[#D1D3D3]"} />
                          ))}
                        </div>
                        <span className="text-xs text-secondary">({item.reviews_count || 0})</span>
                      </div>
                    </div>

                    {/* Price & Wishlist */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xl font-bold text-[#1C1C1C]">Rs. {item.price}</span>
                      <button
                        className="w-10 h-10 bg-white border border-[#DEE2E7] rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MenuItems;
