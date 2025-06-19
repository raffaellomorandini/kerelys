"use client"

import { FaApple, FaPaypal, FaGoogle, FaCreditCard, FaLock } from 'react-icons/fa';
import { SiVisa, SiMastercard, SiAmericanexpress, SiDiscover } from 'react-icons/si';

interface PaymentMethodsProps {
  onSelect?: (method: string) => void;
  selectedMethod?: string;
  showDescription?: boolean;
  compact?: boolean;
}

export default function PaymentMethods({ 
  onSelect, 
  selectedMethod, 
  showDescription = true, 
  compact = false 
}: PaymentMethodsProps) {
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit Card',
      icon: <FaCreditCard className="text-xl" />,
      color: 'bg-blue-600',
      description: 'Visa, Mastercard, American Express, Discover',
      popular: true,
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: <FaApple className="text-xl" />,
      color: 'bg-black',
      description: 'Quick and secure payment with Apple Pay',
      popular: false,
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      icon: <FaGoogle className="text-xl" />,
      color: 'bg-green-600',
      description: 'Fast checkout with Google Pay',
      popular: false,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <FaPaypal className="text-xl" />,
      color: 'bg-blue-500',
      description: 'Pay with your PayPal account',
      popular: true,
    },
  ];

  const cardBrands = [
    { name: 'Visa', icon: <SiVisa className="text-2xl text-blue-600" /> },
    { name: 'Mastercard', icon: <SiMastercard className="text-2xl text-red-600" /> },
    { name: 'American Express', icon: <SiAmericanexpress className="text-2xl text-blue-800" /> },
    { name: 'Discover', icon: <SiDiscover className="text-2xl text-orange-600" /> },
  ];

  return (
    <div className="space-y-4">
      {/* Payment Method Buttons */}
      <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect?.(method.id)}
            className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedMethod === method.id
                ? `${method.color} border-current text-white`
                : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            } ${compact ? 'text-sm' : ''}`}
          >
            <div className="flex items-center gap-3">
              {method.icon}
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${compact ? 'text-sm' : ''}`}>
                    {method.name}
                  </span>
                  {method.popular && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                      Popular
                    </span>
                  )}
                </div>
                {showDescription && !compact && (
                  <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Accepted Cards */}
      {showDescription && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaLock className="text-green-600 text-sm" />
              <span className="text-sm font-medium text-gray-700">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">We accept:</span>
              <div className="flex gap-1">
                {cardBrands.map((brand) => (
                  <div key={brand.name} title={brand.name}>
                    {brand.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      {showDescription && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            All payments are secured with 256-bit SSL encryption and PCI DSS compliance
          </p>
        </div>
      )}
    </div>
  );
} 