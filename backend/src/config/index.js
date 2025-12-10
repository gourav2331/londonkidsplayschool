// backend/src/config/index.js
const dotenv = require('dotenv');

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  pg: {
    host: process.env.PG_HOST || 'localhost',
    port: Number(process.env.PG_PORT || 5432),
    database: process.env.PG_DATABASE || 'playschool',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || ''
  }
};

module.exports = config;
