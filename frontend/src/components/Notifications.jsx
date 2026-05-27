import React, { useState, useEffect } from 'react';
import { Bell, Package, CheckCircle2, XCircle, Clock, ShoppingBag, ArrowLeft, CheckCheck, Trash2 } from 'lucide-react';
import { api } from '../lib/api';

const Notifications = ({ setPage, handleBack, userProfile }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userProfile?.id) {
            fetchNotifications();
        } else {
            setLoading(false);
            setNotifications([]);
        }
    }, [userProfile?.id]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await api.notifications.getAll();
            setNotifications(data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.notifications.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.notifications.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.notifications.delete(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="text-green-500" size={24} />;
            case 'error': return <XCircle className="text-red-500" size={24} />;
            case 'pending': return <Clock className="text-orange-500" size={24} />;
            case 'order': return <Package className="text-blue-500" size={24} />;
            default: return <Bell className="text-primary" size={24} />;
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
                    <div className="flex gap-2">
                        <button
                            onClick={markAllAsRead}
                            className="text-primary font-bold hover:underline text-sm flex items-center gap-1"
                        >
                            <CheckCheck size={16} />
                            Mark all read
                        </button>
                        <button
                            onClick={fetchNotifications}
                            className="text-primary font-bold hover:underline text-sm"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-[#DEE2E7]">
                    {loading ? (
                        <div className="p-12 text-center text-secondary">Loading notifications...</div>
                    ) : !userProfile ? (
                        <div className="p-12 text-center">
                            <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-dark mb-2">Sign in to see notifications</h2>
                            <p className="text-secondary">Please log in to view your notifications.</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-dark mb-2">No notifications</h2>
                            <p className="text-secondary">You're all caught up!</p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-6 hover:bg-gray-50 transition-colors flex gap-4 ${!notif.is_read ? 'bg-primary/5' : ''}`}
                            >
                                <div className="mt-1">{getIcon(notif.type)}</div>
                                <div className="flex-1">
                                    {notif.title && (
                                        <p className="font-bold text-dark text-sm">{notif.title}</p>
                                    )}
                                    <p className="text-dark font-medium leading-relaxed mb-1">{notif.message}</p>
                                    <div className="flex items-center gap-3 text-xs text-secondary">
                                        <span>{new Date(notif.created_at).toLocaleString()}</span>
                                        {!notif.is_read && (
                                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {!notif.is_read && (
                                        <button
                                            onClick={() => markAsRead(notif.id)}
                                            className="text-primary hover:text-primary-dark"
                                            title="Mark as read"
                                        >
                                            <CheckCheck size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notif.id)}
                                        className="text-red-400 hover:text-red-600"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
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
