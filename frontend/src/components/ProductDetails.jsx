import React from 'react';
import { Star, Heart, MessageSquare, ShoppingBag, ShieldCheck, Globe, ChevronRight, ChevronDown, Check, Send, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useRelatedProducts, useReviews } from '../hooks/useProducts';

// Category Banner Images
import flagDE from '../assets/Layout1/Image/flags/DE@2x.png';


const ProductDetails = ({ setPage, handleBack, product, addToCart, toggleFavorite, favorites }) => {
   const [selectedThumb, setSelectedThumb] = React.useState(0);
   const [activeTab, setActiveTab] = React.useState('description');
   const [newReview, setNewReview] = React.useState({ rating: 5, comment: '', name: '' });
   const isFavorite = favorites.some(f => f.id === product?.id);

   const { data: relatedProducts = [], isLoading: loadingRelated } = useRelatedProducts(product?.category, product?.id);
   const { data: reviews = [], isLoading: loadingReviews, refetch: refetchReviews } = useReviews(product?.id);
   
   // We can reuse related products for recommended as well or just slice differently
   const recommendedProducts = relatedProducts.slice(0, 4);

   // Product images will be fetched from Supabase
   const thumbnails = product ? [product.image_url] : [];

   React.useEffect(() => {
      window.scrollTo(0, 0);
   }, [product]);


   const handleSubmitReview = async () => {
      if (!newReview.comment.trim() || !newReview.name.trim()) {
         alert('Please fill in all fields');
         return;
      }

      try {
         await api.reviews.create({
            product_id: product.id,
            rating: newReview.rating,
            comment: newReview.comment,
            name: newReview.name,
         });

         // Reset form and refresh reviews
         setNewReview({ rating: 5, comment: '', name: '' });
         await refetchReviews();
         alert('Review submitted successfully!');

      } catch (error) {
         console.error('Error submitting review:', error);
         alert('Failed to submit review. Please try again.');
      }
   };

   return (
      <div className="container py-4">
         {/* Breadcrumbs & Back Button */}
         <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2 text-[#8B96A5] text-sm">
               <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setPage('home')}>Home</span>
               <ChevronRight className="w-4 h-4" />
               <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setPage('listing')}>All Products</span>
               <ChevronRight className="w-4 h-4" />
               <span className="text-[#1C1C1C] font-normal">{product?.name || 'Product Details'}</span>
            </div>
            <button
               onClick={handleBack}
               className="flex items-center gap-2 text-[#505050] hover:text-primary transition-colors font-medium"
            >
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
               Back
            </button>
         </div>


         {/* Main Content Card */}
         <div className="bg-white border border-[#DEE2E7] rounded-lg p-4 sm:p-5 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8 shadow-sm">
            {/* Gallery Section */}
            <div className="lg:w-[450px] flex-shrink-0">
               <div className="border border-[#DEE2E7] rounded-lg p-4 sm:p-8 mb-4 flex items-center justify-center bg-[#F7F7F7] aspect-square overflow-hidden group">
                   <img src={thumbnails[selectedThumb]} alt="Product" width="450" height="450" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
               </div>
               <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  {thumbnails.map((img, i) => (
                     <div
                        key={i}
                        className={`w-[56px] h-[56px] border rounded-md cursor-pointer flex items-center justify-center p-1 bg-[#F7F7F7] hover:border-primary transition-colors ${selectedThumb === i ? 'border-primary shadow-sm' : 'border-[#DEE2E7]'}`}
                        onClick={() => setSelectedThumb(i)}
                     >
                        <img src={img} alt={`Product thumbnail ${i + 1}`} width="56" height="56" loading="lazy" className="max-w-[85%] max-h-[85%] object-contain" />
                     </div>
                  ))}
               </div>
            </div>

            {/* Product Info Section */}
            <div className="flex-1">
               {product ? (
                  <>
                     <div className="flex items-center gap-2 text-[#00B517] mb-2">
                        <Check size={20} />
                        <span className="text-sm font-medium">{product.stock > 0 ? 'In stock' : 'Out of stock'}</span>
                     </div>
                     <h1 className="text-xl lg:text-2xl font-bold text-[#1C1C1C] mb-4">
                        {product.name}
                     </h1>

                     {/* Ratings & Orders */}
                     <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                        <div className="flex items-center gap-1">
                           {[5, 4, 3, 2, 1].map((s, i) => <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-[#FF9017] text-[#FF9017]" : "text-[#D1D3D3]"} />)}
                           <span className="text-[#FF9017] text-sm ml-1">{product.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#8B96A5] text-sm">
                           <MessageSquare size={16} />
                           <span>{product.reviews_count} reviews</span>
                        </div>
                     </div>

                     {/* Pricing Block */}
                     <div className="bg-[#FFF0DF] p-4 rounded-lg flex flex-wrap gap-4 sm:gap-8 items-center mb-6">
                        <div className="flex flex-col">
                           <span className="text-xl lg:text-3xl font-bold text-[#FA3434]">Rs. {product.price}</span>
                        </div>
                     </div>
                  </>
               ) : (
                  <div className="text-center py-8 text-[#8B96A5]">Loading product...</div>
               )}

               {/* Product Meta Info */}
               <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
                     <span className="text-[#8B96A5]">Price:</span>
                     <span className="col-span-2 lg:col-span-3 text-[#505050]">Negotiable</span>
                  </div>
                  <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 text-sm border-t border-[#DEE2E7] pt-4">
                     <span className="text-[#8B96A5]">Type:</span>
                     <span className="col-span-2 lg:col-span-3 text-[#505050]">Classic shoe</span>
                  </div>
                  <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 text-sm border-t border-[#DEE2E7] pt-4">
                     <span className="text-[#8B96A5]">Material:</span>
                     <span className="col-span-2 lg:col-span-3 text-[#505050]">Plastic material</span>
                  </div>
                  <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 text-sm border-t border-[#DEE2E7] pt-4">
                     <span className="text-[#8B96A5]">Design:</span>
                     <span className="col-span-2 lg:col-span-3 text-[#505050]">Modern design</span>
                  </div>
               </div>

               <div className="h-[1px] bg-[#DEE2E7] mb-8"></div>

               {/* Action Buttons & Variations */}
               <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                     <span className="text-sm text-[#505050] sm:w-16">Size:</span>
                     <div className="flex flex-wrap gap-2">
                        {['Small', 'Medium', 'Large'].map(size => (
                           <button key={size} className="px-4 py-2 border border-[#DEE2E7] rounded-md text-sm font-medium hover:border-primary hover:text-primary transition-colors bg-white">
                              {size}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-3 sm:gap-4">
                     <button
                        className="flex-1 min-w-[150px] bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-bold transition-colors"
                        onClick={() => setPage('checkout', { ...product, total: product.price })}
                     >
                        Buy Now
                     </button>
                     <button
                        className="flex-1 min-w-[150px] bg-[#E3F0FF] hover:bg-[#D1E9FF] text-primary py-3 rounded-lg font-bold transition-colors"
                        onClick={() => addToCart(product)}
                     >
                        Add to Cart
                     </button>
                     <button
                        className={`w-full sm:w-12 h-12 flex items-center justify-center border border-[#DEE2E7] rounded-lg transition-colors ${isFavorite ? 'bg-primary text-white border-primary' : 'text-primary hover:bg-shade'}`}
                        onClick={() => toggleFavorite(product)}
                     >
                        <Heart size={20} className={isFavorite ? 'fill-white' : ''} />
                     </button>
                  </div>
               </div>
            </div>

            {/* Sidebar / Seller Info Section */}
            <div className="lg:w-[280px] space-y-4">
               {/* Seller Module */}
               <div className="bg-white border border-[#DEE2E7] rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-12 h-12 rounded-md bg-[#E3F0FF] flex items-center justify-center text-primary font-bold text-xl uppercase">R</div>
                     <div className="flex flex-col">
                        <span className="text-[#1C1C1C] font-normal">Supplier</span>
                        <span className="text-[#505050] text-sm">Guanjhou Trading Co.</span>
                     </div>
                  </div>
                  <div className="h-[1px] bg-[#DEE2E7] mb-4"></div>
                  <div className="space-y-3 mb-5">
                     <div className="flex items-center gap-3 text-sm text-[#8B96A5]">
                        <img src={flagDE} alt="DE" className="w-5 h-3 rounded-sm" />
                        <span>Germany, Berlin</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm text-[#8B96A5]">
                        <ShieldCheck size={18} />
                        <span>Verified Seller</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm text-[#8B96A5]">
                        <Globe size={18} />
                        <span>Worldwide shipping</span>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <button 
                        className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                        onClick={() => setPage('seller-profile', { 
                           name: product.seller || 'Guanjhou Trading Co.',
                           location: 'Germany, Berlin',
                           verified: true,
                           memberSince: '2022'
                        })}
                     >
                        Seller's profile
                     </button>
                  </div>
               </div>

               <div className="text-center p-4">
                  <button 
                     className={`flex items-center justify-center gap-2 font-medium hover:underline text-sm w-full transition-colors ${isFavorite ? 'text-primary' : 'text-[#505050] hover:text-primary'}`}
                     onClick={() => toggleFavorite(product)}
                  >
                     <Heart size={18} className={isFavorite ? 'fill-primary' : ''} />
                     <span>{isFavorite ? 'Favorited' : 'Save for later'}</span>
                  </button>
               </div>
            </div>
         </div>

         {/* Tabs Section Container */}
         <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
               <div className="bg-white border border-[#DEE2E7] rounded-lg overflow-hidden mb-8">
                  <div className="flex border-b border-[#DEE2E7] bg-white overflow-x-auto no-scrollbar">
                     {['description', 'reviews', 'shipping'].map((tab, i) => {
                        const tabLabel = tab.charAt(0).toUpperCase() + tab.slice(1);
                        return (
                           <button
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? 'text-primary border-primary' : 'text-[#8B96A5] border-transparent hover:text-primary'}`}
                           >
                              {tabLabel}
                           </button>
                        );
                     })}
                  </div>
                  <div className="p-4 sm:p-6 lg:p-8">
                     {/* Description Tab */}
                     {activeTab === 'description' && product && (
                        <div className="space-y-8 animate-fadeIn">
                           <div>
                              <h3 className="text-xl font-bold text-[#1C1C1C] mb-4">Product Description</h3>
                              <p className="text-[#505050] text-sm lg:text-base leading-relaxed mb-6 font-normal">
                                 {product.description}
                                 <br /><br />
                                 Experience unparalleled quality and performance with the {product.name}. Designed for professionals and enthusiasts alike, this product combines state-of-the-art technology with ergonomic design to deliver an exceptional user experience. Every detail has been meticulously crafted to ensure durability, efficiency, and aesthetic appeal.
                              </p>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                 <h4 className="font-bold text-[#1C1C1C] mb-4 flex items-center gap-2">
                                    <ShieldCheck className="text-primary w-5 h-5" />
                                    Key Features
                                 </h4>
                                 <ul className="space-y-3">
                                    {[
                                       "Premium quality materials for long-lasting durability",
                                       "Ergonomic design for maximum comfort and ease of use",
                                       "Advanced technology integration for superior performance",
                                       "Lightweight and portable for convenient handling",
                                       "Weather-resistant coating for all-condition reliability"
                                    ].map((feature, i) => (
                                       <li key={i} className="flex items-start gap-3 text-sm text-[#505050]">
                                          <Check className="text-[#00B517] w-4 h-4 mt-0.5 flex-shrink-0" />
                                          {feature}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                              <div>
                                 <h4 className="font-bold text-[#1C1C1C] mb-4 flex items-center gap-2">
                                    <Globe className="text-primary w-5 h-5" />
                                    Technical Specifications
                                 </h4>
                                 <div className="bg-[#F7F7F7] rounded-xl overflow-hidden border border-[#DEE2E7]">
                                    <table className="w-full text-sm text-left">
                                       <tbody className="divide-y divide-[#DEE2E7]">
                                          <tr className="bg-white/50">
                                             <td className="px-4 py-3 text-[#8B96A5] font-medium w-1/3">Model</td>
                                             <td className="px-4 py-3 text-[#1C1C1C] font-semibold">CC-2024-PRO</td>
                                          </tr>
                                          <tr>
                                             <td className="px-4 py-3 text-[#8B96A5] font-medium">Material</td>
                                             <td className="px-4 py-3 text-[#1C1C1C] font-semibold">High-Grade Composite</td>
                                          </tr>
                                          <tr className="bg-white/50">
                                             <td className="px-4 py-3 text-[#8B96A5] font-medium">Warranty</td>
                                             <td className="px-4 py-3 text-[#1C1C1C] font-semibold">1 Year Limited</td>
                                          </tr>
                                          <tr>
                                             <td className="px-4 py-3 text-[#8B96A5] font-medium">Origin</td>
                                             <td className="px-4 py-3 text-[#1C1C1C] font-semibold">Global Distribution</td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </div>
                              </div>
                           </div>

                           <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                              <h4 className="font-bold text-primary mb-3">Professional Summary</h4>
                              <p className="text-sm text-[#505050] italic leading-relaxed">
                                 "The {product.name} stands as a testament to our commitment to excellence. Whether you're using it for daily tasks or high-intensity professional work, it provides the reliability and precision you need to excel in your field. This product is rigorously tested to meet international standards of safety and performance."
                              </p>
                           </div>

                           <div className="bg-[#F7F7F7] p-6 rounded-xl border border-[#DEE2E7]">
                              <h4 className="font-bold text-[#1C1C1C] mb-4">Availability Details</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                                 <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-[#DEE2E7] shadow-sm">
                                    <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32]">
                                       <ShoppingBag size={20} />
                                    </div>
                                    <div>
                                       <span className="text-[#8B96A5] block">Current Status</span>
                                       <p className="font-bold text-[#1C1C1C]">{product.stock > 0 ? 'Ready for Dispatch' : 'Restocking Soon'}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-[#DEE2E7] shadow-sm">
                                    <div className="w-10 h-10 bg-[#E3F2FD] rounded-full flex items-center justify-center text-[#1565C0]">
                                       <Globe size={20} />
                                    </div>
                                    <div>
                                       <span className="text-[#8B96A5] block">Product Category</span>
                                       <p className="font-bold text-[#1C1C1C] uppercase tracking-tight">{product.category}</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* Reviews Tab */}
                     {activeTab === 'reviews' && (
                        <div>
                           <h3 className="text-lg font-bold text-[#1C1C1C] mb-6">Customer Reviews</h3>
                           
                           {/* Write Review Section */}
                           <div className="bg-[#F7F7F7] p-4 sm:p-6 rounded-lg mb-8">
                              <h4 className="font-bold text-[#1C1C1C] mb-4">Write Your Review</h4>
                              <div className="space-y-4">
                                 <div>
                                    <label className="block text-sm font-medium text-[#505050] mb-2">Your Name</label>
                                    <input
                                       type="text"
                                       value={newReview.name}
                                       onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                                       placeholder="Enter your name"
                                       className="w-full p-3 border border-[#DEE2E7] rounded-lg text-sm focus:outline-none focus:border-primary"
                                    />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-[#505050] mb-2">Rating</label>
                                    <div className="flex items-center gap-3">
                                       {[1, 2, 3, 4, 5].map((star) => (
                                          <button
                                             key={star}
                                             onClick={() => setNewReview({...newReview, rating: star})}
                                             className="focus:outline-none transition-transform hover:scale-110"
                                          >
                                             <Star
                                                size={24}
                                                className={star <= newReview.rating ? "fill-[#FFB400] text-[#FFB400]" : "text-[#D1D3D3]"}
                                             />
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-[#505050] mb-2">Your Review</label>
                                    <textarea
                                       value={newReview.comment}
                                       onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                       placeholder="Share your thoughts about this product..."
                                       className="w-full p-3 border border-[#DEE2E7] rounded-lg text-sm focus:outline-none focus:border-primary resize-none h-32"
                                    />
                                 </div>
                                 <button
                                    onClick={handleSubmitReview}
                                    className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                 >
                                    <Send size={16} />
                                    Submit Review
                                 </button>
                              </div>
                           </div>

                           {/* Reviews List */}
                           <h4 className="font-bold text-[#1C1C1C] mb-4">Customer Feedback ({reviews.length})</h4>
                           <div className="space-y-4">
                              {loadingReviews ? (
                                 <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                 </div>
                              ) : reviews.length === 0 ? (
                                 <div className="text-center py-8 bg-[#F7F7F7] rounded-lg">
                                    <AlertCircle size={32} className="text-[#8B96A5] mx-auto mb-2" />
                                    <p className="text-[#8B96A5]">No reviews yet. Be the first to review this product!</p>
                                 </div>
                              ) : (
                                 reviews.map((review, index) => (
                                    <div key={index} className="border-l-4 border-[#FFB400] bg-white p-4 rounded-lg">
                                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                          <div className="font-medium text-[#1C1C1C]">{review.name}</div>
                                          <div className="flex items-center gap-1">
                                             {[1, 2, 3, 4, 5].map((s, i) => (
                                                <Star key={i} size={14} className={i < review.rating ? "fill-[#FFB400] text-[#FFB400]" : "text-[#D1D3D3]"} />
                                             ))}
                                          </div>
                                       </div>
                                       <p className="text-[#505050] text-sm">{review.comment}</p>
                                       <p className="text-[#8B96A5] text-xs mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                                    </div>
                                 ))
                              )}
                           </div>
                        </div>
                     )}

                     {/* Shipping Tab */}
                     {activeTab === 'shipping' && (
                        <div>
                           <h3 className="text-lg font-bold text-[#1C1C1C] mb-6">Shipping Information</h3>
                           <div className="space-y-4">
                              <div className="border-l-4 border-[#007BFF] bg-[#E3F0FF] p-4 rounded-lg">
                                 <h4 className="font-medium text-[#1C1C1C] mb-2">Shipping Options</h4>
                                 <p className="text-[#505050] text-sm">
                                    We offer worldwide shipping with multiple carriers. Shipping costs and delivery times vary depending on your location.
                                 </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                 <div className="border border-[#DEE2E7] p-4 rounded-lg">
                                    <h5 className="font-medium text-[#1C1C1C] mb-2">Standard Shipping</h5>
                                    <p className="text-[#505050] text-sm mb-3">Delivery in 7-14 business days</p>
                                    <p className="font-bold text-primary">Rs. 500 - Rs. 1500</p>
                                 </div>
                                 <div className="border border-[#DEE2E7] p-4 rounded-lg">
                                    <h5 className="font-medium text-[#1C1C1C] mb-2">Express Shipping</h5>
                                    <p className="text-[#505050] text-sm mb-3">Delivery in 3-5 business days</p>
                                    <p className="font-bold text-primary">Rs. 2000 - Rs. 3500</p>
                                 </div>
                              </div>

                              <div className="bg-[#F7F7F7] p-4 rounded-lg mt-6">
                                 <h5 className="font-medium text-[#1C1C1C] mb-2">Return Policy</h5>
                                 <p className="text-[#505050] text-sm">
                                    Items can be returned within 30 days of purchase. Products must be in original condition with all packaging and accessories. Return shipping is free for defective items.
                                 </p>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Similar Products Sidebar - You may like */}
            <aside className="lg:w-[280px]">
               <div className="bg-white border border-[#DEE2E7] rounded-lg p-5">
                  <h4 className="font-bold text-[#1C1C1C] mb-4">You may like</h4>
                  <div className="space-y-4">
                     {recommendedProducts.length === 0 ? (
                        <p className="text-[#8B96A5] text-sm">No recommendations available</p>
                     ) : (
                        recommendedProducts.map((recProduct) => (
                           <div
                              key={recProduct.id}
                              className="border border-[#DEE2E7] rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => setPage('details', recProduct)}
                           >
                              <div className="bg-[#F7F7F7] rounded p-2 mb-2 h-32 flex items-center justify-center">
                                  <img src={recProduct.image_url} alt={recProduct.name} width="280" height="280" loading="lazy" className="max-w-full max-h-full object-contain" />
                              </div>
                              <h5 className="text-[#1C1C1C] font-medium text-sm line-clamp-2 mb-1">{recProduct.name}</h5>
                              <div className="flex items-center gap-1 mb-2">
                                 {[1, 2, 3, 4, 5].map((s, i) => (
                                    <Star key={i} size={12} className={i < Math.floor(recProduct.rating || 0) ? "fill-[#FFB400] text-[#FFB400]" : "text-[#D1D3D3]"} />
                                 ))}
                              </div>
                              <p className="font-bold text-primary text-sm">Rs. {recProduct.price}</p>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            </aside>
         </div>

         {/* Related Products Section */}
         <div className="bg-white border border-[#DEE2E7] rounded-lg p-5 lg:p-6 mb-8 mt-6">
            <h4 className="font-bold text-[#1C1C1C] text-lg mb-4">Related products</h4>
            {loadingRelated ? (
               <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
               </div>
            ) : relatedProducts.length === 0 ? (
               <div className="text-center py-8 text-[#8B96A5]">
                  <p>No related products found</p>
               </div>
            ) : (
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {relatedProducts.map((relProduct) => (
                     <div
                        key={relProduct.id}
                        className="border border-[#DEE2E7] rounded-lg p-3 hover:shadow-lg transition-shadow cursor-pointer bg-white"
                        onClick={() => setPage('details', relProduct)}
                     >
                        <div className="bg-[#F7F7F7] rounded p-2 mb-2 aspect-square flex items-center justify-center relative group">
                            <img src={relProduct.image_url} alt={relProduct.name} width="200" height="200" loading="lazy" className="max-w-full max-h-full object-contain" />
                           <button
                              className={`absolute top-1 right-1 p-1 backdrop-blur-sm rounded-full shadow hover:bg-white transition-colors ${favorites.some(f => f.id === relProduct.id) ? 'bg-primary text-white' : 'bg-white/90 text-[#505050]'}`}
                              onClick={(e) => {
                                 e.stopPropagation();
                                 toggleFavorite(relProduct);
                              }}
                           >
                              <Heart className={`w-3 h-3 ${favorites.some(f => f.id === relProduct.id) ? 'fill-white' : ''}`} />
                           </button>
                        </div>
                        <h5 className="text-[#1C1C1C] font-medium text-xs line-clamp-2 mb-1">{relProduct.name}</h5>
                        <div className="flex items-center gap-0.5 mb-1">
                           {[1, 2, 3, 4, 5].map((s, i) => (
                              <Star key={i} size={10} className={i < Math.floor(relProduct.rating || 0) ? "fill-[#FFB400] text-[#FFB400]" : "text-[#D1D3D3]"} />
                           ))}
                        </div>
                        <p className="font-bold text-primary text-xs">Rs. {relProduct.price}</p>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Super Discount Banner */}
         <div className="bg-gradient-to-r from-primary to-[#005ADE] rounded-lg p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8 text-white relative overflow-hidden">
            <div className="relative z-10 text-center md:text-left">
               <h2 className="text-xl lg:text-2xl font-bold mb-2">Super discount on more than 10000 Rs.</h2>
               <p className="opacity-80 text-sm">Have you ever finally just for dummy info.</p>
            </div>
            <button className="relative z-10 bg-[#FF9017] hover:bg-[#E38015] text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg">
               Shop now
            </button>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
         </div>
      </div>
   );
};

export default ProductDetails;
