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
  - Order summary sidebar with discount codes
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
  - Order summary with discount codes
  - Security badges
  - Benefits display

### 4. Discount Codes System
- **Location**: `/app/components/DiscountCode.tsx`
- **Features**:
  - Real-time discount code validation
  - Percentage and fixed amount discounts
  - Minimum order requirements
  - Usage limits and expiration dates
  - Visual feedback and savings display

### 5. API Routes
- **Payment Intent Creation**: `/app/api/create-payment-intent/route.ts`
- **Discount Validation**: `/app/api/validate-discount/route.ts`
- **Stripe Configuration**: `/app/lib/stripe.ts`
- **Discount Logic**: `/app/lib/discounts.ts`

### 6. Success Page
- **Location**: `/app/payment-success/page.tsx`
- **Features**:
  - Payment confirmation
  - Next steps information
  - Order tracking details

### 7. Admin Management
- **Location**: `/app/components/DiscountCodesManager.tsx`
- **Features**:
  - View all discount codes
  - Usage statistics and limits
  - Status tracking (Active, Expired, Used Up)
  - Code management interface

## Discount Codes

### Sample Codes for Testing
The system includes several sample discount codes for testing:

- **WELCOME10**: 10% off, minimum $50 order, max $25 discount
- **SAVE20**: 20% off, minimum $100 order, max $50 discount  
- **FREESHIP**: $10 off, minimum $75 order
- **FLASH25**: 25% off, minimum $25 order, max $100 discount (fully used)

### Discount Code Features
- **Real-time Validation**: Codes are validated instantly as users type
- **Multiple Types**: Percentage-based and fixed amount discounts
- **Usage Limits**: Set maximum usage per code
- **Minimum Orders**: Require minimum purchase amounts
- **Expiration Dates**: Automatic expiration handling
- **Visual Feedback**: Clear success/error messages
- **Savings Display**: Shows exact amount saved

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

### Discount Code Testing
1. **Valid Code**: Try `WELCOME10` with orders over $50
2. **Invalid Code**: Try any random code
3. **Expired Code**: Try `FLASH25` (fully used)
4. **Minimum Order**: Try `SAVE20` with orders under $100

## Security Features

- **PCI DSS Compliance**: All payment data is handled by Stripe
- **SSL Encryption**: 256-bit encryption for all transactions
- **Tokenization**: Card data is never stored on your servers
- **Fraud Protection**: Stripe's built-in fraud detection
- **Discount Validation**: Server-side validation prevents abuse

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

### Discount Codes
To customize discount codes:

1. Edit the `sampleDiscountCodes` array in `/app/lib/discounts.ts`
2. Add new validation rules in the `validateDiscountCode` function
3. Modify the discount calculation logic in `calculateDiscount`
4. Update the admin interface in `DiscountCodesManager.tsx`

## Production Deployment

Before going live:

1. **Switch to Live Mode**: Update your Stripe keys to live keys
2. **Webhook Setup**: Configure webhooks for payment events
3. **Domain Verification**: Add your domain to Stripe's allowed list
4. **SSL Certificate**: Ensure your site has a valid SSL certificate
5. **Testing**: Thoroughly test all payment flows and discount codes
6. **Database Integration**: Replace sample discount codes with database storage

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

4. **Discount Code Not Working**
   - Check the discount code validation logic
   - Verify minimum order requirements
   - Check if the code has expired or reached usage limit

5. **3D Secure Issues**
   - Test with the 3D Secure test card
   - Ensure your domain is properly configured

### Support

For Stripe-specific issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

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
6. **Database Integration**: Store discount codes in your database
7. **Advanced Discount Rules**: Product-specific, user-specific, or time-based discounts
8. **Bulk Code Generation**: Create multiple codes for campaigns
9. **Usage Analytics**: Track which codes are most effective
10. **A/B Testing**: Test different discount strategies 