"use client"

import { useState } from 'react';
import { FaTag, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';

interface DiscountCodeProps {
  onDiscountApplied: (discount: any) => void;
  onDiscountRemoved: () => void;
  appliedDiscount?: any;
}

export default function DiscountCode({ 
  onDiscountApplied, 
  onDiscountRemoved, 
  appliedDiscount 
}: DiscountCodeProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

      onDiscountApplied(data.discount);
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
    onDiscountRemoved();
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
    <div className="bg-gray-50 rounded-lg p-4">
      {appliedDiscount ? (
        // Applied discount display
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheck className="text-green-600 text-sm" />
            </div>
            <div>
              <p className="font-semibold text-green-800">
                {appliedDiscount.code} - {getDiscountText(appliedDiscount)}
              </p>
              <p className="text-sm text-green-600">
                {appliedDiscount.name}
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
          <div className="flex items-center gap-2 mb-3">
            <FaTag className="text-[#8B4513] text-sm" />
            <span className="font-semibold text-gray-900">Have a promotion code?</span>
          </div>
          
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full text-left text-[#8B4513] hover:text-[#A0522D] font-medium transition-colors"
            >
              + Add promotion code
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g., WELCOME10)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyCode()}
                  disabled={isLoading}
                />
                <button
                  onClick={handleApplyCode}
                  disabled={isLoading || !code.trim()}
                  className="px-4 py-2 bg-[#8B4513] text-white rounded-lg font-semibold hover:bg-[#A0522D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin text-sm" />
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                >
                  Cancel
                </button>
                
                {/* Note about Stripe handling */}
                <div className="text-xs text-gray-500">
                  Stripe will calculate your discount
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 