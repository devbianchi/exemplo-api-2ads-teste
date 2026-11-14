import { SQLInputValue } from 'node:sqlite';
import { db } from '../config/database';
import {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from '../models/customer.model';

export const customerRepository = {
  async findAll(): Promise<Customer[]> {
    const stmt = db.prepare('SELECT * FROM customers ORDER BY id');
    return stmt.all() as unknown as Customer[];
  },

  async findById(id: number): Promise<Customer | null> {
    const stmt = db.prepare('SELECT * FROM customers WHERE id = ?');
    const row = stmt.get(id) as unknown as Customer | undefined;
    return row ?? null;
  },

  async findByEmail(email: string): Promise<Customer | null> {
    const stmt = db.prepare('SELECT * FROM customers WHERE email = ?');
    const row = stmt.get(email) as unknown as Customer | undefined;
    return row ?? null;
  },

  async create(input: CreateCustomerInput): Promise<Customer> {
    const { name, email, phone } = input;
    const stmt = db.prepare(
      'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
    );
    const result = stmt.run(name, email, phone ?? null);

    const created = await this.findById(Number(result.lastInsertRowid));
    return created!;
  },

  async update(id: number, input: UpdateCustomerInput): Promise<Customer | null> {
    const fields: string[] = [];
    const values: SQLInputValue[] = [];

    if (input.name !== undefined) {
      fields.push('name = ?');
      values.push(input.name);
    }
    if (input.email !== undefined) {
      fields.push('email = ?');
      values.push(input.email);
    }
    if (input.phone !== undefined) {
      fields.push('phone = ?');
      values.push(input.phone);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const stmt = db.prepare(
      `UPDATE customers SET ${fields.join(', ')} WHERE id = ?`,
    );
    stmt.run(...values);

    return this.findById(id);
  },

  async delete(id: number): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM customers WHERE id = ?');
    const result = stmt.run(id);
    return Number(result.changes) > 0;
  },

  async existsInOrder(id: number): Promise<boolean> {
    const stmt = db.prepare(
      'SELECT 1 FROM orders WHERE customer_id = ? LIMIT 1',
    );
    const row = stmt.get(id);
    return !!row;
  },
};
