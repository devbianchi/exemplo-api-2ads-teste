import { SQLInputValue } from 'node:sqlite';
import { db } from '../config/database';
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from '../models/product.model';

export const productRepository = {
  async findAll(): Promise<Product[]> {
    const stmt = db.prepare('SELECT * FROM products ORDER BY id');
    return stmt.all() as unknown as Product[];
  },

  async findById(id: number): Promise<Product | null> {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const row = stmt.get(id) as unknown as Product | undefined;
    return row ?? null;
  },

  async create(input: CreateProductInput): Promise<Product> {
    const { name, description, price } = input;
    const stmt = db.prepare(
      'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
    );
    const result = stmt.run(name, description ?? null, price);

    const created = await this.findById(Number(result.lastInsertRowid));
    return created!;
  },

  async update(id: number, input: UpdateProductInput): Promise<Product | null> {
    const fields: string[] = [];
    const values: SQLInputValue[] = [];

    if (input.name !== undefined) {
      fields.push('name = ?');
      values.push(input.name);
    }
    if (input.description !== undefined) {
      fields.push('description = ?');
      values.push(input.description);
    }
    if (input.price !== undefined) {
      fields.push('price = ?');
      values.push(input.price);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const stmt = db.prepare(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
    );
    stmt.run(...values);

    return this.findById(id);
  },

  async delete(id: number): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    const result = stmt.run(id);
    return Number(result.changes) > 0;
  },

  async existsInOrder(id: number): Promise<boolean> {
    const stmt = db.prepare(
      'SELECT 1 FROM order_items WHERE product_id = ? LIMIT 1',
    );
    const row = stmt.get(id);
    return !!row;
  },
};
