"use client"

import { useState } from 'react';
import { FaTimes, FaShoppingCart, FaTrash, FaMinus, FaPlus, FaLock } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { calculateTotalPrice } from '../lib/products';

export default function Cart() {
  const { 
    state, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    closeCart, 
    getTotalItems, 
    getTotalPrice
  } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    closeCart();
    router.push('/checkout');
  };

  const handleApplePay = () => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    closeCart();
    router.push('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const total = getTotalPrice();

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={closeCart}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white  z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <FaShoppingCart className="text-emerald-600 text-xl" />
              <h2 className="text-xl font-bold text-slate-900">Shopping Cart</h2>
              <span className="bg-emerald-600 text-white text-xs rounded-full px-2 py-1 font-semibold">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <FaShoppingCart className="text-slate-300 text-4xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Your cart is empty</h3>
                <p className="text-slate-600">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                        <Image
                          src="/product.png"
                          alt={item.name}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{item.name}</h3>
                      <p className="text-emerald-600 font-semibold">{formatPrice(calculateTotalPrice(item.id))}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-white border border-slate-300 rounded flex items-center justify-center hover:bg-slate-50 transition-colors"
                        >
                          <FaMinus className="text-xs text-slate-600" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-white border border-slate-300 rounded flex items-center justify-center hover:bg-slate-50 transition-colors"
                        >
                          <FaPlus className="text-xs text-slate-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-semibold text-slate-900">
                        {formatPrice(calculateTotalPrice(item.id) * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-slate-200 p-6 bg-white">
              {/* Price Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-lg font-semibold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-slate-900 text-white py-3 px-4 rounded-2xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <FaLock className="text-sm" />
                  Checkout
                </button>
                
                <button
                  onClick={handleApplePay}
                  className="w-full bg-black text-white py-3 px-4 rounded-2xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Pay with Apple Pay
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full border border-slate-300 text-slate-700 py-2 px-4 rounded-2xl font-medium hover:bg-slate-50 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
              
              <div className="mt-4 text-xs text-slate-500 text-center">
                <p>Free shipping on all orders</p>
                <p>30-day money-back guarantee</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 
