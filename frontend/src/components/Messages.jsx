import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bot, Send, Sparkles, Trash2 } from 'lucide-react';
import { api } from '../lib/api';

const supportTopics = [
  {
    id: 'shipping',
    title: 'Shipping',
    keywords: ['ship', 'shipping', 'delivery', 'deliver', 'courier', 'dispatch', 'eta', 'arrive', 'late'],
    answer:
      'Standard shipping usually takes 5 to 7 business days after dispatch, while express shipping usually takes 2 to 4 business days. Delivery times can vary by location, weather, holidays, and customs screening.',
  },
  {
    id: 'tracking',
    title: 'Tracking',
    keywords: ['track', 'tracking', 'where is my order', 'parcel', 'shipment status', 'consignment', 'status'],
    answer:
      'You can track an order from the Orders section once the package has been scanned by the shipping partner. Tracking updates often appear within 12 to 24 hours after dispatch.',
  },
  {
    id: 'returns',
    title: 'Returns',
    keywords: ['return', 'send back', 'exchange', 'replace', 'replacement', 'return policy'],
    answer:
      'Most items can be returned within 30 days if they are unused, complete, and in their original packaging. If the item arrived damaged, incorrect, or incomplete, support can usually help faster with a replacement or refund path.',
  },
  {
    id: 'refunds',
    title: 'Refunds',
    keywords: ['refund', 'money back', 'reimburse', 'reversal', 'refund status'],
    answer:
      'Refunds are typically processed after the return is reviewed and approved. Once approved, funds usually appear in the original payment method within 5 to 7 business days, depending on the bank or payment provider.',
  },
  {
    id: 'quality',
    title: 'Product Quality',
    keywords: ['quality', 'original', 'authentic', 'genuine', 'material', 'durable', 'fake', 'defect', 'defective'],
    answer:
      'Product quality is expected to match the listing description, images, and condition details. If the delivered item does not match the listing or has a defect, you can request support for review, return, or replacement.',
  },
  {
    id: 'payment',
    title: 'Payments',
    keywords: ['pay', 'payment', 'card', 'visa', 'mastercard', 'checkout', 'transaction', 'bank', 'wallet'],
    answer:
      'Available payment methods depend on the configured checkout options. If a payment fails, verify your billing details, available balance, and network connection, then retry once before attempting another method.',
  },
  {
    id: 'cancellation',
    title: 'Cancellations',
    keywords: ['cancel', 'cancellation', 'change order', 'modify order', 'wrong address', 'wrong order'],
    answer:
      'Orders can usually be changed or cancelled only before they move into packing or shipment. If the order has already been dispatched, the fastest option is often to receive it and then request a return if needed.',
  },
  {
    id: 'availability',
    title: 'Availability',
    keywords: ['available', 'availability', 'in stock', 'out of stock', 'restock', 'stock'],
    answer:
      'Product availability depends on current supplier stock. If an item is out of stock, the listing may update later when new inventory is added, but restock timing can vary by supplier and category.',
  },
  {
    id: 'bulk',
    title: 'Bulk Orders',
    keywords: ['bulk', 'wholesale', 'moq', 'minimum order', 'large order', 'supplier', 'quote'],
    answer:
      'Bulk orders are best handled by confirming the product name, quantity, destination, and required delivery window. That makes it easier to estimate stock availability, shipping options, and supplier lead time.',
  },
  {
    id: 'warranty',
    title: 'Warranty',
    keywords: ['warranty', 'guarantee', 'repair', 'covered', 'claim'],
    answer:
      'Warranty coverage varies by product and supplier. When a warranty applies, the exact coverage usually depends on the item type, defect reason, and whether the issue is from normal use or manufacturing error.',
  },
  {
    id: 'account',
    title: 'Account Help',
    keywords: ['account', 'login', 'password', 'profile', 'address', 'sign in'],
    answer:
      'For account help, start by checking your saved profile details, login email, and delivery address. If checkout or access issues continue, refreshing the session and signing in again usually helps.',
  },
  {
    id: 'website_navigation',
    title: 'Website Navigation',
    keywords: ['website', 'site', 'navigate', 'navigation', 'page', 'where can i find', 'menu', 'section'],
    answer:
      'You can browse products from the home page, search bar, category menus, hot offers, gift boxes, projects, and menu items. Help-related pages are also available from the header, including contact, shipping info, returns, and FAQ.',
  },
  {
    id: 'search',
    title: 'Search Help',
    keywords: ['search', 'find product', 'look for', 'cannot find', 'find item', 'product search'],
    answer:
      'Use the top search bar to search by product name or keyword. You can also browse by category from the header menu or open the listing page to filter products by category, price, and rating.',
  },
  {
    id: 'cart',
    title: 'Cart Help',
    keywords: ['cart', 'my cart', 'basket', 'add to cart', 'remove from cart', 'cart issue'],
    answer:
      'You can add products from listing or details pages, review them in My cart, update quantities, and continue to checkout from there. If cart totals or quantities look wrong, refreshing the page and rechecking item quantities usually helps.',
  },
  {
    id: 'favorites',
    title: 'Favorites and Wishlist',
    keywords: ['favorite', 'wishlist', 'save item', 'saved items', 'heart icon'],
    answer:
      'Use the heart icon on a product to save it to Favorites. You can open the Favorites page from the header to review saved items and remove any product you no longer want to keep there.',
  },
  {
    id: 'checkout',
    title: 'Checkout Help',
    keywords: ['checkout', 'place order', 'buy now', 'billing', 'shipping address', 'payment page'],
    answer:
      'At checkout, review your products, delivery details, and payment information carefully before placing the order. If something is incorrect, go back to the cart or product page to update it before submitting payment.',
  },
  {
    id: 'contact',
    title: 'Contact and Support',
    keywords: ['contact', 'support', 'help center', 'customer service', 'email support', 'call'],
    answer:
      'You can reach support through the Help and Contact pages on the website. Those sections are the best place to submit questions related to orders, delivery, returns, account issues, and general store support.',
  },
  {
    id: 'profile',
    title: 'Profile Settings',
    keywords: ['profile', 'my profile', 'account settings', 'update profile', 'address book'],
    answer:
      'The Profile area is where you manage account details and saved information. If you need to update your address or review account-related details, the profile page is the right place to start.',
  },
  {
    id: 'faq_help',
    title: 'FAQ and Help Pages',
    keywords: ['faq', 'help page', 'help center', 'common questions', 'support articles'],
    answer:
      'The website includes dedicated help pages for shipping information, returns, FAQs, and contact support. Those sections are useful when you want a quick answer without going through the full order flow.',
  },
  {
    id: 'admin',
    title: 'Admin Access',
    keywords: ['admin', 'admin panel', 'secret admin page', 'manage products'],
    answer:
      'The admin area is only available for authorized users. If your account has admin access, the navigation can expose the admin page where products and store-related data can be managed.',
  },
  {
    id: 'orders',
    title: 'Orders',
    keywords: ['order', 'order number', 'purchase', 'placed order', '#'],
    answer:
      'If you are asking about an order, sharing the order number and a short description of the issue helps support the fastest. Common questions include status, delivery timing, address corrections, and return eligibility.',
  },
];

const questionTemplates = [
  'How long does {topic} usually take?',
  'Can you explain your {topic} policy?',
  'What should I do if I need help with {topic}?',
  'Is there any fee related to {topic}?',
  'Do you offer support for {topic}?',
  'What are the usual steps for {topic}?',
  'Can I get an update about {topic}?',
  'What information should I prepare for {topic}?',
  'How soon will I hear back about {topic}?',
  'Do weekends or holidays affect {topic}?',
  'Can you walk me through {topic} step by step?',
  'What are the most common issues with {topic}?',
  'Can {topic} be expedited?',
  'Is {topic} available internationally?',
  'What if something goes wrong during {topic}?',
  'How do I know whether I qualify for {topic}?',
  'Can I get a quick summary of {topic}?',
  'What documents are useful for {topic}?',
  'Can I request help with {topic} today?',
  'What delays usually happen with {topic}?',
];

const questionTopics = [
  'shipping', 'delivery', 'order tracking', 'returns', 'refunds',
  'exchanges', 'product quality', 'damaged items', 'bulk orders',
  'supplier quotes', 'payment issues', 'checkout help',
  'website navigation', 'search help', 'cart issues', 'favorites',
  'account login', 'profile settings', 'contact support',
  'help center pages', 'admin access',
];

const suggestedQuestions = questionTopics.flatMap((topic) =>
  questionTemplates.map((template, index) => ({
    id: `${topic.replace(/\s+/g, '-')}-${index + 1}`,
    question: template.replace('{topic}', topic),
    topic,
  }))
);

const searchableQuestionBank = suggestedQuestions.map((item) => item.question.toLowerCase());

const formatTime = () =>
  new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

const findBestTopic = (message) => {
  const lowered = message.toLowerCase();
  let bestTopic = null;
  let bestScore = 0;

  supportTopics.forEach((topic) => {
    const score = topic.keywords.reduce((total, keyword) => {
      return total + (lowered.includes(keyword) ? 1 : 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  });

  return bestScore > 0 ? bestTopic : null;
};

const findClosestQuestion = (message) => {
  const lowered = message.toLowerCase().trim();
  return searchableQuestionBank.find((question) => {
    const words = lowered.split(/\s+/).filter(Boolean);
    const overlap = words.filter((word) => word.length > 3 && question.includes(word)).length;
    return overlap >= 2;
  });
};

const findMatchingProduct = (message, products) => {
  const lowered = message.toLowerCase();

  return products.find((product) => {
    const name = product.name?.toLowerCase();
    return name && name.length > 3 && lowered.includes(name);
  });
};

const buildProductAnswer = (product) => {
  const stockMessage =
    Number(product.stock) > 0
      ? `It currently appears to be in stock with ${product.stock} unit${product.stock === 1 ? '' : 's'} available.`
      : 'It currently appears to be out of stock.';

  return `${product.name} is listed in the ${product.category || 'product'} category for Rs. ${product.price}. ${stockMessage} You can open the product details page for images, description, ratings, and checkout options.`;
};

const buildOrderAnswer = (message) => {
  const match = message.match(/#\d+/);
  const orderLabel = match ? match[0] : 'your order';

  return `I can help with ${orderLabel}. For order-specific support, the most useful details are the order number, what happened, and whether the issue is about shipping, payment, address, damage, or return eligibility.`;
};

const buildFallbackAnswer = () =>
  'I can help with products, shipping, delivery timing, tracking, returns, refunds, cancellations, warranties, payment issues, website navigation, search, cart, favorites, checkout, account help, and contact support. Try asking a full question like "How do I find products on the website?" or "What is your return policy?"';

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const SYSTEM_PROMPT = `You are a highly knowledgeable customer support assistant for Core Collective, a B2B marketplace. You MUST answer EVERY question the user asks — greetings, goodbyes, casual chat, products, shipping, returns, payments, website features, account help, technical issues, admin functions, and any other topic related to the website. NEVER say you cannot answer. Always respond helpfully and conversationally.

Keep responses concise (2-4 sentences) unless the user asks for details. Be warm, friendly, and professional.

## GREETINGS & CONVERSATION
When the user says hello, hi, hey, good morning, etc., respond warmly and ask how you can help. When they say bye, goodbye, thanks, etc., respond politely and invite them to return.

## STORE OVERVIEW
- Name: Core Collective
- Type: B2B (business-to-business) marketplace
- Contact: rehanilyas20196@gmail.com, +92 345 5900229
- Address: Mellinium Karachi, Pakistan
- Admin: rehanilyas20196@gmail.com
- Default seller: Guanjhou Trading Co. (Berlin, Germany, verified since 2022)
- Ships to 100+ countries worldwide
- Currencies: Pakistani Rupee (Rs.)

## ALL WEBSITE PAGES & FEATURES
1. Home - Hero carousel (auto-rotating banners), category list, promo sidebar with "Get Rs. 1000 off with a new supplier"
2. All Categories - Browse product categories, filter by category/price/rating, grid/list view
3. Product Details - Gallery, stock status, name, rating, reviews, price, size selector, quantity, Buy Now/Add to Cart/Favorite buttons, seller info, description, tech specs, reviews section, shipping info tab, related products
4. Cart - Items list, quantity +/- controls, remove individual/clear all, Save for Later, coupon input, discount request form, subtotal/discount/tax/total calculation, checkout button (login required)
5. Checkout - 3 steps: (1) Delivery info (full name, phone, province, city, building, area, colony, address, label HOME/OFFICE), (2) Payment method (Bank Card, JazzCash, EasyPaisa, Direct Bank Transfer) with screenshot upload, (3) Order placed confirmation
6. Orders - Track orders with status progress bar: Pending > Confirmed > Shipped > In Transit > Out for Delivery > Delivered. Shows order date, total, items, address, tracking timeline
7. Favorites - Heart icon on products to save, view saved items from Favorites page in header
8. Profile - Login/Signup forms, account settings, update name/phone/password, payment methods display, order history link
9. Notifications - Success/error/pending/order/info notifications, mark as read, delete
10. Help Center - Search, 5 help categories (Order Status, Shipping, Returns, Payment, Account Security), contact options (Live Chat, Email, Call), FAQs
11. FAQ - 12 FAQs across General, Account, Orders, Shipping, Returns, Payment, Privacy
12. Contact Us - Email/phone/address, contact form opens mail client to rehanilyas20196@gmail.com
13. Shipping Info - 3 methods with prices, 6-step tracking guide, local/international delivery areas
14. Returns Info - 30-day policy, non-returnable items, refund timeline
15. Hot Offers - Up to 50% off selected items, category filter
16. Gift Boxes - Gift box products, category filter, heart wishlist, ratings
17. Projects - Crowdfunding-style projects, days left, backers, percent funded
18. Menu Items - Product listing page
19. Region Suppliers - Suppliers by region (UAE, Australia, US, Russia, Italy, Denmark, France, China, UK)
20. Seller Profile - Seller details, rating, products by seller
21. Services - Source from Industry Hubs, Customize Products, Shipping, Product monitoring
22. Deals - Timed deals with countdown timer
23. Recommended Items - Grid of recommended products
24. Chatbot - AI-powered support assistant (this chat)
25. Admin Panel - (authorized only) Manage orders (view/delete/status/tracking), Discount Requests (approve/reject), Supplier Quotes (approve with supplier ref/reject with notes)
26. Quote Form - "Send quote to suppliers" with email, item name, details, quantity, unit

## SHIPPING
- Standard: Free, 5-7 business days worldwide
- Express: Rs. 999, 2-3 business days selected countries
- Next Day: Rs. 1,999, 1 business day (local Pakistan)
- Tracking steps: Pending > Confirmed > Shipped > In Transit > Out for Delivery > Delivered
- Tracking updates 12-24 hours after dispatch
- Delivery provinces: Punjab, Sindh, KPK, Balochistan, Islamabad
- Label: HOME or OFFICE

## RETURNS & REFUNDS
- 30-day return window, items must be unused in original packaging
- Non-returnable: intimate/sanitary, used personal care, custom products, digital downloads, gift cards
- Refunds processed 5-7 business days after return received (10-14 days to appear in bank)
- Return shipping: customer's responsibility; original shipping fees non-refundable

## PAYMENT METHODS
- Bank Card (Visa, Mastercard)
- JazzCash: +92 345 5900229 (Core Collective)
- EasyPaisa: +92 345 5900229 (Core Collective)
- Direct Bank Transfer: Faysal Bank IBAN PK63FAYS0000123456789
- Coupon codes at checkout
- Payment screenshot required for non-card payments

## ORDERS
- Cancel within 24 hours of placing; after dispatch, receive then return
- Order statuses: pending, confirmed, rejected, delivered
- Payment screenshot upload for JazzCash/EasyPaisa/Bank Transfer

## ACCOUNT
- Sign up from Profile page (email, password, name, phone)
- Login with email + password
- Google Sign-In available (OAuth)
- Forgot password from login page
- Update name, phone, password in profile settings

## BULK ORDERS & SUPPLIER INQUIRIES
- Use "Send quote to suppliers" form: item name, details, quantity, unit (Pcs/Kgs/Boxes/Sets)
- Admin reviews and responds with supplier reference

## DISCOUNTS & PROMOS
- "Get Rs. 1000 off with a new supplier" promo
- Super discount on orders over Rs. 10,000
- Hot Offers: up to 50% off
- Newsletter signup for daily offers

## PRODUCT CATEGORIES (with prices)
Electronics: Coffee Machine (Rs.12,500), Hair Dryer (Rs.5,000), Air Conditioner (Rs.100,000), LED Light (Rs.400), Downlight (Rs.300), Charger (Rs.200), Security Camera (Rs.9,000), Toaster (Rs.13,000), Oven (Rs.15,000), Smart Robot Speaker (Rs.25,000), Wireless Printer (Rs.15,000), AI Humanoid Robot (Rs.40,000), Microphone (Rs.6,000), Wireless Charger (Rs.200), Smart Thermostat (Rs.1,000), Video Doorbell (Rs.9,000), Smart Plug (Rs.65), Juice Machine (Rs.3,000), Ceiling Fan (Rs.15,000)
Clothing: Wedding Dresses (Rs.10,000-20,000), Shalwar Kameez (Rs.2,000-3,000), Polo Shirt (Rs.5,000), Formal Dresses (Rs.1,500-2,500), Kids Dresses (Rs.300-1,000), accessories
Home: Ergonomic Sofa (Rs.5,000), Water Pot (Rs.400), Lamp (Rs.7,000), Magazine Rack (Rs.3,000)
Sports: Tennis Racket (Rs.3,000), Yoga Mat (Rs.400), Basketball (Rs.3,000), Cricket Bat (Rs.5,000), Soccer Ball (Rs.2,000), Cricket Ball (Rs.500), Running Shorts (Rs.2,000), Water Bottle (Rs.300)
Pet Supplies: Dog Bed (Rs.2,000), Cat Tree (Rs.4,000), Dog Leash (Rs.1,000), Cat Litter Box (Rs.300), Dog Chew Toy (Rs.900), Cat Food Bowl (Rs.400), Bird Cage (Rs.2,000), Fish Tank Kit (Rs.5,000)
Tools: Power Drill (Rs.12,000), Complete Tool Set (Rs.27,000), Circular Saw (Rs.1,000), Multi-tool Kit (Rs.15,000), Tape Measure (Rs.500), Screwdriver Set (Rs.100), Wrench Set (Rs.400)

## FAQ
- Create account: Profile page > Sign up
- Reset password: Login page > Forgot Password
- View orders: Profile > Orders
- Cancel order: Within 24 hours, contact support
- Return item: Orders > select order > Return Item
- Payment methods: Visa, Mastercard, JazzCash, EasyPaisa, Direct Bank Transfer
- Shipping: Standard free 5-7 days, Express Rs.999 2-3 days, Next Day Rs.1,999 1 day
- International shipping: Yes, 100+ countries
- Data protection: Industry-standard encryption

If the user asks about anything not listed above, use your general knowledge to help them appropriately. NEVER refuse to answer.`;

const quickTopics = [
  { label: 'Shipping times', icon: '📦' },
  { label: 'Return policy', icon: '↩️' },
  { label: 'Payment methods', icon: '💳' },
  { label: 'Track my order', icon: '🔍' },
  { label: 'Bulk order', icon: '📋' },
];

const Messages = ({ setPage, handleBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickTopics, setShowQuickTopics] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      const { supabase } = await import('../lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      const loggedIn = !!session?.user;
      if (cancelled) return;
      setIsLoggedIn(loggedIn);

      try {
        setLoadingProducts(true);
        const data = await api.products.getMinimal(200);
        if (!cancelled) setProducts(data || []);
      } catch (error) {
        console.error('Error loading chatbot products:', error);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }

      if (loggedIn) {
        try {
          setLoadingMessages(true);
          const history = await api.messages.getAll();
          if (!cancelled) {
            if (history && history.length > 0) {
              setMessages(history);
            } else {
              setMessages([
                { id: 'welcome-1', sender: 'bot', text: 'Hello! I am the Core Collective support chatbot. Ask me anything about products, shipping, returns, refunds, payments, warranties, stock, or order help.', time: 'Now', local: true },
                { id: 'welcome-2', sender: 'bot', text: `Ask naturally about products, shipping, returns, orders, and more.`, time: 'Now', local: true },
              ]);
            }
          }
        } catch (error) {
          console.error('Error loading messages:', error);
          if (!cancelled) {
            setMessages([
              { id: 'welcome-1', sender: 'bot', text: 'Hello! I am the Core Collective support chatbot. Ask me anything about products, shipping, returns, refunds, payments, warranties, stock, or order help.', time: 'Now', local: true },
              { id: 'welcome-2', sender: 'bot', text: `Ask naturally about products, shipping, returns, orders, and more.`, time: 'Now', local: true },
            ]);
          }
        } finally {
          if (!cancelled) setLoadingMessages(false);
        }
      } else {
        if (!cancelled) {
          setMessages([
            { id: 'welcome-1', sender: 'bot', text: 'Hello! I am the Core Collective support chatbot. Ask me anything about products, shipping, returns, refunds, payments, warranties, stock, or order help.', time: 'Now', local: true },
            { id: 'welcome-2', sender: 'bot', text: `Ask naturally about products, shipping, returns, orders, and more.`, time: 'Now', local: true },
          ]);
          setLoadingMessages(false);
        }
      }
    };
    init();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isTyping) inputRef.current?.focus();
  }, [isTyping]);

  const generateGeminiReply = async (message, history) => {
    if (!GEMINI_KEY) return null;

    const recent = history.slice(-10).map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text || m.message }],
    }));

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [...recent, { role: 'user', parts: [{ text: message }] }],
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      const data = await res.json();
      if (data.error) {
        console.error('Gemini error:', data.error);
        return null;
      }
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (e) {
      console.error('Gemini fetch failed:', e);
      return null;
    }
  };

  const generateFallbackReply = (message) => {
    const productMatch = findMatchingProduct(message, products);
    if (productMatch) return buildProductAnswer(productMatch);

    if (message.includes('#')) return buildOrderAnswer(message);

    const topic = findBestTopic(message);
    if (topic) return topic.answer;

    const closestQuestion = findClosestQuestion(message);
    if (closestQuestion) {
      const matchedTopic = findBestTopic(closestQuestion);
      if (matchedTopic) return matchedTopic.answer;
    }

    return buildFallbackAnswer();
  };

  const saveMessageToServer = async (sender, text) => {
    if (!isLoggedIn) return null;
    try {
      const result = await api.messages.create(sender, text);
      return result?.[0] || null;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  };

  const messagesRef = useRef(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const submitMessage = async (messageText) => {
    const cleaned = messageText.trim();
    if (!cleaned) return;

    setShowQuickTopics(false);
    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text: cleaned, time: formatTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const geminiText = await generateGeminiReply(cleaned, messagesRef.current);
    const botText = geminiText || generateFallbackReply(cleaned);
    const botMsg = { id: `bot-${Date.now() + 1}`, sender: 'bot', text: botText, time: formatTime() };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);

    await Promise.all([
      saveMessageToServer('user', cleaned),
      saveMessageToServer('bot', botText),
    ]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitMessage(inputValue);
  };

  const handleClearChat = async () => {
    if (isLoggedIn) {
      try {
        await api.messages.clear();
      } catch (error) {
        console.error('Error clearing messages:', error);
      }
    }
    setMessages([
      { id: 'welcome-1', sender: 'bot', text: 'Hello! I am the Core Collective support chatbot. Ask me anything about products, shipping, returns, refunds, payments, warranties, stock, or order help.', time: 'Now', local: true },
      { id: 'welcome-2', sender: 'bot', text: `Ask naturally about products, shipping, returns, orders, and more.`, time: 'Now', local: true },
    ]);
  };

  return (
    <div className="container py-6">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-elevated overflow-hidden">
        <div className="min-h-[680px] flex flex-col">
          {/* ── Header ── */}
          <header className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-sm shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm leading-tight">Core Collective Assistant</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
                  <span className="text-xs text-gray-500">
                    {isTyping ? 'Typing...' : loadingProducts ? 'Loading...' : 'Online'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isLoggedIn && (
                <button
                  onClick={handleClearChat}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-danger transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </header>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-5 space-y-3 scrollbar-thin">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse-dot" />
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse-dot" style={{ animationDelay: '0.3s' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse-dot" style={{ animationDelay: '0.6s' }} />
                  <span className="text-sm ml-1">Loading messages</span>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2.5 animate-fade-in ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                    style={{ animationDelay: '0ms' }}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-sm shrink-0 mb-1">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[600px] px-4 py-2.5 ${
                        message.sender === 'user'
                          ? 'bg-primary text-white rounded-2xl rounded-br-sm'
                          : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100'
                      } ${message.local ? 'opacity-80' : ''}`}
                    >
                      <p className="text-sm leading-6 whitespace-pre-wrap">{message.text || message.message}</p>
                      <p
                        className={`text-[11px] mt-1.5 ${
                          message.sender === 'user' ? 'text-white/60' : 'text-gray-400'
                        }`}
                      >
                        {message.time || (message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Just now')}
                      </p>
                    </div>
                  </div>
                ))}

                {/* ── Typing indicator ── */}
                {isTyping && (
                  <div className="flex items-end gap-2.5 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-sm shrink-0 mb-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse-dot" />
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse-dot" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse-dot" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Quick Topics ── */}
          {showQuickTopics && !loadingMessages && messages.length <= 2 && (
            <div className="px-4 pt-2 pb-1 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Quick answers</p>
              <div className="flex flex-wrap gap-2">
                {quickTopics.map((topic) => (
                  <button
                    key={topic.label}
                    onClick={() => submitMessage(topic.label)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-primary hover:text-primary hover:bg-primary-50 transition-all shadow-sm"
                  >
                    <span className="text-base leading-none">{topic.icon}</span>
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Input ── */}
          <div className="border-t border-gray-200 px-4 py-3 bg-white">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  disabled={isTyping}
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-primary hover:bg-primary-700 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
            <p className="text-[11px] text-gray-400 mt-1.5 text-center">
              Powered by Gemini AI &mdash; Answers may be AI-generated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
