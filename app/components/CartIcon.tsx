"use client"

import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';

export default function CartIcon() {
  const { toggleCart, getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-slate-600 hover:text-[#FFD700] hover:bg-slate-50 rounded-md transition-colors"
      aria-label="Shopping cart"
    >
      <FaShoppingCart className="text-xl" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#FFD700] text-slate-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
} 