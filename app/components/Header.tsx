"use client"

import { useState } from "react";
import { FaLeaf, FaFlask } from "react-icons/fa";
import Link from "next/link";
import CartIcon from "./CartIcon";

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-2xl font-bold text-slate-800 tracking-tight">Kerelys</span>
              <div className="hidden sm:flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium flex items-center gap-1 border border-emerald-200">
                  <FaLeaf className="text-emerald-600" /> Authentic
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium flex items-center gap-1 border border-blue-200">
                  <FaFlask className="text-blue-600" /> FDA Approved
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/products" className="text-slate-600 hover:text-blue-800 transition-colors font-medium">Products</Link>
            <a href="/#products" className="text-slate-600 hover:text-blue-800 transition-colors font-medium">Shop</a>
            <a href="/#why" className="text-slate-600 hover:text-blue-800 transition-colors font-medium">Why Kerelys?</a>
            <a href="/#testimonials" className="text-slate-600 hover:text-blue-800 transition-colors font-medium">Reviews</a>
            <a href="/#faq" className="text-slate-600 hover:text-blue-800 transition-colors font-medium">FAQ</a>
            <a href="/#contact" className="text-slate-600 hover:text-blue-800 transition-colors font-medium">Contact</a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <CartIcon />
            <button 
              className="lg:hidden p-2 text-slate-600 hover:text-blue-800 hover:bg-slate-50 rounded-lg transition-colors" 
              aria-label="Open navigation" 
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setMobileNavOpen(false)}>
          <nav className="absolute top-0 right-0 w-80 h-full bg-white shadow-elegant flex flex-col p-8">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-slate-800">Menu</span>
              <button 
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" 
                onClick={() => setMobileNavOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col space-y-4">
              <Link href="/products" className="text-slate-700 hover:text-blue-800 transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Products</Link>
              <a href="#products" className="text-slate-700 hover:text-blue-800 transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Shop</a>
              <a href="#why" className="text-slate-700 hover:text-blue-800 transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Why Kerelys?</a>
              <a href="#testimonials" className="text-slate-700 hover:text-blue-800 transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Reviews</a>
              <a href="#faq" className="text-slate-700 hover:text-blue-800 transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>FAQ</a>
              <a href="#contact" className="text-slate-700 hover:text-blue-800 transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Contact</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
} 