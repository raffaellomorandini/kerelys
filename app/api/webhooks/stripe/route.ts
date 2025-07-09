import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createOrder } from '../../../lib/order-utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    if (!session.customer_details?.email || !session.amount_total) {
      console.error('Missing required session data');
      return;
    }

    // Get line items from the session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    
    // Prepare order data
    const orderData = {
      email: session.customer_details.email,
      stripePaymentIntentId: session.payment_intent as string,
      stripeCustomerId: session.customer as string,
      totalAmount: session.amount_total / 100, // Convert from cents
      currency: session.currency?.toUpperCase() || 'USD',
      items: lineItems.data.map(item => ({
        productName: item.description || 'Unknown Product',
        productId: item.price?.product as string,
        quantity: item.quantity || 1,
        unitPrice: (item.amount_total || 0) / 100,
        totalPrice: (item.amount_total || 0) / 100,
        stripeProductId: item.price?.product as string,
        stripePriceId: item.price?.id,
        metadata: {
          stripeLineItemId: item.id,
        },
      })),
      shipping: {
        name: session.customer_details.name || '',
        street: session.customer_details.address?.line1 || '',
        city: session.customer_details.address?.city || '',
        zip: session.customer_details.address?.postal_code || '',
        province: session.customer_details.address?.state || '',
        country: session.customer_details.address?.country || '',
        phone: session.customer_details.phone || '',
      },
      metadata: {
        sessionId: session.id,
        mode: session.mode,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_details.email,
      },
    };

    // Create order in database
    const result = await createOrder(orderData);
    
    if (result.success && result.order) {
      console.log(`Order created successfully: ${result.order.orderNumber}`);
    } else {
      console.error('Failed to create order:', result.error);
    }
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // This can be used for additional payment confirmation logic
    console.log(`Payment succeeded: ${paymentIntent.id}`);
    
    // You can also update order status here if needed
    // await updateOrderStatus(orderNumber, 'paid');
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
} 