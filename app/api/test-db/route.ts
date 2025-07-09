import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import { ordersTable, orderItemsTable, shippingInfoTable } from '../../../db/schema';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Testing Database Connection ===');
    
    // Test 1: Check if we can connect to the database
    console.log('Testing database connection...');
    
    // Test 2: Check if tables exist
    console.log('Checking if tables exist...');
    
    // Try to query the orders table
    const ordersCount = await db.select().from(ordersTable).limit(1);
    console.log('Orders table query successful, count:', ordersCount.length);
    
    // Try to query the order_items table
    const orderItemsCount = await db.select().from(orderItemsTable).limit(1);
    console.log('Order items table query successful, count:', orderItemsCount.length);
    
    // Try to query the shipping_info table
    const shippingCount = await db.select().from(shippingInfoTable).limit(1);
    console.log('Shipping info table query successful, count:', shippingCount.length);
    
    // Test 3: Check environment variables
    const envVars = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...',
    };
    
    console.log('Environment variables check:', envVars);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test completed',
      results: {
        ordersTable: 'OK',
        orderItemsTable: 'OK',
        shippingInfoTable: 'OK',
        environmentVariables: envVars,
      },
    });
    
  } catch (error) {
    console.error('Database test failed:', {
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        envVars: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
          hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        },
      },
    }, { status: 500 });
  }
} 