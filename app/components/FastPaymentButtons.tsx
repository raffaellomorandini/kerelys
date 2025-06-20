"use client"

import { useRouter } from 'next/navigation';
import { FaApple, FaPaypal, FaLock } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  stripeProductId: string;
  image: string;
}

interface FastPaymentButtonsProps {
  variant?: 'primary' | 'secondary' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  product?: Product;
}

export default function FastPaymentButtons({ 
  variant = 'primary', 
  size = 'md',
  className = '',
  product
}: FastPaymentButtonsProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const handleFastPayment = (method: string) => {
    // If a product is provided, add it to cart first
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        stripeProductId: product.stripeProductId,
        image: product.image
      });
      toast.success(`${product.name} added to cart!`);
    }
    
    // Navigate to checkout page
    router.push('/checkout');
  };

  const baseClasses = "flex items-center justify-center gap-3 font-semibold transition-all duration-200 rounded-xl border-2 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md";
  
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-6 py-4 text-base",
    lg: "px-8 py-5 text-lg"
  };

  const variantClasses = {
    primary: {
      apple: "bg-black text-white border-black hover:bg-gray-800 hover:border-gray-800",
      paypal: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
    },
    secondary: {
      apple: "bg-white text-black border-black hover:bg-gray-50 hover:shadow-lg",
      paypal: "bg-white text-blue-600 border-blue-600 hover:bg-blue-50 hover:shadow-lg"
    },
    compact: {
      apple: "bg-black text-white border-black hover:bg-gray-800",
      paypal: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
    }
  };

  // Compact variant shows only icons in a horizontal layout
  if (variant === 'compact') {
    return (
      <div className={`flex gap-2 ${className}`}>
        <button
          onClick={() => handleFastPayment('apple')}
          className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
          title="Pay with Apple Pay"
        >
          <FaApple className="text-xl" />
        </button>
        <button
          onClick={() => handleFastPayment('paypal')}
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
          title="Pay with PayPal"
        >
          <FaPaypal className="text-xl" />
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Apple Pay Button */}
      <button
        onClick={() => handleFastPayment('apple')}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant].apple} w-full`}
      >
        <FaApple className="text-2xl" />
        <span>Pay with Apple Pay</span>
        <FaLock className="text-sm opacity-70" />
      </button>

      {/* PayPal Button */}
      <button
        onClick={() => handleFastPayment('paypal')}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant].paypal} w-full`}
      >
        <FaPaypal className="text-2xl" />
        <span>Pay with PayPal</span>
        <FaLock className="text-sm opacity-70" />
      </button>

      {/* Security Notice */}
      <div className="text-xs text-gray-500 text-center mt-3">
        <p>🔒 Secure payment powered by Stripe</p>
        <p>All payments are encrypted and secure</p>
      </div>
    </div>
  );
} 