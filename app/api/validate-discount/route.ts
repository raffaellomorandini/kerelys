import { NextRequest, NextResponse } from 'next/server';
import { validateDiscountCode, calculateDiscount } from '@/app/lib/discounts';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (!code || !subtotal) {
      return NextResponse.json(
        { error: 'Discount code and subtotal are required' },
        { status: 400 }
      );
    }

    const validation = validateDiscountCode(code, subtotal);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { discountAmount, finalAmount } = calculateDiscount(validation.discount!, subtotal);

    return NextResponse.json({
      success: true,
      discount: {
        code: validation.discount!.code,
        type: validation.discount!.type,
        value: validation.discount!.value,
        discountAmount,
        finalAmount,
        savings: discountAmount,
      },
    });
  } catch (error) {
    console.error('Error validating discount code:', error);
    return NextResponse.json(
      { error: 'Failed to validate discount code' },
      { status: 500 }
    );
  }
} 