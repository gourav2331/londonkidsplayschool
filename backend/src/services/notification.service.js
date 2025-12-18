// backend/src/services/notification.service.js
const nodemailer = require('nodemailer');
const axios = require('axios');

// ---------- Email ----------
async function sendEmailNotification(enquiry) {
  // Read fresh values from process.env so tests can override them
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    NOTIFY_TO_EMAIL,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !NOTIFY_TO_EMAIL) {
    console.log('Email notification skipped: SMTP/recipient not configured.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  const subject = `New ${enquiry.source} enquiry from ${enquiry.parent_name}`;
  const text = [
    `Source: ${enquiry.source}`,
    `Parent: ${enquiry.parent_name}`,
    `Phone: ${enquiry.phone}`,
    `Email: ${enquiry.email || 'N/A'}`,
    `Child: ${enquiry.child_name || 'N/A'} (${enquiry.child_age || 'N/A'} yrs)`,
    `Class: ${enquiry.class_applied_for || 'N/A'}`,
    '',
    `Message: ${enquiry.message || 'N/A'}`,
    '',
    `Created at: ${enquiry.created_at}`
  ].join('\n');

  await transporter.sendMail({
    from: `"London Kids Gopalpur" <${SMTP_USER}>`,
    to: NOTIFY_TO_EMAIL,
    subject,
    text
  });
}

// ---------- Telegram ----------
async function sendTelegramNotification(enquiry) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Telegram notification skipped: bot token/chat id not configured.');
    return;
  }

  const message =
    `📥 *New ${enquiry.source} enquiry*\n` +
    `👤 Parent: ${enquiry.parent_name}\n` +
    `📞 Phone: ${enquiry.phone}\n` +
    `📧 Email: ${enquiry.email || 'N/A'}\n` +
    `🧒 Child: ${enquiry.child_name || 'N/A'} (${enquiry.child_age || 'N/A'} yrs)\n` +
    `🏷 Class: ${enquiry.class_applied_for || 'N/A'}\n` +
    `💬 Message: ${enquiry.message || 'N/A'}\n` +
    `🕒 ${enquiry.created_at}`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  await axios.post(url, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'Markdown'
  });
}

async function sendEnquiryNotifications(enquiry) {
  await Promise.allSettled([
    sendEmailNotification(enquiry),
    sendTelegramNotification(enquiry),
  ]);
}

module.exports = {
  sendEmailNotification,
  sendTelegramNotification,
  sendEnquiryNotifications,
};
