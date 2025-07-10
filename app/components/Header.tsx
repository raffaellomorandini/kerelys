"use client"

import { useState } from "react";
import Link from "next/link";
import CartIcon from "./CartIcon";
import Logo from "./Logo";

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo left */}
        <div className="flex items-center gap-6 min-w-[120px]">
          <Logo variant="header" showBadges={false} />
        </div>
        {/* Nav center */}
        <nav className="hidden lg:flex items-center gap-8 mx-auto">
          <a href="/#products" className="text-base font-medium text-slate-700 hover:text-[#FFD700] transition-colors">Products</a>
          <a href="/#tutorial" className="text-base font-medium text-slate-700 hover:text-[#FFD700] transition-colors">How to Use</a>
          <a href="/#why" className="text-base font-medium text-slate-700 hover:text-[#FFD700] transition-colors">Why Us</a>
          <a href="/#testimonials" className="text-base font-medium text-slate-700 hover:text-[#FFD700] transition-colors">Reviews</a>
          <a href="/#newsletter" className="text-base font-medium text-slate-700 hover:text-[#FFD700] transition-colors">Newsletter</a>
        </nav>
        {/* Cart right */}
        <div className="flex items-center gap-4 min-w-[48px] justify-end">
          <CartIcon />
          <button 
            className="lg:hidden p-2 text-slate-600 hover:text-[#FFD700] hover:bg-slate-50 rounded-md transition-colors" 
            aria-label="Open navigation" 
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 h-screen" onClick={() => setMobileNavOpen(false)}>
          <nav className="absolute top-0 right-0 w-80 h-full bg-white shadow-md flex flex-col p-8 border-l border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-slate-800">Menu</span>
              <button 
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors" 
                onClick={() => setMobileNavOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col space-y-4">
              <a href="#products" className="text-slate-700 hover:text-[#FFD700] transition-colors font-medium py-2 border-b border-slate-100" onClick={() => setMobileNavOpen(false)}>Products</a>
              <a href="#tutorial" className="text-slate-700 hover:text-[#FFD700] transition-colors font-medium py-2 border-b border-slate-100" onClick={() => setMobileNavOpen(false)}>How to Use</a>
              <a href="#why" className="text-slate-700 hover:text-[#FFD700] transition-colors font-medium py-2 border-b border-slate-100" onClick={() => setMobileNavOpen(false)}>Why Us</a>
              <a href="#testimonials" className="text-slate-700 hover:text-[#FFD700] transition-colors font-medium py-2 border-b border-slate-100" onClick={() => setMobileNavOpen(false)}>Reviews</a>
              <a href="#newsletter" className="text-slate-700 hover:text-[#FFD700] transition-colors font-medium py-2 border-b border-slate-100" onClick={() => setMobileNavOpen(false)}>Newsletter</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
} 