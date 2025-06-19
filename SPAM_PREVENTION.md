# Newsletter Spam Prevention System

This document outlines the comprehensive spam prevention measures implemented for the Kerelys newsletter signup system.

## Features Implemented

### 1. Rate Limiting
- **5 attempts per hour** per IP address for newsletter signups
- Automatic IP blocking for 24 hours when limit exceeded
- Configurable limits in `app/lib/spam-prevention.ts`

### 2. IP Address Blocking
- Automatic blocking of IPs that exceed rate limits
- Manual blocking capability for suspicious IPs
- Temporary and permanent blocking options
- Automatic cleanup of expired blocks

### 3. Email Validation
- Basic email format validation
- Detection of common spam patterns:
  - Very short local parts with numbers (`a1@`, `test123@`)
  - Common spam prefixes (`admin@`, `info@`, `support@`, etc.)
  - Bot-related prefixes (`bot@`, `robot@`, `automated@`)
- Blocking of disposable email domains (50+ domains)

### 4. Honeypot Protection
- Hidden form field that bots fill out but humans don't see
- Automatic rejection of submissions with filled honeypot fields
- CSS-based hiding with `position: absolute` and `left: -9999px`

### 5. Request Metadata Tracking
- IP address logging for all submissions
- User agent string tracking
- Source tracking (footer, popup, landing page, etc.)
- Timestamp tracking for analysis

### 6. Database Schema Enhancements
- Enhanced `email` table with metadata fields
- New `rate_limit` table for tracking submission attempts
- New `blocked_ip` table for IP blocking management
- Proper indexing for performance

## Database Tables

### Email Table
```sql
CREATE TABLE email (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  source VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  verified_at TIMESTAMP
);
```

### Rate Limit Table
```sql
CREATE TABLE rate_limit (
  id SERIAL PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  action VARCHAR(50) NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  first_attempt TIMESTAMP NOT NULL DEFAULT NOW(),
  last_attempt TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Blocked IP Table
```sql
CREATE TABLE blocked_ip (
  id SERIAL PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL UNIQUE,
  reason TEXT,
  blocked_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

## Usage

### Frontend Implementation
The newsletter form includes:
- Hidden honeypot field
- Loading states
- Better error messages
- Form validation

```tsx
<form onSubmit={handleSubmit}>
  {/* Hidden honeypot field */}
  <input 
    type="text" 
    name="website" 
    className="absolute left-[-9999px] opacity-0 pointer-events-none"
    tabIndex={-1}
    autoComplete="off"
  />
  
  <input 
    type="email" 
    name="email" 
    required 
    disabled={isSubmitting}
  />
  
  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Joining...' : 'Join'}
  </button>
</form>
```

### Backend Implementation
The `addEmail` action now includes comprehensive spam checks:

```typescript
export async function addEmail(
  email: string, 
  honeypot?: string,
  source?: string
): Promise<{ success: boolean, error?: string }> {
  // Get client IP and user agent
  const headersList = await headers();
  const ipAddress = SpamPrevention.getClientIp(headersList);
  
  // Perform spam checks
  const spamCheck = await SpamPrevention.checkNewsletterSubmission({
    email: email.trim().toLowerCase(),
    ipAddress,
    userAgent: headersList.get('user-agent'),
    source: source || 'footer',
    honeypot,
  });
  
  if (spamCheck.isBlocked) {
    return { success: false, error: spamCheck.reason };
  }
  
  // Insert email if checks pass
  await db.insert(emailTable).values({...});
}
```

## Configuration

### Rate Limiting
Configure limits in `app/lib/spam-prevention.ts`:

```typescript
const RATE_LIMITS = {
  newsletter_signup: {
    maxAttempts: 5,           // Max attempts per window
    windowMinutes: 60,        // Time window in minutes
    blockDurationMinutes: 1440, // Block duration in minutes
  },
};
```

### Email Patterns
Add new spam patterns or disposable domains:

```typescript
const EMAIL_PATTERNS = {
  spamPatterns: [
    /^newspam@/i,  // Add new patterns here
  ],
  disposableDomains: [
    'newdisposable.com',  // Add new domains here
  ],
};
```

## Admin Tools

### Migration
Run database migration to create new tables:

```bash
npm run migrate
```

### Admin Utilities
Use `AdminUtils` class for managing spam prevention:

```typescript
// Get spam statistics
const stats = await AdminUtils.getSpamStats();

// Get blocked IPs
const blockedIPs = await AdminUtils.getBlockedIPs();

// Unblock an IP
await AdminUtils.unblockIP('192.168.1.1');

// Get suspicious activity
const suspicious = await AdminUtils.getSuspiciousActivity();

// Clean up expired blocks
const cleaned = await AdminUtils.cleanupExpiredBlocks();
```

## Monitoring and Maintenance

### Regular Tasks
1. **Clean up expired blocks** - Run `AdminUtils.cleanupExpiredBlocks()` daily
2. **Monitor suspicious activity** - Check `AdminUtils.getSuspiciousActivity()` regularly
3. **Review blocked IPs** - Periodically review and unblock legitimate users

### Performance Considerations
- Rate limiting queries are indexed for fast lookups
- Expired blocks are automatically cleaned up
- IP address storage uses efficient VARCHAR(45) for IPv6 support

### Security Best Practices
- Honeypot fields are completely hidden from users
- Rate limiting prevents brute force attacks
- Email validation catches common spam patterns
- IP blocking provides additional protection layer

## Error Handling

The system provides clear error messages for different scenarios:

- **Rate limit exceeded**: "Too many attempts. Please try again later."
- **Invalid email**: "Invalid email format"
- **Disposable email**: "Disposable email addresses are not allowed"
- **Bot detected**: "Bot detected" (honeypot filled)
- **IP blocked**: "IP address is blocked"
- **Duplicate email**: "Email already subscribed"

## Future Enhancements

Potential improvements to consider:

1. **reCAPTCHA integration** for additional bot protection
2. **Email verification** system with confirmation links
3. **Machine learning** based spam detection
4. **Geolocation blocking** for specific regions
5. **Real-time monitoring dashboard** for admin users
6. **Webhook notifications** for suspicious activity

## Testing

To test the spam prevention system:

1. **Rate limiting**: Submit multiple emails from the same IP
2. **Honeypot**: Fill out the hidden website field
3. **Email validation**: Try disposable email domains
4. **IP blocking**: Exceed rate limits to trigger blocking

The system is designed to be robust while maintaining a good user experience for legitimate subscribers. 