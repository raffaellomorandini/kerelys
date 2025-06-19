"use client"

import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement, AddressElement } from '@stripe/react-stripe-js';
import { FaApple, FaPaypal, FaGoogle, FaCreditCard, FaLock, FaSpinner } from 'react-icons/fa';
import { SiVisa, SiMastercard, SiAmericanexpress } from 'react-icons/si';
import { toast } from 'sonner';

interface CheckoutFormProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'paypal';

export default function CheckoutForm({ amount, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [message, setMessage] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message || 'An error occurred during payment.');
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Payment successful!');
        toast.success('Payment successful!');
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setMessage('An unexpected error occurred.');
      toast.error('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const renderPaymentMethodButton = (method: PaymentMethod, icon: React.ReactNode, label: string, color: string) => (
    <button
      type="button"
      onClick={() => handlePaymentMethodSelect(method)}
      className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
        selectedPaymentMethod === method
          ? `${color} border-current text-white`
          : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Secure Checkout</h2>
            <p className="text-[#F5DEB3] mt-1">Complete your purchase</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#F5DEB3]">Total Amount</p>
            <p className="text-3xl font-bold">{formatPrice(amount)}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {renderPaymentMethodButton(
              'card',
              <FaCreditCard className="text-xl" />,
              'Credit Card',
              'bg-blue-600'
            )}
            {renderPaymentMethodButton(
              'apple_pay',
              <FaApple className="text-xl" />,
              'Apple Pay',
              'bg-black'
            )}
            {renderPaymentMethodButton(
              'google_pay',
              <FaGoogle className="text-xl" />,
              'Google Pay',
              'bg-green-600'
            )}
            {renderPaymentMethodButton(
              'paypal',
              <FaPaypal className="text-xl" />,
              'PayPal',
              'bg-blue-500'
            )}
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Billing Address */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Billing Address</h4>
            <AddressElement
              options={{
                mode: 'billing',
                allowedCountries: ['US', 'CA', 'GB'],
              }}
            />
          </div>

          {/* Payment Element */}
          {selectedPaymentMethod === 'card' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
              <PaymentElement
                options={{
                  layout: 'tabs',
                  paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
                }}
              />
            </div>
          )}

          {/* Alternative Payment Methods */}
          {selectedPaymentMethod !== 'card' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">
                {selectedPaymentMethod === 'apple_pay' && 'Apple Pay'}
                {selectedPaymentMethod === 'google_pay' && 'Google Pay'}
                {selectedPaymentMethod === 'paypal' && 'PayPal'}
              </h4>
              <p className="text-gray-600 text-sm">
                You'll be redirected to complete your payment securely.
              </p>
            </div>
          )}

          {/* Accepted Cards */}
          <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">We accept:</span>
            <div className="flex gap-2">
              <SiVisa className="text-2xl text-blue-600" />
              <SiMastercard className="text-2xl text-red-600" />
              <SiAmericanexpress className="text-2xl text-blue-800" />
            </div>
          </div>

          {/* Error Message */}
          {message && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1 bg-[#8B4513] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A0522D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FaLock />
                  Pay {formatPrice(amount)}
                </>
              )}
            </button>
          </div>
        </form>

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
  );
} 