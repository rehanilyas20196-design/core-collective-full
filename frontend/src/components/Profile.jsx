import React, { useEffect, useState, useRef } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ShoppingBag, Heart, Package, Settings, LogOut, ChevronRight, ArrowLeft, Shield, CreditCard, Bell, MapPin, Phone, Edit3 } from 'lucide-react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

const TURNSTILE_SITE_KEY = '0x4AAAAAADXvb-lWRkZj3Kxs';

const Profile = ({ setPage, handleBack, setIsAdmin, userProfile, setUserProfile }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        joiningDate: new Date().toISOString().split('T')[0],
        phone: ''
    });
    const [cfToken, setCfToken] = useState('');
    const turnstileRef = useRef(null);
    const turnstileWidgetId = useRef(null);

    const [accountName, setAccountName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [settingsMsg, setSettingsMsg] = useState('');
    const [activeSettingsTab, setActiveSettingsTab] = useState(null);

    useEffect(() => {
        if (userProfile) return;
        const timer = setTimeout(() => {
            if (!window.turnstile) return;
            if (turnstileWidgetId.current) {
                window.turnstile.remove(turnstileWidgetId.current);
            }
            if (turnstileRef.current) {
                turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
                    sitekey: TURNSTILE_SITE_KEY,
                    callback: (token) => setCfToken(token),
                    'expired-callback': () => setCfToken(''),
                });
            }
        }, 500);
        return () => {
            clearTimeout(timer);
            if (turnstileWidgetId.current) {
                try { window.turnstile.remove(turnstileWidgetId.current); } catch {}
            }
        };
    }, [userProfile, isLogin]);

    useEffect(() => {
        const handleSetAuthMode = (e) => {
            if (e.detail === 'signup') {
                setIsLogin(false);
            } else {
                setIsLogin(true);
            }
        };
        window.addEventListener('setAuthMode', handleSetAuthMode);
        return () => window.removeEventListener('setAuthMode', handleSetAuthMode);
    }, []);

    useEffect(() => {
        if (userProfile) {
            setAccountName(userProfile.name || '');
            setPhoneNumber(userProfile.phone || '');
        }
    }, [userProfile]);

    const signInWithGoogle = async () => {
        try {
            const data = await api.auth.googleSignIn();
            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSignOut = async () => {
        try {
            await api.auth.logout();
            await supabase.auth.signOut();
        } catch (e) {
            console.error(e);
        }
        setUserProfile(null);
        setIsAdmin(false);
        window.dispatchEvent(new CustomEvent('authExpired'));
        setPage('home');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthMessage('');

        if (!formData.email || !formData.password) {
            setAuthMessage('Please enter both email and password.');
            return;
        }

        if (!cfToken) {
            setAuthMessage('Please complete the security check (CAPTCHA).');
            return;
        }

        if (isLogin) {
            try {
                const data = await api.auth.login(formData.email, formData.password, cfToken);
                const user = data?.user || data?.session?.user;
                if (user) {
                    if (data?.session) {
                        await supabase.auth.setSession({
                            access_token: data.session.access_token,
                            refresh_token: data.session.refresh_token,
                        });
                    }
                    setAuthMessage('Login successful!');
                    setIsAdmin(user.email === 'rehanilyas20196@gmail.com');
                    setUserProfile({
                        id: user.id,
                        name: user.user_metadata?.full_name || formData.email.split('@')[0],
                        email: user.email,
                        phone: user.user_metadata?.phone || '',
                    });
                    window.dispatchEvent(new CustomEvent('authChanged', { detail: { user } }));
                    resetTurnstile();
                    setPage('home');
                    return;
                }
            } catch (error) {
                setAuthMessage(error.message || 'Unable to login. Please check your credentials.');
                resetTurnstile();
                return;
            }
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setAuthMessage('Passwords do not match.');
            return;
        }

        try {
            const data = await api.auth.signup(formData.email, formData.password, formData.name, formData.joiningDate, formData.phone, cfToken);
            if (data?.user) {
                const loginData = await api.auth.login(formData.email, formData.password, cfToken);
                const user = loginData?.user || loginData?.session?.user;
                if (user && loginData?.session) {
                    await supabase.auth.setSession({
                        access_token: loginData.session.access_token,
                        refresh_token: loginData.session.refresh_token,
                    });
                    setAuthMessage('Account created and logged in successfully!');
                    setIsAdmin(user.email === 'rehanilyas20196@gmail.com');
                    setUserProfile({
                        id: user.id,
                        name: user.user_metadata?.full_name || formData.name || user.email.split('@')[0],
                        email: user.email,
                        phone: user.user_metadata?.phone || formData.phone || '',
                    });
                    window.dispatchEvent(new CustomEvent('authChanged', { detail: { user } }));
                    resetTurnstile();
                    setPage('home');
                    return;
                }
            }
            setAuthMessage('Signup successful! You can now log in.');
        } catch (error) {
            setAuthMessage(error.message || 'Unable to create account.');
            return;
        }
        resetTurnstile();
    };

    const resetTurnstile = () => {
        setCfToken('');
        if (turnstileWidgetId.current) {
            try { window.turnstile.reset(turnstileWidgetId.current); } catch {}
        }
    };

    const handleUpdateName = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');
            const { error } = await supabase.auth.updateUser({
                data: { full_name: accountName }
            });
            if (error) throw error;
            setUserProfile(prev => ({ ...prev, name: accountName }));
            setSettingsMsg('Account name updated successfully!');
            setTimeout(() => setSettingsMsg(''), 3000);
        } catch (err) {
            setSettingsMsg('Error updating name: ' + err.message);
        }
    };

    const handleUpdatePassword = async () => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (error) throw error;
            setNewPassword('');
            setCurrentPassword('');
            setSettingsMsg('Password updated successfully! Please sign in again with your new password.');
            setUserProfile(null);
            setIsAdmin(false);
            window.dispatchEvent(new CustomEvent('authExpired'));
        } catch (err) {
            setSettingsMsg('Error updating password: ' + err.message);
        }
    };

    const handleUpdatePhone = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');
            const { error } = await supabase.auth.updateUser({
                data: { phone: phoneNumber }
            });
            if (error) throw error;
            setSettingsMsg('Phone number updated successfully!');
            setTimeout(() => setSettingsMsg(''), 3000);
        } catch (err) {
            setSettingsMsg('Error updating phone: ' + err.message);
        }
    };

    if (userProfile) {
        const initials = (userProfile.name || 'U').charAt(0).toUpperCase();
        const memberSince = userProfile.created_at
            ? new Date(userProfile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
            : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

        const quickActions = [
            { icon: ShoppingBag, label: 'Orders', color: 'bg-blue-50 text-blue-600', onClick: () => setPage('orders') },
            { icon: Package, label: 'Cart', color: 'bg-green-50 text-green-600', onClick: () => setPage('cart') },
            { icon: Heart, label: 'Favorites', color: 'bg-red-50 text-red-600', onClick: () => setPage('favorites') },
            { icon: Bell, label: 'Notifications', color: 'bg-amber-50 text-amber-600', onClick: () => setPage('notifications') },
        ];

        const paymentMethods = [
            { name: 'JazzCash', number: '+92 345 5900229', owner: 'Core Collective' },
            { name: 'EasyPaisa', number: '+92 345 5900229', owner: 'Core Collective' },
            { name: 'Direct Bank Transfer', details: 'Faysal Bank Ltd - PK63FAYS0000123456789' },
        ];

        return (
            <div className="container py-6 sm:py-10">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-[#8B96A5] hover:text-primary transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Profile Header Card */}
                    <div className="bg-gradient-to-br from-primary via-primary/90 to-primary-dark rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-6 -mb-6"></div>
                        <div className="relative flex items-center gap-5">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-2 border-white/30 shadow-lg flex-shrink-0">
                                {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold truncate">{userProfile.name || 'User'}</h1>
                                <p className="text-white/80 text-sm mt-1 truncate">{userProfile.email}</p>
                                {userProfile.phone && <p className="text-white/70 text-xs mt-1 truncate flex items-center gap-1"><Phone className="w-3 h-3" />{userProfile.phone}</p>}
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/10">
                                        <Shield className="w-3 h-3" />
                                        Verified
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-sm font-medium backdrop-blur-sm transition-all border border-white/10"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {quickActions.map((action) => (
                            <button
                                key={action.label}
                                onClick={action.onClick}
                                className="bg-white border border-shade-border rounded-xl p-4 sm:p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-center"
                            >
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                                    <action.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <span className="text-sm font-medium text-dark">{action.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Membership Section */}
                    <div className="bg-white border border-shade-border rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 bg-gradient-to-r from-amber-50 to-transparent border-b border-shade-border">
                            <h2 className="font-bold text-dark text-sm uppercase tracking-wider flex items-center gap-2">
                                <Shield className="w-4 h-4 text-amber-600" />
                                Membership
                            </h2>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-dark">Core Collective Member</p>
                                    <p className="text-sm text-secondary">Joined {memberSince}</p>
                                </div>
                                <span className="ml-auto px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className="bg-white border border-shade-border rounded-2xl overflow-hidden divide-y divide-shade-border">
                        <div className="px-5 py-4 bg-gradient-to-r from-primary/5 to-transparent">
                            <h2 className="font-bold text-dark text-sm uppercase tracking-wider flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                Account Settings
                            </h2>
                        </div>

                        {/* Update Name */}
                        <div className="p-5">
                            <button
                                onClick={() => setActiveSettingsTab(activeSettingsTab === 'name' ? null : 'name')}
                                className="w-full flex items-center gap-4 text-left group"
                            >
                                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                    <User className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-dark">Account Name</p>
                                    <p className="text-xs text-secondary">{accountName || userProfile.name || 'Not set'}</p>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-secondary transition-transform ${activeSettingsTab === 'name' ? 'rotate-90' : ''}`} />
                            </button>
                            {activeSettingsTab === 'name' && (
                                <div className="mt-4 pt-4 border-t border-shade-border space-y-3">
                                    <input
                                        type="text"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-2.5 border border-shade-border rounded-xl bg-shade/30 focus:bg-white focus:border-primary outline-none text-sm"
                                    />
                                    <button
                                        onClick={handleUpdateName}
                                        className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                                    >
                                        Update Name
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Update Password */}
                        <div className="p-5">
                            <button
                                onClick={() => setActiveSettingsTab(activeSettingsTab === 'password' ? null : 'password')}
                                className="w-full flex items-center gap-4 text-left group"
                            >
                                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                    <Lock className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-dark">Password</p>
                                    <p className="text-xs text-secondary">Update your account password</p>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-secondary transition-transform ${activeSettingsTab === 'password' ? 'rotate-90' : ''}`} />
                            </button>
                            {activeSettingsTab === 'password' && (
                                <div className="mt-4 pt-4 border-t border-shade-border space-y-3">
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Current password"
                                        className="w-full px-4 py-2.5 border border-shade-border rounded-xl bg-shade/30 focus:bg-white focus:border-primary outline-none text-sm"
                                    />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="New password"
                                        className="w-full px-4 py-2.5 border border-shade-border rounded-xl bg-shade/30 focus:bg-white focus:border-primary outline-none text-sm"
                                    />
                                    <button
                                        onClick={handleUpdatePassword}
                                        disabled={!currentPassword || !newPassword}
                                        className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Add Phone Number */}
                        <div className="p-5">
                            <button
                                onClick={() => setActiveSettingsTab(activeSettingsTab === 'phone' ? null : 'phone')}
                                className="w-full flex items-center gap-4 text-left group"
                            >
                                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                    <Phone className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-dark">Phone Number</p>
                                    <p className="text-xs text-secondary">{phoneNumber || 'Add your phone number'}</p>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-secondary transition-transform ${activeSettingsTab === 'phone' ? 'rotate-90' : ''}`} />
                            </button>
                            {activeSettingsTab === 'phone' && (
                                <div className="mt-4 pt-4 border-t border-shade-border space-y-3">
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+92 XXX XXXXXXX"
                                        className="w-full px-4 py-2.5 border border-shade-border rounded-xl bg-shade/30 focus:bg-white focus:border-primary outline-none text-sm"
                                    />
                                    <button
                                        onClick={handleUpdatePhone}
                                        disabled={!phoneNumber}
                                        className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                                    >
                                        Save Phone Number
                                    </button>
                                </div>
                            )}
                        </div>

                        {settingsMsg && (
                            <div className="px-5 pb-4">
                                <div className="p-3 rounded-xl text-sm text-center font-medium bg-green-50 text-green-700 border border-green-200">
                                    {settingsMsg}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white border border-shade-border rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-shade-border">
                            <h2 className="font-bold text-dark text-sm uppercase tracking-wider flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Payment Methods
                            </h2>
                        </div>
                        <div className="divide-y divide-shade-border">
                            {paymentMethods.map((method, idx) => (
                                <div key={idx} className="p-5 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-shade flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                                        {method.name === 'JazzCash' ? 'JC' : method.name === 'EasyPaisa' ? 'EP' : 'Bank'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-dark">{method.name}</p>
                                        {method.number && <p className="text-xs text-secondary">{method.number} - {method.owner}</p>}
                                        {method.details && <p className="text-xs text-secondary">{method.details}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Sign Out */}
                    <button
                        onClick={handleSignOut}
                        className="sm:hidden w-full flex items-center justify-center gap-2 py-3.5 border border-shade-border rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-6 sm:py-10">
            <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[#8B96A5] hover:text-primary transition-colors mb-6"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
            </button>

            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-5 shadow-sm border border-primary/10">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-dark">
                        {isLogin ? 'Welcome Back' : 'Join Core Collective'}
                    </h1>
                    <p className="text-secondary mt-2 text-sm">
                        {isLogin
                            ? 'Sign in to access your account and orders'
                            : 'Create an account to start sourcing products'
                        }
                    </p>
                </div>

                <div className="bg-white border border-shade-border rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-4 text-sm font-semibold transition-all duration-300 relative ${isLogin
                                ? 'text-primary'
                                : 'text-secondary hover:text-dark'
                                }`}
                        >
                            Login
                            {isLogin && (
                                <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full"></span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-4 text-sm font-semibold transition-all duration-300 relative ${!isLogin
                                ? 'text-primary'
                                : 'text-secondary hover:text-dark'
                                }`}
                        >
                            Sign Up
                            {!isLogin && (
                                <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full"></span>
                            )}
                        </button>
                    </div>

                    <div className="h-px bg-shade-border"></div>

                    <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-5">
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-dark">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-secondary" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        className="w-full pl-10 pr-4 py-2.5 border border-shade-border rounded-xl bg-shade/30 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-dark">Joining Date</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-secondary pointer-events-none">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="date"
                                        name="joiningDate"
                                        value={formData.joiningDate}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-shade-border rounded-xl bg-shade/30 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-dark">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-secondary" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+92 XXX XXXXXXX"
                                        className="w-full pl-10 pr-4 py-2.5 border border-shade-border rounded-xl bg-shade/30 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-dark">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-secondary" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 border border-shade-border rounded-xl bg-shade/30 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-dark">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-secondary" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
                                    className="w-full pl-10 pr-10 py-2.5 border border-shade-border rounded-xl bg-shade/30 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary hover:text-dark transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                </button>
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-dark">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-secondary" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Repeat your password"
                                        className="w-full pl-10 pr-4 py-2.5 border border-shade-border rounded-xl bg-shade/30 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex justify-end">
                                <button type="button" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <div ref={turnstileRef} className="flex justify-center" />

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>

                        {authMessage && (
                            <div className={`p-3 rounded-xl text-sm text-center font-medium ${
                                authMessage.includes('successful') || authMessage.includes('successfully')
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                                {authMessage}
                            </div>
                        )}

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-shade-border"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-4 text-xs text-secondary">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={signInWithGoogle}
                            className="w-full flex items-center justify-center gap-3 py-2.5 border border-shade-border rounded-xl hover:bg-shade/50 hover:border-primary/30 transition-all text-sm font-medium text-dark"
                        >
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;