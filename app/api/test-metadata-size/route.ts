import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Simulate the order data structure we're using
    const orderData = {
      email: '',
      totalAmount: 43.17,
      currency: 'USD',
      items: [
        {
          name: '3 Month Supply',
          id: '3',
          qty: 1,
          price: 39.97,
          total: 39.97,
        },
      ],
      shipping: {
        name: '',
        street: '',
        city: '',
        zip: '',
        province: '',
        country: 'US',
        phone: '',
      },
      meta: {
        subtotal: 39.97,
        discount: 0,
        tax: 3.20,
        hasDiscount: false,
      },
    };

    const metadataString = JSON.stringify(orderData);
    const characterCount = metadataString.length;

    return NextResponse.json({
      success: true,
      metadataSize: {
        characters: characterCount,
        isUnderLimit: characterCount <= 500,
        limit: 500,
        remaining: 500 - characterCount,
      },
      metadata: metadataString,
      orderData: orderData,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to test metadata size',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 