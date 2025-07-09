import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createOrder } from '../../../lib/order-utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Helper function for Vercel logging
function log(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    message,
    data,
    environment: process.env.NODE_ENV,
  };
  
  // This will show up in Vercel logs
  console.log(JSON.stringify(logEntry));
  
  // Also log to stderr for better visibility
  console.error(JSON.stringify(logEntry));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    // Debug logging
    log('=== Webhook Debug ===', {
      webhookSecretExists: !!webhookSecret,
      webhookSecretLength: webhookSecret?.length || 0,
      signatureExists: !!signature,
      bodyLength: body.length,
      envVars: {
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
      }
    });

    // Check if webhook secret is configured
    if (!webhookSecret) {
      log('ERROR: STRIPE_WEBHOOK_SECRET is not configured', {
        secretExists: false,
        secretLength: 0,
        signatureExists: !!signature,
        bodyLength: body.length,
        envVars: {
          hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
          hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        }
      });
      return NextResponse.json(
        { 
          error: 'Webhook secret not configured',
          debug: {
            secretExists: false,
            secretLength: 0,
            signatureExists: !!signature,
            bodyLength: body.length,
            envVars: {
              hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
              hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
            }
          }
        },
        { status: 500 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      log('Webhook signature verified successfully', {
        eventType: event.type,
        eventId: event.id,
      });
    } catch (err) {
      log('ERROR: Webhook signature verification failed', {
        secretExists: true,
        secretLength: webhookSecret.length,
        signatureExists: !!signature,
        bodyLength: body.length,
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
      });
      return NextResponse.json(
        { 
          error: 'Webhook signature verification failed',
          debug: {
            secretExists: true,
            secretLength: webhookSecret.length,
            signatureExists: !!signature,
            bodyLength: body.length,
            errorMessage: err instanceof Error ? err.message : 'Unknown error',
          }
        },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        log('Processing checkout.session.completed event', { eventId: event.id });
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        log('Processing payment_intent.succeeded event', { eventId: event.id });
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        log(`Unhandled event type: ${event.type}`, { 
          eventId: event.id,
          eventType: event.type,
          note: 'This event type is not configured to create orders. Only checkout.session.completed creates orders.'
        });
    }

    log('Webhook processed successfully', { eventType: event.type, eventId: event.id });
    return NextResponse.json({ received: true });
  } catch (error) {
    log('ERROR: Webhook handler failed', {
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { 
        error: 'Webhook handler failed',
        debug: {
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        }
      },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    log('=== Processing Checkout Session ===', {
      sessionId: session.id,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      paymentIntent: session.payment_intent,
      customerId: session.customer,
    });

    if (!session.customer_details?.email || !session.amount_total) {
      log('ERROR: Missing required session data', {
        hasEmail: !!session.customer_details?.email,
        hasAmount: !!session.amount_total,
      });
      return;
    }

    // Get line items from the session
    log('Fetching line items from Stripe...', { sessionId: session.id });
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    log('Line items retrieved', {
      lineItemsCount: lineItems.data.length,
      lineItems: lineItems.data.map(item => ({
        description: item.description,
        quantity: item.quantity,
        amountTotal: item.amount_total,
      })),
    });
    
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

    log('Order data prepared', {
      email: orderData.email,
      totalAmount: orderData.totalAmount,
      itemsCount: orderData.items.length,
      shippingName: orderData.shipping.name,
    });

    // Create order in database
    log('Creating order in database...', { sessionId: session.id });
    const result = await createOrder(orderData);
    
    if (result.success) {
      log('Order created successfully', {
        orderNumber: result.order.orderNumber,
        orderId: result.order.id,
      });
    } else {
      log('ERROR: Failed to create order', {
        error: result.error,
        sessionId: session.id,
      });
    }
  } catch (error) {
    log('ERROR: Error handling checkout session completed', {
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      sessionId: session.id,
    });
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    log('=== Processing Payment Intent Success ===', {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    });
    
    // Try to get order data from metadata
    let orderData = null;
    if (paymentIntent.metadata.orderData) {
      try {
        orderData = JSON.parse(paymentIntent.metadata.orderData);
        log('Order data parsed from metadata', {
          email: orderData.email,
          totalAmount: orderData.totalAmount,
          itemsCount: orderData.items?.length || 0,
        });
      } catch (parseError) {
        log('ERROR: Failed to parse order data from metadata', {
          paymentIntentId: paymentIntent.id,
          parseError: parseError instanceof Error ? parseError.message : 'Unknown error',
          rawMetadata: paymentIntent.metadata.orderData,
        });
      }
    }

    // Get customer email from metadata or payment intent
    const customerEmail = paymentIntent.metadata.customerEmail || 
                         paymentIntent.receipt_email || 
                         'customer@example.com';

    // If no order data in metadata, create a basic order
    if (!orderData) {
      log('No order data in metadata, creating basic order', { paymentIntentId: paymentIntent.id });
      
      orderData = {
        email: customerEmail,
        totalAmount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency?.toUpperCase() || 'USD',
        items: [
          {
            productName: 'Product Purchase',
            productId: 'unknown',
            quantity: 1,
            unitPrice: paymentIntent.amount / 100,
            totalPrice: paymentIntent.amount / 100,
            stripeProductId: 'unknown',
          },
        ],
        shipping: {
          name: paymentIntent.metadata.customerName || 'Customer',
          street: 'Address not provided',
          city: 'City not provided',
          zip: '00000',
          province: 'State not provided',
          country: 'US',
          phone: '',
        },
        metadata: {
          paymentIntentId: paymentIntent.id,
          customerId: paymentIntent.customer,
          createdFromWebhook: true,
          originalAmount: paymentIntent.amount,
          originalCurrency: paymentIntent.currency,
        },
      };
    } else {
      // Transform simplified order data to full structure
      orderData = {
        email: orderData.email || customerEmail,
        totalAmount: orderData.totalAmount,
        currency: orderData.currency || 'USD',
        items: orderData.items?.map((item: any) => ({
          productName: item.name,
          productId: item.id,
          quantity: item.qty,
          unitPrice: item.price,
          totalPrice: item.total,
          stripeProductId: item.stripeProductId || 'unknown',
        })) || [],
        shipping: orderData.shipping || {
          name: paymentIntent.metadata.customerName || 'Customer',
          street: 'Address not provided',
          city: 'City not provided',
          zip: '00000',
          province: 'State not provided',
          country: 'US',
          phone: '',
        },
        metadata: {
          ...orderData.meta,
          paymentIntentId: paymentIntent.id,
          customerId: paymentIntent.customer,
          createdFromWebhook: true,
        },
        stripePaymentIntentId: paymentIntent.id,
        stripeCustomerId: paymentIntent.customer as string,
      };
    }

    // Create order in database
    log('Creating order from payment intent...', { paymentIntentId: paymentIntent.id });
    const result = await createOrder(orderData);
    
    if (result.success) {
      log('Order created successfully from payment intent', {
        orderNumber: result.order.orderNumber,
        orderId: result.order.id,
        paymentIntentId: paymentIntent.id,
      });
    } else {
      log('ERROR: Failed to create order from payment intent', {
        error: result.error,
        paymentIntentId: paymentIntent.id,
      });
    }
  } catch (error) {
    log('ERROR: Error handling payment intent succeeded', {
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      paymentIntentId: paymentIntent.id,
    });
  }
} 