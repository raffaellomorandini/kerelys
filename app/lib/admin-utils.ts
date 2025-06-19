import { db } from "@/db";
import { rateLimitTable, blockedIpTable, emailTable } from "@/db/schema";
import { eq, and, gt, lt, desc, sql, or, isNull, isNotNull } from "drizzle-orm";

export interface SpamStats {
  totalSubmissions: number;
  blockedSubmissions: number;
  uniqueIPs: number;
  blockedIPs: number;
  recentActivity: {
    date: string;
    submissions: number;
    blocked: number;
  }[];
}

export interface BlockedIP {
  id: number;
  ipAddress: string;
  reason: string | null;
  blockedAt: Date;
  expiresAt: Date | null;
}

export interface RateLimitData {
  id: number;
  ipAddress: string;
  action: string;
  count: number;
  firstAttempt: Date;
  lastAttempt: Date;
}

export class AdminUtils {
  /**
   * Get spam prevention statistics
   */
  static async getSpamStats(): Promise<SpamStats> {
    // Get total submissions
    const totalSubmissions = await db
      .select({ count: sql<number>`count(*)` })
      .from(emailTable);

    // Get blocked IPs count
    const blockedIPs = await db
      .select({ count: sql<number>`count(*)` })
      .from(blockedIpTable)
      .where(
        or(
          isNull(blockedIpTable.expiresAt),
          gt(blockedIpTable.expiresAt, new Date())
        )
      );

    // Get unique IPs
    const uniqueIPs = await db
      .select({ count: sql<number>`count(distinct ip_address)` })
      .from(emailTable)
      .where(sql`ip_address != 'unknown'`);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSubmissions = await db
      .select({ count: sql<number>`count(*)` })
      .from(emailTable)
      .where(gt(emailTable.createdAt, sevenDaysAgo));

    // Get recent blocks
    const recentBlocks = await db
      .select({ count: sql<number>`count(*)` })
      .from(blockedIpTable)
      .where(gt(blockedIpTable.blockedAt, sevenDaysAgo));

    return {
      totalSubmissions: totalSubmissions[0]?.count || 0,
      blockedSubmissions: 0, // This would need to be tracked separately
      uniqueIPs: uniqueIPs[0]?.count || 0,
      blockedIPs: blockedIPs[0]?.count || 0,
      recentActivity: [
        {
          date: new Date().toISOString().split('T')[0],
          submissions: recentSubmissions[0]?.count || 0,
          blocked: recentBlocks[0]?.count || 0,
        }
      ]
    };
  }

  /**
   * Get all blocked IPs
   */
  static async getBlockedIPs(): Promise<BlockedIP[]> {
    return await db
      .select({
        id: blockedIpTable.id,
        ipAddress: blockedIpTable.ipAddress,
        reason: blockedIpTable.reason,
        blockedAt: blockedIpTable.blockedAt,
        expiresAt: blockedIpTable.expiresAt,
      })
      .from(blockedIpTable)
      .orderBy(desc(blockedIpTable.blockedAt));
  }

  /**
   * Unblock an IP address
   */
  static async unblockIP(ipAddress: string): Promise<void> {
    await db
      .delete(blockedIpTable)
      .where(eq(blockedIpTable.ipAddress, ipAddress));
  }

  /**
   * Get rate limiting data
   */
  static async getRateLimitData(): Promise<RateLimitData[]> {
    return await db
      .select({
        id: rateLimitTable.id,
        ipAddress: rateLimitTable.ipAddress,
        action: rateLimitTable.action,
        count: rateLimitTable.count,
        firstAttempt: rateLimitTable.firstAttempt,
        lastAttempt: rateLimitTable.lastAttempt,
      })
      .from(rateLimitTable)
      .orderBy(desc(rateLimitTable.lastAttempt));
  }

  /**
   * Clear rate limiting data for an IP
   */
  static async clearRateLimit(ipAddress: string, action?: string): Promise<void> {
    if (action) {
      await db
        .delete(rateLimitTable)
        .where(
          and(
            eq(rateLimitTable.ipAddress, ipAddress),
            eq(rateLimitTable.action, action)
          )
        );
    } else {
      await db
        .delete(rateLimitTable)
        .where(eq(rateLimitTable.ipAddress, ipAddress));
    }
  }

  /**
   * Get suspicious activity (high submission rates)
   */
  static async getSuspiciousActivity(): Promise<RateLimitData[]> {
    return await db
      .select({
        id: rateLimitTable.id,
        ipAddress: rateLimitTable.ipAddress,
        action: rateLimitTable.action,
        count: rateLimitTable.count,
        firstAttempt: rateLimitTable.firstAttempt,
        lastAttempt: rateLimitTable.lastAttempt,
      })
      .from(rateLimitTable)
      .where(gt(rateLimitTable.count, 3)) // More than 3 attempts
      .orderBy(desc(rateLimitTable.count));
  }

  /**
   * Clean up expired blocks
   */
  static async cleanupExpiredBlocks(): Promise<number> {
    const result = await db
      .delete(blockedIpTable)
      .where(
        and(
          isNotNull(blockedIpTable.expiresAt),
          lt(blockedIpTable.expiresAt, new Date())
        )
      );
    
    return result.rowCount || 0;
  }
} 