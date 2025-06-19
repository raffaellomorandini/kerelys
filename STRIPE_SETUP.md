# Stripe Checkout Setup Guide

This guide will help you set up the Stripe checkout integration for your Kerelys e-commerce application.

## Prerequisites

1. A Stripe account (sign up at [stripe.com](https://stripe.com))
2. Node.js and pnpm installed
3. Your Kerelys project set up

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Stripe Configuration
# Get these keys from your Stripe Dashboard: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Database Configuration (if using existing setup)
DATABASE_URL=your_database_url_here

# Other Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## Getting Your Stripe Keys

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Make sure you're in **Test mode** (toggle in the top right)
3. Copy your **Publishable key** and **Secret key**
4. Replace the placeholder values in your `.env.local` file

## Features Implemented

### 1. Custom Checkout Form
- **Location**: `/app/checkout/page.tsx`
- **Features**:
  - Stripe Elements integration
  - Custom styling matching your brand
  - Order summary sidebar with promotion codes
  - Responsive design

### 2. Payment Method Selection
- **Location**: `/app/components/PaymentMethods.tsx`
- **Supported Methods**:
  - Credit/Debit Cards (Visa, Mastercard, American Express, Discover)
  - Apple Pay
  - Google Pay
  - PayPal

### 3. Pre-Checkout Modal
- **Location**: `/app/components/PreCheckout.tsx`
- **Features**:
  - Payment method preview
  - Order summary with promotion codes
  - Security badges
  - Benefits display

### 4. Stripe Native Promotion Codes
- **Location**: `/app/components/DiscountCode.tsx`
- **Features**:
  - Real-time promotion code validation using Stripe's API
  - Percentage and fixed amount discounts
  - Minimum order requirements (handled by Stripe)
  - Usage limits and expiration dates (managed by Stripe)
  - Visual feedback and promotion display

### 5. API Routes
- **Payment Intent Creation**: `/app/api/create-payment-intent/route.ts`
- **Promotion Code Validation**: `/app/api/validate-discount/route.ts`
- **Sample Promotions Creation**: `/app/api/admin/create-sample-promotions/route.ts`
- **Stripe Configuration**: `/app/lib/stripe.ts`

### 6. Success Page
- **Location**: `/app/payment-success/page.tsx`
- **Features**:
  - Payment confirmation
  - Next steps information
  - Order tracking details

### 7. Admin Management
- **Location**: `/app/components/DiscountCodesManager.tsx`
- **Features**:
  - View all promotion codes
  - Usage statistics and limits
  - Status tracking (Active, Expired, Used Up)
  - Code management interface

## Setting Up Promotion Codes

### Option 1: Create Sample Codes (Recommended for Testing)

1. **Start your development server**: `pnpm dev`
2. **Create sample promotion codes**: Make a POST request to `/api/admin/create-sample-promotions`
3. **Test the codes** in your checkout

### Option 2: Create Codes Manually in Stripe Dashboard

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/coupons)
2. Create coupons with your desired settings
3. Create promotion codes linked to those coupons
4. Use the promotion codes in your checkout

### Sample Promotion Codes

After running the sample creation API, you'll have these codes:

- **WELCOME10**: 10% off, minimum $50 order
- **SAVE20**: 20% off, minimum $100 order  
- **FREESHIP**: $10 off, minimum $75 order
- **FLASH25**: 25% off, minimum $25 order

## Testing the Integration

### Test Card Numbers
Use these test card numbers in Stripe test mode:

- **Visa**: `4242424242424242`
- **Mastercard**: `5555555555554444`
- **American Express**: `378282246310005`
- **Declined Card**: `4000000000000002`

### Test Scenarios
1. **Successful Payment**: Use any valid test card
2. **Declined Payment**: Use `4000000000000002`
3. **3D Secure**: Use `4000002500003155`
4. **Insufficient Funds**: Use `4000000000009995`

### Promotion Code Testing
1. **Valid Code**: Try `WELCOME10` with orders over $50
2. **Invalid Code**: Try any random code
3. **Minimum Order**: Try `SAVE20` with orders under $100
4. **Usage Limits**: Try codes multiple times to test limits

## Advantages of Stripe Native Promotion Codes

### ✅ **Built-in Features**
- **Automatic Validation**: Stripe handles all validation logic
- **Usage Tracking**: Automatic redemption counting
- **Expiration Management**: Built-in expiration handling
- **Minimum Order Requirements**: Native support for order minimums
- **Analytics**: Built-in reporting and analytics

### ✅ **Security & Reliability**
- **Fraud Protection**: Stripe's built-in fraud detection
- **Rate Limiting**: Automatic protection against abuse
- **Audit Trail**: Complete history of all redemptions
- **PCI Compliance**: All data handled by Stripe

### ✅ **Easy Management**
- **Dashboard Management**: Create and manage codes in Stripe Dashboard
- **API Integration**: Full programmatic access
- **Bulk Operations**: Create multiple codes at once
- **Real-time Updates**: Changes reflect immediately

## Security Features

- **PCI DSS Compliance**: All payment data is handled by Stripe
- **SSL Encryption**: 256-bit encryption for all transactions
- **Tokenization**: Card data is never stored on your servers
- **Fraud Protection**: Stripe's built-in fraud detection
- **Promotion Code Security**: Server-side validation prevents abuse

## Customization

### Styling
The checkout form uses your brand colors (`#8B4513` and `#A0522D`). You can customize the appearance by modifying:

1. **Stripe Elements Theme**: Update the `appearance` object in `/app/checkout/page.tsx`
2. **Component Styling**: Modify Tailwind classes in the component files
3. **Color Scheme**: Update the color variables in the Stripe configuration

### Payment Methods
To add or remove payment methods:

1. Edit the `paymentMethods` array in `/app/components/PaymentMethods.tsx`
2. Update the `paymentMethodOrder` in the Stripe Elements configuration
3. Modify the payment intent creation to include/exclude specific methods

### Promotion Codes
To customize promotion codes:

1. **Via Stripe Dashboard**: Create coupons and promotion codes directly
2. **Via API**: Use the Stripe API to create codes programmatically
3. **Via Admin Interface**: Use the provided admin components
4. **Custom Validation**: Add additional validation logic in `/app/lib/stripe.ts`

## Production Deployment

Before going live:

1. **Switch to Live Mode**: Update your Stripe keys to live keys
2. **Webhook Setup**: Configure webhooks for payment events
3. **Domain Verification**: Add your domain to Stripe's allowed list
4. **SSL Certificate**: Ensure your site has a valid SSL certificate
5. **Testing**: Thoroughly test all payment flows and promotion codes
6. **Promotion Code Setup**: Create your production promotion codes in Stripe

## Troubleshooting

### Common Issues

1. **"Invalid API Key" Error**
   - Check that your Stripe keys are correct
   - Ensure you're using test keys for development

2. **Payment Element Not Loading**
   - Verify your publishable key is set correctly
   - Check browser console for JavaScript errors

3. **Payment Intent Creation Fails**
   - Check your secret key configuration
   - Verify the API route is accessible

4. **Promotion Code Not Working**
   - Check if the code exists in your Stripe account
   - Verify minimum order requirements
   - Check if the code has expired or reached usage limit
   - Ensure the code is active in Stripe Dashboard

5. **3D Secure Issues**
   - Test with the 3D Secure test card
   - Ensure your domain is properly configured

### Support

For Stripe-specific issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Promotion Codes Guide](https://stripe.com/docs/billing/subscriptions/discounts)

For application-specific issues, check:
- Browser console for errors
- Network tab for API call failures
- Environment variable configuration

## Next Steps

After setup, consider implementing:

1. **Webhook Handling**: Process payment events server-side
2. **Order Management**: Store order details in your database
3. **Email Notifications**: Send order confirmations
4. **Inventory Management**: Update stock levels after purchase
5. **Analytics**: Track payment success rates and conversion
6. **Advanced Promotion Rules**: Product-specific, user-specific, or time-based discounts
7. **Bulk Code Generation**: Create multiple codes for campaigns
8. **Usage Analytics**: Track which codes are most effective
9. **A/B Testing**: Test different discount strategies
10. **Customer Segmentation**: Target specific customer groups with promotions 