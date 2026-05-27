import React, { useState, useEffect } from 'react';
import { Bell, Package, CheckCircle2, XCircle, Clock, ShoppingBag, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';

const Notifications = ({ setPage, handleBack }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await api.orders.getAll();

            // Map orders to notification messages
            const msgs = data.map(order => {
                let message = '';
                let type = '';
                let icon = null;

                if (order.status === 'confirmed') {
                    message = `Your order #${order.id} is confirmed and now goes to shipping!`;
                    type = 'success';
                    icon = <CheckCircle2 className="text-green-500" />;
                } else if (order.status === 'rejected') {
                    message = `Your order #${order.id} has been rejected. Please check your payment details or contact support.`;
                    type = 'error';
                    icon = <XCircle className="text-red-500" />;
                } else {
                    message = `Your order #${order.id} is pending approval. Estimated review time: 5 hours.`;
                    type = 'pending';
                    icon = <Clock className="text-orange-500" />;
                }

                return {
                    id: order.id,
                    message,
                    time: new Date(order.created_at).toLocaleString(),
                    type,
                    icon,
                    orderId: order.id
                };
            });

            setNotifications(msgs);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-8 max-w-4xl">
            <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[#8B96A5] hover:text-primary transition-colors mb-4"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
            </button>
            <div className="bg-white border border-[#DEE2E7] rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-[#DEE2E7] bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Bell className="text-primary w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-dark">Notifications</h1>
                    </div>
                    <button
                        onClick={fetchNotifications}
                        className="text-primary font-bold hover:underline text-sm"
                    >
                        Refresh
                    </button>
                </div>

                <div className="divide-y divide-[#DEE2E7]">
                    {loading ? (
                        <div className="p-12 text-center text-secondary">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-dark mb-2">No notifications</h2>
                            <p className="text-secondary">You haven't placed any orders yet.</p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-6 hover:bg-gray-50 transition-colors flex gap-4 cursor-pointer`}
                                onClick={() => setPage('orders')}
                            >
                                <div className="mt-1">{notif.icon}</div>
                                <div className="flex-1">
                                    <p className="text-dark font-medium leading-relaxed mb-1">{notif.message}</p>
                                    <div className="flex items-center gap-3 text-xs text-secondary">
                                        <span>{notif.time}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="font-bold text-primary uppercase tracking-wider">{notif.type}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
