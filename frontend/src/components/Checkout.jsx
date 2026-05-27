import React, { useState } from 'react';
import { ChevronRight, CreditCard, Landmark, Phone, ArrowLeft, CheckCircle2, Upload, ImageIcon, X, Clock } from 'lucide-react';
import { api } from '../lib/api';

const Checkout = ({ setPage, handleBack, cartItems, total }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        province: '',
        city: '',
        buildingStreet: '',
        area: '',
        colonySuburb: '',
        address: '',
        label: 'HOME'
    });

    const [paymentMethod, setPaymentMethod] = useState('');
    const [screenshotFile, setScreenshotFile] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshotFile(file);
            setScreenshotPreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveInfo = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePlaceOrder = async () => {
        try {
            setLoading(true);
            let screenshotUrl = '';
            if (screenshotFile) {
                const result = await api.upload.paymentScreenshot(screenshotFile);
                screenshotUrl = result.url;
            }

            await api.orders.create({
                full_name: formData.fullName,
                phone_number: formData.phoneNumber,
                province: formData.province,
                city: formData.city,
                area: formData.area,
                building_street: formData.buildingStreet,
                colony_suburb: formData.colonySuburb,
                address: formData.address,
                label: formData.label,
                total_amount: total,
                payment_method: paymentMethod,
                payment_screenshot: screenshotUrl,
                items: cartItems,
            });
            setStep(3);
        } catch (error) {
            console.error('Error saving order:', error);
            alert(`Failed to place order: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    if (step === 3) {
        return (
            <div className="container py-12 sm:py-20 text-center">
                <div className="max-w-md mx-auto bg-white p-6 sm:p-8 border border-[#DEE2E7] rounded-xl shadow-lg">
                    <div className="w-20 h-20 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 text-orange">
                        <Clock size={48} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] mb-4">Order Pending!</h2>
                    <p className="text-[#505050] mb-8">Your application is <strong>pending</strong> and will be <strong>confirmed or rejected in 5 hours</strong>. You will receive a notification once the review is complete.</p>
                    <button
                        className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-all shadow-md active:scale-95"
                        onClick={() => setPage('home')}
                    >
                        Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f4f4f4] min-h-screen py-6 sm:py-8">
            <div className="container">
                {/* Header / Breadcrumbs & Back Button */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-2 text-[#8B96A5] text-sm">
                        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setPage('cart')}>Cart</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#1C1C1C] font-normal">Checkout</span>
                    </div>
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-[#505050] hover:text-primary transition-colors font-medium"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Back
                    </button>
                </div>


                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Section: Information */}
                    <div className="flex-1">
                        {step === 1 ? (
                            <div className="bg-white rounded-lg border border-[#DEE2E7] p-4 sm:p-6 lg:p-8">
                                <h1 className="text-xl font-bold text-[#1C1C1C] mb-6 sm:mb-8">Delivery Information</h1>
                                <form onSubmit={handleSaveInfo} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1C1C]">Full name</label>
                                            <input
                                                required name="fullName" value={formData.fullName} onChange={handleInputChange}
                                                type="text" placeholder="Enter your first and last name"
                                                className="w-full px-4 py-2.5 border border-[#DEE2E7] rounded-md outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label htmlFor="province" className="text-sm font-medium text-[#1C1C1C]">Province</label>
                                            <select
                                                id="province"
                                                required name="province" value={formData.province} onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 border border-[#DEE2E7] rounded-md outline-none focus:border-primary transition-colors"
                                            >
                                                <option value="">Please choose your province</option>
                                                <option value="Punjab">Punjab</option>
                                                <option value="Sindh">Sindh</option>
                                                <option value="KPK">KPK</option>
                                                <option value="Balochistan">Balochistan</option>
                                                <option value="Islamabad">Islamabad</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1C1C]">Phone Number</label>
                                            <input
                                                required name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange}
                                                type="text" placeholder="Please enter your phone number"
                                                className="w-full px-4 py-2.5 border border-[#DEE2E7] rounded-md outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1C1C]">City</label>
                                            <input
                                                required name="city" value={formData.city} onChange={handleInputChange}
                                                type="text" placeholder="Please enter your city"
                                                className="w-full px-4 py-2.5 border border-[#DEE2E7] rounded-md outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1C1C]">Building / House No / Floor / Street</label>
                                            <input
                                                name="buildingStreet" value={formData.buildingStreet} onChange={handleInputChange}
                                                type="text" placeholder="Please enter"
                                                className="w-full px-4 py-2.5 border border-[#DEE2E7] rounded-md outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1C1C]">Area</label>
                                            <input
                                                name="area" value={formData.area} onChange={handleInputChange}
                                                type="text" placeholder="Please enter your area"
                                                className="w-full px-4 py-2.5 border border-[#DEE2E7] rounded-md outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1C1C]">Colony / Suburb / Locality / Landmark</label>
                                            <input
                                                name="colonySuburb" value={formData.colonySuburb} onChange={handleInputChange}
                                                type="text" placeholder="Please enter"
                                                className="w-full px-4 py-2.5 border border-[#DEE2E7] rounded-md outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1C1C]">Address</label>
                                            <input
                                                required name="address" value={formData.address} onChange={handleInputChange}
                                                type="text" placeholder="For Example: House# 123, Street# 123, ABC Road"
                                                className="w-full px-4 py-2.5 border border-[#DEE2E7] rounded-md outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4">
                                        <label className="text-sm font-medium text-[#1C1C1C]">Select a label for effective delivery:</label>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, label: 'OFFICE' }))}
                                                className={`flex items-center gap-2 px-6 py-3 rounded-md border transition-all ${formData.label === 'OFFICE' ? 'border-[#0096C7] bg-[#E8F8FE] text-[#0096C7]' : 'border-[#DEE2E7] bg-white text-[#505050]'}`}
                                            >
                                                <Landmark size={18} />
                                                OFFICE
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, label: 'HOME' }))}
                                                className={`flex items-center gap-2 px-6 py-3 rounded-md border transition-all ${formData.label === 'HOME' ? 'border-[#FF9017] bg-[#FFF9F2] text-[#FF9017]' : 'border-[#DEE2E7] bg-white text-[#505050]'}`}
                                            >
                                                <Landmark size={18} />
                                                HOME
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-stretch sm:justify-end pt-6">
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto bg-[#0096C7] hover:bg-[#0077B6] text-white px-10 py-3 rounded-md font-bold transition-colors shadow-md"
                                        >
                                            SAVE
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-white rounded-lg border border-[#DEE2E7] p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-lg mb-1">Delivery to {formData.fullName}</h3>
                                        <p className="text-sm text-[#505050]">{formData.address}, {formData.city}, {formData.province}</p>
                                    </div>
                                    <button onClick={() => setStep(1)} className="text-[#0096C7] font-bold hover:underline">Edit</button>
                                </div>

                                <div className="bg-white rounded-lg border border-[#DEE2E7] p-4 sm:p-6 lg:p-8">
                                    <h2 className="text-xl font-bold mb-6">Select Payment Method</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { id: 'card', name: 'Bank Card', icon: <CreditCard className="text-blue-500" /> },
                                            { id: 'jazzcash', name: 'JazzCash', icon: <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">JC</div> },
                                            { id: 'easypaisa', name: 'EasyPaisa', icon: <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-bold">EP</div> },
                                            { id: 'bank', name: 'Direct Bank Transfer', icon: <Landmark className="text-gray-600" /> }
                                        ].map(method => (
                                            <div
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === method.id ? 'border-primary bg-primary/5 shadow-inner' : 'border-[#DEE2E7] hover:border-primary/50 bg-white'}`}
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                                                    {method.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-[#1C1C1C]">{method.name}</p>
                                                    <p className="text-xs text-[#8B96A5]">{method.id === 'card' ? 'Visa / Mastercard' : 'Instant Payment'}</p>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-primary' : 'border-[#DEE2E7]'}`}>
                                                    {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {paymentMethod && (
                                        <div className="mt-8 space-y-6">
                                            <div className="p-4 sm:p-6 bg-[#F7F7F7] border border-[#DEE2E7] rounded-xl">
                                                <p className="font-bold mb-2">Account Details:</p>
                                                {paymentMethod === 'jazzcash' && <p className="text-[#505050] font-medium text-lg">JazzCash: <span className="text-primary">+92 345 5900229</span> (Core Collective)</p>}
                                                {paymentMethod === 'easypaisa' && <p className="text-[#505050] font-medium text-lg">EasyPaisa: <span className="text-primary">+92 345 5900229</span> (Core Collective)</p>}
                                                {paymentMethod === 'bank' && <p className="text-[#505050]">Bank: Faysal Bank Ltd<br />Title: Core Collective<br />IBAN: PK63FAYS0000123456789</p>}
                                                {paymentMethod === 'card' && <p className="text-[#505050]">You will be redirected to the secure card payment gateway.</p>}
                                            </div>

                                            <div className="space-y-4">
                                                <p className="font-bold text-[#1C1C1C]">Upload Payment Screenshot</p>
                                                <div className="relative">
                                                    {!screenshotPreview ? (
                                                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#DEE2E7] rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                                <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                                                            </div>
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                        </label>
                                                    ) : (
                                                        <div className="relative w-full h-64 rounded-xl overflow-hidden border border-[#DEE2E7] group">
                                                            <img src={screenshotPreview} alt="Payment screenshot preview" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                                <label className="bg-white text-primary px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-gray-100 flex items-center gap-2">
                                                                    <Upload size={18} />
                                                                    Change
                                                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                                </label>
                                                                <button
                                                                    onClick={() => { setScreenshotFile(null); setScreenshotPreview(null); }}
                                                                    className="bg-[#FA3434] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#D42D2D] flex items-center gap-2"
                                                                >
                                                                    <X size={18} />
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-4 mt-10">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="flex-1 border border-[#DEE2E7] py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={!paymentMethod || (paymentMethod !== 'card' && !screenshotFile) || loading}
                                            className="flex-[2] bg-[#00B517] hover:bg-[#009A14] text-white py-3 rounded-lg font-bold transition-all shadow-lg disabled:opacity-50"
                                        >
                                            {loading ? 'Processing...' : 'Place Order Now'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Section: Order Summary */}
                    <div className="lg:w-[380px]">
                        <div className="bg-white rounded-lg border border-[#DEE2E7] p-4 sm:p-6 shadow-sm lg:sticky lg:top-24">
                            <h2 className="font-bold text-lg mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <img src={item.image_url || item.image} alt={item.name || item.title} width="48" height="48" loading="lazy" className="w-12 h-12 rounded border p-1 object-contain" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium line-clamp-1">{item.name || item.title}</p>
                                            <p className="text-xs text-[#8B96A5]">Qty: {item.qty || 1}</p>
                                        </div>
                                        <p className="text-sm font-bold">Rs. {item.price}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[#DEE2E7] pt-4 space-y-3">
                                <div className="flex justify-between text-[#505050]">
                                    <span>Items Total ({cartItems.length} items)</span>
                                    <span>Rs. {total}</span>
                                </div>
                                <div className="flex justify-between text-[#505050]">
                                    <span>Delivery Fee</span>
                                    <span>Rs. 140</span>
                                </div>
                                <div className="pt-4 border-t border-[#DEE2E7] flex justify-between items-baseline">
                                    <span className="font-bold text-lg">Total:</span>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-[#FF9017]">Rs. {parseFloat(total) + 140}</p>
                                        <p className="text-[10px] text-[#8B96A5]">VAT included, where applicable</p>
                                    </div>
                                </div>
                            </div>

                            {step === 1 && (
                                <button
                                    onClick={handleSaveInfo}
                                    className={`w-full mt-8 py-4 rounded-lg font-bold text-lg shadow-lg transition-all ${formData.fullName && formData.phoneNumber && formData.address
                                        ? 'bg-[#FF9017] hover:bg-[#E38015] text-white'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Proceed to Pay
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
