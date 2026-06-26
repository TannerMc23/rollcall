const pool = require('../db/pool');
const { findOrCreateCustomer } = require('./customerModel');

// Records a sale and decrements stock in a single transaction, with a row
// lock on the tire being sold. If a customer name is provided it's linked
// to a customers row (created on the fly if it's a new name) so their full
// purchase history stays queryable over time.
async function recordSale(tireId, quantity, salePrice, customerName) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const tireResult = await client.query(
      'SELECT quantity FROM tires WHERE id = $1 FOR UPDATE',
      [tireId]
    );

    if (tireResult.rows.length === 0) {
      throw new Error('That tire could not be found.');
    }

    const currentQty = tireResult.rows[0].quantity;
    if (quantity > currentQty) {
      throw new Error(`Only ${currentQty} in stock for that tire.`);
    }

    await client.query(
      'UPDATE tires SET quantity = quantity - $1 WHERE id = $2',
      [quantity, tireId]
    );

    let customerId = null;
    if (customerName && customerName.trim()) {
      customerId = await findOrCreateCustomer(client, customerName);
    }

    const saleResult = await client.query(
      `INSERT INTO sales (tire_id, quantity, sale_price, customer_name, customer_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tireId, quantity, salePrice, customerName ? customerName.trim() : null, customerId]
    );

    await client.query('COMMIT');
    return saleResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function deleteSale(saleId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const saleResult = await client.query(
      'SELECT tire_id, quantity FROM sales WHERE id = $1 FOR UPDATE',
      [saleId]
    );

    if (saleResult.rows.length === 0) {
      throw new Error('That sale could not be found.');
    }

    const { tire_id, quantity } = saleResult.rows[0];

    await client.query(
      'UPDATE tires SET quantity = quantity + $1 WHERE id = $2',
      [quantity, tire_id]
    );

    await client.query('DELETE FROM sales WHERE id = $1', [saleId]);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getRecentSales(limit = 10) {
  const result = await pool.query(
    `SELECT sales.id, sales.quantity, sales.sale_price, sales.customer_name,
            sales.customer_id, sales.sale_date, tires.brand, tires.size
     FROM sales
     JOIN tires ON sales.tire_id = tires.id
     ORDER BY sales.sale_date DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

async function getTodaysSalesTotal() {
  const result = await pool.query(`
    SELECT COALESCE(SUM(quantity * sale_price), 0) AS total
    FROM sales
    WHERE sale_date::date = CURRENT_DATE
  `);
  return result.rows[0].total;
}

module.exports = {
  recordSale,
  deleteSale,
  getRecentSales,
  getTodaysSalesTotal
};
