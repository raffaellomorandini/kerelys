import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { orderData } = await request.json();

    // Get the payment intent ID from the request headers or body
    // For now, we'll need to get this from the client side
    const paymentIntentId = request.headers.get('x-payment-intent-id');

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    // Update the payment intent with the new order data
    const updatedPaymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        orderData: JSON.stringify(orderData),
      },
    });

    return NextResponse.json({
      success: true,
      paymentIntent: updatedPaymentIntent,
    });
  } catch (error) {
    console.error('Error updating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to update payment intent' },
      { status: 500 }
    );
  }
} 