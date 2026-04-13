import { pool } from "../config/db.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

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
    offerPrice:
      row.offer_price != null ? Number(row.offer_price) : row.offer_price,
    image: row.image,
    category: categoryStr,
    inStock: row.in_stock,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Normalize to string[] then serialize — never pass raw JS arrays to pg for JSONB (pg maps them to Postgres ARRAY, not JSON). */
function asTextArray(value) {
  const arr = Array.isArray(value) ? value : value != null ? [value] : [];
  return arr.map((x) => String(x ?? ""));
}

/** Valid JSON text for JSONB columns; validates round-trip. */
function toJsonbString(value) {
  const s = JSON.stringify(value);
  JSON.parse(s);
  return s;
}

function parseProductData(raw) {
  if (raw == null) return null;
  if (Buffer.isBuffer(raw)) {
    try {
      return JSON.parse(raw.toString("utf8"));
    } catch {
      return null;
    }
  }
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  // Multer can return duplicate fields as string[]; typeof [] === "object"
  if (Array.isArray(raw)) {
    const first = raw.find((x) => x != null);
    if (typeof first === "string") return parseProductData(first);
    return null;
  }
  if (typeof raw === "object") {
    return raw;
  }
  return null;
}

function normalizeCategory(category) {
  if (category == null) return "";
  if (Array.isArray(category)) {
    return category.length ? String(category[0]).trim() : "";
  }
  return String(category).trim();
}

function normalizeArrays({ name, description, price, offerPrice, category, image, inStock }) {
  return {
    name,
    description: Array.isArray(description)
      ? description
      : description != null
        ? [description]
        : [],
    price,
    offerPrice,
    category: normalizeCategory(category),
    image: Array.isArray(image) ? image : image != null ? [image] : [],
    inStock: inStock !== undefined ? inStock : true,
  };
}

export const addProduct = async (request, response) => {
  try {
    let raw;
    if (request.body.productData !== undefined) {
      raw = parseProductData(request.body.productData);
      if (raw == null) {
        return response.json({
          success: false,
          message: "Invalid productData JSON",
        });
      }
    } else if (request.body.name !== undefined) {
      raw = request.body;
    } else {
      return response.json({
        success: false,
        message: "productData is required",
      });
    }

    const productData = normalizeArrays(raw);

    const files = request.files || [];
    const uploadedUrls = [];
    for (const file of files) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        uploadedUrls.push(result.secure_url);
      } finally {
        try {
          if (file.path) await fs.unlink(file.path);
        } catch {
          /* ignore */
        }
      }
    }

    const image =
      uploadedUrls.length > 0 ? uploadedUrls : productData.image;

    if (
      !productData.name ||
      productData.description === undefined ||
      productData.price === undefined ||
      productData.offerPrice === undefined ||
      !image ||
      (Array.isArray(image) && image.length === 0) ||
      String(productData.category).trim() === ""
    ) {
      return response.json({
        success: false,
        message:
          "name, description, price, offerPrice, image, and category are required",
      });
    }

    const priceNum = Number(productData.price);
    const offerNum = Number(productData.offerPrice);
    if (!Number.isFinite(priceNum) || !Number.isFinite(offerNum)) {
      return response.json({
        success: false,
        message: "price and offerPrice must be valid numbers",
      });
    }

    const descArr = asTextArray(productData.description);
    const imgArr = asTextArray(image);

    let descJson;
    let imgJson;
    try {
      descJson = toJsonbString(descArr);
      imgJson = toJsonbString(imgArr);
    } catch {
      return response.json({
        success: false,
        message: "Invalid JSON for description or image",
      });
    }

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
    const values = [
      String(productData.name),
      descJson,
      priceNum,
      offerNum,
      imgJson,
      String(productData.category).slice(0, 200),
      Boolean(productData.inStock),
    ];

    const result = await pool.query(query, values);
    const product = mapRow(result.rows[0]);

    return response.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    return response.json({ success: false, message: error.message });
  }
};

export const productList = async (request, response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM products ORDER BY created_at DESC`
    );
    const products = result.rows.map(mapRow);
    return response.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    return response.json({ success: false, message: error.message });
  }
};

export const productById = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await pool.query(`SELECT * FROM products WHERE id = $1`, [
      id,
    ]);
    const product = mapRow(result.rows[0]);
    if (!product) {
      return response.json({ success: false, message: "Product not found" });
    }
    return response.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    return response.json({ success: false, message: error.message });
  }
};

export const changeStock = async (request, response) => {
  try {
    const { id, inStock } = request.body;
    if (id === undefined || inStock === undefined) {
      return response.json({
        success: false,
        message: "id and inStock are required",
      });
    }
    const result = await pool.query(
      `UPDATE products SET in_stock = $1 WHERE id = $2 RETURNING *`,
      [Boolean(inStock), id]
    );
    const product = mapRow(result.rows[0]);
    if (!product) {
      return response.json({ success: false, message: "Product not found" });
    }
    return response.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    return response.json({ success: false, message: error.message });
  }
};
