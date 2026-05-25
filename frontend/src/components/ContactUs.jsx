import React, { useState } from 'react';
import { ChevronRight, Mail, Phone, MapPin, Send, ArrowLeft } from 'lucide-react';

const helpTopicContent = {
  order: {
    title: 'Order Status',
    description: 'Track your orders, view order history, and understand what each order status means.',
    rules: [
      'Use your order number to request the latest order update.',
      'Order history is available after the order is placed successfully.',
      'Address or item changes are easiest before packing starts.',
    ],
  },
  shipping: {
    title: 'Shipping & Delivery',
    description: 'Shipping methods, delivery times, tracking, and dispatch expectations.',
    rules: [
      'Standard shipping usually takes 5 to 7 business days after dispatch.',
      'Express delivery is usually faster but may cost more depending on destination.',
      'Tracking can take 12 to 24 hours to update after shipment pickup.',
    ],
  },
  returns: {
    title: 'Returns & Refunds',
    description: 'Return policy, refund process, damaged item support, and exchanges.',
    rules: [
      'Most returns should be requested within 30 days of delivery.',
      'Items should be unused and complete unless they arrived damaged or incorrect.',
      'Approved refunds are usually returned to the original payment method.',
    ],
  },
  payment: {
    title: 'Payment Methods',
    description: 'Payment options, transfer details, coupons, gift cards, and checkout help.',
    rules: [
      'Double-check payment details before confirming checkout.',
      'Payment proof may be required for manual payment verification.',
      'Coupon or discount issues should be reported before placing the order.',
    ],
  },
  security: {
    title: 'Account Security',
    description: 'Password safety, privacy guidance, and account access best practices.',
    rules: [
      'Use a strong password and do not share it with anyone.',
      'Review saved profile and address details regularly.',
      'If you suspect account issues, update your password and contact support.',
    ],
  },
};

const ContactUs = ({ setPage, helpTopic }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const selectedTopic = helpTopic ? helpTopicContent[helpTopic] : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(formData.subject || 'Support Request');
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:rehanilyas20196@gmail.com?subject=${subject}&body=${body}`;
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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
        <span className="text-[#1C1C1C] font-normal">Contact Us</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div>
          <h1 className="text-3xl font-bold text-dark mb-4">Get in Touch</h1>
          <p className="text-secondary mb-6">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-dark">Email</p>
                <a href="mailto:rehanilyas20196@gmail.com" className="text-secondary hover:text-primary transition-colors">rehanilyas20196@gmail.com</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-dark">Phone</p>
                <a href="tel:+923455900229" className="text-secondary hover:text-primary transition-colors">+92 345 5900229</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-dark">Address</p>
                <p className="text-secondary">Mellinium Karachi</p>
              </div>
            </div>
          </div>

          {selectedTopic && (
            <div className="mt-8 bg-white border border-[#DEE2E7] rounded-lg p-6">
              <h2 className="text-xl font-bold text-dark mb-2">{selectedTopic.title}</h2>
              <p className="text-secondary mb-4">{selectedTopic.description}</p>
              <div className="space-y-3">
                {selectedTopic.rules.map((rule) => (
                  <div key={rule} className="rounded-lg bg-[#F7F9FC] px-4 py-3 text-sm text-dark">
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-[#DEE2E7] rounded-lg p-6">
          <h2 className="text-xl font-bold text-dark mb-4">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#DEE2E7] rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-[#DEE2E7] rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-[#DEE2E7] rounded-lg focus:ring-1 focus:ring-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows="4"
                className="w-full px-4 py-2 border border-[#DEE2E7] rounded-lg focus:ring-1 focus:ring-primary outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
