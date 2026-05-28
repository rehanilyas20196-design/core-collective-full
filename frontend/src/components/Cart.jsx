import React, { useState } from 'react';
import { Minus, Plus, ArrowLeft, Trash2, Heart, ShieldCheck, Truck, MessageSquare, ShoppingCart, Tag } from 'lucide-react';
import { api } from '../lib/api';

const Cart = ({ setPage, handleBack, cartItems, setCartItems, removeFromCart, clearCart }) => {
    const [savedForLater, setSavedForLater] = useState([]);
    const [showDiscountForm, setShowDiscountForm] = useState(false);
    const [discountMsg, setDiscountMsg] = useState('');
    const [discountSending, setDiscountSending] = useState(false);

    const removeItem = (id) => {
        removeFromCart(id);
    };

    const removeAllItems = () => {
        if (clearCart) {
            clearCart();
        } else {
            setCartItems([]);
        }
    };

    const saveForLater = (item) => {
        setSavedForLater(prev => [...prev, item]);
        removeFromCart(item.id);
    };

    const moveToCart = (item) => {
        setCartItems(prev => {
            const existingItem = prev.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prev.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, qty: (cartItem.qty || 1) + 1 } : cartItem
                );
            }
            return [...prev, { ...item, qty: 1 }];
        });
        setSavedForLater(prev => prev.filter(i => i.id !== item.id));
    };

    const updateQty = (item, newQty) => {
        if (newQty < 1) return;
        setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, qty: newQty } : i));
        api.cart.updateQty(item.id, newQty).catch(console.error);
    };

    const handleDiscountSubmit = async (e) => {
        e.preventDefault();
        if (!discountMsg.trim()) return;
        setDiscountSending(true);
        try {
            const { supabase } = await import('../lib/supabase');
            const { data: { session } } = await supabase.auth.getSession();
            const email = session?.user?.email || 'guest@example.com';
            const name = session?.user?.user_metadata?.full_name || email.split('@')[0];
            await api.discountMessages.create(email, name, discountMsg);
            alert('Discount request sent! Admin will review it shortly.');
            setDiscountMsg('');
            setShowDiscountForm(false);
        } catch (error) {
            console.error('Error sending discount request:', error);
            alert('Failed to send request. Please try again.');
        } finally {
            setDiscountSending(false);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);
    const discount = subtotal > 0 ? 60.00 : 0;
    const tax = subtotal > 0 ? 14.00 : 0;
    const total = subtotal - discount + tax;

    if (cartItems.length === 0) {
        return (
            <div className="container py-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">My cart (0)</h1>

                <div className="card-lg p-6 sm:p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <ShoppingCart size={40} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <button
                        className="btn-primary inline-flex items-center gap-2 mx-auto"
                        onClick={handleBack}
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => setShowDiscountForm(!showDiscountForm)}
                            className="text-primary font-medium hover:underline inline-flex items-center gap-2"
                        >
                            <Tag size={18} />
                            Request a discount
                        </button>
                        {showDiscountForm && (
                            <form onSubmit={handleDiscountSubmit} className="max-w-md mx-auto mt-4 space-y-3">
                                <textarea
                                    value={discountMsg}
                                    onChange={(e) => setDiscountMsg(e.target.value)}
                                    placeholder="Tell us about the discount you're looking for..."
                                    className="input-field resize-none h-24"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={discountSending}
                                    className="btn-primary"
                                >
                                    {discountSending ? 'Sending...' : 'Send Request'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">My cart ({cartItems.length})</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                    <div className="card-lg">
                        {cartItems.map((item, index) => (
                            <div key={item.id} className={`p-4 lg:p-6 flex flex-col sm:flex-row gap-4 lg:gap-6 ${index !== cartItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                <div className="w-20 h-20 lg:w-24 lg:h-24 border border-gray-200 rounded-xl p-3 flex items-center justify-center bg-gray-50 flex-shrink-0 group overflow-hidden">
                                    <img src={item.image || item.image_url} alt={item.title || item.name} width="100" height="100" loading="lazy" className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                                </div>

                                <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-1.5 min-w-0">
                                        <h3 className="font-semibold text-gray-900 hover:text-primary cursor-pointer transition-colors max-w-md line-clamp-2">{item.title || item.name}</h3>
                                        <div className="text-gray-500 text-sm space-y-0.5">
                                            <p>{item.specs || item.description || item.category}</p>
                                            <p>Seller: {item.seller}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="btn-danger flex items-center gap-1.5"
                                            >
                                                <Trash2 size={14} />
                                                Remove
                                            </button>
                                            <button
                                                onClick={() => saveForLater(item)}
                                                className="px-3 py-1.5 border border-gray-200 rounded-md text-primary text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                                            >
                                                <Heart size={14} />
                                                Save for later
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-row sm:flex-col sm:items-end justify-between gap-3 min-w-[120px]">
                                        <span className="text-lg font-bold text-gray-900">Rs. {(item.price * (item.qty || 1)).toFixed(2)}</span>
                                        <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-white shadow-sm">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateQty(item, (item.qty || 1) - 1); }}
                                                className="px-2.5 py-1.5 hover:bg-gray-100 rounded-l-lg transition-colors text-gray-600 disabled:opacity-30"
                                                disabled={(item.qty || 1) <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="px-2 py-1.5 text-sm font-medium min-w-[28px] text-center">{item.qty || 1}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateQty(item, (item.qty || 1) + 1); }}
                                                className="px-2.5 py-1.5 hover:bg-gray-100 rounded-r-lg transition-colors text-gray-600"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <button
                            className="btn-primary inline-flex items-center gap-2"
                            onClick={handleBack}
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>

                        <button
                            onClick={removeAllItems}
                            className="text-danger font-semibold hover:text-red-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            Remove all
                        </button>
                    </div>

                    {savedForLater.length > 0 && (
                        <div className="card-lg p-5">
                            <h3 className="font-bold text-gray-900 mb-4">Saved for later ({savedForLater.length})</h3>
                            <div className="space-y-3">
                                {savedForLater.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 border border-gray-200 rounded-xl">
                                        <img src={item.image || item.image_url} alt={item.title || item.name} width="64" height="64" loading="lazy" className="w-16 h-16 object-contain rounded-lg" />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm">{item.title || item.name}</h4>
                                            <p className="text-gray-500 text-sm">Seller: {item.seller}</p>
                                        </div>
                                        <span className="font-bold text-gray-900">Rs. {item.price.toFixed(2)}</span>
                                        <button
                                            onClick={() => moveToCart(item)}
                                            className="text-primary text-sm font-semibold hover:underline self-start sm:self-auto"
                                        >
                                            Move to cart
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-gray-800 font-semibold text-sm">Secure Payment</p>
                                <p className="text-gray-500 text-xs">100% secure payment</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <MessageSquare size={20} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-gray-800 font-semibold text-sm">Customer Support</p>
                                <p className="text-gray-500 text-xs">24/7 support available</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <Truck size={20} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-gray-800 font-semibold text-sm">Free Delivery</p>
                                <p className="text-gray-500 text-xs">On orders over $100</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:w-[280px] space-y-4">
                    <div className="card-lg p-4 sm:p-5">
                        <p className="text-gray-600 text-sm mb-3">Have a coupon?</p>
                        <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200">
                            <input type="text" placeholder="Add coupon" className="flex-1 px-3 py-2 outline-none text-sm" />
                            <button className="bg-white border-l border-gray-200 px-4 py-2 text-primary font-semibold text-sm hover:bg-gray-50 transition-colors">Apply</button>
                        </div>
                    </div>

                    <div className="card-lg p-4 sm:p-5">
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Items Total ({cartItems.reduce((s, i) => s + (i.qty || 1), 0)} items)</span>
                                <span>Rs. {total}</span>
                            </div>
                            <div className="flex justify-between text-danger">
                                <span>Discount:</span>
                                <span>- Rs. {discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-success">
                                <span>Tax:</span>
                                <span>+ Rs. {tax.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="h-px bg-gray-200 mb-4"></div>

                        <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                            <span>Total:</span>
                            <span>Rs. {total.toFixed(2)}</span>
                        </div>

                        <button
                            className="w-full bg-success hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
                            onClick={() => setPage('checkout', { total: total.toFixed(2) })}
                        >
                            Checkout
                        </button>

                        <div className="mt-4 flex flex-wrap justify-center gap-2 opacity-50">
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
