import { pool } from "../config/db.js";

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: String(row.id),
    userId: row.user_id,
    items: row.items,
    amount: row.amount != null ? Number(row.amount) : row.amount,
    addressId: row.address_id,
    address: row.address, // if you later decide to join/return JSON
    status: row.status,
    paymentType: row.payment_type,
    isPaid: row.is_paid,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Minimal PostgreSQL order model for your existing "Orders.js" requirement.
 * Not wired to routes right now, but safe to import later.
 */
class OrdersModel {
  static async createOrder({
    userId,
    items,
    amount,
    addressId,
    status = "Order Placed",
    paymentType,
    isPaid = false,
  }) {
    const payload = Array.isArray(items) ? items : [];
    const itemsJson = JSON.stringify(payload);

    const query = `
      INSERT INTO orders (
        user_id, items, amount, address_id, status, payment_type, is_paid
      )
      VALUES ($1, $2::text::jsonb, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      userId,
      itemsJson,
      amount,
      addressId,
      status,
      paymentType,
      Boolean(isPaid),
    ];
    const result = await pool.query(query, values);
    return mapRow(result.rows[0]);
  }

  static async getOrdersByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows.map(mapRow);
  }
}

export default OrdersModel;

