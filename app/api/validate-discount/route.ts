import { NextRequest, NextResponse } from 'next/server';
import { validatePromotionCode } from '@/app/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Promotion code is required' },
        { status: 400 }
      );
    }

    const validation = await validatePromotionCode(code);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // At this point, validation.isValid is true, so promotionCode and discount exist
    const { promotionCode, discount } = validation;

    return NextResponse.json({
      success: true,
      discount: {
        code: promotionCode.code,
        type: discount.type,
        value: discount.value,
        currency: discount.currency,
        name: discount.name,
        promotionCodeId: promotionCode.id,
      },
    });
  } catch (error) {
    console.error('Error validating promotion code:', error);
    return NextResponse.json(
      { error: 'Failed to validate promotion code' },
      { status: 500 }
    );
  }
} 