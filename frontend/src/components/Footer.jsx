import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Apple, Play, ChevronUp } from 'lucide-react';
import flagUS from '../assets/Layout1/Image/flags/US@2x.png';

const Footer = ({ setPage }) => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 sm:pt-16">
      <div className="container pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-3">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary to-primary-500 bg-clip-text text-transparent">Core Collective</h3>
            </div>
            <p className="text-gray-500 max-w-xs mb-6 text-sm leading-relaxed">
              Best information about the company gies here but now lorem ipsum is simply dummy text of the printing and typesetting industry.
            </p>
            <div className="flex gap-3">
              {[{ Icon: Facebook, name: 'Facebook' }, { Icon: Twitter, name: 'Twitter' }, { Icon: Linkedin, name: 'LinkedIn' }, { Icon: Instagram, name: 'Instagram' }, { Icon: Youtube, name: 'YouTube' }].map(({ Icon, name }, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5" aria-label={`Follow us on ${name}`}>
                  <Icon className="w-4 h-4 fill-current" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <h4 className="font-bold text-gray-900 mb-4 text-sm tracking-wide uppercase">About</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }} className="hover:text-primary transition-colors duration-200">About Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }} className="hover:text-primary transition-colors duration-200">Find store</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }} className="hover:text-primary transition-colors duration-200">Categories</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }} className="hover:text-primary transition-colors duration-200">Blogs</a></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h4 className="font-bold text-gray-900 mb-4 text-sm tracking-wide uppercase">Partnership</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }} className="hover:text-primary transition-colors duration-200">About Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }} className="hover:text-primary transition-colors duration-200">Find store</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }} className="hover:text-primary transition-colors duration-200">Categories</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }} className="hover:text-primary transition-colors duration-200">Blogs</a></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h4 className="font-bold text-gray-900 mb-4 text-sm tracking-wide uppercase">Information</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('help-center'); }} className="hover:text-primary transition-colors duration-200">Help Center</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('returns-info'); }} className="hover:text-primary transition-colors duration-200">Money Refund</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('shipping-info'); }} className="hover:text-primary transition-colors duration-200">Shipping</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('contact-us'); }} className="hover:text-primary transition-colors duration-200">Contact us</a></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h4 className="font-bold text-gray-900 mb-4 text-sm tracking-wide uppercase">For users</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('profile'); }} className="hover:text-primary transition-colors duration-200">Login</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('profile'); }} className="hover:text-primary transition-colors duration-200">Register</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('profile'); }} className="hover:text-primary transition-colors duration-200">Settings</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('orders'); }} className="hover:text-primary transition-colors duration-200">My Orders</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-gray-900 mb-4 text-sm tracking-wide uppercase">Get app</h4>
            <div className="flex flex-col gap-2 max-w-[160px]">
              <a href="#" className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 w-full hover:-translate-y-0.5 hover:shadow-lg" aria-label="Download our app from the App Store">
                <Apple size={20} fill="white" />
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase leading-none opacity-70">Download on the</span>
                  <span className="text-[12px] font-bold leading-none">App Store</span>
                </div>
              </a>
              <a href="#" className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 w-full hover:-translate-y-0.5 hover:shadow-lg" aria-label="Get our app on Google Play">
                <Play size={20} fill="white" />
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase leading-none opacity-70">GET IT ON</span>
                  <span className="text-[12px] font-bold leading-none">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 border-t border-gray-200 py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">&copy; 2023 Core Collective. All rights reserved.</p>
          <div className="flex items-center gap-4 text-gray-700 text-sm">
            <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors duration-200">
              <img src={flagUS} alt="US" className="w-[20px] h-[14px] rounded-sm shadow-sm" />
              <span>English</span>
              <ChevronUp className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
