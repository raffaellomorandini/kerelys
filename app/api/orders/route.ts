import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrdersByEmail, getOrderByNumber } from '../../../app/lib/order-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, stripePaymentIntentId, stripeCustomerId, totalAmount, currency, items, shipping, metadata } = body;

    // Validate required fields
    if (!email || !totalAmount || !items || !shipping) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the order
    const result = await createOrder({
      email,
      stripePaymentIntentId,
      stripeCustomerId,
      totalAmount,
      currency,
      items,
      shipping,
      metadata,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: result.order,
    });
  } catch (error) {
    console.error('Error in order creation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const orderNumber = searchParams.get('orderNumber');

    if (orderNumber) {
      // Get specific order by order number
      const result = await getOrderByNumber(orderNumber);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        order: result.order,
      });
    }

    if (email) {
      // Get orders by email
      const result = await getOrdersByEmail(email);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        orders: result.orders,
      });
    }

    return NextResponse.json(
      { error: 'Email or order number is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in order retrieval API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 