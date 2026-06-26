const pool = require('../db/pool');

// Finds an existing customer by name (case-insensitive) or creates one.
// This keeps the sale form a simple text input while still normalizing
// customer records behind the scenes.
async function findOrCreateCustomer(client, name) {
  const trimmed = name.trim();
  const existing = await client.query(
    'SELECT id FROM customers WHERE LOWER(name) = LOWER($1)',
    [trimmed]
  );
  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }
  const inserted = await client.query(
    'INSERT INTO customers (name) VALUES ($1) RETURNING id',
    [trimmed]
  );
  return inserted.rows[0].id;
}

// All customers sorted by total tires purchased descending so the best
// buyers are always at the top of the list.
async function getAllCustomers() {
  const result = await pool.query(`
    SELECT
      c.id,
      c.name,
      c.created_at,
      COUNT(s.id)              AS order_count,
      COALESCE(SUM(s.quantity), 0)              AS total_tires,
      COALESCE(SUM(s.quantity * s.sale_price), 0) AS total_spent,
      MAX(s.sale_date)         AS last_order_date
    FROM customers c
    LEFT JOIN sales s ON s.customer_id = c.id
    GROUP BY c.id, c.name, c.created_at
    ORDER BY total_tires DESC, c.name ASC
  `);
  return result.rows;
}

// All sales for a single customer, newest first.
async function getCustomerSales(customerId) {
  const result = await pool.query(
    `SELECT
       s.id, s.quantity, s.sale_price, s.sale_date,
       t.brand, t.size, t.type
     FROM sales s
     JOIN tires t ON s.tire_id = t.id
     WHERE s.customer_id = $1
     ORDER BY s.sale_date DESC`,
    [customerId]
  );
  return result.rows;
}

async function getCustomerById(id) {
  const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
  return result.rows[0];
}

// Returns just names for the datalist autocomplete on the sale form.
async function getAllCustomerNames() {
  const result = await pool.query('SELECT name FROM customers ORDER BY name ASC');
  return result.rows.map((r) => r.name);
}

module.exports = {
  findOrCreateCustomer,
  getAllCustomers,
  getCustomerSales,
  getCustomerById,
  getAllCustomerNames
};
