/** Human-readable category for display (handles array / JSON-string legacy shapes). */
export function categoryLabel(cat) {
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

/** URL segment for /products/:category/:id (matches categories[].path style, lowercase). */
export function categorySlug(cat) {
  return categoryLabel(cat).toLowerCase().replace(/\s+/g, "-");
}

/** Stable id for cart keys and routes (API uses numeric id; dummy data uses _id). */
export function productKey(product) {
  if (!product) return undefined;
  return product.id ?? product._id;
}
