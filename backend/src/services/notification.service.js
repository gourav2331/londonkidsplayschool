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
    const missing = [];
    if (!SMTP_HOST) missing.push('SMTP_HOST');
    if (!SMTP_PORT) missing.push('SMTP_PORT');
    if (!SMTP_USER) missing.push('SMTP_USER');
    if (!SMTP_PASS) missing.push('SMTP_PASS');
    if (!NOTIFY_TO_EMAIL) missing.push('NOTIFY_TO_EMAIL');
    console.error('[notification.service] Email notification skipped: Missing env vars:', missing.join(', '));
    throw new Error(`Email notification failed: Missing configuration - ${missing.join(', ')}`);
  }

  try {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
      secure: SMTP_PORT === '465', // true for SSL (465), false for STARTTLS (587)
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

    const info = await transporter.sendMail({
    from: `"London Kids Gopalpur" <${SMTP_USER}>`,
    to: NOTIFY_TO_EMAIL,
    subject,
    text
  });

    console.log('[notification.service] Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[notification.service] Email send error:', error.message);
    if (error.response) {
      console.error('[notification.service] SMTP response:', error.response);
    }
    throw error;
  }
}

// ---------- Telegram ----------
async function sendTelegramNotification(enquiry) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    const missing = [];
    if (!TELEGRAM_BOT_TOKEN) missing.push('TELEGRAM_BOT_TOKEN');
    if (!TELEGRAM_CHAT_ID) missing.push('TELEGRAM_CHAT_ID');
    console.error('[notification.service] Telegram notification skipped: Missing env vars:', missing.join(', '));
    throw new Error(`Telegram notification failed: Missing configuration - ${missing.join(', ')}`);
  }

  try {
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

    const response = await axios.post(url, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'Markdown'
  });

    if (response.data && response.data.ok) {
      console.log('[notification.service] Telegram message sent successfully:', response.data.result.message_id);
      return { success: true, messageId: response.data.result.message_id };
    } else {
      throw new Error(`Telegram API returned error: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error('[notification.service] Telegram send error:', error.message);
    if (error.response) {
      console.error('[notification.service] Telegram API response:', error.response.data);
    }
    throw error;
  }
}

async function sendEnquiryNotifications(enquiry) {
  const results = await Promise.allSettled([
    sendEmailNotification(enquiry),
    sendTelegramNotification(enquiry),
  ]);

  // Log results for debugging
  results.forEach((result, index) => {
    const service = index === 0 ? 'Email' : 'Telegram';
    if (result.status === 'fulfilled') {
      console.log(`[notification.service] ${service} notification sent successfully`);
    } else {
      console.error(`[notification.service] ${service} notification failed:`, result.reason?.message || result.reason);
    }
  });

  // Return results for caller to check
  return {
    email: results[0].status === 'fulfilled' ? { success: true, ...results[0].value } : { success: false, error: results[0].reason?.message },
    telegram: results[1].status === 'fulfilled' ? { success: true, ...results[1].value } : { success: false, error: results[1].reason?.message }
  };
}

module.exports = {
  sendEmailNotification,
  sendTelegramNotification,
  sendEnquiryNotifications,
};
