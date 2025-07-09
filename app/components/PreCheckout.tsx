"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import PaymentMethods from './PaymentMethods';
import DiscountCode from './DiscountCode';
import { FaTimes, FaShieldAlt, FaTruck, FaUndo, FaCreditCard } from 'react-icons/fa';
import { calculateTotalPrice } from '../lib/products';

interface PreCheckoutProps {
  onClose: () => void;
}

export default function PreCheckout({ onClose }: PreCheckoutProps) {
  const { state, getTotalPrice, getDiscountedTotal, getDiscountAmount } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const router = useRouter();

  const subtotal = getTotalPrice();
  const discountAmount = getDiscountAmount();
  const discountedSubtotal = getDiscountedTotal();
  const taxAmount = discountedSubtotal * 0.08;
  const finalTotal = discountedSubtotal + taxAmount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleProceedToCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  if (state.items.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Review Your Order</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Methods */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Options</h3>
              <PaymentMethods
                onSelect={setSelectedPaymentMethod}
                selectedMethod={selectedPaymentMethod}
                showDescription={true}
              />
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(calculateTotalPrice(item.id) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="mb-4">
                <DiscountCode />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                
                {/* Discount */}
                {state.appliedDiscount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount ({state.appliedDiscount.code})</span>
                    <span className="text-green-600 font-medium">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#8B4513]">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Applied Promotion */}
              {state.appliedDiscount && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Applied Promotion:</span>
                    <span className="text-lg font-bold text-green-800">
                      {state.appliedDiscount.code}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {state.appliedDiscount.name} - You saved {formatPrice(discountAmount)}
                  </p>
                </div>
              )}

              {/* Benefits */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FaShieldAlt className="text-green-500" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FaTruck className="text-blue-500" />
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FaUndo className="text-orange-500" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FaCreditCard className="text-purple-500" />
                  <span>Multiple payment options</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleProceedToCheckout}
            className="px-8 py-3 bg-[#8B4513] text-white rounded-lg font-semibold hover:bg-[#A0522D] transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
} 