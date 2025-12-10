// backend/src/db/pool.js
const { Pool } = require('pg');

// Single central pool config – everything uses this
const pool = new Pool({
  host: process.env.PG_HOST || 'playschool-db',   // docker service name
  port: Number(process.env.PG_PORT || '5432'),
  database: process.env.PG_DATABASE || 'playschool_db', // 👈 THIS is the DB
  user: process.env.PG_USER || 'playschool_user',
  password: process.env.PG_PASSWORD || 'playschool_pass',
});

pool.on('error', (err) => {
  console.error('Unexpected PG pool error', err);
});

module.exports = pool;

