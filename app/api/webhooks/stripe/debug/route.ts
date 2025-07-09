import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    console.log('=== Webhook Debug Info ===');
    console.log('Webhook Secret:', process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : 'NOT SET');
    console.log('Signature Header:', signature ? 'Present' : 'Missing');
    console.log('Body Length:', body.length);
    console.log('Request URL:', request.url);
    console.log('All Headers:', Object.fromEntries(request.headers.entries()));

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({
        error: 'STRIPE_WEBHOOK_SECRET not configured',
        debug: {
          secretSet: false,
          signaturePresent: !!signature,
          bodyLength: body.length,
        }
      }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({
        error: 'No Stripe signature found in headers',
        debug: {
          secretSet: true,
          signaturePresent: false,
          bodyLength: body.length,
          headers: Object.fromEntries(request.headers.entries()),
        }
      }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
      console.log('✅ Signature verification successful');
      console.log('Event Type:', event.type);
      
      return NextResponse.json({
        success: true,
        message: 'Signature verification successful',
        eventType: event.type,
        debug: {
          secretSet: true,
          signaturePresent: true,
          bodyLength: body.length,
          eventId: event.id,
        }
      });
    } catch (err) {
      console.log('❌ Signature verification failed');
      console.error('Verification error:', err);
      
      return NextResponse.json({
        error: 'Webhook signature verification failed',
        debug: {
          secretSet: true,
          signaturePresent: true,
          bodyLength: body.length,
          errorMessage: err instanceof Error ? err.message : 'Unknown error',
          // Don't log the actual secret for security
          secretLength: process.env.STRIPE_WEBHOOK_SECRET?.length || 0,
        }
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Webhook debug error:', error);
    return NextResponse.json({
      error: 'Webhook handler failed',
      debug: {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      }
    }, { status: 500 });
  }
} 