import React, { useState } from 'react';
import { api } from '../lib/api';

const PromoModal = ({ userProfile, onClose }) => {
  const [email, setEmail] = useState(userProfile?.email || '');
  const [name, setName] = useState(userProfile?.name || '');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setStatus('submitting');
    try {
      await api.discountMessages.create(email, name || email.split('@')[0], message);
      setStatus('success');
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-dark">Get Rs. 1000 off</h3>
          <button onClick={onClose} className="text-dark-light hover:text-dark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-lg font-bold text-dark">Request Sent!</p>
            <p className="text-sm text-dark-light mt-1">We'll review your request shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-dark-light">Enter your details to receive your Rs. 1000 discount with a new supplier.</p>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2 border border-shade-border rounded-md focus:ring-1 focus:ring-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-shade-border rounded-md focus:ring-1 focus:ring-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about the discount you're looking for..."
                className="w-full px-4 py-2 border border-shade-border rounded-md focus:ring-1 focus:ring-primary outline-none resize-none h-24"
                required
              />
            </div>
            {status === 'error' && (
              <p className="text-sm text-red-600">Failed to send. Please try again.</p>
            )}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {status === 'submitting' ? 'Sending...' : 'Claim Rs. 1000 Discount'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PromoModal;