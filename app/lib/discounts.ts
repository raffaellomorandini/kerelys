export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
}

// Sample discount codes - in production, these would come from your database
export const sampleDiscountCodes: DiscountCode[] = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minAmount: 50,
    maxDiscount: 25,
    usageLimit: 100,
    usedCount: 45,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31'),
    isActive: true,
  },
  {
    code: 'SAVE20',
    type: 'percentage',
    value: 20,
    minAmount: 100,
    maxDiscount: 50,
    usageLimit: 50,
    usedCount: 12,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31'),
    isActive: true,
  },
  {
    code: 'FREESHIP',
    type: 'fixed',
    value: 10,
    minAmount: 75,
    usageLimit: 200,
    usedCount: 89,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31'),
    isActive: true,
  },
  {
    code: 'FLASH25',
    type: 'percentage',
    value: 25,
    minAmount: 25,
    maxDiscount: 100,
    usageLimit: 25,
    usedCount: 25, // This code is fully used
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31'),
    isActive: true,
  },
];

export const validateDiscountCode = (
  code: string,
  subtotal: number,
  discountCodes: DiscountCode[] = sampleDiscountCodes
): { isValid: boolean; discount?: DiscountCode; error?: string } => {
  const discountCode = discountCodes.find(
    (dc) => dc.code.toUpperCase() === code.toUpperCase()
  );

  if (!discountCode) {
    return { isValid: false, error: 'Invalid discount code' };
  }

  if (!discountCode.isActive) {
    return { isValid: false, error: 'This discount code is no longer active' };
  }

  const now = new Date();
  if (now < discountCode.validFrom || now > discountCode.validUntil) {
    return { isValid: false, error: 'This discount code has expired or is not yet valid' };
  }

  if (discountCode.usageLimit && discountCode.usedCount >= discountCode.usageLimit) {
    return { isValid: false, error: 'This discount code has reached its usage limit' };
  }

  if (discountCode.minAmount && subtotal < discountCode.minAmount) {
    return { 
      isValid: false, 
      error: `Minimum order amount of $${discountCode.minAmount} required for this discount code` 
    };
  }

  return { isValid: true, discount: discountCode };
};

export const calculateDiscount = (
  discountCode: DiscountCode,
  subtotal: number
): { discountAmount: number; finalAmount: number } => {
  let discountAmount = 0;

  if (discountCode.type === 'percentage') {
    discountAmount = (subtotal * discountCode.value) / 100;
    
    // Apply maximum discount limit if specified
    if (discountCode.maxDiscount) {
      discountAmount = Math.min(discountAmount, discountCode.maxDiscount);
    }
  } else {
    // Fixed amount discount
    discountAmount = discountCode.value;
  }

  // Ensure discount doesn't exceed subtotal
  discountAmount = Math.min(discountAmount, subtotal);
  
  const finalAmount = subtotal - discountAmount;

  return { discountAmount, finalAmount };
};

export const formatDiscountCode = (code: string): string => {
  return code.toUpperCase().replace(/\s/g, '');
}; 