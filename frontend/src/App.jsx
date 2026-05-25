import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Deals from './components/Deals';
import CategorySection from './components/CategorySection';
import InquiryForm from './components/InquiryForm';
import RecommendedItems from './components/RecommendedItems';
import Services from './components/Services';
import RegionSuppliers from './components/RegionSuppliers';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ProductListing from './components/ProductListing';
import ProductDetails from './components/ProductDetails';
import HotOffers from './components/HotOffers';
import GiftBoxes from './components/GiftBoxes';
import Projects from './components/Projects';
import MenuItems from './components/MenuItems';
import HelpCenter from './components/HelpCenter';
import ContactUs from './components/ContactUs';
import ShippingInfo from './components/ShippingInfo';
import ReturnsInfo from './components/ReturnsInfo';
import FAQ from './components/FAQ';
import Cart from './components/Cart';
import Profile from './components/Profile';
import Chatbot from './components/Chatbot';
import Orders from './components/Orders';
import Checkout from './components/Checkout';
import AdminPanel from './components/AdminPanel';
import SellerProfile from './components/SellerProfile';
import Notifications from './components/Notifications';
import { api } from './lib/api';
import { useCategories, useConfirmedOrdersCount } from './hooks/useProducts';


// Category Banner Images
import homeBanner from './assets/Image/backgrounds/image 98.png';
import electronicsBanner from './assets/Image/backgrounds/image 106.png';
import interiorBanner from './assets/Image/backgrounds/image 107.png';
import petsBanner from './assets/Image/backgrounds/Mask group.png';
import clothesBanner from './assets/Image/backgrounds/Mask group (1).png';
import sportsBanner from './assets/Image/backgrounds/Group 969.png';
import beautyBanner from './assets/Image/backgrounds/Group 982.png';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showLogo, setShowLogo] = useState(true);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Cart & Favorites State
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [navigationData, setNavigationData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);


  // Category items will be fetched from Supabase via React Query
  const { categories, categoryList } = useCategories();
  const { data: confirmedOrdersCountResult } = useConfirmedOrdersCount(userProfile?.id);
  const confirmedOrdersCount = confirmedOrdersCountResult || 0;

  useEffect(() => {
    api.auth.getSession().then((data) => {
      const session = data?.session;
      const user = session?.user;
      if (user) {
        setUserProfile({
          id: user.id,
          name: user.user_metadata?.full_name || user.email.split('@')[0],
          email: user.email
        });
        setIsAdmin(user.email === 'rehanilyas20196@gmail.com');
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const totalCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
    setCartCount(totalCount);
  }, [cartItems]);

  const addToCart = (product) => {
    if (!userProfile) {
      alert('Please log in to add items to your cart.');
      handleSetPage('profile');
      window.dispatchEvent(new CustomEvent('setAuthMode', { detail: 'login' }));
      return;
    }
    const normalizedProduct = {
      ...product,
      title: product.title || product.name || 'Product',
      name: product.name || product.title || 'Product',
      image: product.image || product.image_url || '',
      image_url: product.image_url || product.image || '',
      seller: product.seller || product.supplier || 'Core Collective',
      specs: product.specs || product.description || product.category || 'Standard product',
      qty: product.qty || 1,
    };

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === normalizedProduct.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === normalizedProduct.id ? { ...item, qty: (item.qty || 1) + 1 } : item
        );
      }
      return [...prev, { ...normalizedProduct, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleFavorite = (product) => {
    if (!userProfile) {
      alert('Please log in to save favorites.');
      handleSetPage('profile');
      window.dispatchEvent(new CustomEvent('setAuthMode', { detail: 'login' }));
      return;
    }
    setFavorites(prev => {
      const isFav = prev.some(item => item.id === product.id);
      if (isFav) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const [history, setHistory] = useState([]);

  const handleSetPage = (page, data = null) => {
    if (page === 'promo-modal') {
      setShowPromoModal(true);
      return;
    }

    // Enforce login for specific pages
    if (['checkout', 'cart', 'orders', 'favorites'].includes(page) && !userProfile) {
      alert(`Please log in to access your ${page}.`);
      setCurrentPage('profile');
      window.dispatchEvent(new CustomEvent('setAuthMode', { detail: 'login' }));
      return;
    }

    // Save current state to history if it's a different page
    if (page !== currentPage) {
      setHistory(prev => [...prev, { page: currentPage, category: selectedCategory, query: searchQuery, product: selectedProduct, data: navigationData }]);
    }

    if (page === 'listing') {
      if (data?.category) {
        setSelectedCategory(data.category);
      } else {
        setSelectedCategory(null);
      }
      setSearchQuery(data?.query || '');
    }
    if (data?.id) {
      setSelectedProduct(data);
    }
    setNavigationData(data);
    setCurrentPage(page);
  };

  const handleBack = () => {
    if (history.length === 0) {
      setCurrentPage('home');
      return;
    }

    const lastState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));

    setCurrentPage(lastState.page);
    setSelectedCategory(lastState.category);
    setSearchQuery(lastState.query);
    setSelectedProduct(lastState.product);
    setNavigationData(lastState.data);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'listing':
        return <ProductListing setPage={handleSetPage} handleBack={handleBack} category={selectedCategory} query={searchQuery} addToCart={addToCart} toggleFavorite={toggleFavorite} favorites={favorites} />;
      case 'details':
        return <ProductDetails setPage={handleSetPage} handleBack={handleBack} product={selectedProduct} addToCart={addToCart} toggleFavorite={toggleFavorite} favorites={favorites} />;
      case 'admin':
        return <AdminPanel setPage={handleSetPage} handleBack={handleBack} />;
      case 'seller-profile':
        return <SellerProfile setPage={handleSetPage} handleBack={handleBack} sellerData={navigationData} addToCart={addToCart} toggleFavorite={toggleFavorite} favorites={favorites} />;
      case 'cart':
        return <Cart setPage={handleSetPage} handleBack={handleBack} cartItems={cartItems} setCartItems={setCartItems} removeFromCart={removeFromCart} />;
      case 'favorites':
        return <ProductListing setPage={handleSetPage} handleBack={handleBack} category="My Favorites" productsOverride={favorites} addToCart={addToCart} toggleFavorite={toggleFavorite} favorites={favorites} />;
      case 'checkout':
        return <Checkout setPage={handleSetPage} handleBack={handleBack} cartItems={navigationData?.id ? [navigationData] : cartItems} total={navigationData?.total || cartItems.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0)} />;
      case 'profile':
        return <Profile setPage={handleSetPage} handleBack={handleBack} setIsAdmin={setIsAdmin} userProfile={userProfile} setUserProfile={setUserProfile} />;
      case 'message':
        return <Chatbot setPage={handleSetPage} handleBack={handleBack} />;
      case 'orders':
        return <Orders setPage={handleSetPage} handleBack={handleBack} userProfile={userProfile} />;
      case 'notifications':
        return <Notifications setPage={handleSetPage} handleBack={handleBack} />;
      case 'hot-offers':
        return <HotOffers setPage={handleSetPage} handleBack={handleBack} />;
      case 'gift-boxes':
        return <GiftBoxes setPage={handleSetPage} handleBack={handleBack} />;
      case 'projects':
        return <Projects setPage={handleSetPage} handleBack={handleBack} />;
      case 'menu-items':
        return <MenuItems setPage={handleSetPage} handleBack={handleBack} />;
      case 'help-center':
        return <HelpCenter setPage={handleSetPage} handleBack={handleBack} />;
      case 'contact-us':
        return <ContactUs setPage={handleSetPage} handleBack={handleBack} helpTopic={navigationData?.helpTopic || null} />;
      case 'shipping-info':
        return <ShippingInfo setPage={handleSetPage} handleBack={handleBack} />;
      case 'returns-info':
        return <ReturnsInfo setPage={handleSetPage} handleBack={handleBack} />;
      case 'faq':
        return <FAQ setPage={handleSetPage} handleBack={handleBack} />;

      default:
        return (
          <div className="container">
            <Hero setPage={handleSetPage} />
            <Deals setPage={handleSetPage} />

            {(categoryList ?? []).map((cat, index) => (
              <CategorySection
                key={cat}
                title={cat}
                bannerBg={[
                  '#E5F1FF', '#F3E5F5', '#FFE6BF', '#FFF3E0',
                  '#E3F2FD', '#F7F7F7', '#E8F5E9', '#FCE4EC'
                ][index % 8]}
                bannerImg={[
                  electronicsBanner,
                  clothesBanner,
                  interiorBanner,
                  petsBanner,
                  sportsBanner,
                  homeBanner,
                  beautyBanner,
                  sportsBanner
                ][index % 8]}
                items={categories?.[cat] ?? []}
                setPage={handleSetPage}
                category={cat}
              />
            ))}

            <InquiryForm />
            <RecommendedItems setPage={handleSetPage} />
            <Services />
            <RegionSuppliers />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header setPage={handleSetPage} cartCount={cartCount} favoritesCount={favorites.length} confirmedOrdersCount={confirmedOrdersCount} isAdmin={isAdmin} userProfile={userProfile} />

      {/* Hide logo section and toggle on login/signup page */}
      {currentPage !== 'profile' && (
        <>
          {/* Toggle Button Below Navigation */}
          <div className="relative border-b border-shade-border">
            <button
              onClick={() => setShowLogo(!showLogo)}
              className="absolute left-1/2 -translate-x-1/2 -bottom-5 z-30 group"
            >
              <div className="relative">
                {/* Outer ripple ring */}
                <div className="absolute -inset-2 border border-primary/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 ease-out"></div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-400 scale-110"></div>

                {/* Button container with smooth morph */}
                <div className={`relative overflow-hidden rounded-full transition-all duration-400 ease-out 
                  ${showLogo
                    ? 'bg-white/90 backdrop-blur-md shadow-md border border-primary/30 px-4 py-1.5'
                    : 'bg-primary/10 backdrop-blur-sm shadow-sm border border-primary/20 px-3 py-1'
                  } 
                  group-hover:shadow-lg group-hover:scale-110`}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Chevron with bounce animation */}
                  <svg
                    className={`w-5 h-5 sm:w-6 sm:h-6 relative z-10 transition-all duration-500 ease-out transform
                      ${showLogo ? 'text-primary rotate-180' : 'text-primary/70'}
                      group-hover:text-primary group-hover:scale-110
                    `}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Logo Section - Visible by default */}
          <div className={`relative overflow-hidden transition-all duration-500 z-10 ${showLogo ? 'py-8 sm:py-10 h-auto border-b border-shade-border' : 'py-0 h-0 border-none'
            }`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-60"></div>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            <div className={`relative container flex justify-center transition-all duration-500 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
              }`}>
              {/* Logo Container with Animation */}
              <div
                className="cursor-pointer group"
                onClick={() => handleSetPage('home')}
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Logo */}
                  <div className="relative bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                    <img
                      src="https://izqxsfuyibbzwdxdcmev.supabase.co/storage/v1/object/public/Background/Logo/Core%20Collective%20(1).png"
                      alt="Core Collective"
                      className="h-[100px] sm:h-[140px] lg:h-[160px] w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <main className="flex-grow pb-12">
        {renderContent()}
      </main>

      <Newsletter />
      <Footer />

      {/* Promo Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPromoModal(false)}>
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-dark">Get US $10 off</h3>
              <button
                onClick={() => setShowPromoModal(false)}
                className="text-dark-light hover:text-dark"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <p className="text-dark-light mb-4">Enter your details to receive your $10 discount with a new supplier.</p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-shade-border rounded-md focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Joining Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-shade-border rounded-md focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Claim $10 Discount
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
