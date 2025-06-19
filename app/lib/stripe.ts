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