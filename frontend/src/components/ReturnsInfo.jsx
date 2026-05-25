import React from 'react';
import { ChevronRight, RotateCcw, Check, Shield, ArrowLeft } from 'lucide-react';

const ReturnsInfo = ({ setPage }) => {
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
        <span className="text-[#1C1C1C] font-normal">Returns & Refunds</span>
      </div>

      <h1 className="text-3xl font-bold text-dark mb-6">Returns & Refunds</h1>

      {/* Return Policy */}
      <div className="bg-white border border-[#DEE2E7] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-primary" />
          Return Policy
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-teal mt-0.5" />
            <p className="text-dark">30-day return window for most items</p>
          </div>
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-teal mt-0.5" />
            <p className="text-dark">Items must be unused and in original packaging</p>
          </div>
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-teal mt-0.5" />
            <p className="text-dark">Original shipping fees are non-refundable</p>
          </div>
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-teal mt-0.5" />
            <p className="text-dark">Return shipping cost is the customer's responsibility</p>
          </div>
        </div>
      </div>

      {/* Non-Returnable Items */}
      <div className="bg-white border border-[#DEE2E7] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-dark mb-4">Items That Cannot Be Returned</h2>
        <ul className="list-disc list-inside text-secondary space-y-2">
          <li>Intimate or sanitary products</li>
          <li>Personal care items that have been used</li>
          <li>Custom or made-to-order products</li>
          <li>Digital downloads</li>
          <li>Gift cards</li>
        </ul>
      </div>

      {/* Refund Process */}
      <div className="bg-white border border-[#DEE2E7] rounded-lg p-6">
        <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Refund Process
        </h2>
        <p className="text-secondary mb-4">Once we receive your returned item, refunds are processed within 5-7 business days. The amount will be credited to your original payment method.</p>
        <div className="bg-shade-light p-4 rounded-lg">
          <p className="text-sm text-dark"><strong>Note:</strong> Refunds may take 10-14 business days to appear in your account due to processing times by your bank or payment provider.</p>
        </div>
      </div>
    </div>
  );
};

export default ReturnsInfo;