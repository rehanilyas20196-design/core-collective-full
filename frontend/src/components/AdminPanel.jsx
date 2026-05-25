import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Package, CheckCircle, XCircle, Clock, ExternalLink, RefreshCw, Eye, User, Phone, MapPin, CreditCard, Image as ImageIcon, Trash2 } from 'lucide-react';

const AdminPanel = ({ setPage, handleBack }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await api.orders.getAll();
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
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

    return (
        <div className="container py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-start gap-4">
                    <button
                        onClick={handleBack}
                        className="mt-1 p-2 hover:bg-[#F7F7F7] rounded-lg text-[#8B96A5] transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1C1C1C]">Admin Dashboard</h1>
                        <p className="text-[#505050]">Manage and verify customer orders</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-[#DEE2E7]">
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
                            {/* Order Header */}
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
                                <div className="flex items-center gap-8">
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
                                {/* Customer & Shipping */}
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

                                {/* Order Items */}
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

                                {/* Payment Proof */}
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

                            {/* Action Buttons */}
                            <div className="bg-white border-t border-[#DEE2E7] p-5 flex justify-between items-center">
                                <button
                                    onClick={() => deleteOrder(order.id)}
                                    className="p-2.5 text-[#FA3434] hover:bg-[#FA3434]/5 rounded-lg transition-all flex items-center gap-2 font-bold text-sm"
                                    title="Delete Order"
                                >
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                                <div className="flex gap-3">
                                    {order.status === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'rejected')}
                                                className="px-6 py-2.5 rounded-lg border border-[#FA3434] text-[#FA3434] font-bold hover:bg-[#FA3434]/5 transition-all text-sm"
                                            >
                                                Reject Order
                                            </button>
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                                className="px-8 py-2.5 rounded-lg bg-[#00B517] text-white font-bold hover:bg-[#009A14] transition-all shadow-md text-sm"
                                            >
                                                Confirm Payment
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'pending')}
                                            className="text-[#8B96A5] text-sm hover:underline"
                                        >
                                            Revert to Pending
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
