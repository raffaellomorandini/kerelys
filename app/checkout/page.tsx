"use client"

import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import CheckoutForm from '../components/CheckoutForm';
import DiscountCode from '../components/DiscountCode';
import { toast } from 'sonner';
import { FaArrowLeft, FaShoppingBag } from 'react-icons/fa';

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { state, getTotalPrice, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const router = useRouter();

  const subtotal = getTotalPrice();
  const discountAmount = appliedDiscount ? appliedDiscount.savings : 0;
  const finalSubtotal = subtotal - discountAmount;
  const taxAmount = finalSubtotal * 0.08;
  const totalAmount = finalSubtotal + taxAmount;

  useEffect(() => {
    if (state.items.length === 0) {
      router.push('/');
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: totalAmount,
            currency: 'usd',
            discount: appliedDiscount,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        toast.error('Failed to initialize checkout');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [totalAmount, state.items.length, router, appliedDiscount]);

  const handlePaymentSuccess = (paymentIntentId: string) => {
    toast.success('Payment successful! Your order has been placed.');
    clearCart();
    router.push('/payment-success');
  };

  const handlePaymentCancel = () => {
    router.push('/');
  };

  const handleDiscountApplied = (discount: any) => {
    setAppliedDiscount(discount);
  };

  const handleDiscountRemoved = () => {
    setAppliedDiscount(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (state.items.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <FaShoppingBag className="text-[#8B4513] text-xl" />
              <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Order Total</p>
              <p className="text-lg font-bold text-[#8B4513]">
                {formatPrice(totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#8B4513',
                      colorBackground: '#ffffff',
                      colorText: '#1f2937',
                      colorDanger: '#ef4444',
                      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                      spacingUnit: '4px',
                      borderRadius: '8px',
                    },
                  },
                }}
              >
                <CheckoutForm
                  amount={totalAmount}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handlePaymentCancel}
                />
              </Elements>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
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
              <div className="mb-6">
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
                  <span className="text-[#8B4513]">
                    {formatPrice(totalAmount)}
                  </span>
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

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>PCI Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 