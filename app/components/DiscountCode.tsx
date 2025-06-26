"use client"

import { useState } from 'react';
import { FaCheck, FaTimes, FaTag } from 'react-icons/fa';
import { toast } from 'sonner';
import { useCart } from '../contexts/CartContext';

interface DiscountCodeProps {
  onDiscountApplied?: (discount: any) => void;
  onDiscountRemoved?: () => void;
  appliedDiscount?: any;
}

export default function DiscountCode({ 
  onDiscountApplied, 
  onDiscountRemoved, 
  appliedDiscount 
}: DiscountCodeProps) {
  const { state, applyDiscount, removeDiscount, getTotalPrice } = useCart();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Use cart context discount if available, otherwise fall back to props
  const currentDiscount = state.appliedDiscount || appliedDiscount;

  const handleApplyCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter a promotion code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/validate-discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to apply promotion code');
        return;
      }

      // Apply discount to cart context
      applyDiscount(data.discount);
      
      // Also call the callback if provided (for backward compatibility)
      if (onDiscountApplied) {
        onDiscountApplied(data.discount);
      }
      
      toast.success(`Promotion applied! ${data.discount.name}`);
      setCode('');
      setIsExpanded(false);
    } catch (error) {
      console.error('Error applying promotion code:', error);
      toast.error('Failed to apply promotion code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    // Remove discount from cart context
    removeDiscount();
    
    // Also call the callback if provided (for backward compatibility)
    if (onDiscountRemoved) {
      onDiscountRemoved();
    }
    
    toast.success('Promotion removed');
  };

  const getDiscountText = (discount: any) => {
    if (discount.type === 'percentage') {
      return `${discount.value}% off`;
    } else {
      return `$${(discount.value / 100).toFixed(2)} off`;
    }
  };

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      {currentDiscount ? (
        // Applied discount display
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <FaCheck className="text-emerald-600 text-sm" />
            </div>
            <div>
              <p className="font-semibold text-emerald-800">
                {currentDiscount.code} - {getDiscountText(currentDiscount)}
              </p>
              <p className="text-sm text-emerald-600">
                {currentDiscount.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveDiscount}
            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
            title="Remove promotion"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      ) : (
        // Discount code input
        <div>
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <FaTag className="text-sm" />
              <span className="text-sm">Have a promotion code?</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter promotion code"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyCode()}
                />
                <button
                  onClick={handleApplyCode}
                  disabled={isLoading || !code.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg text-sm font-medium hover:shadow-elegant transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Applying...' : 'Apply'}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-slate-500 hover:text-slate-700 text-sm transition-colors"
                >
                  Cancel
                </button>
                
                {/* Note about discount calculation */}
                <div className="text-xs text-slate-500">
                  Discount will be applied to your order
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 