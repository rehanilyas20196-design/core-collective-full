import React from 'react';
import { ChevronRight, Truck, MapPin, Clock, Package, ArrowLeft } from 'lucide-react';

const ShippingInfo = ({ setPage }) => {
  const shippingMethods = [
    { name: 'Standard Shipping', time: '5-7 business days', price: 'Free', available: 'Worldwide' },
    { name: 'Express Shipping', time: '2-3 business days', price: 'Rs. 999', available: 'Selected countries' },
    { name: 'Next Day Delivery', time: '1 business day', price: 'Rs. 1999', available: 'Local addresses only' },
  ];

  const trackingSteps = [
    'Order confirmed',
    'Processing',
    'Shipped',
    'In transit',
    'Out for delivery',
    'Delivered',
  ];

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
        <span className="text-[#1C1C1C] font-normal">Shipping Information</span>
      </div>

      <h1 className="text-3xl font-bold text-dark mb-6">Shipping Information</h1>

      {/* Shipping Methods */}
      <div className="bg-white border border-[#DEE2E7] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary" />
          Shipping Methods
        </h2>
        <div className="space-y-3">
          {shippingMethods.map((method, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-shade-light rounded-lg">
              <div>
                <p className="font-medium text-dark">{method.name}</p>
                <p className="text-sm text-secondary flex items-center gap-2">
                  <Clock size={14} /> {method.time}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{method.price}</p>
                <p className="text-xs text-secondary">{method.available}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracking */}
      <div className="bg-white border border-[#DEE2E7] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Tracking Your Order
        </h2>
        <div className="flex items-center justify-between">
          {trackingSteps.map((step, idx) => (
            <div key={idx} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                idx < 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {idx + 1}
              </div>
              <p className={`text-xs ml-2 ${idx < 3 ? 'text-dark' : 'text-secondary'}`}>{step}</p>
              {idx < trackingSteps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${idx < 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Areas */}
      <div className="bg-white border border-[#DEE2E7] rounded-lg p-6">
        <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Delivery Areas
        </h2>
        <p className="text-secondary">We ship to over 100 countries worldwide. Delivery times may vary based on location.</p>
      </div>
    </div>
  );
};

export default ShippingInfo;