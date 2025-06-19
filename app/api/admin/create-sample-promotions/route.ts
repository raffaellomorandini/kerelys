import { NextRequest, NextResponse } from 'next/server';
import { createCoupon, createPromotionCode } from '@/app/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // Create sample coupons
    const welcomeCoupon = await createCoupon({
      name: 'Welcome Discount',
      percent_off: 10,
      duration: 'once',
      max_redemptions: 100,
    });

    const saveCoupon = await createCoupon({
      name: 'Big Savings',
      percent_off: 20,
      duration: 'once',
      max_redemptions: 50,
    });

    const freeShipCoupon = await createCoupon({
      name: 'Free Shipping',
      amount_off: 1000, // $10.00 in cents
      currency: 'usd',
      duration: 'once',
      max_redemptions: 200,
    });

    const flashCoupon = await createCoupon({
      name: 'Flash Sale',
      percent_off: 25,
      duration: 'once',
      max_redemptions: 25,
    });

    // Create promotion codes
    const welcomePromo = await createPromotionCode({
      coupon: welcomeCoupon.id,
      code: 'WELCOME10',
      max_redemptions: 100,
      restrictions: {
        minimum_amount: 5000, // $50.00 in cents
        minimum_amount_currency: 'usd',
      },
    });

    const savePromo = await createPromotionCode({
      coupon: saveCoupon.id,
      code: 'SAVE20',
      max_redemptions: 50,
      restrictions: {
        minimum_amount: 10000, // $100.00 in cents
        minimum_amount_currency: 'usd',
      },
    });

    const freeShipPromo = await createPromotionCode({
      coupon: freeShipCoupon.id,
      code: 'FREESHIP',
      max_redemptions: 200,
      restrictions: {
        minimum_amount: 7500, // $75.00 in cents
        minimum_amount_currency: 'usd',
      },
    });

    const flashPromo = await createPromotionCode({
      coupon: flashCoupon.id,
      code: 'FLASH25',
      max_redemptions: 25,
      restrictions: {
        minimum_amount: 2500, // $25.00 in cents
        minimum_amount_currency: 'usd',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Sample promotion codes created successfully',
      codes: [
        {
          code: 'WELCOME10',
          name: 'Welcome Discount',
          type: 'percentage',
          value: 10,
          minAmount: 50,
        },
        {
          code: 'SAVE20',
          name: 'Big Savings',
          type: 'percentage',
          value: 20,
          minAmount: 100,
        },
        {
          code: 'FREESHIP',
          name: 'Free Shipping',
          type: 'fixed',
          value: 10,
          minAmount: 75,
        },
        {
          code: 'FLASH25',
          name: 'Flash Sale',
          type: 'percentage',
          value: 25,
          minAmount: 25,
        },
      ],
    });
  } catch (error) {
    console.error('Error creating sample promotions:', error);
    return NextResponse.json(
      { error: 'Failed to create sample promotion codes' },
      { status: 500 }
    );
  }
} 