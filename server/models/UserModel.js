import { pool } from "../config/db.js";

/** Row from DB -> API shape (camelCase, no password). */
export function mapPublicUser(row) {
  if (!row) return null;
  const cart = row.cart_items;
  return {
    id: row.id,
    _id: String(row.id),
    name: row.name,
    email: row.email,
    cartItems:
      cart && typeof cart === "object" && !Array.isArray(cart) ? cart : {},
    createdAt: row.created_at,
  };
}

class UserModel {
  static async createUser({ name, email, password }) {
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, cart_items, created_at
    `;
    const values = [name, email, password];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getUserByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  }

  static async getUserById(id) {
    const result = await pool.query(
      `SELECT id, name, email, cart_items, created_at FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async updateCartItems(userId, cartItems) {
    const payload =
      cartItems && typeof cartItems === "object" && !Array.isArray(cartItems)
        ? cartItems
        : {};
    const result = await pool.query(
      `UPDATE users SET cart_items = $2::jsonb WHERE id = $1
       RETURNING id, name, email, cart_items, created_at`,
      [userId, payload]
    );
    return result.rows[0];
  }
}

export default UserModel;
