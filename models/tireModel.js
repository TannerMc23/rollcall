const pool = require('../db/pool');

async function getAllTires() {
  const result = await pool.query(
    'SELECT * FROM tires WHERE is_active = true ORDER BY brand, size'
  );
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

// Edits every field on an existing tire. Only touches rows that are still
// active, since an edit shouldn't be able to resurrect a deleted tire.
async function updateTire(id, { brand, size, type, quantity, price, low_stock_threshold }) {
  const result = await pool.query(
    `UPDATE tires
     SET brand = $1, size = $2, type = $3, quantity = $4, price = $5, low_stock_threshold = $6
     WHERE id = $7 AND is_active = true
     RETURNING *`,
    [brand, size, type, quantity, price, low_stock_threshold, id]
  );
  if (result.rows.length === 0) {
    throw new Error('That tire could not be found.');
  }
  return result.rows[0];
}

// "Deleting" a tire just flags it inactive rather than removing the row.
// A hard delete would either fail (a foreign key blocks it once the tire
// has any sales recorded against it) or force losing/orphaning that sales
// history. This keeps past sales intact while the tire disappears from the
// active inventory list and the sale dropdown.
async function deactivateTire(id) {
  const result = await pool.query(
    'UPDATE tires SET is_active = false WHERE id = $1 RETURNING *',
    [id]
  );
  if (result.rows.length === 0) {
    throw new Error('That tire could not be found.');
  }
  return result.rows[0];
}

async function getInventoryStats() {
  const result = await pool.query(`
    SELECT
      COALESCE(SUM(quantity), 0) AS total_quantity,
      COALESCE(SUM(quantity * price), 0) AS total_value,
      COUNT(*) FILTER (WHERE quantity <= low_stock_threshold) AS low_stock_count
    FROM tires
    WHERE is_active = true
  `);
  return result.rows[0];
}

module.exports = {
  getAllTires,
  getTireById,
  addTire,
  updateTire,
  deactivateTire,
  getInventoryStats
};
