const pool = require('../db/pool');

async function getAllTires() {
  const result = await pool.query('SELECT * FROM tires ORDER BY brand, size');
  return result.rows;
}

async function getTireById(id) {
  const result = await pool.query('SELECT * FROM tires WHERE id = $1', [id]);
  return result.rows[0];
}

async function addTire({ brand, size, type, quantity, price, low_stock_threshold }) {
  const result = await pool.query(
    `INSERT INTO tires (brand, size, type, quantity, price, low_stock_threshold)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [brand, size, type, quantity, price, low_stock_threshold]
  );
  return result.rows[0];
}

async function getInventoryStats() {
  const result = await pool.query(`
    SELECT
      COALESCE(SUM(quantity), 0) AS total_quantity,
      COALESCE(SUM(quantity * price), 0) AS total_value,
      COUNT(*) FILTER (WHERE quantity <= low_stock_threshold) AS low_stock_count
    FROM tires
  `);
  return result.rows[0];
}

module.exports = {
  getAllTires,
  getTireById,
  addTire,
  getInventoryStats
};
