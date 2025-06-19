import { db } from "@/db";
import { rateLimitTable, blockedIpTable, emailTable } from "@/db/schema";
import { eq, and, gt, lt, or, isNull } from "drizzle-orm";

export interface SpamCheckResult {
  isBlocked: boolean;
  reason?: string;
  retryAfter?: number;
}

export interface NewsletterSubmission {
  email: string;
  ipAddress: string;
  userAgent?: string;
  source?: string;
  honeypot?: string;
  recaptchaToken?: string;
}

// Rate limiting configuration
const RATE_LIMITS = {
  newsletter_signup: {
    maxAttempts: 5,
    windowMinutes: 60, // 5 attempts per hour
    blockDurationMinutes: 1440, // 24 hours
  },
};

// Email validation patterns
const EMAIL_PATTERNS = {
  // Common spam patterns
  spamPatterns: [
    /^[a-z]{1,3}\d{1,3}@/i, // Very short local part with numbers
    /^test\d*@/i, // Test emails
    /^admin\d*@/i, // Admin emails
    /^info\d*@/i, // Info emails
    /^support\d*@/i, // Support emails
    /^noreply\d*@/i, // No reply emails
    /^mail\d*@/i, // Mail emails
    /^user\d*@/i, // User emails
    /^demo\d*@/i, // Demo emails
    /^temp\d*@/i, // Temp emails
    /^fake\d*@/i, // Fake emails
    /^spam\d*@/i, // Spam emails
    /^bot\d*@/i, // Bot emails
    /^robot\d*@/i, // Robot emails
    /^automated\d*@/i, // Automated emails
  ],
  // Disposable email domains (partial list)
  disposableDomains: [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com',
    'yopmail.com',
    'throwaway.email',
    'temp-mail.org',
    'sharklasers.com',
    'getairmail.com',
    'mailnesia.com',
    'maildrop.cc',
    'mailmetrash.com',
    'trashmail.com',
    'mailnull.com',
    'spam4.me',
    'bccto.me',
    'chacuo.net',
    'dispostable.com',
    'fakeinbox.com',
    'fakeinbox.net',
    'fakemailgenerator.com',
    'mailinator.net',
    'mailnesia.com',
    'mintemail.com',
    'mytrashmail.com',
    'nwldx.com',
    'sharklasers.com',
    'spamspot.com',
    'spam.la',
    'tempr.email',
    'tmpeml.com',
    'tmpmail.net',
    'tmpmail.org',
    'temporary-mail.net',
    'temporarymail.net',
    'temporarymail.org',
    'temporarymailaddress.com',
    'temporarymailbox.com',
    'temporarymailbox.net',
    'temporarymailbox.org',
    'temporarymailboxaddress.com',
    'temporarymailboxaddress.net',
    'temporarymailboxaddress.org',
  ],
};

export class SpamPrevention {
  /**
   * Check if an IP is blocked
   */
  static async isIpBlocked(ipAddress: string): Promise<SpamCheckResult> {
    const blocked = await db
      .select()
      .from(blockedIpTable)
      .where(
        and(
          eq(blockedIpTable.ipAddress, ipAddress),
          or(
            isNull(blockedIpTable.expiresAt),
            gt(blockedIpTable.expiresAt, new Date())
          )
        )
      )
      .limit(1);

    if (blocked.length > 0) {
      return {
        isBlocked: true,
        reason: blocked[0].reason || 'IP address is blocked',
      };
    }

    return { isBlocked: false };
  }

  /**
   * Check rate limiting for an action
   */
  static async checkRateLimit(
    ipAddress: string,
    action: keyof typeof RATE_LIMITS
  ): Promise<SpamCheckResult> {
    const config = RATE_LIMITS[action];
    const windowStart = new Date(Date.now() - config.windowMinutes * 60 * 1000);

    // Get current rate limit record
    const rateLimit = await db
      .select()
      .from(rateLimitTable)
      .where(
        and(
          eq(rateLimitTable.ipAddress, ipAddress),
          eq(rateLimitTable.action, action)
        )
      )
      .limit(1);

    if (rateLimit.length === 0) {
      // First attempt
      await db.insert(rateLimitTable).values({
        ipAddress,
        action,
        count: 1,
        firstAttempt: new Date(),
        lastAttempt: new Date(),
      });
      return { isBlocked: false };
    }

    const record = rateLimit[0];

    // Check if within time window
    if (record.firstAttempt < windowStart) {
      // Reset counter if outside window
      await db
        .update(rateLimitTable)
        .set({
          count: 1,
          firstAttempt: new Date(),
          lastAttempt: new Date(),
        })
        .where(eq(rateLimitTable.id, record.id));
      return { isBlocked: false };
    }

    // Check if limit exceeded
    if (record.count >= config.maxAttempts) {
      const retryAfter = Math.ceil(
        (record.firstAttempt.getTime() + config.windowMinutes * 60 * 1000 - Date.now()) / 1000
      );

      // Block IP if limit exceeded
      if (retryAfter > 0) {
        await this.blockIp(ipAddress, `Rate limit exceeded for ${action}`);
        return {
          isBlocked: true,
          reason: `Too many attempts. Please try again later.`,
          retryAfter,
        };
      }
    }

    // Update counter
    await db
      .update(rateLimitTable)
      .set({
        count: record.count + 1,
        lastAttempt: new Date(),
      })
      .where(eq(rateLimitTable.id, record.id));

    return { isBlocked: false };
  }

  /**
   * Block an IP address
   */
  static async blockIp(ipAddress: string, reason: string, durationMinutes?: number): Promise<void> {
    const expiresAt = durationMinutes 
      ? new Date(Date.now() + durationMinutes * 60 * 1000)
      : null;

    await db.insert(blockedIpTable).values({
      ipAddress,
      reason,
      expiresAt,
    }).onConflictDoNothing();
  }

  /**
   * Validate email format and check for spam patterns
   */
  static validateEmail(email: string): SpamCheckResult {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        isBlocked: true,
        reason: 'Invalid email format',
      };
    }

    // Check for spam patterns
    for (const pattern of EMAIL_PATTERNS.spamPatterns) {
      if (pattern.test(email)) {
        return {
          isBlocked: true,
          reason: 'Email pattern indicates spam',
        };
      }
    }

    // Check for disposable domains
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && EMAIL_PATTERNS.disposableDomains.includes(domain)) {
      return {
        isBlocked: true,
        reason: 'Disposable email addresses are not allowed',
      };
    }

    return { isBlocked: false };
  }

  /**
   * Check honeypot field
   */
  static checkHoneypot(honeypot?: string): SpamCheckResult {
    if (honeypot && honeypot.trim() !== '') {
      return {
        isBlocked: true,
        reason: 'Bot detected',
      };
    }
    return { isBlocked: false };
  }

  /**
   * Comprehensive spam check for newsletter submissions
   */
  static async checkNewsletterSubmission(
    submission: NewsletterSubmission
  ): Promise<SpamCheckResult> {
    // Check honeypot
    const honeypotCheck = this.checkHoneypot(submission.honeypot);
    if (honeypotCheck.isBlocked) {
      return honeypotCheck;
    }

    // Check if IP is blocked
    const ipBlockCheck = await this.isIpBlocked(submission.ipAddress);
    if (ipBlockCheck.isBlocked) {
      return ipBlockCheck;
    }

    // Check rate limiting
    const rateLimitCheck = await this.checkRateLimit(submission.ipAddress, 'newsletter_signup');
    if (rateLimitCheck.isBlocked) {
      return rateLimitCheck;
    }

    // Validate email
    const emailCheck = this.validateEmail(submission.email);
    if (emailCheck.isBlocked) {
      return emailCheck;
    }

    // Check for duplicate email (already handled by database unique constraint)
    // but we can add additional logic here if needed

    return { isBlocked: false };
  }

  /**
   * Get client IP address from request headers
   */
  static getClientIp(headers: Headers): string {
    // Check for forwarded headers (common with proxies)
    const forwarded = headers.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }

    const realIp = headers.get('x-real-ip');
    if (realIp) {
      return realIp;
    }

    // Fallback to connection remote address
    return 'unknown';
  }
} 