import React, { useState } from 'react';
import { ChevronRight, MessageCircle, Phone, Mail, Search, ShoppingBag, Truck, RotateCcw, CreditCard, Shield, Package, ArrowLeft } from 'lucide-react';

const helpCategories = [
  { id: 'order', icon: ShoppingBag, title: 'Order Status', description: 'Track your orders, view order history' },
  { id: 'shipping', icon: Truck, title: 'Shipping & Delivery', description: 'Shipping methods, delivery times, tracking' },
  { id: 'returns', icon: RotateCcw, title: 'Returns & Refunds', description: 'Return policy, refund process, exchanges' },
  { id: 'payment', icon: CreditCard, title: 'Payment Methods', description: 'Payment options, coupons, gift cards' },
  { id: 'security', icon: Shield, title: 'Account Security', description: 'Password, 2FA, privacy settings' },
];

const faqs = [
  { category: 'Order', question: 'How do I track my order?', answer: 'You can track your order by logging into your account and visiting the Orders section. You will find tracking information there.' },
  { category: 'Order', question: 'Can I modify my order after placing it?', answer: 'Once an order is placed, modifications are not possible. Please cancel the order and place a new one if needed.' },
  { category: 'Shipping', question: 'How long does delivery take?', answer: 'Standard delivery takes 5-7 business days. Express delivery takes 2-3 business days.' },
  { category: 'Shipping', question: 'Do you ship internationally?', answer: 'Yes, we ship to over 100 countries worldwide. Shipping costs vary by destination.' },
  { category: 'Returns', question: 'What is your return policy?', answer: 'We offer 30-day returns for most items. Items must be unused and in original packaging.' },
  { category: 'Returns', question: 'How do I get a refund?', answer: 'Refunds are processed within 5-7 business days after we receive the returned item.' },
  { category: 'Payment', question: 'What payment methods do you accept?', answer: 'We accept Visa, Mastercard, PayPal, and all major credit cards.' },
  { category: 'Payment', question: 'How do I apply a coupon?', answer: 'Enter your coupon code at checkout in the designated field.' },
  { category: 'Security', question: 'How is my data protected?', answer: 'We use industry-standard encryption to protect your personal information.' },
  { category: 'Security', question: 'How do I reset my password?', answer: 'Click "Forgot Password" on the login page and follow the instructions sent to your email.' },
];

const HelpCenter = ({ setPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const filteredFAQs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

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
        <span className="text-[#1C1C1C] font-normal">Help Center</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-8 mb-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">How can we help you?</h1>
          <p className="text-white/80 mb-6">Search our knowledge base or browse categories below</p>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg text-dark"
            />
          </div>
        </div>
      </div>

      {/* Help Categories */}
      <h2 className="text-xl font-bold text-dark mb-4">Browse by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {helpCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white border border-[#DEE2E7] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setPage('contact-us', { helpTopic: category.id })}
          >
            <category.icon className="w-10 h-10 text-primary mb-3" />
            <h3 className="font-semibold text-dark mb-1">{category.title}</h3>
            <p className="text-sm text-secondary">{category.description}</p>
          </div>
        ))}
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-[#DEE2E7] rounded-lg p-6 text-center">
          <MessageCircle className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-dark mb-1">Live Chat</h3>
          <p className="text-sm text-secondary mb-3">Chat with our support team</p>
          <button className="text-primary font-medium hover:underline" onClick={() => setPage('message')}>Start Chat</button>
        </div>
        <div className="bg-white border border-[#DEE2E7] rounded-lg p-6 text-center">
          <Mail className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-dark mb-1">Email Support</h3>
          <p className="text-sm text-secondary mb-3">We'll respond within 24 hours</p>
          <a className="text-primary font-medium hover:underline" href="mailto:rehanilyas20196@gmail.com">Send Email</a>
        </div>
        <div className="bg-white border border-[#DEE2E7] rounded-lg p-6 text-center">
          <Phone className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-dark mb-1">Call Us</h3>
          <p className="text-sm text-secondary mb-3">Available 24/7</p>
          <a className="text-primary font-medium hover:underline" href="tel:+923455900229">+92 345 5900229</a>
        </div>
      </div>

      {/* FAQs */}
      <h2 className="text-xl font-bold text-dark mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {filteredFAQs.map((faq, index) => (
          <div key={index} className="bg-white border border-[#DEE2E7] rounded-lg overflow-hidden">
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center"
              onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
            >
              <span className="font-medium text-dark">{faq.question}</span>
              <ChevronRight className={`w-5 h-5 text-secondary transition-transform ${expandedFAQ === index ? 'rotate-90' : ''}`} />
            </button>
            {expandedFAQ === index && (
              <div className="px-6 pb-4">
                <p className="text-secondary">{faq.answer}</p>
                <span className="text-xs text-primary mt-2 inline-block">{faq.category}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpCenter;
