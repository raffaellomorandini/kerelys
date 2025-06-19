import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntentWithPromotion } from '@/app/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd', promotionCode } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const paymentIntent = await createPaymentIntentWithPromotion(amount, currency, promotionCode);

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