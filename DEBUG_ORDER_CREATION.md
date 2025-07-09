# Debugging Order Creation

This guide will help you test and debug the order creation process.

## 🔍 The Problem

Your checkout flow uses **Payment Intents** directly, but the webhook was only set up to create orders from **Checkout Sessions**. This means when customers complete checkout, the `payment_intent.succeeded` webhook event fires, but no orders were being created.

## ✅ The Solution

I've updated the webhook to handle `payment_intent.succeeded` events and create orders. The webhook now:

1. **Tries to get order data from payment intent metadata** (if available)
2. **Creates a basic order even if metadata is missing** (with fallback data)
3. **Logs detailed information** for debugging

## 🧪 Testing Steps

### 1. Test Database Connection

First, test if your database is working:

```bash
# Test database connection
curl -X GET http://localhost:3000/api/test-db
```

### 2. Test Order Creation

Test if orders can be created manually:

```bash
# Test order creation
curl -X POST http://localhost:3000/api/test-order-creation
```

### 3. Test Complete Checkout Flow

1. **Add items to cart** on your website
2. **Go to checkout** (`/checkout`)
3. **Complete a test payment** using Stripe test cards:
   - Card: `4242424242424242`
   - Expiry: Any future date
   - CVC: Any 3 digits
4. **Check Vercel logs** for webhook events

### 4. Check Vercel Logs

In your Vercel dashboard, look for these log entries:

```
=== Processing Payment Intent Success ===
Creating order from payment intent...
Order created successfully from payment intent
```

## 🔧 What I Fixed

### 1. Updated Webhook Handler

Modified `app/api/webhooks/stripe/route.ts`:
- Enhanced `handlePaymentIntentSucceeded` function
- Added fallback logic for missing order data
- Improved error logging

### 2. Updated Payment Intent Creation

Modified `app/api/create-payment-intent/route.ts`:
- Now accepts and stores order data in metadata
- Passes cart items and pricing information

### 3. Updated Checkout Page

Modified `app/checkout/page.tsx`:
- Sends order data when creating payment intent
- Includes cart items, pricing, and discount information

## 📊 Expected Behavior

After these changes:

1. **When customer completes checkout:**
   - Payment intent is created with order data in metadata
   - Customer completes payment
   - Stripe sends `payment_intent.succeeded` webhook
   - Webhook creates order in database
   - Order appears in your database

2. **Order will include:**
   - Unique order number (KYS-xxx-xxx format)
   - Customer email (if available)
   - Cart items and quantities
   - Total amount and currency
   - Payment intent ID
   - Timestamp

## 🚨 Troubleshooting

### If orders still don't appear:

1. **Check Vercel logs** for webhook errors
2. **Verify webhook endpoint** is configured in Stripe
3. **Test database connection** using `/api/test-db`
4. **Test order creation** using `/api/test-order-creation`

### Common Issues:

1. **Webhook not configured**: Make sure `payment_intent.succeeded` is enabled in Stripe
2. **Database connection**: Check `DATABASE_URL` environment variable
3. **Webhook secret**: Verify `STRIPE_WEBHOOK_SECRET` is correct

## 📝 Next Steps

1. **Test the checkout flow** with a real payment
2. **Check your database** for new orders
3. **Monitor Vercel logs** for any errors
4. **Let me know** if you see any issues!

The orders should now appear in your database when customers complete checkout. 🎉 