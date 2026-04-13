-- Run in pgAdmin / psql / DBeaver against the same DB as DB_NAME in .env

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  amount NUMERIC(12, 2) NOT NULL,
  address_id INTEGER NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,
  status VARCHAR(100) NOT NULL DEFAULT 'Order Placed',
  payment_type VARCHAR(50) NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

