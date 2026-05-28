import React, { useState, useEffect, lazy, Suspense, useCallback, useRef, startTransition } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Deals from './components/Deals';
import CategorySection from './components/CategorySection';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import { api } from './lib/api';
import { supabase } from './lib/supabase';
import { useCategories, useConfirmedOrdersCount } from './hooks/useProducts';

const InquiryForm = lazy(() => import('./components/InquiryForm'));
const RecommendedItems = lazy(() => import('./components/RecommendedItems'));
const Services = lazy(() => import('./components/Services'));
const RegionSuppliers = lazy(() => import('./components/RegionSuppliers'));
const ProductListing = lazy(() => import('./components/ProductListing'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const HotOffers = lazy(() => import('./components/HotOffers'));
const GiftBoxes = lazy(() => import('./components/GiftBoxes'));
const Projects = lazy(() => import('./components/Projects'));
const MenuItems = lazy(() => import('./components/MenuItems'));
const HelpCenter = lazy(() => import('./components/HelpCenter'));
const ContactUs = lazy(() => import('./components/ContactUs'));
const ShippingInfo = lazy(() => import('./components/ShippingInfo'));
const ReturnsInfo = lazy(() => import('./components/ReturnsInfo'));
const FAQ = lazy(() => import('./components/FAQ'));
const Cart = lazy(() => import('./components/Cart'));
const Profile = lazy(() => import('./components/Profile'));
const Chatbot = lazy(() => import('./components/Chatbot'));
const Orders = lazy(() => import('./components/Orders'));
const Checkout = lazy(() => import('./components/Checkout'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const SellerProfile = lazy(() => import('./components/SellerProfile'));
const Notifications = lazy(() => import('./components/Notifications'));
const PromoModal = lazy(() => import('./components/PromoModal'));

const SectionFallback = () => <div className="py-8" />;

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

  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [navigationData, setNavigationData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  const loadingRef = useRef({ cart: false, fav: false });
  const userIdRef = useRef(null);

  useEffect(() => { userIdRef.current = userProfile?.id; }, [userProfile?.id]);

  const storageKey = (key) => `core_${userProfile?.id || 'anon'}_${key}`;

  useEffect(() => {
    if (!userProfile?.id) return;
    const savedCart = localStorage.getItem(storageKey('cart'));
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, [userProfile?.id]);

  useEffect(() => {
    if (!userProfile?.id) return;
    const savedFav = localStorage.getItem(storageKey('fav'));
    if (savedFav) setFavorites(JSON.parse(savedFav));
  }, [userProfile?.id]);

  useEffect(() => {
    if (!userProfile?.id || cartItems.length === 0) return;
    localStorage.setItem(storageKey('cart'), JSON.stringify(cartItems));
  }, [cartItems, userProfile?.id]);

  useEffect(() => {
    if (!userProfile?.id || favorites.length === 0) return;
    localStorage.setItem(storageKey('fav'), JSON.stringify(favorites));
  }, [favorites, userProfile?.id]);

  const { categories, categoryList } = useCategories();
  const { data: confirmedOrdersCountResult } = useConfirmedOrdersCount(userProfile?.id);
  const confirmedOrdersCount = confirmedOrdersCountResult || 0;

  const loadCart = useCallback(async (userId) => {
    if (!userId || loadingRef.current.cart) return;
    loadingRef.current.cart = true;
    try {
      const data = await api.cart.getAll();
      const items = data.map(item => ({
        id: item.product_id,
        ...item.product_data,
        qty: item.qty,
        cart_item_id: item.id,
      }));
      setCartItems(items);
    } catch (e) {
      console.error('Error loading cart:', e);
    } finally {
      loadingRef.current.cart = false;
    }
  }, []);

  const loadFavorites = useCallback(async (userId) => {
    if (!userId || loadingRef.current.fav) return;
    loadingRef.current.fav = true;
    try {
      const data = await api.favorites.getAll();
      const items = data.map(item => ({
        id: item.product_id,
        ...item.product_data,
        fav_id: item.id,
      }));
      setFavorites(items);
    } catch (e) {
      console.error('Error loading favorites:', e);
    } finally {
      loadingRef.current.fav = false;
    }
  }, []);

  const loadNotifications = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const count = await api.notifications.getUnreadCount();
      setNotifCount(count || 0);
    } catch (e) {
      console.error('Error loading notification count:', e);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const onUserReady = (user) => {
      if (cancelled) return;
      const profile = {
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email,
        phone: user.user_metadata?.phone || ''
      };
      setUserProfile(profile);
      setIsAdmin(user.email === 'rehanilyas20196@gmail.com');
    };

    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (!error && user && !cancelled) {
        onUserReady(user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && !cancelled) {
        onUserReady(session.user);
      }
    });

    return () => { cancelled = true; subscription?.unsubscribe(); };
  }, [loadCart, loadFavorites, loadNotifications]);

  useEffect(() => {
    if (userProfile?.id) {
      loadCart(userProfile.id);
      loadFavorites(userProfile.id);
      loadNotifications(userProfile.id);
    }
  }, [userProfile?.id]);

  useEffect(() => {
    const handleAuthChange = (e) => {
      const user = e.detail?.user;
      if (user) {
        const profile = {
          id: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email,
          phone: user.user_metadata?.phone || '',
          date_of_birth: user.user_metadata?.date_of_birth || '',
        };
        setUserProfile(profile);
        setIsAdmin(user.email === 'rehanilyas20196@gmail.com');
        loadCart(user.id);
        loadFavorites(user.id);
        loadNotifications(user.id);
      }
    };
    const handleAuthExpired = () => {
      const uid = userIdRef.current;
      setUserProfile(null);
      setIsAdmin(false);
      setCartItems([]);
      setFavorites([]);
      setNotifCount(0);
      if (uid) {
        localStorage.removeItem(`core_${uid}_cart`);
        localStorage.removeItem(`core_${uid}_fav`);
      }
    };
    window.addEventListener('authChanged', handleAuthChange);
    window.addEventListener('authExpired', handleAuthExpired);
    return () => {
      window.removeEventListener('authChanged', handleAuthChange);
      window.removeEventListener('authExpired', handleAuthExpired);
    };
  }, [loadCart, loadFavorites, loadNotifications]);

  useEffect(() => {
    const totalCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
    setCartCount(totalCount);
  }, [cartItems]);

  const addToCart = async (product) => {
    if (!userProfile) {
      alert('Please log in to add items to your cart.');
      handleSetPage('profile');
      window.dispatchEvent(new CustomEvent('setAuthMode', { detail: 'login' }));
      return;
    }
    const selectedQty = product.qty || 1;
    const normalizedProduct = {
      ...product,
      title: product.title || product.name || 'Product',
      name: product.name || product.title || 'Product',
      image: product.image || product.image_url || '',
      image_url: product.image_url || product.image || '',
      seller: product.seller || product.supplier || 'Core Collective',
      specs: product.specs || product.description || product.category || 'Standard product',
    };

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === normalizedProduct.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === normalizedProduct.id ? { ...item, qty: (item.qty || 1) + selectedQty } : item
        );
      }
      return [...prev, { ...normalizedProduct, qty: selectedQty }];
    });

    try {
      await api.cart.add(normalizedProduct.id, selectedQty, normalizedProduct);
    } catch (e) {
      console.error('Error syncing cart:', e);
    }
  };

  const removeFromCart = async (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    try {
      await api.cart.remove(productId);
    } catch (e) {
      console.error('Error removing from cart:', e);
    }
  };

  const toggleFavorite = async (product) => {
    if (!userProfile) {
      alert('Please log in to save favorites.');
      handleSetPage('profile');
      window.dispatchEvent(new CustomEvent('setAuthMode', { detail: 'login' }));
      return;
    }
    const isFav = favorites.some(item => item.id === product.id);
    if (isFav) {
      setFavorites(prev => prev.filter(item => item.id !== product.id));
    } else {
      setFavorites(prev => [...prev, product]);
    }
    try {
      await api.favorites.toggle(product.id, product);
    } catch (e) {
      console.error('Error syncing favorite:', e);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    try {
      await api.cart.clear();
    } catch (e) {
      console.error('Error clearing cart:', e);
    }
  };

  const [history, setHistory] = useState([]);

  const handleSetPage = (page, data = null) => {
    if (page === 'promo-modal') {
      setShowPromoModal(true);
      return;
    }

    if (['checkout', 'cart', 'orders', 'favorites'].includes(page) && !userProfile) {
      alert(`Please log in to access your ${page}.`);
      setCurrentPage('profile');
      window.dispatchEvent(new CustomEvent('setAuthMode', { detail: 'login' }));
      return;
    }

    startTransition(() => {
      if (page !== currentPage) {
        setHistory(prev => [...prev, { page: currentPage, category: selectedCategory, query: searchQuery, product: selectedProduct, data: navigationData }]);
        window.history.pushState({ page: currentPage }, '');
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
    });
  };

  const handleBack = () => {
    if (history.length === 0) {
      setCurrentPage('home');
      return;
    }

    const lastState = history[history.length - 1];
    startTransition(() => {
      setHistory(prev => prev.slice(0, -1));
      setCurrentPage(lastState.page);
      setSelectedCategory(lastState.category);
      setSearchQuery(lastState.query);
      setSelectedProduct(lastState.product);
      setNavigationData(lastState.data);
    });
  };

  useEffect(() => {
    const handlePopState = () => handleBack();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [history]);

  const renderContent = () => {
    switch (currentPage) {
      case 'listing':
        return <Suspense fallback={<SectionFallback />}><ProductListing setPage={handleSetPage} handleBack={handleBack} category={selectedCategory} query={searchQuery} addToCart={addToCart} toggleFavorite={toggleFavorite} favorites={favorites} /></Suspense>;
      case 'details':
        return <Suspense fallback={<SectionFallback />}><ProductDetails setPage={handleSetPage} handleBack={handleBack} product={selectedProduct} addToCart={addToCart} toggleFavorite={toggleFavorite} favorites={favorites} /></Suspense>;
      case 'admin':
        return <Suspense fallback={<SectionFallback />}><AdminPanel setPage={handleSetPage} handleBack={handleBack} userProfile={userProfile} /></Suspense>;
      case 'seller-profile':
        return <Suspense fallback={<SectionFallback />}><SellerProfile setPage={handleSetPage} handleBack={handleBack} sellerData={navigationData} addToCart={addToCart} toggleFavorite={toggleFavorite} favorites={favorites} /></Suspense>;
      case 'cart':
        return <Suspense fallback={<SectionFallback />}><Cart setPage={handleSetPage} handleBack={handleBack} cartItems={cartItems} setCartItems={setCartItems} removeFromCart={removeFromCart} clearCart={clearCart} /></Suspense>;
      case 'favorites':
        return <Suspense fallback={<SectionFallback />}><ProductListing setPage={handleSetPage} handleBack={handleBack} category="My Favorites" productsOverride={favorites} addToCart={addToCart} toggleFavorite={toggleFavorite} favorites={favorites} /></Suspense>;
      case 'checkout':
        return <Suspense fallback={<SectionFallback />}><Checkout setPage={handleSetPage} handleBack={handleBack} cartItems={navigationData?.id ? [navigationData] : cartItems} total={navigationData?.total || cartItems.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0)} clearCart={clearCart} /></Suspense>;
      case 'profile':
        return <Suspense fallback={<SectionFallback />}><Profile setPage={handleSetPage} handleBack={handleBack} setIsAdmin={setIsAdmin} userProfile={userProfile} setUserProfile={setUserProfile} /></Suspense>;
      case 'message':
        return <Suspense fallback={<SectionFallback />}><Chatbot setPage={handleSetPage} handleBack={handleBack} /></Suspense>;
      case 'orders':
        return <Suspense fallback={<SectionFallback />}><Orders setPage={handleSetPage} handleBack={handleBack} userProfile={userProfile} /></Suspense>;
      case 'notifications':
        return <Suspense fallback={<SectionFallback />}><Notifications setPage={handleSetPage} handleBack={handleBack} userProfile={userProfile} /></Suspense>;
      case 'hot-offers':
        return <Suspense fallback={<SectionFallback />}><HotOffers setPage={handleSetPage} handleBack={handleBack} /></Suspense>;
      case 'gift-boxes':
        return <Suspense fallback={<SectionFallback />}><GiftBoxes setPage={handleSetPage} handleBack={handleBack} /></Suspense>;
      case 'projects':
        return <Suspense fallback={<SectionFallback />}><Projects setPage={handleSetPage} handleBack={handleBack} /></Suspense>;
      case 'menu-items':
        return <Suspense fallback={<SectionFallback />}><MenuItems setPage={handleSetPage} handleBack={handleBack} /></Suspense>;
      case 'help-center':
        return <Suspense fallback={<SectionFallback />}><HelpCenter setPage={handleSetPage} handleBack={handleBack} /></Suspense>;
      case 'contact-us':
        return <Suspense fallback={<SectionFallback />}><ContactUs setPage={handleSetPage} handleBack={handleBack} helpTopic={navigationData?.helpTopic || null} /></Suspense>;
      case 'shipping-info':
        return <Suspense fallback={<SectionFallback />}><ShippingInfo setPage={handleSetPage} handleBack={handleBack} /></Suspense>;
      case 'returns-info':
        return <Suspense fallback={<SectionFallback />}><ReturnsInfo setPage={handleSetPage} handleBack={handleBack} /></Suspense>;
      case 'faq':
        return <Suspense fallback={<SectionFallback />}><FAQ setPage={handleSetPage} handleBack={handleBack} /></Suspense>;

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

            <Suspense fallback={<SectionFallback />}><InquiryForm userProfile={userProfile} /></Suspense>
            <Suspense fallback={<SectionFallback />}><RecommendedItems setPage={handleSetPage} /></Suspense>
            <Suspense fallback={<SectionFallback />}><Services /></Suspense>
            <Suspense fallback={<SectionFallback />}><RegionSuppliers /></Suspense>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header setPage={handleSetPage} cartCount={cartCount} favoritesCount={favorites.length} confirmedOrdersCount={notifCount} isAdmin={isAdmin} userProfile={userProfile} />

      {currentPage !== 'profile' && (
        <>
          <div className="relative border-b border-shade-border">
            <button
              onClick={() => setShowLogo(!showLogo)}
              className="absolute left-1/2 -translate-x-1/2 -bottom-5 z-30 group"
              aria-label={showLogo ? 'Hide logo section' : 'Show logo section'}
            >
              <div className="relative">
                <div className="absolute -inset-2 border border-primary/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 ease-out"></div>
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-400 scale-110"></div>
                <div className={`relative overflow-hidden rounded-full transition-all duration-400 ease-out 
                  ${showLogo
                    ? 'bg-white/90 backdrop-blur-md shadow-md border border-primary/30 px-4 py-1.5'
                    : 'bg-primary/10 backdrop-blur-sm shadow-sm border border-primary/20 px-3 py-1'
                  } 
                  group-hover:shadow-lg group-hover:scale-110`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

          <div className={`relative overflow-hidden transition-all duration-500 z-10 ${showLogo ? 'py-8 sm:py-10 h-auto border-b border-shade-border' : 'py-0 h-0 border-none'
            }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-60"></div>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            <div className={`relative container flex justify-center transition-all duration-500 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
              }`}>
              <div
                className="cursor-pointer group"
                onClick={() => handleSetPage('home')}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                    <img
                      src="https://izqxsfuyibbzwdxdcmev.supabase.co/storage/v1/object/public/Background/Logo/Core%20Collective%20(1).png"
                      alt="Core Collective"
                      width="500"
                      height="500"
                      fetchpriority="high"
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

      {showPromoModal && (
        <PromoModal
          userProfile={userProfile}
          onClose={() => setShowPromoModal(false)}
        />
      )}

    </div>
  );
}

export default App;
