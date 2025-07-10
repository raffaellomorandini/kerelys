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
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-2xl w-full relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center mb-8 shadow-lg">
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
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-[#FFD700] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Order Confirmation</p>
                  <p className="text-sm text-slate-600">You'll receive an order confirmation email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaClock className="text-[#FFD700] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Processing Time</p>
                  <p className="text-sm text-slate-600">Your order will be processed within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaTruck className="text-[#FFD700] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Shipping Updates</p>
                  <p className="text-sm text-slate-600">Shipping updates will be sent to your email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-[#FFD700] mt-1 flex-shrink-0" />
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
              className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-slate-800 py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
            >
              <FaHome className="text-lg" />
              Continue Shopping
            </Link>
            
            <Link
              href="/orders"
              className="w-full border-2 border-[#FFD700] text-[#FFD700] py-4 px-6 rounded-xl font-bold text-lg hover:bg-[#FFD700] hover:text-slate-800 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <FaShoppingBag className="text-lg" />
              View Orders
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Need help? Contact us at{' '}
              <a href="mailto:support@klys.store" className="text-[#FFD700] hover:text-[#FFA500] font-semibold transition-colors">
                support@klys.store
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 