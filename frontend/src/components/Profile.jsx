import React, { useEffect, useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/api';

const Profile = ({ setPage, handleBack, setIsAdmin, userProfile, setUserProfile }) => {
    const [isLogin, setIsLogin] = useState(true);

    const [showPassword, setShowPassword] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        joiningDate: new Date().toISOString().split('T')[0]
    });

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
        } catch (e) {
            console.error(e);
        }
        setPage('home');
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthMessage('');

        if (!formData.email || !formData.password) {
            setAuthMessage('Please enter both email and password.');
            return;
        }

        if (isLogin) {
            try {
                const data = await api.auth.login(formData.email, formData.password);
                const user = data?.user;
                if (user) {
                    setAuthMessage('Login successful ✅');
                    setIsAdmin(user.email === 'rehanilyas20196@gmail.com');
                    setUserProfile({
                        name: user.user_metadata?.full_name || user.email.split('@')[0],
                        email: user.email,
                    });
                    setPage('home');
                    return;
                }
            } catch (error) {
                setAuthMessage(error.message || 'Unable to login. Please check your credentials.');
                return;
            }
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setAuthMessage('Passwords do not match.');
            return;
        }

        try {
            const data = await api.auth.signup(formData.email, formData.password, formData.name, formData.joiningDate);
            setAuthMessage('Signup successful ✔ Check your email to confirm your account.');
            if (data?.user) {
                setUserProfile({
                    name: data.user.user_metadata?.full_name || formData.name || data.user.email.split('@')[0],
                    email: data.user.email,
                });
            }
        } catch (error) {
            setAuthMessage(error.message || 'Unable to create account.');
            return;
        }
    };

    if (userProfile) {
        return (
            <div className="container py-8 sm:py-12">
                <div className="max-w-md mx-auto bg-white border border-shade-border rounded-2xl shadow-lg p-6 sm:p-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                            <User className="w-10 h-10" />
                        </div>
                        <h1 className="text-2xl font-bold text-dark">{userProfile.name || 'Profile'}</h1>
                        <p className="text-[#8B96A5] mt-2">{userProfile.email}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-lg bg-[#F7F9FC] px-4 py-3">
                            <p className="text-sm text-[#8B96A5]">Account Status</p>
                            <p className="font-medium text-dark">{userProfile.name === 'Admin' ? 'Administrator' : 'Logged in'}</p>
                        </div>

                        <button
                            onClick={handleBack}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-all"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="w-full border border-shade-border hover:bg-shade py-3 rounded-lg font-medium transition-all"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8 sm:py-12">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <img
                        src="https://izqxsfuyibbzwdxdcmev.supabase.co/storage/v1/object/public/Background/Logo/Core%20Collective%20(1).png"
                        alt="Core Collective"
                        className="h-20 w-auto mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-dark">Welcome to Core Collective</h1>
                    <p className="text-[#8B96A5] mt-2">
                        {isLogin ? 'Sign in to your account' : 'Create your new account'}
                    </p>
                </div>

                <div className="bg-white border border-shade-border rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex border-b border-shade-border">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-4 font-medium transition-all duration-300 ${isLogin
                                ? 'text-primary border-b-2 border-primary bg-primary/5'
                                : 'text-[#8B96A5] hover:text-dark'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-4 font-medium transition-all duration-300 ${!isLogin
                                ? 'text-primary border-b-2 border-primary bg-primary/5'
                                : 'text-[#8B96A5] hover:text-dark'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-dark">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className="w-full pl-12 pr-4 py-3 border border-shade-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-dark">Joining Date</label>
                                <div className="relative">
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <input
                                        type="date"
                                        name="joiningDate"
                                        value={formData.joiningDate}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border border-shade-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-dark">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3 border border-shade-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-dark">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="w-full pl-12 pr-12 py-3 border border-shade-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B96A5] hover:text-dark transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-dark">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm your password"
                                        className="w-full pl-12 pr-4 py-3 border border-shade-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex justify-end">
                                <button type="button" className="text-sm text-primary hover:text-primary/80 transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>

                        {authMessage && (
                            <p className="text-sm text-center text-[#1F2937] mt-3">{authMessage}</p>
                        )}

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-shade-border"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-4 text-sm text-[#8B96A5]">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                type="button"
                                onClick={signInWithGoogle}
                                className="flex items-center justify-center gap-2 py-3 border border-shade-border rounded-lg hover:bg-shade transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="font-medium">Google</span>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="text-center mt-6">
                    <button
                        onClick={handleBack}
                        className="text-[#8B96A5] hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
