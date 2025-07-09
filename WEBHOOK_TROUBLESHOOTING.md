# Webhook Signature Verification Troubleshooting

## 🔍 **Current Issue: "Webhook signature verification failed"**

This error occurs when the webhook secret in your environment variables doesn't match the one in your Stripe dashboard.

## 🛠️ **Step-by-Step Fix**

### **1. Get the Correct Webhook Secret**

1. **Go to Stripe Dashboard**
   - Navigate to **Developers > Webhooks**
   - Find your webhook endpoint: `https://www.klys.store/api/webhooks/stripe`

2. **Copy the Webhook Secret**
   - Click on your webhook endpoint
   - Click **"Reveal"** next to "Signing secret"
   - Copy the secret (starts with `whsec_`)

### **2. Update Your Environment Variables**

Add or update in your `.env.local` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
```

### **3. Test with Debug Endpoint**

1. **Temporarily change your webhook URL** in Stripe Dashboard to:
   ```
   https://www.klys.store/api/webhooks/stripe/debug
   ```

2. **Trigger a test event** in Stripe Dashboard:
   - Go to your webhook endpoint
   - Click **"Send test webhook"**
   - Select **"checkout.session.completed"**

3. **Check the response** - it will show detailed debug info

### **4. Verify Environment Variables**

Make sure your environment variables are properly loaded:

```bash
# Check if the secret is loaded (don't log the actual secret)
echo "Webhook secret length: ${#STRIPE_WEBHOOK_SECRET}"
```

### **5. Common Issues & Solutions**

#### **Issue: Secret not loading**
- **Solution**: Restart your development server after adding environment variables
- **Command**: `npm run dev` or `pnpm dev`

#### **Issue: Wrong secret copied**
- **Solution**: Double-check you copied the entire secret (including `whsec_` prefix)
- **Note**: Webhook secrets are different from API keys

#### **Issue: Multiple webhooks**
- **Solution**: Make sure you're using the secret from the correct webhook endpoint

#### **Issue: Environment variable name mismatch**
- **Solution**: Ensure the variable is named exactly `STRIPE_WEBHOOK_SECRET`

## 🔧 **Debug Steps**

### **Step 1: Test Debug Endpoint**
```bash
curl -X POST https://www.klys.store/api/webhooks/stripe/debug \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### **Step 2: Check Environment Variables**
```bash
# In your terminal, check if the variable is set
echo $STRIPE_WEBHOOK_SECRET
```

### **Step 3: Verify Webhook Configuration**
1. **Stripe Dashboard > Developers > Webhooks**
2. **Check endpoint URL**: `https://www.klys.store/api/webhooks/stripe`
3. **Check events**: `checkout.session.completed`, `payment_intent.succeeded`
4. **Check signing secret**: Should start with `whsec_`

## 📋 **Complete Setup Checklist**

- [ ] Webhook endpoint URL is correct
- [ ] Webhook secret is copied from Stripe Dashboard
- [ ] Environment variable `STRIPE_WEBHOOK_SECRET` is set
- [ ] Development server restarted after adding environment variables
- [ ] Test webhook sent from Stripe Dashboard
- [ ] Debug endpoint shows successful verification

## 🚨 **Security Notes**

- **Never commit** your webhook secret to version control
- **Use different secrets** for development and production
- **Rotate secrets** if they're ever exposed
- **Don't log** the actual secret value

## 🔄 **After Fixing**

1. **Change webhook URL back** to: `https://www.klys.store/api/webhooks/stripe`
2. **Test with a real checkout** to ensure orders are saved
3. **Monitor webhook delivery** in Stripe Dashboard
4. **Check your database** for new orders

## 📞 **Still Having Issues?**

If the debug endpoint shows the secret is set but verification still fails:

1. **Double-check the secret** - copy it again from Stripe
2. **Check for extra spaces** - ensure no leading/trailing whitespace
3. **Verify the webhook endpoint** - make sure it's the correct one
4. **Try creating a new webhook** - sometimes this helps

The debug endpoint will show you exactly what's happening and help identify the issue! 