# Order Tracking System Setup

This document explains how to set up automatic order tracking when customers complete checkout.

## 🗄️ Database Schema

The system creates three main tables:

### 1. `orders` Table
- **order_number**: Unique order identifier (e.g., KYS-123456-ABC123)
- **email**: Customer email address
- **stripe_payment_intent_id**: Stripe payment intent ID
- **stripe_customer_id**: Stripe customer ID
- **total_amount**: Order total in decimal format
- **currency**: Currency code (default: USD)
- **status**: Order status (pending, completed, failed, cancelled)
- **metadata**: Additional order data in JSON format

### 2. `order_items` Table
- **order_id**: Reference to orders table
- **product_name**: Product name
- **product_id**: Internal product ID
- **quantity**: Item quantity
- **unit_price**: Price per unit
- **total_price**: Total price for this item
- **size**: Product size (optional)
- **color**: Product color (optional)
- **stripe_product_id**: Stripe product ID
- **stripe_price_id**: Stripe price ID
- **metadata**: Additional item data

### 3. `shipping_info` Table
- **order_id**: Reference to orders table
- **name**: Customer name
- **street**: Shipping address street
- **city**: Shipping city
- **zip**: Postal/ZIP code
- **province**: State/Province (optional)
- **country**: Country
- **phone**: Phone number (optional)

## 🚀 Setup Instructions

### 1. Environment Variables
Add these to your `.env.local` file:

```env
# Database
DATABASE_URL="your_neon_database_url"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 2. Run Database Migration
Execute the migration script to create the tables:

```bash
# Using Node.js
node -e "require('./db/migrate').migrate()"

# Or using TypeScript
npx tsx db/migrate.ts
```

### 3. Set Up Stripe Webhook
1. Go to your Stripe Dashboard
2. Navigate to Developers > Webhooks
3. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Copy the webhook secret to your environment variables

## 🔄 How It Works

### Automatic Order Creation
When a customer completes checkout:

1. **Stripe sends webhook** to `/api/webhooks/stripe`
2. **Webhook handler** processes the checkout session
3. **Order data** is extracted from Stripe session
4. **Order is saved** to database with:
   - Unique order number (KYS-timestamp-random)
   - Customer details
   - Product information
   - Shipping address
   - Payment details

### Order Number Format
Orders are assigned unique numbers like: `KYS-123456-ABC123`
- `KYS`: Brand prefix
- `123456`: Last 6 digits of timestamp
- `ABC123`: Random 6-character string

## 📊 API Endpoints

### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "email": "customer@example.com",
  "stripePaymentIntentId": "pi_...",
  "totalAmount": 99.99,
  "items": [...],
  "shipping": {...}
}
```

### Get Order by Number
```http
GET /api/orders?orderNumber=KYS-123456-ABC123
```

### Get Orders by Email
```http
GET /api/orders?email=customer@example.com
```

## 📋 Data Fields Captured

The system automatically captures all the fields you requested:

| Field | Source | Description |
|-------|--------|-------------|
| Order Number | Generated | Unique KYS-xxx-xxx format |
| Email | Stripe Session | Customer email |
| Line Item Quantity | Stripe Line Items | Product quantity |
| Price | Stripe Line Items | Unit and total prices |
| Product Name | Stripe Line Items | Product description |
| Size/Color | Stripe Metadata | Product variants |
| Shipping Name | Stripe Customer Details | Customer name |
| Shipping Street | Stripe Customer Details | Address line 1 |
| Shipping City | Stripe Customer Details | City |
| Shipping Zip | Stripe Customer Details | Postal code |
| Shipping Province | Stripe Customer Details | State/Province |
| Shipping Country | Stripe Customer Details | Country |

## 🔧 Customization

### Modify Order Number Format
Edit `generateOrderNumber()` in `app/lib/order-utils.ts`:

```typescript
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KYS-${timestamp.slice(-6)}-${random}`;
}
```

### Add Custom Fields
Extend the database schema in `db/schema.ts` and update the order creation logic.

### Custom Webhook Events
Add new event handlers in `app/api/webhooks/stripe/route.ts`:

```typescript
case 'your.custom.event':
  await handleCustomEvent(event.data.object);
  break;
```

## 🐛 Troubleshooting

### Webhook Not Receiving Events
1. Check webhook endpoint URL is correct
2. Verify webhook secret in environment variables
3. Check Stripe dashboard for webhook delivery status

### Database Connection Issues
1. Verify `DATABASE_URL` is correct
2. Check database permissions
3. Ensure tables were created successfully

### Order Not Created
1. Check webhook logs in console
2. Verify Stripe session contains required data
3. Check database constraints and foreign keys

## 📈 Monitoring

Monitor order creation through:
- Console logs in webhook handler
- Database queries to check order counts
- Stripe dashboard webhook delivery status

The system automatically logs successful order creation with the order number for easy tracking. 