"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { calculateTotalPrice } from '../lib/products';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stripeProductId: string;
  image?: string;
}

export interface AppliedDiscount {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  currency: string;
  name: string;
  promotionCodeId: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedDiscount: AppliedDiscount | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'APPLY_DISCOUNT'; payload: AppliedDiscount }
  | { type: 'REMOVE_DISCOUNT' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        appliedDiscount: null,
      };
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
      };
    case 'APPLY_DISCOUNT':
      return {
        ...state,
        appliedDiscount: action.payload,
      };
    case 'REMOVE_DISCOUNT':
      return {
        ...state,
        appliedDiscount: null,
      };
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  applyDiscount: (discount: AppliedDiscount) => void;
  removeDiscount: () => void;
  getDiscountedTotal: () => number;
  getDiscountAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    appliedDiscount: null,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('klys-cart');
    const savedDiscount = localStorage.getItem('klys-discount');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    if (savedDiscount) {
      try {
        const discount = JSON.parse(savedDiscount);
        dispatch({ type: 'APPLY_DISCOUNT', payload: discount });
      } catch (error) {
        console.error('Error loading discount from localStorage:', error);
      }
    }
  }, []);

  // Save cart and discount to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('klys-cart', JSON.stringify(state.items));
    if (state.appliedDiscount) {
      localStorage.setItem('klys-discount', JSON.stringify(state.appliedDiscount));
    } else {
      localStorage.removeItem('klys-discount');
    }
  }, [state.items, state.appliedDiscount]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (calculateTotalPrice(item.id) * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    if (!state.appliedDiscount) return 0;
    
    const subtotal = getTotalPrice();
    
    if (state.appliedDiscount.type === 'percentage') {
      return (subtotal * state.appliedDiscount.value) / 100;
    } else {
      // Fixed amount discount (value is in cents)
      return state.appliedDiscount.value / 100;
    }
  };

  const getDiscountedTotal = () => {
    const subtotal = getTotalPrice();
    const discountAmount = getDiscountAmount();
    return Math.max(0, subtotal - discountAmount);
  };

  const applyDiscount = (discount: AppliedDiscount) => {
    dispatch({ type: 'APPLY_DISCOUNT', payload: discount });
  };

  const removeDiscount = () => {
    dispatch({ type: 'REMOVE_DISCOUNT' });
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
    getTotalItems,
    getTotalPrice,
    applyDiscount,
    removeDiscount,
    getDiscountedTotal,
    getDiscountAmount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 