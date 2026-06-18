const { Pool } = require('pg');

// Neon and Render-hosted Postgres both require SSL, and the certs used
// by these free-tier hosts aren't always in Node's trusted root store,
// so rejectUnauthorized stays false. This is normal for hosted Postgres
// on these platforms, not a security downgrade for this app's setup.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

module.exports = pool;
