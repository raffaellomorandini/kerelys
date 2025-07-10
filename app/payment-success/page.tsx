"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaHome, FaShoppingBag, FaEnvelope, FaTruck, FaClock } from 'react-icons/fa';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-transparent to-emerald-600/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mb-8">
            <FaCheckCircle className="text-slate-800 text-4xl" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>

          {/* Order Details */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
            <h3 className="text-xl font-bold text-slate-800 mb-6">What's Next?</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-center gap-3 text-slate-600">
                <FaEnvelope className="text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Order Confirmation</p>
                  <p className="text-sm text-slate-600">You'll receive an order confirmation email</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <FaClock className="text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Processing Time</p>
                  <p className="text-sm text-slate-600">Your order will be processed within 24 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <FaTruck className="text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Shipping Updates</p>
                  <p className="text-sm text-slate-600">Shipping updates will be sent to your email</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <FaCheckCircle className="text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Delivery</p>
                  <p className="text-sm text-slate-600">Estimated delivery: 3-5 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/"
              className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <FaHome className="text-lg" />
              Continue Shopping
            </Link>
            
            <Link
              href="/orders"
              className="w-full border-2 border-emerald-600 text-emerald-600 py-4 px-6 rounded-xl font-bold text-lg hover:bg-emerald-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
            >
              <FaShoppingBag className="text-lg" />
              View Orders
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Need help? Contact us at{' '}
              <a href="mailto:support@klys.store" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                support@klys.store
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
