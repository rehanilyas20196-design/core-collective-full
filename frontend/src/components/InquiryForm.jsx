import React, { useState } from 'react';
import bgImg from '../assets/Image/backgrounds/image 107.png';
import { api } from '../lib/api';

const InquiryForm = ({ userProfile }) => {
  const [formData, setFormData] = useState({
    item_name: '',
    details: '',
    quantity: '',
    unit: 'Pcs',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const payload = {
        item_name: formData.item_name.trim(),
        details: formData.details.trim(),
        quantity: Number(formData.quantity) || 0,
        unit: formData.unit,
      };

      await api.supplierInquiries.create(payload);

      alert('Inquiry sent successfully.');
      setFormData({
        item_name: '',
        details: '',
        quantity: '',
        unit: 'Pcs',
      });
    } catch (error) {
      console.error('Error saving inquiry:', error);
      alert('Failed to send inquiry. Please check your Supabase table and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
        className="relative mt-6 rounded-lg overflow-hidden min-h-[400px] lg:h-[400px] flex items-center bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url("${bgImg}")` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2C7CF1]/80 to-[#127FFF]/60 z-0"></div>
      
      <div className="container relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center text-white px-4 py-8 sm:p-8 lg:p-12 gap-8">
        <div className="max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 leading-tight">An easy way to send requests to all suppliers</h2>
          <p className="text-white opacity-90 hidden md:block">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
          </p>
        </div>

          <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-lg shadow-xl w-full max-w-[440px] text-dark">
          <h3 className="text-lg font-bold mb-6">Send quote to suppliers</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {userProfile && (
              <input
                type="email"
                value={userProfile.email}
                disabled
                className="w-full px-4 py-2 border border-shade-border rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            )}
            <input 
              type="text" 
              name="item_name"
              placeholder="What item you need?" 
              value={formData.item_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-shade-border rounded-md focus:ring-1 focus:ring-primary outline-none"
              required
            />
            <textarea 
              name="details"
              placeholder="Type more details" 
              value={formData.details}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-shade-border rounded-md h-24 focus:ring-1 focus:ring-primary outline-none resize-none"
              required
            ></textarea>
            <div className="flex flex-col sm:flex-row gap-4">
               <input 
                type="number"
                min="1"
                name="quantity"
                placeholder="Quantity" 
                value={formData.quantity}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-shade-border rounded-md outline-none"
                required
              />
               <label htmlFor="unit-select" className="sr-only">Unit</label>
               <select
                  id="unit-select"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="px-4 py-2 border border-shade-border rounded-md bg-white outline-none sm:w-[120px]"
                >
                  <option>Pcs</option>
                  <option>Kgs</option>
                  <option>Boxes</option>
                  <option>Sets</option>
                </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send inquiry'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default InquiryForm;
