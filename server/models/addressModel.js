import { pool } from "../config/db.js";

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: String(row.id),
    userId: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    street: row.street,
    city: row.city,
    state: row.state,
    zipcode: row.zipcode != null ? Number(row.zipcode) : row.zipcode,
    country: row.country,
    phone: row.phone,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * PostgreSQL equivalent of your screenshot's Mongoose Address schema.
 * Not currently wired to routes in this repo, but it won't break the server.
 */
class AddressModel {
  static async createAddress({
    userId,
    firstName,
    lastName,
    email,
    street,
    city,
    state,
    zipcode,
    country,
    phone,
  }) {
    const query = `
      INSERT INTO addresses (
        user_id,
        first_name,
        last_name,
        email,
        street,
        city,
        state,
        zipcode,
        country,
        phone
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      userId,
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone,
    ];
    const result = await pool.query(query, values);
    return mapRow(result.rows[0]);
  }

  static async getAddressesByUserId(userId) {
    const query = `
      SELECT * FROM addresses
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows.map(mapRow);
  }
}

export default AddressModel;

