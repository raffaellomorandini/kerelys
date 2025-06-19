"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import PaymentMethods from './PaymentMethods';
import DiscountCode from './DiscountCode';
import { FaArrowRight, FaShoppingBag, FaLock } from 'react-icons/fa';

interface PreCheckoutProps {
  onClose: () => void;
}

export default function PreCheckout({ onClose }: PreCheckoutProps) {
  const { state, getTotalPrice } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const router = useRouter();

  const subtotal = getTotalPrice();
  const discountAmount = appliedDiscount ? appliedDiscount.savings : 0;
  const finalSubtotal = subtotal - discountAmount;
  const taxAmount = finalSubtotal * 0.08;
  const finalTotal = finalSubtotal + taxAmount;

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

  const handleDiscountApplied = (discount: any) => {
    setAppliedDiscount(discount);
  };

  const handleDiscountRemoved = () => {
    setAppliedDiscount(null);
  };

  if (state.items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaShoppingBag className="text-2xl" />
                <div>
                  <h2 className="text-2xl font-bold">Ready to Checkout</h2>
                  <p className="text-[#F5DEB3]">Choose your payment method</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#F5DEB3] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

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
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Discount Code */}
                <div className="mb-4">
                  <DiscountCode
                    subtotal={subtotal}
                    onDiscountApplied={handleDiscountApplied}
                    onDiscountRemoved={handleDiscountRemoved}
                    appliedDiscount={appliedDiscount}
                  />
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {appliedDiscount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount ({appliedDiscount.code})</span>
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

                {/* Savings Summary */}
                {appliedDiscount && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">You saved:</span>
                      <span className="text-lg font-bold text-green-800">
                        {formatPrice(discountAmount)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Benefits */}
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">What's Included</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Free shipping on all orders</li>
                    <li>• 30-day money-back guarantee</li>
                    <li>• Secure payment processing</li>
                    <li>• Order tracking and updates</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleProceedToCheckout}
                className="flex-1 bg-[#8B4513] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A0522D] transition-colors flex items-center justify-center gap-2"
              >
                <FaLock />
                Proceed to Checkout
                <FaArrowRight />
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <FaLock className="text-xs" />
                <span>Your payment is secured by Stripe</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                256-bit SSL encryption • PCI DSS compliant
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 