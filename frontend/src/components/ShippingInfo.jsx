import React from 'react';
import { ChevronRight, Truck, MapPin, Clock, Package, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ShippingInfo = ({ setPage, handleBack }) => {
  const shippingMethods = [
    { name: 'Standard Shipping', time: '5-7 business days', price: 'Free', available: 'Worldwide', icon: Truck },
    { name: 'Express Shipping', time: '2-3 business days', price: 'Rs. 999', available: 'Selected countries', icon: Clock },
    { name: 'Next Day Delivery', time: '1 business day', price: 'Rs. 1999', available: 'Local addresses only', icon: Package },
  ];

  const trackingSteps = [
    { label: 'Order confirmed', icon: CheckCircle2 },
    { label: 'Processing', icon: Package },
    { label: 'Shipped', icon: Truck },
    { label: 'In transit', icon: Truck },
    { label: 'Out for delivery', icon: Truck },
    { label: 'Delivered', icon: CheckCircle2 },
  ];

  return (
    <div className="container py-4 sm:py-6 px-4 sm:px-6">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-[#8B96A5] hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      <div className="flex items-center gap-2 text-[#8B96A5] text-xs sm:text-sm mb-4 sm:mb-6 flex-wrap">
        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setPage('home')}>Home</span>
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="text-[#1C1C1C] font-normal">Shipping Information</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-4 sm:mb-6">Shipping Information</h1>

      {/* Shipping Methods */}
      <div className="bg-white border border-[#DEE2E7] rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-dark mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary" />
          Shipping Methods
        </h2>
        <div className="space-y-3">
          {shippingMethods.map((method, idx) => {
            const Icon = method.icon;
            return (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-[#F7F7F7] rounded-lg gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-dark text-sm sm:text-base">{method.name}</p>
                    <p className="text-xs sm:text-sm text-secondary flex items-center gap-1">
                      <Clock size={12} /> {method.time}
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right ml-13 sm:ml-0">
                  <p className="font-bold text-primary text-sm sm:text-base">{method.price}</p>
                  <p className="text-[10px] sm:text-xs text-secondary">{method.available}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tracking Guide */}
      <div className="bg-white border border-[#DEE2E7] rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-dark mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Tracking Your Order
        </h2>
        {/* Desktop tracking steps */}
        <div className="hidden sm:flex items-center justify-between">
          {trackingSteps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div key={idx} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <StepIcon size={18} />
                  </div>
                  <p className="text-[10px] sm:text-xs mt-1.5 text-center font-medium text-dark whitespace-nowrap">{step.label}</p>
                </div>
                {idx < trackingSteps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 bg-primary/20" />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile tracking steps */}
        <div className="sm:hidden space-y-3">
          {trackingSteps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <StepIcon size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">{step.label}</p>
                </div>
                {idx < trackingSteps.length - 1 && (
                  <div className="w-0.5 h-6 bg-primary/20 ml-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Areas */}
      <div className="bg-white border border-[#DEE2E7] rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-dark mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Delivery Areas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 sm:p-4 bg-[#F7F7F7] rounded-lg">
            <h3 className="font-medium text-dark text-sm mb-2">Local Delivery</h3>
            <p className="text-xs sm:text-sm text-secondary">Available across all major cities in Pakistan including Lahore, Karachi, Islamabad, and more.</p>
          </div>
          <div className="p-3 sm:p-4 bg-[#F7F7F7] rounded-lg">
            <h3 className="font-medium text-dark text-sm mb-2">International Shipping</h3>
            <p className="text-xs sm:text-sm text-secondary">We ship to over 100 countries worldwide. Delivery times may vary based on location and customs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;