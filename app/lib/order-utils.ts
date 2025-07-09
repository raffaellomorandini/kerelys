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
export async function createOrder(orderData: OrderData): Promise<{
  success: true;
  order: any;
} | {
  success: false;
  error: string;
}> {
  try {
    console.log('=== Creating Order ===', {
      email: orderData.email,
      totalAmount: orderData.totalAmount,
      itemsCount: orderData.items.length,
    });

    // Generate unique order number
    const orderNumber = generateOrderNumber();
    console.log('Generated order number:', orderNumber);
    
    // Create the order
    console.log('Inserting order into database...');
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

    console.log('Order created in database:', {
      orderId: order.id,
      orderNumber: order.orderNumber,
    });

    // Create order items
    console.log('Creating order items...', { itemsCount: orderData.items.length });
    const orderItems = await Promise.all(
      orderData.items.map(async (item, index) => {
        console.log(`Creating order item ${index + 1}/${orderData.items.length}:`, {
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        });
        
        const [orderItem] = await db.insert(orderItemsTable).values({
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
        }).returning();
        
        console.log(`Order item ${index + 1} created:`, { itemId: orderItem.id });
        return orderItem;
      })
    );

    console.log('All order items created:', { itemsCount: orderItems.length });

    // Create shipping information
    console.log('Creating shipping information...');
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

    console.log('Shipping information created:', { shippingId: shippingInfo.id });

    const result = {
      success: true as const,
      order: {
        ...order,
        items: orderItems.flat(),
        shipping: shippingInfo,
      },
    };

    console.log('Order creation completed successfully:', {
      orderNumber: result.order.orderNumber,
      orderId: result.order.id,
      itemsCount: result.order.items.length,
    });

    return result;
  } catch (error) {
    console.error('ERROR: Error creating order:', {
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      orderData: {
        email: orderData.email,
        totalAmount: orderData.totalAmount,
        itemsCount: orderData.items.length,
      },
    });
    return {
      success: false as const,
      error: 'Failed to create order',
    };
  }
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string): Promise<{
  success: true;
  order: any;
} | {
  success: false;
  error: string;
}> {
  try {
    const order = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.orderNumber, orderNumber))
      .limit(1);

    if (order.length === 0) {
      return { success: false as const, error: 'Order not found' };
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
      success: true as const,
      order: {
        ...order[0],
        items: orderItems,
        shipping: shippingInfo[0],
      },
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false as const,
      error: 'Failed to fetch order',
    };
  }
}

// Get orders by email
export async function getOrdersByEmail(email: string): Promise<{
  success: true;
  orders: any[];
} | {
  success: false;
  error: string;
}> {
  try {
    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.email, email))
      .orderBy(ordersTable.createdAt);

    return {
      success: true as const,
      orders,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false as const,
      error: 'Failed to fetch orders',
    };
  }
}

// Update order status
export async function updateOrderStatus(orderNumber: string, status: string): Promise<{
  success: true;
  order: any;
} | {
  success: false;
  error: string;
}> {
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
      success: true as const,
      order: updatedOrder,
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false as const,
      error: 'Failed to update order status',
    };
  }
} 