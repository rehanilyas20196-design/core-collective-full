import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Package, ChevronDown, ChevronUp, Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useOrders } from '../hooks/useProducts';

const TRACKING_STEPS = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'shipped', label: 'Shipped', icon: Package },
  { key: 'in_transit', label: 'In Transit', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const TRACKING_ORDER = ['pending', 'confirmed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'];

const getTrackingStepIndex = (trackingStatus) => {
  const idx = TRACKING_ORDER.indexOf(trackingStatus);
  return idx >= 0 ? idx : 0;
};

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-[#FFF9E5] text-[#B7791F]',
    confirmed: 'bg-[#E3F9E5] text-[#1F7A33]',
    rejected: 'bg-[#FFF0F0] text-[#D32F2F]',
    delivered: 'bg-[#E3F9E5] text-[#1F7A33]',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
};

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const currentStepIdx = getTrackingStepIndex(order.tracking_status || order.status);
  const items = order.items || [];
  const totalQty = items.reduce((s, i) => s + (i.qty || 1), 0);

  return (
    <div className="border border-[#DEE2E7] rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-[#FAFAFA] p-4 border-b border-[#DEE2E7]">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm">
            <div>
              <p className="text-[#8B96A5] text-xs uppercase tracking-wider font-bold">Order Placed</p>
              <p className="font-medium text-[#1C1C1C]">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[#8B96A5] text-xs uppercase tracking-wider font-bold">Total</p>
              <p className="font-bold text-[#1C1C1C]">Rs. {parseFloat(order.total_amount || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[#8B96A5] text-xs uppercase tracking-wider font-bold">Items</p>
              <p className="font-medium text-[#1C1C1C]">{totalQty}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.tracking_status || order.status)}`}>
              {order.tracking_status === 'in_transit' ? 'In Transit' :
               order.tracking_status === 'out_for_delivery' ? 'Out for Delivery' :
               (order.tracking_status || order.status || 'pending')}
            </span>
            <span className="text-[#8B96A5] text-xs">#ORD-{String(order.id).padStart(6, '0')}</span>
          </div>
        </div>
      </div>

      {/* Tracking Progress Bar */}
      {(order.tracking_status && order.tracking_status !== 'rejected' && order.status !== 'rejected') ? (
        <div className="p-4 sm:p-6 border-b border-[#DEE2E7] bg-white">
          <div className="hidden sm:flex items-center justify-between">
            {TRACKING_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isCompleted ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-2 ring-primary/30 ring-offset-2' : ''}`}>
                      <StepIcon size={16} />
                    </div>
                    <p className={`text-[10px] mt-1.5 text-center font-medium whitespace-nowrap ${
                      isCompleted ? 'text-primary' : 'text-gray-400'
                    }`}>{step.label}</p>
                  </div>
                  {idx < TRACKING_STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full ${
                      idx < currentStepIdx ? 'bg-primary' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile tracking */}
          <div className="sm:hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStepIdx >= 0 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {TRACKING_STEPS[currentStepIdx >= 0 ? currentStepIdx : 0].icon && (
                  <Package size={18} />
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-[#1C1C1C]">
                  {currentStepIdx >= 0 ? TRACKING_STEPS[currentStepIdx].label : 'Pending'}
                </p>
                <p className="text-xs text-[#8B96A5]">Current Status</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-700"
                style={{ width: `${((currentStepIdx + 1) / TRACKING_STEPS.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-[#8B96A5]">
              <span>Pending</span>
              <span>Delivered</span>
            </div>
          </div>

          {/* Tracking History */}
          {order.tracking_history && order.tracking_history.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#DEE2E7]">
              <div className="space-y-2">
                {order.tracking_history.slice().reverse().map((entry, i) => {
                  const stepLabel = TRACKING_STEPS.find(s => s.key === entry.status)?.label || entry.status;
                  return (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        i === 0 ? 'bg-primary' : 'bg-gray-300'
                      }`} />
                      <div>
                        <p className="font-medium text-[#1C1C1C] capitalize">{stepLabel}</p>
                        <p className="text-[#8B96A5]">{new Date(entry.date).toLocaleString()}{entry.note ? ` - ${entry.note}` : ''}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : order.status === 'rejected' ? (
        <div className="p-4 sm:p-6 border-b border-[#DEE2E7] bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            </div>
            <div>
              <p className="font-bold text-red-700 text-sm">Order Rejected</p>
              <p className="text-xs text-red-600">Please contact support for more details.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 border-b border-[#DEE2E7] bg-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock size={20} />
            </div>
            <div>
              <p className="font-bold text-amber-700 text-sm">Pending Review</p>
              <p className="text-xs text-amber-600">Your order is pending review by the admin.</p>
            </div>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="p-4 sm:p-6">
        <div className="space-y-3">
          {items.slice(0, expanded ? items.length : 2).map((item, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 border border-[#DEE2E7] rounded-lg p-1.5 flex items-center justify-center bg-[#F7F7F7] flex-shrink-0">
                <img src={item.image_url || item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[#1C1C1C] truncate">{item.name || item.title}</p>
                <p className="text-xs text-[#8B96A5]">Qty: {item.qty || 1} x Rs. {item.price}</p>
              </div>
              <p className="font-bold text-sm text-[#1C1C1C]">Rs. {((item.price || 0) * (item.qty || 1)).toFixed(2)}</p>
            </div>
          ))}
          {items.length > 2 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-primary text-xs font-medium hover:underline mt-1"
            >
              {expanded ? 'Show less' : `Show ${items.length - 2} more items`}
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>

        {order.address && (
          <div className="mt-4 pt-3 border-t border-[#DEE2E7] flex items-start gap-2 text-xs text-[#505050]">
            <MapPin size={14} className="text-[#8B96A5] mt-0.5 shrink-0" />
            <span>{order.address}, {order.city}, {order.province}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Orders = ({ setPage, handleBack, userProfile }) => {
    const { data: orders = [], isLoading } = useOrders(userProfile?.id);

    if (isLoading) {
        return (
            <div className="container py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-[#8B96A5]">Loading your orders...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container py-4 sm:py-8 px-4 sm:px-6">
                <div className="bg-white border border-[#DEE2E7] rounded-lg p-6 sm:p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl sm:text-2xl font-bold">My Orders</h1>
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-[#505050] hover:text-primary transition-colors font-medium text-sm"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            Back
                        </button>
                    </div>

                    <div className="text-center py-8 sm:py-12">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-[#F7F7F7] rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-[#8B96A5]" />
                        </div>
                        <h2 className="text-lg sm:text-xl font-semibold text-dark mb-2">No orders yet</h2>
                        <p className="text-[#8B96A5] text-sm mb-6">You haven't placed any orders yet.</p>
                        <button
                            onClick={() => setPage('listing')}
                            className="bg-primary text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-medium flex items-center gap-2 mx-auto hover:bg-primary-dark transition-colors text-sm"
                        >
                            Start Shopping
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4 sm:py-8 px-4 sm:px-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">My Orders ({orders.length})</h1>
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-[#505050] hover:text-primary transition-colors font-medium text-sm"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back
                </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
};

export default Orders;