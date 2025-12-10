// backend/src/config.js
require('dotenv').config();

module.exports = {
  pg: {
    host: process.env.PG_HOST || 'playschool-db',
    port: parseInt(process.env.PG_PORT || '5432', 10),
    database: process.env.PG_DATABASE || 'playschool_db',   // 👈 IMPORTANT
    user: process.env.PG_USER || 'playschool_user',
    password: process.env.PG_PASSWORD || 'your_strong_password',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    expiresIn: '7d',
  },

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'no-reply@example.com',
    to: process.env.SMTP_TO || '',
  },

  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
  },
};
