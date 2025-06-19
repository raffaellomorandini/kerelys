import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/app/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd', discount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const paymentIntent = await createPaymentIntent(amount, currency);

    // Add discount information to metadata if provided
    if (discount) {
      paymentIntent.metadata = {
        ...paymentIntent.metadata,
        discount_code: discount.code,
        discount_type: discount.type,
        discount_value: discount.value.toString(),
        discount_amount: discount.savings.toString(),
      };
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 