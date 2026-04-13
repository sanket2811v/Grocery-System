import { pool } from "../config/db.js";

/**
 * Maps DB row (snake_case) to API shape (camelCase).
 */
function normalizeCategoryFromRow(cat) {
  if (cat == null || cat === "") return "";
  if (Array.isArray(cat)) return String(cat[0] ?? "").trim();
  if (typeof cat === "string") {
    const s = cat.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const p = JSON.parse(s);
        if (Array.isArray(p)) return String(p[0] ?? "").trim();
      } catch {
        /* ignore */
      }
    }
    return s;
  }
  return String(cat).trim();
}

function mapRow(row) {
  if (!row) return null;
  const categoryStr = normalizeCategoryFromRow(row.category);
  return {
    id: row.id,
    _id: String(row.id),
    name: row.name,
    description: row.description,
    price: row.price != null ? Number(row.price) : row.price,
    offerPrice: row.offer_price != null ? Number(row.offer_price) : row.offer_price,
    image: row.image,
    category: categoryStr,
    inStock: row.in_stock,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function asTextArray(value) {
  const arr = Array.isArray(value) ? value : value != null ? [value] : [];
  return arr.map((x) => String(x ?? ""));
}

function toJsonbString(value) {
  const s = JSON.stringify(value);
  JSON.parse(s);
  return s;
}

class ProductModel {
  static async createProduct({
    name,
    description,
    price,
    offerPrice,
    image,
    category,
    inStock = true,
  }) {
    const query = `
      INSERT INTO products (
        name, description, price, offer_price, image, category, in_stock
      )
      VALUES (
        $1,
        $2::text::jsonb,
        $3::numeric,
        $4::numeric,
        $5::text::jsonb,
        $6::varchar,
        $7
      )
      RETURNING *
    `;
    const desc = asTextArray(
      Array.isArray(description) ? description : [description]
    );
    const img = asTextArray(Array.isArray(image) ? image : [image]);
    const catStr =
      category == null
        ? ""
        : Array.isArray(category)
          ? String(category[0] ?? "").trim()
          : String(category).trim();
    const priceNum = Number(price);
    const offerNum = Number(offerPrice);
    if (!Number.isFinite(priceNum) || !Number.isFinite(offerNum)) {
      throw new Error("price and offerPrice must be valid numbers");
    }
    const values = [
      String(name),
      toJsonbString(desc),
      priceNum,
      offerNum,
      toJsonbString(img),
      catStr.slice(0, 200),
      Boolean(inStock),
    ];
    const result = await pool.query(query, values);
    return mapRow(result.rows[0]);
  }

  static async getAllProducts() {
    const result = await pool.query(
      `SELECT * FROM products ORDER BY created_at DESC`
    );
    return result.rows.map(mapRow);
  }

  static async getProductById(id) {
    const result = await pool.query(`SELECT * FROM products WHERE id = $1`, [
      id,
    ]);
    return mapRow(result.rows[0]);
  }

  static async changeStock(id, inStock) {
    const result = await pool.query(
      `UPDATE products SET in_stock = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, inStock]
    );
    return mapRow(result.rows[0]);
  }
}

export default ProductModel;
