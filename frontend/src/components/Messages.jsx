import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bot, Send, Sparkles } from 'lucide-react';
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
  'shipping',
  'delivery',
  'order tracking',
  'returns',
  'refunds',
  'exchanges',
  'product quality',
  'damaged items',
  'bulk orders',
  'supplier quotes',
  'payment issues',
  'checkout help',
  'website navigation',
  'search help',
  'cart issues',
  'favorites',
  'account login',
  'profile settings',
  'contact support',
  'help center pages',
  'admin access',
];

const suggestedQuestions = questionTopics.flatMap((topic) =>
  questionTemplates.map((template, index) => ({
    id: `${topic.replace(/\s+/g, '-')}-${index + 1}`,
    question: template.replace('{topic}', topic),
    topic,
  }))
);

const searchableQuestionBank = suggestedQuestions.map((item) => item.question.toLowerCase());

const welcomeMessages = [
  {
    id: 1,
    sender: 'bot',
    text: 'Hello! I am the Core Collective support chatbot. Ask me anything about products, shipping, returns, refunds, payments, warranties, stock, or order help.',
    time: 'Now',
  },
  {
    id: 2,
    sender: 'bot',
    text: `I am trained with ${suggestedQuestions.length}+ built-in support questions, so you can type naturally and I will reply here in chat.`,
    time: 'Now',
  },
];

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

const Messages = ({ setPage, handleBack }) => {
  const [messages, setMessages] = useState(welcomeMessages);
  const [inputValue, setInputValue] = useState('');
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const data = await api.products.getMinimal(200);
        setProducts(data || []);
      } catch (error) {
        console.error('Error loading chatbot products:', error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateBotReply = (message) => {
    const productMatch = findMatchingProduct(message, products);
    if (productMatch) {
      return buildProductAnswer(productMatch);
    }

    if (message.includes('#')) {
      return buildOrderAnswer(message);
    }

    const topic = findBestTopic(message);
    if (topic) {
      return topic.answer;
    }

    const closestQuestion = findClosestQuestion(message);
    if (closestQuestion) {
      const matchedTopic = findBestTopic(closestQuestion);
      if (matchedTopic) {
        return matchedTopic.answer;
      }
    }

    return buildFallbackAnswer();
  };

  const submitMessage = (messageText) => {
    const cleaned = messageText.trim();
    if (!cleaned) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: cleaned,
      time: formatTime(),
    };

    const botMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      text: generateBotReply(cleaned),
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInputValue('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitMessage(inputValue);
  };

  return (
    <div className="container py-6">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-[#8B96A5] hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      <div className="bg-white border border-shade-border rounded-2xl shadow-sm overflow-hidden">
        <div className="min-h-[720px]">
          <section className="flex flex-col bg-white min-h-[720px]">
            <div className="p-5 border-b border-shade-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark">Core Collective Assistant</h3>
                  <p className="text-sm text-teal">
                    {loadingProducts ? 'Loading product knowledge...' : `Ready with ${products.length} product records`}
                  </p>
                </div>
              </div>
              <div className="text-sm text-secondary text-right">
                <p>Single support chatbot</p>
                <p>{suggestedQuestions.length}+ built-in support questions</p>
              </div>
            </div>

            <div className="px-5 pt-4">
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-semibold">Ask naturally</span>
                </div>
                <p className="text-sm text-secondary">
                  Try questions about products, stock, shipping, delivery times, returns, refunds, quality, payments, warranties, order support, website navigation, search, cart, favorites, checkout, and account help.
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#F6F8FB] p-5 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[720px] px-4 py-3 rounded-2xl shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-white border border-shade-border text-dark rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-6">{message.text}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-secondary'
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-shade-border p-4 bg-white">
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder='Ask a question like "How long does shipping take?"'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 px-4 py-3 bg-shade-light border border-shade-border rounded-full text-sm focus:ring-1 focus:ring-primary outline-none"
                />
                <button
                  type="submit"
                  className="w-12 h-12 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center transition-colors"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Messages;
