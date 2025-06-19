"use client"

import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';

export default function CartIcon() {
  const { toggleCart, getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-gray-600 hover:text-[#8B4513] hover:bg-gray-50 rounded-lg transition-colors"
      aria-label="Shopping cart"
    >
      <FaShoppingCart className="text-xl" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#8B4513] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
} 