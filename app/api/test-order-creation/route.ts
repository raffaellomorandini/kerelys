import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/app/lib/order-utils';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Testing Order Creation ===');
    
    // Test order data
    const testOrderData = {
      email: 'test@example.com',
      stripePaymentIntentId: 'pi_test_123',
      stripeCustomerId: 'cus_test_123',
      totalAmount: 99.99,
      currency: 'USD',
      items: [
        {
          productName: 'Test Product',
          productId: '1',
          quantity: 2,
          unitPrice: 49.99,
          totalPrice: 99.98,
          stripeProductId: 'prod_test_123',
        },
      ],
      shipping: {
        name: 'Test Customer',
        street: '123 Test St',
        city: 'Test City',
        zip: '12345',
        province: 'Test State',
        country: 'US',
        phone: '555-123-4567',
      },
      metadata: {
        test: true,
        timestamp: new Date().toISOString(),
        subtotal: 99.98,
        discount: 0,
        tax: 0,
        hasDiscount: false,
      },
    };

    console.log('Creating test order with data:', {
      email: testOrderData.email,
      totalAmount: testOrderData.totalAmount,
      itemsCount: testOrderData.items.length,
    });

    const result = await createOrder(testOrderData);
    
    if (result.success) {
      console.log('Test order created successfully:', {
        orderNumber: result.order.orderNumber,
        orderId: result.order.id,
      });
      
      return NextResponse.json({
        success: true,
        message: 'Test order created successfully',
        order: {
          orderNumber: result.order.orderNumber,
          orderId: result.order.id,
          email: result.order.email,
          totalAmount: result.order.totalAmount,
        },
      });
    } else {
      console.error('Failed to create test order:', result.error);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to create test order',
        details: result.error,
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error in test order creation:', {
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json({
      success: false,
      error: 'Test order creation failed',
      details: {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  }
} 