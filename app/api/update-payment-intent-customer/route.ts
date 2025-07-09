import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { orderData } = await request.json();

    // Get the payment intent ID from the request headers
    const paymentIntentId = request.headers.get('x-payment-intent-id');

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!orderData.email) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    // Update the payment intent with customer information
    const updatedPaymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        customerEmail: orderData.email,
        customerName: orderData.shipping?.name || 'Customer',
        billingComplete: 'true',
        orderData: JSON.stringify(orderData),
      },
      receipt_email: orderData.email, // Send receipt to customer email
    });

    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: updatedPaymentIntent.id,
        status: updatedPaymentIntent.status,
      },
    });
  } catch (error) {
    console.error('Error updating payment intent with customer info:', error);
    return NextResponse.json(
      { error: 'Failed to update payment intent with customer information' },
      { status: 500 }
    );
  }
} 