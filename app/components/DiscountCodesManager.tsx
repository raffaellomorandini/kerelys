"use client"

import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { sampleDiscountCodes, DiscountCode } from '../lib/discounts';

export default function DiscountCodesManager() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(sampleDiscountCodes);
  const [showInactive, setShowInactive] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (code: DiscountCode) => {
    const now = new Date();
    const isExpired = now > code.validUntil;
    const isNotStarted = now < code.validFrom;
    const isUsedUp = code.usageLimit && code.usedCount >= code.usageLimit;

    if (!code.isActive) {
      return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Inactive</span>;
    }
    if (isExpired) {
      return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Expired</span>;
    }
    if (isNotStarted) {
      return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Future</span>;
    }
    if (isUsedUp) {
      return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Used Up</span>;
    }
    return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>;
  };

  const getUsagePercentage = (code: DiscountCode) => {
    if (!code.usageLimit) return 0;
    return Math.round((code.usedCount / code.usageLimit) * 100);
  };

  const filteredCodes = discountCodes.filter(code => 
    showInactive ? true : code.isActive
  );

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Discount Codes</h2>
            <p className="text-sm text-gray-600">Manage your promotional codes and coupons</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              {showInactive ? <FaEyeSlash /> : <FaEye />}
              {showInactive ? 'Hide Inactive' : 'Show Inactive'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] transition-colors">
              <FaPlus className="text-sm" />
              Add Code
            </button>
          </div>
        </div>
      </div>

      {/* Codes List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valid Until
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCodes.map((code) => (
              <tr key={code.code} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{code.code}</div>
                    {code.minAmount && (
                      <div className="text-xs text-gray-500">
                        Min: ${code.minAmount}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    code.type === 'percentage' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {code.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {code.type === 'percentage' ? `${code.value}%` : `$${code.value}`}
                  {code.maxDiscount && code.type === 'percentage' && (
                    <div className="text-xs text-gray-500">
                      Max: ${code.maxDiscount}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-1 mr-2">
                      <div className="text-sm text-gray-900">
                        {code.usedCount}
                        {code.usageLimit && ` / ${code.usageLimit}`}
                      </div>
                      {code.usageLimit && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#8B4513] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getUsagePercentage(code)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(code)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(code.validUntil)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button className="text-[#8B4513] hover:text-[#A0522D] transition-colors">
                      <FaEdit className="text-sm" />
                    </button>
                    <button className="text-red-600 hover:text-red-800 transition-colors">
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredCodes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🎫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No discount codes found</h3>
          <p className="text-gray-600">Create your first discount code to start offering promotions.</p>
        </div>
      )}
    </div>
  );
} 