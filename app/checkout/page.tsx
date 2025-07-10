"use client"

import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import CheckoutForm from '../components/CheckoutForm';
import DiscountCode from '../components/DiscountCode';
import { toast } from 'sonner';
import { FaArrowLeft, FaShoppingBag, FaShieldAlt, FaLock } from 'react-icons/fa';
import { calculateTotalPrice } from '../lib/products';

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { state, getTotalPrice, getDiscountedTotal, getDiscountAmount, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
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
            name: item.name,
            id: item.id.toString(),
            qty: item.quantity,
            price: calculateTotalPrice(item.id),
            total: calculateTotalPrice(item.id) * item.quantity,
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
          // Simplified metadata to stay under 500 characters
          meta: {
            subtotal: subtotal,
            discount: discountAmount,
            tax: taxAmount,
            hasDiscount: !!state.appliedDiscount,
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
        setPaymentIntentId(data.paymentIntentId);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Preparing your checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-3 text-slate-600 hover:text-[#FFD700] transition-colors font-medium"
              >
                <FaArrowLeft className="text-sm" />
                <span className="text-sm font-medium">Continue Shopping</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <FaShoppingBag className="text-[#FFD700] text-2xl" />
              <span className="text-2xl font-bold text-slate-800">Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Payment Information</h2>
              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#FFD700',
                        colorBackground: '#ffffff',
                        colorText: '#1f2937',
                        colorDanger: '#ef4444',
                        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                        spacingUnit: '4px',
                        borderRadius: '12px',
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    amount={totalAmount}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                    paymentIntentId={paymentIntentId}
                  />
                </Elements>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-slate-800">
                      {formatPrice(calculateTotalPrice(item.id) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="mb-8">
                <DiscountCode />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-base">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-800 font-semibold">{formatPrice(subtotal)}</span>
                </div>
                
                {/* Discount */}
                {state.appliedDiscount && (
                  <div className="flex justify-between text-base">
                    <span className="text-slate-600">Discount ({state.appliedDiscount.code})</span>
                    <span className="text-[#FFD700] font-bold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-base">
                  <span className="text-slate-600">Shipping</span>
                  <span className="text-[#FFD700] font-bold">Free</span>
                </div>
                
                <div className="flex justify-between text-base">
                  <span className="text-slate-600">Tax</span>
                  <span className="text-slate-800 font-semibold">{formatPrice(taxAmount)}</span>
                </div>
                
                <div className="flex justify-between text-xl font-bold border-t border-slate-200 pt-4">
                  <span className="text-slate-800">Total</span>
                  <span className="text-[#FFD700]">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Applied Promotion */}
              {state.appliedDiscount && (
                <div className="mb-8 p-6 bg-[#FFD700]/10 rounded-2xl border border-[#FFD700]/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-800">Applied Promotion:</span>
                    <span className="text-lg font-bold text-[#FFD700]">
                      {state.appliedDiscount.code}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {state.appliedDiscount.name} - You saved {formatPrice(discountAmount)}
                  </p>
                </div>
              )}

              {/* Security Badges */}
              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-[#FFD700]" />
                    <span className="font-medium">Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaLock className="text-[#FFD700]" />
                    <span className="font-medium">SSL Encrypted</span>
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