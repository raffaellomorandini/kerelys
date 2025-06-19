"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if accessed directly without payment
    const hasPaymentIntent = new URLSearchParams(window.location.search).get('payment_intent');
    if (!hasPaymentIntent) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <FaCheckCircle className="text-green-600 text-3xl" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• You'll receive an order confirmation email</li>
            <li>• Your order will be processed within 24 hours</li>
            <li>• Shipping updates will be sent to your email</li>
            <li>• Estimated delivery: 3-5 business days</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-[#8B4513] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#A0522D] transition-colors flex items-center justify-center gap-2"
          >
            <FaHome />
            Continue Shopping
          </Link>
          
          <Link
            href="/orders"
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <FaShoppingBag />
            View Orders
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@kerelys.com" className="text-[#8B4513] hover:underline">
              support@kerelys.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 