const nodemailer = require('nodemailer');
const axios = require('axios');
const {
  sendEmailNotification,
  sendTelegramNotification,
  sendEnquiryNotifications,
} = require('../../src/services/notification.service');

jest.mock('nodemailer');
jest.mock('axios');

describe('Notification Service', () => {
  const mockEnquiry = {
    id: 1,
    parent_name: 'John Doe',
    phone: '1234567890',
    email: 'john@example.com',
    child_name: 'Alice',
    child_age: 4,
    class_applied_for: 'Nursery',
    message: 'Test message',
    source: 'contact',
    created_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmailNotification', () => {
    it('should skip if SMTP not configured', async () => {
      const originalEnv = process.env;
      process.env = {};

      await sendEmailNotification(mockEnquiry);

      expect(nodemailer.createTransport).not.toHaveBeenCalled();

      process.env = originalEnv;
    });

    it('should send email when configured', async () => {
      process.env.SMTP_HOST = 'smtp.example.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'user@example.com';
      process.env.SMTP_PASS = 'password';
      process.env.NOTIFY_TO_EMAIL = 'admin@example.com';

      const mockSendMail = jest.fn().mockResolvedValue({ messageId: '123' });
      const mockTransporter = {
        sendMail: mockSendMail,
      };

      nodemailer.createTransport.mockReturnValue(mockTransporter);

      await sendEmailNotification(mockEnquiry);

      expect(nodemailer.createTransport).toHaveBeenCalled();
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'admin@example.com',
          subject: expect.stringContaining('John Doe'),
        })
      );
    });

    it('should handle email send errors gracefully', async () => {
      process.env.SMTP_HOST = 'smtp.example.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'user@example.com';
      process.env.SMTP_PASS = 'password';
      process.env.NOTIFY_TO_EMAIL = 'admin@example.com';

      const mockSendMail = jest.fn().mockRejectedValue(new Error('SMTP error'));
      const mockTransporter = {
        sendMail: mockSendMail,
      };

      nodemailer.createTransport.mockReturnValue(mockTransporter);

      await expect(sendEmailNotification(mockEnquiry)).rejects.toThrow('SMTP error');
    });
  });

  describe('sendTelegramNotification', () => {
    it('should skip if Telegram not configured', async () => {
      const originalEnv = process.env;
      process.env = {};

      await sendTelegramNotification(mockEnquiry);

      expect(axios.post).not.toHaveBeenCalled();

      process.env = originalEnv;
    });

    it('should send Telegram message when configured', async () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test-token';
      process.env.TELEGRAM_CHAT_ID = '123456';

      axios.post.mockResolvedValue({ data: { ok: true } });

      await sendTelegramNotification(mockEnquiry);

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('test-token'),
        expect.objectContaining({
          chat_id: '123456',
          text: expect.stringContaining('John Doe'),
          parse_mode: 'Markdown',
        })
      );
    });

    it('should handle Telegram API errors gracefully', async () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test-token';
      process.env.TELEGRAM_CHAT_ID = '123456';

      axios.post.mockRejectedValue(new Error('Telegram API error'));

      await expect(sendTelegramNotification(mockEnquiry)).rejects.toThrow('Telegram API error');
    });
  });

  describe('sendEnquiryNotifications', () => {
    it('should call both email and telegram notifications', async () => {
      process.env.SMTP_HOST = 'smtp.example.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'user@example.com';
      process.env.SMTP_PASS = 'password';
      process.env.NOTIFY_TO_EMAIL = 'admin@example.com';
      process.env.TELEGRAM_BOT_TOKEN = 'test-token';
      process.env.TELEGRAM_CHAT_ID = '123456';

      const mockSendMail = jest.fn().mockResolvedValue({ messageId: '123' });
      const mockTransporter = {
        sendMail: mockSendMail,
      };
      nodemailer.createTransport.mockReturnValue(mockTransporter);
      axios.post.mockResolvedValue({ data: { ok: true } });

      await sendEnquiryNotifications(mockEnquiry);

      expect(mockSendMail).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalled();
    });

    it('should handle partial failures gracefully', async () => {
      process.env.SMTP_HOST = 'smtp.example.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'user@example.com';
      process.env.SMTP_PASS = 'password';
      process.env.NOTIFY_TO_EMAIL = 'admin@example.com';
      process.env.TELEGRAM_BOT_TOKEN = 'test-token';
      process.env.TELEGRAM_CHAT_ID = '123456';

      const mockSendMail = jest.fn().mockRejectedValue(new Error('Email failed'));
      const mockTransporter = {
        sendMail: mockSendMail,
      };
      nodemailer.createTransport.mockReturnValue(mockTransporter);
      axios.post.mockResolvedValue({ data: { ok: true } });

      // Should not throw even if email fails
      await expect(sendEnquiryNotifications(mockEnquiry)).resolves.not.toThrow();
    });
  });
});

