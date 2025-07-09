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
  const { state, getTotalPrice, getDiscountedTotal, getDiscountAmount, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const subtotal = getTotalPrice();
  const discountAmount = getDiscountAmount();
  const discountedSubtotal = getDiscountedTotal();
  const taxAmount = discountedSubtotal * 0.08;
  const totalAmount = discountedSubtotal + taxAmount;

  useEffect(() => {
    if (state.items.length === 0) {
      router.push('/');
      return;
    }

    const createPaymentIntent = async () => {
      try {
        // Prepare order data to be stored in payment intent metadata
        const orderData = {
          email: '', // Will be filled from billing address
          totalAmount: totalAmount,
          currency: 'USD',
          items: state.items.map(item => ({
            productName: item.name,
            productId: item.id.toString(),
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
            stripeProductId: item.stripeProductId,
          })),
          shipping: {
            name: '', // Will be filled from billing address
            street: '', // Will be filled from billing address
            city: '', // Will be filled from billing address
            zip: '', // Will be filled from billing address
            province: '', // Will be filled from billing address
            country: 'US', // Default
            phone: '', // Will be filled from billing address
          },
          metadata: {
            cartItems: state.items,
            appliedDiscount: state.appliedDiscount,
            subtotal: subtotal,
            discountAmount: discountAmount,
            taxAmount: taxAmount,
          },
        };

        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: totalAmount,
            currency: 'usd',
            promotionCode: state.appliedDiscount?.promotionCodeId,
            orderData: orderData,
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
  }, [totalAmount, state.items.length, router, state.appliedDiscount]);

  const handlePaymentSuccess = (paymentIntentId: string) => {
    toast.success('Payment successful! Your order has been placed.');
    clearCart();
    router.push('/payment-success');
  };

  const handlePaymentCancel = () => {
    router.push('/');
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Preparing your checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <FaArrowLeft className="text-sm" />
                <span className="text-sm font-medium">Continue Shopping</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <FaShoppingBag className="text-blue-800 text-xl" />
              <span className="text-xl font-bold text-slate-900">Checkout</span>
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
                      colorPrimary: '#1e3a8a',
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
            <div className="bg-white rounded-xl shadow-elegant p-6 sticky top-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="mb-6">
                <DiscountCode />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
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
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax</span>
                  <span className="text-slate-900">{formatPrice(taxAmount)}</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2">
                  <span className="text-slate-900">Total</span>
                  <span className="text-blue-800">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Applied Promotion */}
              {state.appliedDiscount && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-800">Applied Promotion:</span>
                    <span className="text-lg font-bold text-emerald-800">
                      {state.appliedDiscount.code}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-600 mt-1">
                    {state.appliedDiscount.name} - You saved {formatPrice(discountAmount)}
                  </p>
                </div>
              )}

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>SSL Encrypted</span>
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