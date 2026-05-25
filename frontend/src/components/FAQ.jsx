import React, { useState } from 'react';
import { ChevronRight, Search, ArrowLeft } from 'lucide-react';

const FAQ = ({ setPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    { category: 'General', question: 'What is Core Collective?', answer: 'Core Collective is your one-stop shop for quality products across various categories including electronics, fashion, home goods, and more.' },
    { category: 'Account', question: 'How do I create an account?', answer: 'Click on "Profile" in the header and select "Sign up" to create your account.' },
    { category: 'Account', question: 'How do I reset my password?', answer: 'Go to the login page, click "Forgot Password", and follow the instructions sent to your email.' },
    { category: 'Orders', question: 'Where can I see my order history?', answer: 'Log in to your account and click on "Orders" in the profile section to view your order history.' },
    { category: 'Orders', question: 'Can I cancel my order?', answer: 'You can cancel your order within 24 hours of placing it. Contact customer support for assistance.' },
    { category: 'Shipping', question: 'How long does shipping take?', answer: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.' },
    { category: 'Shipping', question: 'Do you ship internationally?', answer: 'Yes, we ship to over 100 countries worldwide.' },
    { category: 'Returns', question: 'What is your return policy?', answer: 'We offer 30-day returns for most items. Items must be unused and in original packaging.' },
    { category: 'Returns', question: 'How do I initiate a return?', answer: 'Go to your order history, select the order, and click "Return Item" to start the return process.' },
    { category: 'Payment', question: 'What payment methods do you accept?', answer: 'We accept Visa, Mastercard, PayPal, and all major credit cards.' },
    { category: 'Payment', question: 'Is my payment information secure?', answer: 'Yes, we use industry-standard encryption to protect your payment information.' },
    { category: 'Privacy', question: 'How is my data protected?', answer: 'We are committed to protecting your privacy and use advanced security measures to keep your data safe.' },
  ];

  const filteredFAQs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const categories = [...new Set(faqs.map(faq => faq.category))];

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

      <div className="flex items-center gap-2 text-[#8B96A5] text-sm mb-6">
        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setPage('home')}>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1C1C1C] font-normal">FAQ</span>
      </div>

      <h1 className="text-3xl font-bold text-dark mb-6">Frequently Asked Questions</h1>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-[#DEE2E7] rounded-lg"
        />
      </div>

      {/* FAQ Categories */}
      {!searchQuery && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <span key={cat} className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-medium">
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* FAQs */}
      <div className="space-y-2">
        {filteredFAQs.map((faq, index) => (
          <div key={index} className="bg-white border border-[#DEE2E7] rounded-lg overflow-hidden">
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center"
              onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
            >
              <div>
                <span className="text-xs text-primary font-medium mr-2">{faq.category}</span>
                <span className="font-medium text-dark">{faq.question}</span>
              </div>
              <ChevronRight className={`w-5 h-5 text-secondary transition-transform ${expandedFAQ === index ? 'rotate-90' : ''}`} />
            </button>
            {expandedFAQ === index && (
              <div className="px-6 pb-4">
                <p className="text-secondary">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;