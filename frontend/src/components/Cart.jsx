import React, { useState } from 'react';
import { ChevronDown, ArrowLeft, Trash2, Heart, ShieldCheck, Truck, MessageSquare, ShoppingCart } from 'lucide-react';

const Cart = ({ setPage, handleBack, cartItems, setCartItems, removeFromCart }) => {
    const [savedForLater, setSavedForLater] = useState([]);


    const removeItem = (id) => {
        removeFromCart(id);
    };

    const removeAllItems = () => {
        setCartItems([]);
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

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);
    const discount = subtotal > 0 ? 60.00 : 0;
    const tax = subtotal > 0 ? 14.00 : 0;
    const total = subtotal - discount + tax;

    if (cartItems.length === 0) {
        return (
            <div className="container py-6">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-6">My cart (0)</h1>

                <div className="bg-white border border-[#DEE2E7] rounded-lg p-6 sm:p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#F7F7F7] flex items-center justify-center">
                        <ShoppingCart size={40} className="text-[#8B96A5]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#1C1C1C] mb-2">Your cart is empty</h2>
                    <p className="text-[#8B96A5] mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <button
                        className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-dark transition-colors mx-auto"
                        onClick={handleBack}
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="container py-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-6">My cart ({cartItems.length})</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Section: Cart Items */}
                <div className="flex-1 space-y-4">
                    <div className="bg-white border border-[#DEE2E7] rounded-lg overflow-hidden">
                        {cartItems.map((item, index) => (
                            <div key={item.id} className={`p-4 lg:p-6 flex flex-col sm:flex-row gap-4 lg:gap-6 ${index !== cartItems.length - 1 ? 'border-b border-[#DEE2E7]' : ''}`}>
                                {/* Product Image */}
                                <div className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] border border-[#DEE2E7] rounded-lg p-3 flex items-center justify-center bg-[#F7F7F7] flex-shrink-0 group overflow-hidden">
                                    <img src={item.image || item.image_url} alt={item.title || item.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-1.5 min-w-0">
                                        <h3 className="font-semibold text-[#1C1C1C] hover:text-primary cursor-pointer transition-colors max-w-md">{item.title || item.name}</h3>
                                        <div className="text-[#8B96A5] text-sm space-y-0.5">
                                            <p>{item.specs || item.description || item.category}</p>
                                            <p>Seller: {item.seller}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="px-3 py-1.5 border border-[#DEE2E7] rounded-md text-[#FA3434] text-xs font-semibold hover:bg-[#FFF0F0] transition-colors flex items-center gap-1.5"
                                            >
                                                <Trash2 size={14} />
                                                Remove
                                            </button>
                                            <button
                                                onClick={() => saveForLater(item)}
                                                className="px-3 py-1.5 border border-[#DEE2E7] rounded-md text-primary text-xs font-semibold hover:bg-shade transition-colors flex items-center gap-1.5"
                                            >
                                                <Heart size={14} />
                                                Save for later
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-row sm:flex-col sm:items-end justify-between gap-3 min-w-[120px]">
                                        <span className="text-lg font-bold text-[#1C1C1C]">Rs. {item.price.toFixed(2)}</span>
                                        <div className="flex items-center gap-2 border border-[#DEE2E7] rounded-md px-3 py-2 bg-white cursor-pointer hover:bg-shade transition-colors">
                                            <span className="text-sm">Qty: {item.qty}</span>
                                            <ChevronDown size={14} className="opacity-50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 rounded-lg border border-[#DEE2E7]">
                        <button
                            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                            onClick={handleBack}
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>

                        <button
                            onClick={removeAllItems}
                            className="text-[#FA3434] font-bold hover:underline flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            Remove all
                        </button>
                    </div>

                    {/* Saved for Later */}
                    {savedForLater.length > 0 && (
                        <div className="bg-white border border-[#DEE2E7] rounded-lg p-5">
                            <h3 className="font-bold text-[#1C1C1C] mb-4">Saved for later ({savedForLater.length})</h3>
                            <div className="space-y-3">
                                {savedForLater.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 border border-[#DEE2E7] rounded-lg">
                                        <img src={item.image || item.image_url} alt={item.title || item.name} className="w-16 h-16 object-contain rounded" />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm">{item.title || item.name}</h4>
                                            <p className="text-[#8B96A5] text-sm">Seller: {item.seller}</p>
                                        </div>
                                        <span className="font-bold">Rs. {item.price.toFixed(2)}</span>
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

                    {/* Benefits Bar */}
                    <div className="flex flex-wrap gap-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#DEE2E7] flex items-center justify-center text-[#8B96A5]">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[#1C1C1C] font-semibold text-sm">Secure Payment</p>
                                <p className="text-[#8B96A5] text-xs">100% secure payment</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#DEE2E7] flex items-center justify-center text-[#8B96A5]">
                                <MessageSquare size={20} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[#1C1C1C] font-semibold text-sm">Customer Support</p>
                                <p className="text-[#8B96A5] text-xs">24/7 support available</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#DEE2E7] flex items-center justify-center text-[#8B96A5]">
                                <Truck size={20} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[#1C1C1C] font-semibold text-sm">Free Delivery</p>
                                <p className="text-[#8B96A5] text-xs">On orders over $100</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Summary */}
                <div className="lg:w-[280px] space-y-4">
                    {/* Coupon */}
                    <div className="bg-white border border-[#DEE2E7] rounded-lg p-4 sm:p-5">
                        <p className="text-[#505050] text-sm mb-3">Have a coupon?</p>
                        <div className="flex border border-[#DEE2E7] rounded-md overflow-hidden">
                            <input type="text" placeholder="Add coupon" className="flex-1 px-3 py-2 outline-none text-sm" />
                            <button className="bg-white border-l border-[#DEE2E7] px-4 py-2 text-primary font-bold text-sm hover:bg-shade transition-colors">Apply</button>
                        </div>
                    </div>

                    {/* Price Calculations */}
                    <div className="bg-white border border-[#DEE2E7] rounded-lg p-4 sm:p-5 shadow-sm">
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-[#505050]">
                                <span>Subtotal:</span>
                                <span>Rs. {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[#FA3434]">
                                <span>Discount:</span>
                                <span>- Rs. {discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[#00B517]">
                                <span>Tax:</span>
                                <span>+ Rs. {tax.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="h-[1px] bg-[#DEE2E7] mb-4"></div>

                        <div className="flex justify-between text-lg font-bold text-[#1C1C1C] mb-6">
                            <span>Total:</span>
                            <span>Rs. {total.toFixed(2)}</span>
                        </div>

                        <button
                            className="w-full bg-[#00B517] hover:bg-[#00A015] text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
                            onClick={() => setPage('checkout', { total: total.toFixed(2) })}
                        >
                            Checkout
                        </button>

                        <div className="mt-4 flex flex-wrap justify-center gap-2 opacity-60">
                            {/* Payment icon placeholders */}
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
