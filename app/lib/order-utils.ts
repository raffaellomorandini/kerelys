import { db } from "../../db";
import { ordersTable, orderItemsTable, shippingInfoTable } from "../../db/schema";
import { eq } from "drizzle-orm";

// Generate a unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KYS-${timestamp.slice(-6)}-${random}`;
}

// Interface for order creation
export interface OrderData {
  email: string;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  totalAmount: number;
  currency?: string;
  items: Array<{
    productName: string;
    productId?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    size?: string;
    color?: string;
    stripeProductId?: string;
    stripePriceId?: string;
    metadata?: any;
  }>;
  shipping: {
    name: string;
    street: string;
    city: string;
    zip: string;
    province?: string;
    country: string;
    phone?: string;
  };
  metadata?: any;
}

// Create a new order in the database
export async function createOrder(orderData: OrderData) {
  try {
    // Generate unique order number
    const orderNumber = generateOrderNumber();
    
    // Create the order
    const [order] = await db.insert(ordersTable).values({
      orderNumber,
      email: orderData.email,
      stripePaymentIntentId: orderData.stripePaymentIntentId,
      stripeCustomerId: orderData.stripeCustomerId,
      totalAmount: orderData.totalAmount.toString(),
      currency: orderData.currency || 'USD',
      status: 'completed',
      metadata: orderData.metadata,
    }).returning();

    // Create order items
    const orderItems = await Promise.all(
      orderData.items.map(item =>
        db.insert(orderItemsTable).values({
          orderId: order.id,
          productName: item.productName,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          totalPrice: item.totalPrice.toString(),
          size: item.size,
          color: item.color,
          stripeProductId: item.stripeProductId,
          stripePriceId: item.stripePriceId,
          metadata: item.metadata,
        }).returning()
      )
    );

    // Create shipping information
    const [shippingInfo] = await db.insert(shippingInfoTable).values({
      orderId: order.id,
      name: orderData.shipping.name,
      street: orderData.shipping.street,
      city: orderData.shipping.city,
      zip: orderData.shipping.zip,
      province: orderData.shipping.province,
      country: orderData.shipping.country,
      phone: orderData.shipping.phone,
    }).returning();

    return {
      success: true,
      order: {
        ...order,
        items: orderItems.flat(),
        shipping: shippingInfo,
      },
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: 'Failed to create order',
    };
  }
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string) {
  try {
    const order = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.orderNumber, orderNumber))
      .limit(1);

    if (order.length === 0) {
      return { success: false, error: 'Order not found' };
    }

    const orderItems = await db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, order[0].id));

    const shippingInfo = await db
      .select()
      .from(shippingInfoTable)
      .where(eq(shippingInfoTable.orderId, order[0].id))
      .limit(1);

    return {
      success: true,
      order: {
        ...order[0],
        items: orderItems,
        shipping: shippingInfo[0],
      },
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false,
      error: 'Failed to fetch order',
    };
  }
}

// Get orders by email
export async function getOrdersByEmail(email: string) {
  try {
    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.email, email))
      .orderBy(ordersTable.createdAt);

    return {
      success: true,
      orders,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false,
      error: 'Failed to fetch orders',
    };
  }
}

// Update order status
export async function updateOrderStatus(orderNumber: string, status: string) {
  try {
    const [updatedOrder] = await db
      .update(ordersTable)
      .set({ 
        status, 
        updatedAt: new Date() 
      })
      .where(eq(ordersTable.orderNumber, orderNumber))
      .returning();

    return {
      success: true,
      order: updatedOrder,
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: 'Failed to update order status',
    };
  }
} 