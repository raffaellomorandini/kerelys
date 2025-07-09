import { integer, pgTable, timestamp, varchar, text, boolean, index, decimal, json } from "drizzle-orm/pg-core";

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

// Orders table
export const ordersTable = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderNumber: varchar({ length: 50 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull(),
  stripePaymentIntentId: varchar({ length: 255 }),
  stripeCustomerId: varchar({ length: 255 }),
  totalAmount: decimal({ precision: 10, scale: 2 }).notNull(),
  currency: varchar({ length: 3 }).notNull().default('USD'),
  status: varchar({ length: 20 }).notNull().default('pending'), // pending, completed, failed, cancelled
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  metadata: json(), // Additional order metadata
}, (table) => ({
  orderNumberIdx: index("order_number_idx").on(table.orderNumber),
  emailIdx: index("email_idx").on(table.email),
  stripePaymentIntentIdx: index("stripe_payment_intent_idx").on(table.stripePaymentIntentId),
}));

// Order items table
export const orderItemsTable = pgTable("order_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer().notNull().references(() => ordersTable.id),
  productName: varchar({ length: 255 }).notNull(),
  productId: varchar({ length: 100 }),
  quantity: integer().notNull(),
  unitPrice: decimal({ precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal({ precision: 10, scale: 2 }).notNull(),
  size: varchar({ length: 50 }),
  color: varchar({ length: 50 }),
  stripeProductId: varchar({ length: 255 }),
  stripePriceId: varchar({ length: 255 }),
  metadata: json(), // Additional product metadata
}, (table) => ({
  orderIdIdx: index("order_id_idx").on(table.orderId),
  productIdIdx: index("product_id_idx").on(table.productId),
}));

// Shipping information table
export const shippingInfoTable = pgTable("shipping_info", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer().notNull().references(() => ordersTable.id),
  name: varchar({ length: 255 }).notNull(),
  street: varchar({ length: 500 }).notNull(),
  city: varchar({ length: 100 }).notNull(),
  zip: varchar({ length: 20 }).notNull(),
  province: varchar({ length: 100 }),
  country: varchar({ length: 100 }).notNull(),
  phone: varchar({ length: 20 }),
  createdAt: timestamp().notNull().defaultNow(),
}, (table) => ({
  orderIdIdx: index("shipping_order_id_idx").on(table.orderId),
}));
