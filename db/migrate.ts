import { db } from './index';
import { ordersTable, orderItemsTable, shippingInfoTable } from './schema';

async function migrate() {
  try {
    console.log('Starting database migration...');

    // Create orders table
    console.log('Creating orders table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        stripe_payment_intent_id VARCHAR(255),
        stripe_customer_id VARCHAR(255),
        total_amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        metadata JSONB
      );
      
      CREATE INDEX IF NOT EXISTS order_number_idx ON orders(order_number);
      CREATE INDEX IF NOT EXISTS email_idx ON orders(email);
      CREATE INDEX IF NOT EXISTS stripe_payment_intent_idx ON orders(stripe_payment_intent_id);
    `);

    // Create order_items table
    console.log('Creating order_items table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id),
        product_name VARCHAR(255) NOT NULL,
        product_id VARCHAR(100),
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        size VARCHAR(50),
        color VARCHAR(50),
        stripe_product_id VARCHAR(255),
        stripe_price_id VARCHAR(255),
        metadata JSONB
      );
      
      CREATE INDEX IF NOT EXISTS order_id_idx ON order_items(order_id);
      CREATE INDEX IF NOT EXISTS product_id_idx ON order_items(product_id);
    `);

    // Create shipping_info table
    console.log('Creating shipping_info table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS shipping_info (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id),
        name VARCHAR(255) NOT NULL,
        street VARCHAR(500) NOT NULL,
        city VARCHAR(100) NOT NULL,
        zip VARCHAR(20) NOT NULL,
        province VARCHAR(100),
        country VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS shipping_order_id_idx ON shipping_info(order_id);
    `);

    console.log('Database migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { migrate }; 