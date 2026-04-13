-- One-time migration: products.category JSONB (array) -> VARCHAR (string).
-- Safe to run once on an existing DB. If category is already VARCHAR, this no-ops.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'products'
      AND column_name = 'category'
      AND udt_name = 'jsonb'
  ) THEN
    ALTER TABLE products ADD COLUMN category_str VARCHAR(200);
    UPDATE products
    SET category_str = COALESCE(NULLIF(TRIM(category->>0), ''), '');
    ALTER TABLE products DROP COLUMN category;
    ALTER TABLE products RENAME COLUMN category_str TO category;
    ALTER TABLE products ALTER COLUMN category SET NOT NULL;
    ALTER TABLE products ALTER COLUMN category SET DEFAULT '';
  END IF;
END $$;
