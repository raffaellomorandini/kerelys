"use client"

import { useState } from 'react';
import { FaTimes, FaShoppingCart, FaTrash, FaMinus, FaPlus, FaLock, FaCreditCard } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PreCheckout from './PreCheckout';
import FastPaymentButtons from './FastPaymentButtons';
import DiscountCode from './DiscountCode';
import { calculateTotalPrice } from '../lib/products';

export default function Cart() {
  const { 
    state, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    closeCart, 
    getTotalItems, 
    getTotalPrice, 
    getDiscountedTotal, 
    getDiscountAmount 
  } = useCart();
  const router = useRouter();
  const [showPreCheckout, setShowPreCheckout] = useState(false);

  const handleCheckout = () => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    closeCart();
    router.push('/checkout');
  };

  const handleViewPaymentOptions = () => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setShowPreCheckout(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const discountAmount = getDiscountAmount();
  const discountedTotal = getDiscountedTotal();

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={closeCart}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-3">
              <FaShoppingCart className="text-blue-800 text-xl" />
              <h2 className="text-xl font-bold text-slate-900">Shopping Cart</h2>
              {getTotalItems() > 0 && (
                <span className="bg-gradient-to-r from-blue-800 to-blue-600 text-white text-xs rounded-full px-2 py-1">
                  {getTotalItems()}
                </span>
              )}
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
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
                      <p className="text-blue-800 font-semibold">{formatPrice(calculateTotalPrice(item.id))}</p>
                      
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
              {/* Discount Code */}
              <div className="mb-4">
                <DiscountCode />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                
                {/* Discount */}
                {state.appliedDiscount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Discount ({state.appliedDiscount.code})</span>
                    <span className="text-emerald-600 font-medium">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-lg font-semibold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600">
                    {formatPrice(discountedTotal)}
                  </span>
                </div>
              </div>
              
              {/* Fast Payment Buttons */}
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-3 text-center font-medium">Pay instantly with:</p>
                <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl p-3 border border-slate-200 shadow-soft">
                  <FastPaymentButtons variant="primary" size="sm" />
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-elegant transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FaLock className="text-sm" />
                  View All Payment Options
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>Free shipping on all orders</p>
                <p>30-day money-back guarantee</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PreCheckout Modal */}
      {showPreCheckout && (
        <PreCheckout onClose={() => setShowPreCheckout(false)} />
      )}
    </>
  );
} 