const { createEnquiry } = require('../../src/controllers/enquiry.controller');
const { query } = require('../../src/helpers/db.helper');
const { sendEnquiryNotifications } = require('../../src/services/notification.service');

jest.mock('../../src/helpers/db.helper');
jest.mock('../../src/services/notification.service');

describe('Enquiry Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createEnquiry', () => {
    it('should create enquiry successfully', async () => {
      const mockEnquiry = {
        id: 1,
        parent_name: 'John Doe',
        phone: '1234567890',
        email: 'john@example.com',
        message: 'Test message',
        source: 'contact',
        created_at: new Date(),
      };

      req.body = {
        parent_name: 'John Doe',
        phone: '1234567890',
        email: 'john@example.com',
        message: 'Test message',
        source: 'contact',
      };

      query.mockResolvedValue({ rows: [mockEnquiry] });
      sendEnquiryNotifications.mockResolvedValue();

      await createEnquiry(req, res);

      expect(query).toHaveBeenCalled();
      expect(sendEnquiryNotifications).toHaveBeenCalledWith(mockEnquiry);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockEnquiry);
    });

    it('should return 400 if parent_name is missing', async () => {
      req.body = {
        phone: '1234567890',
      };

      await createEnquiry(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'parent_name and phone are required',
      });
      expect(query).not.toHaveBeenCalled();
    });

    it('should return 400 if phone is missing', async () => {
      req.body = {
        parent_name: 'John Doe',
      };

      await createEnquiry(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'parent_name and phone are required',
      });
      expect(query).not.toHaveBeenCalled();
    });

    it('should handle optional fields', async () => {
      const mockEnquiry = {
        id: 1,
        parent_name: 'Jane Doe',
        phone: '9876543210',
        email: null,
        message: null,
        source: 'appointment',
        created_at: new Date(),
      };

      req.body = {
        parent_name: 'Jane Doe',
        phone: '9876543210',
        source: 'appointment',
      };

      query.mockResolvedValue({ rows: [mockEnquiry] });
      sendEnquiryNotifications.mockResolvedValue();

      await createEnquiry(req, res);

      expect(query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle database errors', async () => {
      req.body = {
        parent_name: 'John Doe',
        phone: '1234567890',
      };

      query.mockRejectedValue(new Error('Database error'));

      await createEnquiry(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create enquiry' });
    });

    it('should continue even if notification fails', async () => {
      const mockEnquiry = {
        id: 1,
        parent_name: 'John Doe',
        phone: '1234567890',
        source: 'contact',
        created_at: new Date(),
      };

      req.body = {
        parent_name: 'John Doe',
        phone: '1234567890',
      };

      query.mockResolvedValue({ rows: [mockEnquiry] });
      sendEnquiryNotifications.mockRejectedValue(new Error('Notification failed'));

      await createEnquiry(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockEnquiry);
    });
  });
});

