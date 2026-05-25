import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Grid, List, ChevronDown, Star, Heart, X } from 'lucide-react';
import { useProducts, useCategories } from '../hooks/useProducts';


const ProductListing = ({ setPage, handleBack, category, query, productsOverride, addToCart, toggleFavorite, favorites }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: productsData = [], isLoading: productsLoading } = useProducts(query);
  const { categoryList: categoryOptions, isLoading: categoriesLoading } = useCategories();

  const loading = productsLoading || categoriesLoading;
  const products = useMemo(() => {
    const normalized = (productsData || []).map((product) => ({
      ...product,
      image_url: product.image_url || product.image || '',
    }));

    const seenKeys = new Set();
    return normalized.filter((product) => {
      const key = product.name ? product.name.trim().toLowerCase() : String(product.id);
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });
  }, [productsData]);

  const itemsPerPage = 20;
  const isFavoritesPage = category === 'My Favorites';

  useEffect(() => {
    if (isFavoritesPage) {
      setSelectedCategories([]);
      return;
    }

    setSelectedCategories(category ? [category] : []);
    setPriceRange({ min: '', max: '' });
    setSelectedRating(null);
    setCurrentPage(1);
  }, [category, isFavoritesPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, priceRange.min, priceRange.max, selectedRating, productsOverride]);


  const baseProducts = productsOverride || products;
  const minPrice = priceRange.min === '' ? null : parseFloat(priceRange.min);
  const maxPrice = priceRange.max === '' ? null : parseFloat(priceRange.max);

  const filteredProducts = useMemo(() => (
    baseProducts.filter((product) => {
      const productPrice = Number(product.price) || 0;
      const productRating = Number(product.rating) || 0;

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesMinPrice = minPrice === null || productPrice >= minPrice;
      const matchesMaxPrice = maxPrice === null || productPrice <= maxPrice;
      const matchesRating = selectedRating === null || productRating >= selectedRating;

      return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating;
    })
  ), [baseProducts, maxPrice, minPrice, selectedCategories, selectedRating]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const activeFilters = [
    ...selectedCategories,
    ...(minPrice !== null || maxPrice !== null
      ? [`Price: Rs. ${minPrice ?? 0} - Rs. ${maxPrice ?? 'Any'}`]
      : []),
    ...(selectedRating !== null ? [`${selectedRating}+ stars`] : []),
  ];

  const displayTitle = (() => {
    if (isFavoritesPage) return 'My Favorites';
    if (selectedCategories.length === 1) return selectedCategories[0];
    if (selectedCategories.length > 1) return 'Filtered Products';
    return 'All Products';
  })();

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setSelectedRating(null);
  };

  const removeFilter = (filter) => {
    if (selectedCategories.includes(filter)) {
      setSelectedCategories((prev) => prev.filter((item) => item !== filter));
      return;
    }

    if (filter.startsWith('Price:')) {
      setPriceRange({ min: '', max: '' });
      return;
    }

    if (filter.endsWith('stars')) {
      setSelectedRating(null);
    }
  };

  const handleCategoryChange = (selectedCategory) => {
    setSelectedCategories((prev) => (
      prev.includes(selectedCategory)
        ? prev.filter((item) => item !== selectedCategory)
        : [selectedCategory]
    ));
  };

  const handleRatingChange = (rating) => {
    setSelectedRating((prev) => (prev === rating ? null : rating));
  };

  return (
    <div className="container py-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2 text-[#8B96A5] text-sm">
          <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setPage('home')}>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1C1C1C] font-normal">{displayTitle}</span>
        </div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#505050] hover:text-primary transition-colors font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-[240px] lg:flex-shrink-0 space-y-2 bg-white border border-[#DEE2E7] rounded-lg p-4 lg:p-0 lg:bg-transparent lg:border-0">
          <div className="lg:border-t border-[#DEE2E7] lg:py-3">
            <h4 className="font-bold text-[#1C1C1C] mb-3 flex justify-between items-center cursor-pointer">
              Category <ChevronDown className="w-4 h-4 opacity-50" />
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 text-[#505050] text-sm">
              {categoryOptions.map((cat) => (
                <li key={cat} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`cat-${cat}`}
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`cat-${cat}`} className="cursor-pointer">{cat}</label>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#DEE2E7] pt-4 lg:py-3">
            <h4 className="font-bold text-[#1C1C1C] mb-3">Price</h4>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                className="w-full p-2 border border-[#DEE2E7] rounded text-sm"
              />
              <span>-</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                className="w-full p-2 border border-[#DEE2E7] rounded text-sm"
              />
            </div>
          </div>

          <div className="border-t border-[#DEE2E7] pt-4 lg:py-3">
            <h4 className="font-bold text-[#1C1C1C] mb-3">Customer Rating</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="w-4 h-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < rating ? 'fill-[#FFB400] text-[#FFB400]' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-[#8B96A5]">& Up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="border-t border-[#DEE2E7] py-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-[#1C1C1C]">Active Filters</h4>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#8B96A5] hover:text-primary underline"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <span
                    key={filter}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#F5F5F5] text-xs rounded"
                  >
                    {filter}
                    <button
                      onClick={() => removeFilter(filter)}
                      className="ml-1 text-[#8B96A5] hover:text-dark"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C1C]">{displayTitle}</h2>
              <p className="text-sm text-[#8B96A5]">
                {currentProducts.length > 0 ? `${currentProducts.length} of ${filteredProducts.length}` : '0'} products {isFavoritesPage ? 'in wishlist' : 'found'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#007BFF] text-white' : 'bg-[#F5F5F5] text-[#505050]'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#007BFF] text-white' : 'bg-[#F5F5F5] text-[#505050]'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#8B96A5] text-lg">{isFavoritesPage ? 'No items in your favorites yet' : 'No products found'}</p>
              <p className="text-sm text-[#8B96A5] mt-2">{isFavoritesPage ? 'Click the heart icon on products to add them to your favorites!' : 'Try adjusting your filters or check back later.'}</p>
            </div>
          ) : (
            <>
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white border border-[#DEE2E7] rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                    onClick={() => setPage('details', product)}
                  >
                    <div className={`relative ${viewMode === 'grid' ? 'aspect-square' : 'w-full md:w-[250px] aspect-square md:aspect-auto h-48 md:h-auto'} bg-[#F7F7F7] flex-shrink-0 flex items-center justify-center p-4`}>
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8B96A5]">
                          No image
                        </div>
                      )}
                      <button
                        className={`absolute top-2 right-2 p-1.5 backdrop-blur-sm rounded-full shadow hover:bg-white transition-colors ${favorites.some((fav) => fav.id === product.id) ? 'bg-primary text-white' : 'bg-white/90 text-[#505050]'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product);
                        }}
                      >
                        <Heart className={`w-4 h-4 ${favorites.some((fav) => fav.id === product.id) ? 'fill-white' : ''}`} />
                      </button>
                    </div>
                    <div className={`p-4 flex-1 flex flex-col ${viewMode === 'list' ? 'justify-center' : ''}`}>
                      <h3 className={`font-medium text-[#1C1C1C] mb-1 line-clamp-2 ${viewMode === 'list' ? 'text-lg' : 'text-sm'}`}>{product.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 0) ? 'fill-[#FFB400] text-[#FFB400]' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#8B96A5] ml-1">({product.reviews_count || 0})</span>
                      </div>
                      <p className="font-bold text-[#1C1C1C] text-xl mb-2">Rs. {product.price}</p>

                      {viewMode === 'list' && (
                        <p className="text-[#505050] text-sm line-clamp-3 mb-4">{product.description}</p>
                      )}

                      {viewMode === 'list' && (
                        <div className="flex flex-wrap gap-3 mt-auto">
                          <button
                            className="text-primary font-medium text-sm hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPage('details', product);
                            }}
                          >
                            View details
                          </button>
                          <span className="text-[#DEE2E7]">|</span>
                          <button
                            className="text-[#00B517] font-medium text-sm hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                          >
                            Add to cart
                          </button>
                          {isFavoritesPage && (
                            <>
                              <span className="text-[#DEE2E7]">|</span>
                              <button
                                className="text-[#FA3434] font-medium text-sm hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(product);
                                }}
                              >
                                Remove
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      {viewMode === 'grid' && isFavoritesPage && (
                        <button
                          className="mt-2 w-full px-3 py-2 bg-[#FA3434] hover:bg-[#E32E2E] text-white rounded-lg text-sm font-medium transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product);
                          }}
                        >
                          Remove from Favorites
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-[#DEE2E7] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5]"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-primary text-white' : 'border border-[#DEE2E7] hover:bg-[#F5F5F5]'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-[#DEE2E7] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5]"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;
