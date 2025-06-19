"use client"

import { useState, useEffect } from "react";
import { FaTimes, FaGift, FaCheckCircle, FaEnvelope } from "react-icons/fa";
import { addEmail } from "../actions";
import { toast } from "sonner";

interface NewsletterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterDialog({ isOpen, onClose }: NewsletterDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  // Generate a random discount code
  useEffect(() => {
    if (showSuccess) {
      const codes = ["WELCOME10", "NEWSLETTER15", "FIRST20", "SAVE25"];
      const randomCode = codes[Math.floor(Math.random() * codes.length)];
      setDiscountCode(randomCode);
    }
  }, [showSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await addEmail(email, "", "popup");
      if (res.success) {
        setShowSuccess(true);
        toast.success("Successfully subscribed!");
      } else {
        toast.error(res.error || "Error subscribing to newsletter");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setEmail("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors z-10"
          aria-label="Close dialog"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {!showSuccess ? (
          /* Newsletter Signup Form */
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8B4513] to-[#A0522D] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGift className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Get Your Exclusive Discount!
              </h2>
              <p className="text-gray-600">
                Subscribe to our newsletter and receive a special discount code for your first purchase.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <FaCheckCircle className="text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900">Exclusive hair care tips</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <FaCheckCircle className="text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900">Early access to new products</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900">Special offers and discounts</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Hidden honeypot field */}
              <input
                type="text"
                name="website"
                className="absolute left-[-9999px] opacity-0 pointer-events-none"
                tabIndex={-1}
                autoComplete="off"
              />
              <input
                type="hidden"
                name="source"
                value="popup"
              />

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-[#8B4513] disabled:opacity-50"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#A0522D] hover:to-[#8B4513] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    <FaGift className="w-4 h-4" />
                    Get My Discount Code
                  </>
                )}
              </button>
            </form>

            {/* Privacy notice */}
            <p className="text-xs text-gray-500 text-center mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        ) : (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Kerelys!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Thank you for subscribing! Here's your exclusive discount code:
            </p>

            {/* Discount Code */}
            <div className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] rounded-lg p-4 mb-6">
              <p className="text-white text-sm font-medium mb-2">Your Discount Code:</p>
              <div className="bg-white rounded-lg p-3">
                <code className="text-2xl font-bold text-[#8B4513] tracking-wider">
                  {discountCode}
                </code>
              </div>
              <p className="text-white text-xs mt-2">
                Save up to 25% on your first order
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheckCircle className="text-green-600 w-4 h-4" />
                <span>Code sent to your email</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheckCircle className="text-green-600 w-4 h-4" />
                <span>Valid for 30 days</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheckCircle className="text-green-600 w-4 h-4" />
                <span>One-time use per customer</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 