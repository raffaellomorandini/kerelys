import { integer, pgTable, timestamp, varchar, text, boolean, index } from "drizzle-orm/pg-core";

export const emailTable = pgTable("email", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp().notNull().defaultNow(),
  ipAddress: varchar({ length: 45 }), // IPv4 or IPv6
  userAgent: text(),
  source: varchar({ length: 100 }), // e.g., "footer", "popup", "landing_page"
  isVerified: boolean().default(false),
  verificationToken: varchar({ length: 255 }),
  verifiedAt: timestamp(),
});

// Rate limiting table
export const rateLimitTable = pgTable("rate_limit", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  ipAddress: varchar({ length: 45 }).notNull(),
  action: varchar({ length: 50 }).notNull(), // "newsletter_signup", "contact_form"
  count: integer().notNull().default(1),
  firstAttempt: timestamp().notNull().defaultNow(),
  lastAttempt: timestamp().notNull().defaultNow(),
}, (table) => ({
  ipActionIdx: index("ip_action_idx").on(table.ipAddress, table.action),
}));

// Blocked IPs table
export const blockedIpTable = pgTable("blocked_ip", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  ipAddress: varchar({ length: 45 }).notNull().unique(),
  reason: text(),
  blockedAt: timestamp().notNull().defaultNow(),
  expiresAt: timestamp(), // null for permanent blocks
});
