import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Package, CheckCircle, XCircle, Clock, ExternalLink, RefreshCw, Eye, User, Phone, MapPin, CreditCard, Image as ImageIcon, Trash2, MessageSquare, Tag, FileText, Send, Search, Truck, Navigation } from 'lucide-react';

const TABS = ['orders', 'discount-messages', 'supplier-quotes'];

const AdminPanel = ({ setPage, handleBack, userProfile }) => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [discountMessages, setDiscountMessages] = useState([]);
    const [supplierQuotes, setSupplierQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersData, discountData, quotesData] = await Promise.all([
                api.orders.getAll().catch(() => []),
                api.discountMessages.getAll().catch(() => []),
                api.supplierInquiries.getAll().catch(() => []),
            ]);
            setOrders(ordersData || []);
            setDiscountMessages(discountData || []);
            setSupplierQuotes(quotesData || []);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
        try {
            await api.orders.delete(orderId);
            setOrders(orders.filter(order => order.id !== orderId));
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order');
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.orders.updateStatus(orderId, newStatus);
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update status');
        }
    };

    const updateTracking = async (orderId, trackingStatus, note = '') => {
        try {
            await api.orders.updateTracking(orderId, trackingStatus, note);
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, tracking_status: trackingStatus } : order
            ));
        } catch (error) {
            console.error('Error updating tracking:', error);
            alert('Failed to update tracking');
        }
    };

    const handleDiscountAction = async (id, status, adminReply = '') => {
        try {
            await api.discountMessages.updateStatus(id, status, adminReply);
            setDiscountMessages(prev => prev.map(m => m.id === id ? { ...m, status, admin_reply: adminReply, reviewed_at: new Date().toISOString() } : m));
        } catch (error) {
            console.error('Error updating discount message:', error);
            alert('Failed to update');
        }
    };

    const deleteDiscountMessage = async (id) => {
        if (!window.confirm('Delete this discount request?')) return;
        try {
            await api.discountMessages.delete(id);
            setDiscountMessages(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const handleQuoteAction = async (id, status, adminNotes, supplierRef) => {
        try {
            await api.supplierInquiries.updateStatus(id, status, adminNotes, supplierRef);
            setSupplierQuotes(prev => prev.map(q => q.id === id ? { ...q, status, admin_notes: adminNotes, supplier_ref: supplierRef, reviewed_at: new Date().toISOString() } : q));
        } catch (error) {
            console.error('Error updating quote:', error);
            alert('Failed to update');
        }
    };

    const deleteQuote = async (id) => {
        if (!window.confirm('Delete this supplier inquiry?')) return;
        try {
            await api.supplierInquiries.delete(id);
            setSupplierQuotes(prev => prev.filter(q => q.id !== id));
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const filteredOrders = statusFilter === 'all'
        ? orders
        : orders.filter(o => o.status === statusFilter);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <RefreshCw className="animate-spin text-primary w-10 h-10" />
            </div>
        );
    }

    const tabCounts = {
        orders: orders.length,
        'discount-messages': discountMessages.filter(m => m.status === 'pending').length,
        'supplier-quotes': supplierQuotes.filter(q => q.status === 'pending').length,
    };

    return (
        <div className="container py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-start gap-4">
                    <button
                        onClick={handleBack}
                        className="mt-1 p-2 hover:bg-[#F7F7F7] rounded-lg text-[#8B96A5] transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1C1C1C]">Admin Dashboard</h1>
                        <p className="text-[#505050]">Manage orders, discount requests, and supplier quotes</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-[#DEE2E7] pb-2 overflow-x-auto">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-3 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-[#8B96A5] hover:bg-[#F7F7F7]'}`}
                    >
                        {tab === 'orders' && <Package size={16} />}
                        {tab === 'discount-messages' && <Tag size={16} />}
                        {tab === 'supplier-quotes' && <FileText size={16} />}
                        {tab === 'orders' ? 'Orders' : tab === 'discount-messages' ? 'Discount Requests' : 'Supplier Quotes'}
                        {tabCounts[tab] > 0 && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                                {tabCounts[tab]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <>
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-[#DEE2E7] mb-6 w-fit">
                        {['all', 'pending', 'confirmed', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all capitalize ${statusFilter === status ? 'bg-primary text-white shadow-md' : 'text-[#8B96A5] hover:bg-[#F7F7F7]'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {filteredOrders.length === 0 ? (
                            <div className="bg-white border border-[#DEE2E7] rounded-xl p-12 text-center">
                                <Package className="w-16 h-16 text-[#DEE2E7] mx-auto mb-4" />
                                <h2 className="text-xl font-bold text-[#1C1C1C]">No orders found</h2>
                                <p className="text-[#8B96A5]">There are no {statusFilter !== 'all' ? statusFilter : ''} orders to display.</p>
                            </div>
                        ) : (
                            filteredOrders.map((order) => (
                                <div key={order.id} className="bg-white border border-[#DEE2E7] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-[#FAFAFA] border-b border-[#DEE2E7] p-5 flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white border border-[#DEE2E7] rounded-lg">
                                                <Package className="text-primary" size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#8B96A5] font-bold uppercase tracking-wider">Order Reference</p>
                                                <p className="font-bold text-[#1C1C1C]">#ORD-{order.id.toString().padStart(6, '0')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-xs text-[#8B96A5] font-bold uppercase tracking-wider">Date</p>
                                                <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#8B96A5] font-bold uppercase tracking-wider">Total Amount</p>
                                                <p className="font-bold text-lg text-primary">Rs. {order.total_amount}</p>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${order.status === 'confirmed' ? 'bg-[#E3F9E5] text-[#1F7A33]' :
                                                order.status === 'rejected' ? 'bg-[#FFF0F0] text-[#D32F2F]' :
                                                    'bg-[#FFF9E5] text-[#B7791F]'
                                                }`}>
                                                {order.status === 'pending' && <Clock size={14} />}
                                                {order.status === 'confirmed' && <CheckCircle size={14} />}
                                                {order.status === 'rejected' && <XCircle size={14} />}
                                                {order.status}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-sm text-[#8B96A5] uppercase tracking-wider flex items-center gap-2">
                                                <User size={16} /> Customer Info
                                            </h3>
                                            <div className="bg-[#F8F9FA] rounded-lg p-4 space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {order.full_name?.[0] || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#1C1C1C]">{order.full_name}</p>
                                                        {order.user_email && <p className="text-xs text-[#505050]">{order.user_email}</p>}
                                                        <p className="text-xs text-[#505050]">ID: {order.user_id || 'N/A'}</p>
                                                        <div className="flex items-center gap-2 text-sm text-[#505050] mt-1">
                                                            <Phone size={14} />
                                                            {order.phone_number}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pt-3 border-t border-[#DEE2E7] flex gap-2 text-sm text-[#505050]">
                                                    <MapPin size={16} className="shrink-0 text-gray-400" />
                                                    <div>
                                                        <p className="font-medium text-[#1C1C1C]">{order.label} Address</p>
                                                        <p className="text-xs mt-0.5 line-clamp-2">{order.address}, {order.city}, {order.province}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-bold text-sm text-[#8B96A5] uppercase tracking-wider flex items-center gap-2">
                                                <CreditCard size={16} /> Order Details
                                            </h3>
                                            <div className="space-y-3">
                                                <p className="text-sm font-bold text-[#1C1C1C]">Payment: <span className="text-primary capitalize">{order.payment_method}</span></p>
                                                <div className="max-h-[150px] overflow-y-auto pr-2 space-y-2 thin-scrollbar">
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-3 text-sm">
                                                            <img src={item.image_url || item.image} alt={item.name} className="w-8 h-8 rounded object-contain border" />
                                                            <span className="flex-1 line-clamp-1">{item.name || item.title}</span>
                                                            <span className="font-bold">x{item.qty || 1}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-bold text-sm text-[#8B96A5] uppercase tracking-wider flex items-center gap-2">
                                                <Eye size={16} /> Payment Proof
                                            </h3>
                                            {order.payment_screenshot ? (
                                                <div className="relative group rounded-lg overflow-hidden border border-[#DEE2E7] h-[150px]">
                                                    <img src={order.payment_screenshot} alt="Payment Proof" className="w-full h-full object-cover" />
                                                    <a
                                                        href={order.payment_screenshot}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold text-sm"
                                                    >
                                                        <ExternalLink size={20} />
                                                        View Full Size
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="h-[150px] bg-gray-50 border border-dashed border-[#DEE2E7] rounded-lg flex flex-col items-center justify-center text-[#8B96A5]">
                                                    <ImageIcon size={32} className="mb-2 opacity-30" />
                                                    <p className="text-xs">No screenshot provided</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white border-t border-[#DEE2E7] p-4 sm:p-5">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                            <button
                                                onClick={() => deleteOrder(order.id)}
                                                className="p-2.5 text-[#FA3434] hover:bg-[#FA3434]/5 rounded-lg transition-all flex items-center gap-2 font-bold text-sm w-fit"
                                                title="Delete Order"
                                            >
                                                <Trash2 size={18} />
                                                Delete
                                            </button>

                                            {order.status === 'pending' ? (
                                                <div className="flex gap-3 flex-wrap">
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'rejected')}
                                                        className="px-5 py-2 rounded-lg border border-[#FA3434] text-[#FA3434] font-bold hover:bg-[#FA3434]/5 transition-all text-sm"
                                                    >
                                                        Reject Order
                                                    </button>
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                                        className="px-6 py-2 rounded-lg bg-[#00B517] text-white font-bold hover:bg-[#009A14] transition-all shadow-md text-sm"
                                                    >
                                                        Confirm Payment
                                                    </button>
                                                </div>
                                            ) : order.status === 'confirmed' || order.tracking_status ? (
                                                <div className="space-y-3 w-full">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-xs font-bold text-[#8B96A5] uppercase tracking-wider">Update Tracking:</span>
                                                        <select
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val) updateTracking(order.id, val, '');
                                                                e.target.value = '';
                                                            }}
                                                            className="px-3 py-1.5 border border-[#DEE2E7] rounded-lg text-sm outline-none focus:border-primary"
                                                            defaultValue=""
                                                        >
                                                            <option value="" disabled>Select status...</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="in_transit">In Transit</option>
                                                            <option value="out_for_delivery">Out for Delivery</option>
                                                            <option value="delivered">Delivered</option>
                                                        </select>
                                                    </div>
                                                    {order.tracking_status && (
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-xs text-[#8B96A5]">Current: </span>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                                order.tracking_status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                                order.tracking_status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                                                order.tracking_status === 'in_transit' ? 'bg-orange-100 text-orange-700' :
                                                                order.tracking_status === 'out_for_delivery' ? 'bg-amber-100 text-amber-700' :
                                                                order.tracking_status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                                'bg-gray-100 text-gray-600'
                                                            }`}>
                                                                {order.tracking_status === 'in_transit' ? 'In Transit' :
                                                                 order.tracking_status === 'out_for_delivery' ? 'Out for Delivery' :
                                                                 order.tracking_status}
                                                            </span>
                                                            <button
                                                                onClick={() => updateOrderStatus(order.id, 'pending')}
                                                                className="text-[#8B96A5] text-xs hover:underline ml-2"
                                                            >
                                                                Revert to Pending
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : order.status === 'rejected' ? (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'pending')}
                                                    className="text-[#8B96A5] text-sm hover:underline"
                                                >
                                                    Revert to Pending
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* Discount Messages Tab */}
            {activeTab === 'discount-messages' && (
                <div className="space-y-4">
                    {discountMessages.length === 0 ? (
                        <div className="bg-white border border-[#DEE2E7] rounded-xl p-12 text-center">
                            <Tag className="w-16 h-16 text-[#DEE2E7] mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-[#1C1C1C]">No discount requests</h2>
                            <p className="text-[#8B96A5]">Customers haven't sent any discount requests yet.</p>
                        </div>
                    ) : (
                        discountMessages.map((msg) => (
                            <DiscountMessageCard
                                key={msg.id}
                                message={msg}
                                onApprove={(id, reply) => handleDiscountAction(id, 'approved', reply)}
                                onReject={(id, reply) => handleDiscountAction(id, 'rejected', reply)}
                                onDelete={deleteDiscountMessage}
                            />
                        ))
                    )}
                </div>
            )}

            {/* Supplier Quotes Tab */}
            {activeTab === 'supplier-quotes' && (
                <div className="space-y-4">
                    {supplierQuotes.length === 0 ? (
                        <div className="bg-white border border-[#DEE2E7] rounded-xl p-12 text-center">
                            <FileText className="w-16 h-16 text-[#DEE2E7] mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-[#1C1C1C]">No supplier inquiries</h2>
                            <p className="text-[#8B96A5]">No supplier inquiries have been submitted yet.</p>
                        </div>
                    ) : (
                        supplierQuotes.map((quote) => (
                            <SupplierQuoteCard
                                key={quote.id}
                                quote={quote}
                                onApprove={(id, notes, ref) => handleQuoteAction(id, 'approved', notes, ref)}
                                onReject={(id, notes) => handleQuoteAction(id, 'rejected', notes)}
                                onDelete={deleteQuote}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

const DiscountMessageCard = ({ message, onApprove, onReject, onDelete }) => {
    const [replyText, setReplyText] = useState('');
    const [showReply, setShowReply] = useState(false);

    return (
        <div className="bg-white border border-[#DEE2E7] rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                            {message.user_name?.[0] || '?'}
                        </div>
                        <div>
                            <p className="font-bold text-[#1C1C1C]">{message.user_name || 'Unknown User'}</p>
                            <p className="text-xs text-[#8B96A5]">{message.user_email}</p>
                        </div>
                    </div>
                    <div className="bg-[#F8F9FA] rounded-lg p-4 mb-3">
                        <p className="font-medium text-sm text-[#505050]">Discount Request:</p>
                        <p className="text-[#1C1C1C] mt-1">{message.message}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#8B96A5]">
                        <span>{new Date(message.created_at).toLocaleString()}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${message.status === 'approved' ? 'bg-green-100 text-green-700' :
                            message.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                            {message.status}
                        </span>
                        {message.user_id && (
                            <span className="text-[#8B96A5]">User ID: {message.user_id.substring(0, 8)}...</span>
                        )}
                    </div>
                    {message.admin_reply && (
                        <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Admin Reply:</p>
                            <p className="text-sm text-blue-900 mt-1">{message.admin_reply}</p>
                        </div>
                    )}
                </div>
                <div className="flex flex-row sm:flex-col gap-2">
                    {message.status === 'pending' && (
                        <>
                            <button
                                onClick={() => setShowReply(!showReply)}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors flex items-center gap-2"
                            >
                                <Send size={14} />
                                Reply
                            </button>
                            <button
                                onClick={() => onReject(message.id, '')}
                                className="px-4 py-2 border border-[#FA3434] text-[#FA3434] rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
                            >
                                Reject
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => onDelete(message.id)}
                        className="p-2 text-[#FA3434] hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            {showReply && (
                <div className="px-5 pb-5 border-t border-[#DEE2E7] pt-4">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full px-4 py-2 border border-[#DEE2E7] rounded-lg text-sm outline-none focus:border-primary resize-none h-20"
                    />
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => { onApprove(message.id, replyText); setShowReply(false); }}
                            disabled={!replyText.trim()}
                            className="px-4 py-2 bg-[#00B517] text-white rounded-lg text-sm font-bold hover:bg-[#009A14] transition-colors disabled:opacity-50"
                        >
                            Approve & Send
                        </button>
                        <button
                            onClick={() => { onReject(message.id, replyText); setShowReply(false); }}
                            disabled={!replyText.trim()}
                            className="px-4 py-2 border border-[#FA3434] text-[#FA3434] rounded-lg text-sm font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                            Reject & Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const SupplierQuoteCard = ({ quote, onApprove, onReject, onDelete }) => {
    const [notes, setNotes] = useState('');
    const [supplierRef, setSupplierRef] = useState('');
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="bg-white border border-[#DEE2E7] rounded-xl overflow-hidden shadow-sm">
            <div className="p-5">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {quote.user_name?.[0] || '?'}
                            </div>
                            <div>
                                <p className="font-bold text-[#1C1C1C]">{quote.user_name || 'Unknown User'}</p>
                                <p className="text-xs text-[#8B96A5]">{quote.user_email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                            <div className="bg-[#F8F9FA] rounded-lg p-4">
                                <p className="text-xs text-[#8B96A5] uppercase tracking-wider font-bold">Item</p>
                                <p className="font-bold text-[#1C1C1C] mt-1">{quote.item_name}</p>
                            </div>
                            <div className="bg-[#F8F9FA] rounded-lg p-4">
                                <p className="text-xs text-[#8B96A5] uppercase tracking-wider font-bold">Quantity</p>
                                <p className="font-bold text-[#1C1C1C] mt-1">{quote.quantity} {quote.unit || 'Pcs'}</p>
                            </div>
                        </div>

                        <div className="bg-[#F8F9FA] rounded-lg p-4 mb-3">
                            <p className="text-xs text-[#8B96A5] uppercase tracking-wider font-bold">Details</p>
                            <p className="text-[#1C1C1C] mt-1">{quote.details}</p>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-[#8B96A5]">
                            <span>{new Date(quote.created_at).toLocaleString()}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${quote.status === 'approved' ? 'bg-green-100 text-green-700' :
                                quote.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {quote.status}
                            </span>
                            {quote.user_id && (
                                <span className="text-[#8B96A5]">User ID: {quote.user_id.substring(0, 8)}...</span>
                            )}
                        </div>

                        {quote.supplier_ref && (
                            <div className="mt-3 bg-green-50 border border-green-100 rounded-lg p-3">
                                <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Supplier Reference</p>
                                <p className="text-sm text-green-900 mt-1">{quote.supplier_ref}</p>
                            </div>
                        )}
                        {quote.admin_notes && (
                            <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Admin Notes</p>
                                <p className="text-sm text-blue-900 mt-1">{quote.admin_notes}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-row sm:flex-col gap-2">
                        {quote.status === 'pending' && (
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors flex items-center gap-2"
                            >
                                <Send size={14} />
                                Process
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(quote.id)}
                            className="p-2 text-[#FA3434] hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="mt-4 pt-4 border-t border-[#DEE2E7] space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-[#505050] mb-1">Supplier Reference</label>
                            <input
                                type="text"
                                value={supplierRef}
                                onChange={(e) => setSupplierRef(e.target.value)}
                                placeholder="e.g., SUP-2024-001"
                                className="w-full px-4 py-2 border border-[#DEE2E7] rounded-lg text-sm outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#505050] mb-1">Admin Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add notes about this inquiry..."
                                className="w-full px-4 py-2 border border-[#DEE2E7] rounded-lg text-sm outline-none focus:border-primary resize-none h-20"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { onApprove(quote.id, notes, supplierRef); setShowForm(false); }}
                                disabled={!supplierRef.trim()}
                                className="px-6 py-2 bg-[#00B517] text-white rounded-lg text-sm font-bold hover:bg-[#009A14] transition-colors disabled:opacity-50"
                            >
                                Approve with Reference
                            </button>
                            <button
                                onClick={() => { onReject(quote.id, notes); setShowForm(false); }}
                                className="px-6 py-2 border border-[#FA3434] text-[#FA3434] rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
