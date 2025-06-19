import Stripe from 'stripe';

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

// Get the publishable key for client-side
export const getStripePublishableKey = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
};

// Create a payment intent
export const createPaymentIntent = async (amount: number, currency: string = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Create a payment intent with promotion code
export const createPaymentIntentWithPromotion = async (
  amount: number, 
  currency: string = 'usd',
  promotionCode?: string
) => {
  try {
    const paymentIntentData: any = {
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    };

    // If promotion code is provided, add it to the payment intent
    if (promotionCode) {
      paymentIntentData.promotion_code = promotionCode;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
    
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent with promotion:', error);
    throw error;
  }
};

// Validate a promotion code
export const validatePromotionCode = async (code: string): Promise<
  | { isValid: false; error: string }
  | { isValid: true; promotionCode: Stripe.PromotionCode; coupon: Stripe.Coupon; discount: any }
> => {
  try {
    const promotionCodes = await stripe.promotionCodes.list({
      code,
      active: true,
      limit: 1,
    });
    console.log(promotionCodes.data);

    if (promotionCodes.data.length === 0) {
      return { isValid: false, error: 'Invalid promotion code' };
    }

    const promotionCode = promotionCodes.data[0];
    const coupon = promotionCode.coupon;

    // Check if promotion code is active
    if (!promotionCode.active) {
      return { isValid: false, error: 'This promotion code is not active' };
    }

    // Check usage limits
    if (promotionCode.max_redemptions && promotionCode.times_redeemed >= promotionCode.max_redemptions) {
      return { isValid: false, error: 'This promotion code has reached its usage limit' };
    }

    // Check expiration
    if (promotionCode.expires_at && new Date() > new Date(promotionCode.expires_at * 1000)) {
      return { isValid: false, error: 'This promotion code has expired' };
    }

    return {
      isValid: true,
      promotionCode,
      coupon,
      discount: {
        type: coupon.percent_off ? 'percentage' : 'fixed',
        value: coupon.percent_off || coupon.amount_off,
        currency: coupon.currency,
        name: coupon.name,
      },
    };
  } catch (error) {
    console.error('Error validating promotion code:', error);
    return { isValid: false, error: 'Failed to validate promotion code' };
  }
};

// Create a setup intent for saving payment methods
export const createSetupIntent = async () => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['card', 'apple_pay', 'google_pay'],
    });
    
    return setupIntent;
  } catch (error) {
    console.error('Error creating setup intent:', error);
    throw error;
  }
};

// Create a coupon (for admin use)
export const createCoupon = async (couponData: {
  name: string;
  percent_off?: number;
  amount_off?: number;
  currency?: string;
  duration: 'once' | 'repeating' | 'forever';
  duration_in_months?: number;
  max_redemptions?: number;
  metadata?: Record<string, string>;
}) => {
  try {
    const coupon = await stripe.coupons.create(couponData);
    return coupon;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }
};

// Create a promotion code (for admin use)
export const createPromotionCode = async (promotionData: {
  coupon: string;
  code?: string;
  max_redemptions?: number;
  expires_at?: number;
  restrictions?: {
    first_time_transaction?: boolean;
    minimum_amount?: number;
    minimum_amount_currency?: string;
  };
}) => {
  try {
    const promotionCode = await stripe.promotionCodes.create(promotionData);
    return promotionCode;
  } catch (error) {
    console.error('Error creating promotion code:', error);
    throw error;
  }
};

// List all promotion codes (for admin use)
export const listPromotionCodes = async () => {
  try {
    const promotionCodes = await stripe.promotionCodes.list({
      limit: 100,
    });
    return promotionCodes.data;
  } catch (error) {
    console.error('Error listing promotion codes:', error);
    throw error;
  }
}; 