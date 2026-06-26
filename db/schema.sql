-- RollCall database schema
-- Run this once against your Postgres database to set up the tables.

CREATE TABLE IF NOT EXISTS tires (
  id SERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  size TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('New', 'Used', 'Retread')),
  quantity INTEGER NOT NULL DEFAULT 0,
  price NUMERIC(10,2) NOT NULL,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  tire_id INTEGER REFERENCES tires(id),
  quantity INTEGER NOT NULL,
  sale_price NUMERIC(10,2) NOT NULL,
  customer_name TEXT,
  sale_date TIMESTAMP DEFAULT NOW()
);
