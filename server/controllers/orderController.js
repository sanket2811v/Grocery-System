import { pool } from "../config/db.js";
import OrdersModel from "../models/Orders.js";
import AddressModel from "../models/addressModel.js";
import User from "../models/UserModel.js";
import Stripe from "stripe";

let stripeInstance = null;
(() => {
  const rawKey = process.env.STRIPE_SECRET_KEY;
  if (!rawKey) return;
  // Strip leading/trailing quotes if .env uses 'key' or "key"
  const cleaned = rawKey.replace(/^['"]|['"]$/g, "");
  if (!cleaned) return;
  stripeInstance = new Stripe(cleaned);
})();

function isNumericLike(val) {
  if (typeof val === "number") return Number.isFinite(val);
  if (typeof val !== "string") return false;
  return val.trim() !== "" && !Number.isNaN(Number(val));
}

function normalizeProductId(product) {
  if (product == null) return null;
  if (typeof product === "number") return product;
  if (typeof product === "string" && isNumericLike(product)) return Number(product);
  if (typeof product === "object") {
    const maybe = product.id ?? product._id ?? product.productId ?? product.product_id;
    if (isNumericLike(maybe)) return Number(maybe);
  }
  return null;
}

function mapAddressRow(row) {
  if (!row) return null;
  return {
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    street: row.street,
    city: row.city,
    state: row.state,
    zipcode: row.zipcode,
    country: row.country,
    phone: row.phone,
  };
}

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

function mapProductRow(row) {
  if (!row) return null;
  const categoryStr = normalizeCategoryFromRow(row.category);
  return {
    _id: String(row.id),
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price != null ? Number(row.price) : row.price,
    offerPrice: row.offer_price != null ? Number(row.offer_price) : row.offer_price,
    image: row.image,
    category: categoryStr,
    inStock: row.in_stock,
  };
}

function enrichOrders(rows, { addressRows, productRows }) {
  const addressMap = new Map();
  for (const a of addressRows || []) {
    addressMap.set(a.id, mapAddressRow(a));
  }

  const productMap = new Map();
  for (const p of productRows || []) {
    productMap.set(p.id, mapProductRow(p));
  }

  return rows.map((o) => {
    const orderItems = Array.isArray(o.items) ? o.items : [];
    const items = orderItems.map((it) => {
      const pid = normalizeProductId(it.product);
      return {
        ...it,
        product: pid != null ? productMap.get(pid) : it.product,
      };
    });

    return {
      _id: String(o.id),
      userId: o.user_id,
      items,
      amount: o.amount != null ? Number(o.amount) : o.amount,
      address: addressMap.get(o.address_id) || null,
      status: o.status,
      paymentType: o.payment_type,
      isPaid: o.is_paid,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    };
  });
}

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const finalUserId = userId ?? req.userId;

    if (!finalUserId || !items || !Array.isArray(items) || items.length === 0 || !address) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Resolve address -> address_id
    let addressId = null;
    if (isNumericLike(address)) {
      addressId = Number(address);
    } else if (address && typeof address === "object") {
      const maybeId = address.id ?? address._id;
      if (isNumericLike(maybeId)) {
        addressId = Number(maybeId);
      } else {
        const created = await AddressModel.createAddress({
          userId: finalUserId,
          firstName: address.firstName,
          lastName: address.lastName,
          email: address.email,
          street: address.street,
          city: address.city,
          state: address.state,
          zipcode: address.zipcode,
          country: address.country,
          phone: address.phone,
        });
        addressId = created.id;
      }
    }

    if (!addressId) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Calculate amount: sum(offer_price * quantity) then add 2% tax
    const computed = items.reduce((acc, item) => {
      const pid = normalizeProductId(item.product);
      const qty = Number(item.quantity);
      if (pid == null || !Number.isFinite(qty)) return acc;
      // We'll fetch product rows below; keep placeholder value here.
      return acc;
    }, 0);

    // Fetch products in one go for speed and correctness.
    const productIds = Array.from(
      new Set(
        items
          .map((it) => normalizeProductId(it.product))
          .filter((x) => x != null)
      )
    );

    const productRows = productIds.length
      ? (
          await pool.query(
            `SELECT id, offer_price FROM products WHERE id = ANY($1::int[])`,
            [productIds]
          )
        ).rows
      : [];
    const offerMap = new Map(productRows.map((p) => [p.id, Number(p.offer_price)]));

    let amount = items.reduce((acc, item) => {
      const pid = normalizeProductId(item.product);
      const qty = Number(item.quantity);
      if (pid == null || !Number.isFinite(qty)) return acc;
      const offer = offerMap.get(pid);
      if (offer == null) return acc;
      return acc + offer * qty;
    }, 0);

    amount = Math.floor(amount);
    amount += Math.floor(amount * 0.02); // Add Tax Charge (2%)

    const normalizedItems = items.map((it) => ({
      product: normalizeProductId(it.product),
      quantity: Number(it.quantity),
    }));

    await OrdersModel.createOrder({
      userId: finalUserId,
      items: normalizedItems,
      amount,
      addressId,
      status: "Order Placed",
      paymentType: "COD",
      isPaid: false,
    });

    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Place Order with Stripe payment: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    if (!stripeInstance) {
      return res.json({
        success: false,
        message: "Stripe is not configured on the server",
      });
    }
    const { userId, items, address } = req.body;
    const finalUserId = userId ?? req.userId;
    const origin = req.headers.origin || "http://localhost:5173";

    if (!finalUserId || !Array.isArray(items) || items.length === 0 || !address) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Resolve address -> address_id (same logic as COD)
    let addressId = null;
    if (isNumericLike(address)) {
      addressId = Number(address);
    } else if (address && typeof address === "object") {
      const maybeId = address.id ?? address._id;
      if (isNumericLike(maybeId)) {
        addressId = Number(maybeId);
      } else {
        const created = await AddressModel.createAddress({
          userId: finalUserId,
          firstName: address.firstName,
          lastName: address.lastName,
          email: address.email,
          street: address.street,
          city: address.city,
          state: address.state,
          zipcode: address.zipcode,
          country: address.country,
          phone: address.phone,
        });
        addressId = created.id;
      }
    }

    if (!addressId) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Fetch product data for items
    const productIds = Array.from(
      new Set(
        items
          .map((it) => normalizeProductId(it.product))
          .filter((x) => x != null)
      )
    );

    const productRows = productIds.length
      ? (
          await pool.query(
            `SELECT id, name, offer_price FROM products WHERE id = ANY($1::int[])`,
            [productIds]
          )
        ).rows
      : [];

    const productMap = new Map(
      productRows.map((p) => [p.id, { name: p.name, price: Number(p.offer_price) }])
    );

    const productData = items
      .map((it) => {
        const pid = normalizeProductId(it.product);
        const qty = Number(it.quantity);
        const meta = pid != null ? productMap.get(pid) : null;
        if (!meta || !Number.isFinite(qty) || qty <= 0) return null;
        return {
          productId: pid,
          name: meta.name,
          price: meta.price,
          quantity: qty,
        };
      })
      .filter(Boolean);

    if (!productData.length) {
      return res.json({ success: false, message: "Products not found" });
    }

    // Compute total amount (with 2% tax)
    let amount = productData.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    amount = Math.floor(amount);
    amount += Math.floor(amount * 0.02);

    const normalizedItems = productData.map((it) => ({
      product: it.productId,
      quantity: it.quantity,
    }));

    const order = await OrdersModel.createOrder({
      userId: finalUserId,
      items: normalizedItems,
      amount,
      addressId,
      status: "Order Placed",
      paymentType: "Online",
      isPaid: false,
    });

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.floor(item.price * 1.02 * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order.id.toString(),
        userId: finalUserId.toString(),
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get user orders : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body || {};
    const finalUserId = userId ?? req.userId;
    if (!finalUserId) return res.json({ success: false, message: "Not Authorized" });

    const result = await pool.query(
      `
      SELECT * FROM orders
      WHERE user_id = $1
        AND (payment_type = 'COD' OR payment_type = 'Online')
      ORDER BY created_at DESC
      `,
      [finalUserId]
    );

    const rows = result.rows || [];
    const addressIds = Array.from(new Set(rows.map((r) => r.address_id).filter(Boolean)));
    const productIds = Array.from(
      new Set(
        rows.flatMap((r) =>
          (Array.isArray(r.items) ? r.items : [])
            .map((it) => normalizeProductId(it.product))
            .filter((x) => x != null)
        )
      )
    );

    const [addressRes, productRes] = await Promise.all([
      addressIds.length
        ? pool.query(`SELECT * FROM addresses WHERE id = ANY($1::int[])`, [addressIds])
        : Promise.resolve({ rows: [] }),
      productIds.length
        ? pool.query(`SELECT * FROM products WHERE id = ANY($1::int[])`, [productIds])
        : Promise.resolve({ rows: [] }),
    ]);

    const orders = enrichOrders(rows, { addressRows: addressRes.rows, productRows: productRes.rows });
    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get all orders : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM orders
      WHERE (payment_type = 'COD' OR is_paid = true)
      ORDER BY created_at DESC
      `
    );

    const rows = result.rows || [];
    const addressIds = Array.from(new Set(rows.map((r) => r.address_id).filter(Boolean)));
    const productIds = Array.from(
      new Set(
        rows.flatMap((r) =>
          (Array.isArray(r.items) ? r.items : [])
            .map((it) => normalizeProductId(it.product))
            .filter((x) => x != null)
        )
      )
    );

    const [addressRes, productRes] = await Promise.all([
      addressIds.length
        ? pool.query(`SELECT * FROM addresses WHERE id = ANY($1::int[])`, [addressIds])
        : Promise.resolve({ rows: [] }),
      productIds.length
        ? pool.query(`SELECT * FROM products WHERE id = ANY($1::int[])`, [productIds])
        : Promise.resolve({ rows: [] }),
    ]);

    const orders = enrichOrders(rows, { addressRows: addressRes.rows, productRows: productRes.rows });
    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

