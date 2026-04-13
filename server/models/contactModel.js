import { pool } from "../config/db.js";

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    createdAt: row.created_at,
  };
}

class ContactModel {
  static async create({ name, email, subject, message }) {
    const result = await pool.query(
      `
      INSERT INTO contact_messages (
        name,
        email,
        subject,
        message
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, email, subject, message]
    );

    return mapRow(result.rows[0]);
  }
}

export default ContactModel;