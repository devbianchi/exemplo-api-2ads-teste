import { db } from '../config/database';
import { Order, OrderItem, OrderWithItems } from '../models/order.model';

export const orderRepository = {
  async createOrder(customerId: number, total: number): Promise<number> {
    const stmt = db.prepare(
      'INSERT INTO orders (customer_id, total) VALUES (?, ?)',
    );
    const result = stmt.run(customerId, total);
    return Number(result.lastInsertRowid);
  },

  async addItem(
    orderId: number,
    productId: number,
    quantity: number,
    unitPrice: number,
  ): Promise<void> {
    const stmt = db.prepare(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
    );
    stmt.run(orderId, productId, quantity, unitPrice);
  },

  async findById(id: number): Promise<OrderWithItems | null> {
    const orderStmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    const order = orderStmt.get(id) as unknown as Order | undefined;

    if (!order) {
      return null;
    }

    const itemsStmt = db.prepare(
      'SELECT * FROM order_items WHERE order_id = ?',
    );
    const items = itemsStmt.all(id) as unknown as OrderItem[];

    return { ...order, items };
  },

  async findAll(): Promise<Order[]> {
    const stmt = db.prepare('SELECT * FROM orders ORDER BY id DESC');
    return stmt.all() as unknown as Order[];
  },

  async findByCustomerId(customerId: number): Promise<Order[]> {
    const stmt = db.prepare(
      'SELECT * FROM orders WHERE customer_id = ? ORDER BY id DESC',
    );
    return stmt.all(customerId) as unknown as Order[];
  },
};
