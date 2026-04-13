-- Run in pgAdmin / psql / DBeaver against the same database as DB_NAME in .env

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  description JSONB NOT NULL DEFAULT '[]'::jsonb,
  price NUMERIC(12, 2) NOT NULL,
  offer_price NUMERIC(12, 2) NOT NULL,
  image JSONB NOT NULL DEFAULT '[]'::jsonb,
  category VARCHAR(200) NOT NULL DEFAULT '',
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);
