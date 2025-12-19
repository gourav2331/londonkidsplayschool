const config = require('../config');
const { sendEnquiryNotifications } = require('../services/notification.service');

const healthCheck = (req, res) => {
  res.json({
    status: 'ok',
    service: 'playschool-node-backend',
    env: config.env
  });
};

// Test notification endpoint - for debugging notification setup
const testNotifications = async (req, res) => {
  const testEnquiry = {
    id: 999,
    parent_name: 'Test User',
    phone: '1234567890',
    email: 'test@example.com',
    child_name: 'Test Child',
    child_age: 5,
    class_applied_for: 'Nursery',
    message: 'This is a test notification',
    source: 'test',
    created_at: new Date().toISOString()
  };

  try {
    const results = await sendEnquiryNotifications(testEnquiry);
    res.json({
      success: true,
      message: 'Test notifications sent',
      results: {
        email: results.email.success ? 'Sent' : `Failed: ${results.email.error}`,
        telegram: results.telegram.success ? 'Sent' : `Failed: ${results.telegram.error}`
      },
      config: {
        email: {
          configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.NOTIFY_TO_EMAIL),
          host: process.env.SMTP_HOST || 'NOT SET',
          port: process.env.SMTP_PORT || 'NOT SET',
          user: process.env.SMTP_USER ? `${process.env.SMTP_USER.substring(0, 3)}***` : 'NOT SET',
          recipient: process.env.NOTIFY_TO_EMAIL || 'NOT SET'
        },
        telegram: {
          configured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
          botToken: process.env.TELEGRAM_BOT_TOKEN ? 'SET (hidden)' : 'NOT SET',
          chatId: process.env.TELEGRAM_CHAT_ID || 'NOT SET'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = {
  healthCheck,
  testNotifications
};
