const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const adminRoutes = require('../../src/routes/admin.routes');
const { authRequired, requireRole } = require('../../src/middleware/auth.middleware');
const { query } = require('../../src/helpers/db.helper');

jest.mock('../../src/helpers/db.helper');

const app = express();
app.use(express.json());
app.use('/api/admin', authRequired, requireRole(['admin']), adminRoutes);

describe('Admin Routes', () => {
  let adminToken;

  beforeEach(() => {
    adminToken = jwt.sign(
      { sub: 'admin', role: 'admin' },
      process.env.JWT_SECRET
    );
    jest.clearAllMocks();
  });

  describe('GET /api/admin/enquiries', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/admin/enquiries');

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-admin user', async () => {
      const teacherToken = jwt.sign(
        { sub: 'teacher', role: 'teacher' },
        process.env.JWT_SECRET
      );

      const response = await request(app)
        .get('/api/admin/enquiries')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(403);
    });

    it('should return enquiries list for admin', async () => {
      const mockEnquiries = [
        {
          id: 1,
          parent_name: 'John Doe',
          phone: '1234567890',
          email: 'john@example.com',
          source: 'contact',
          created_at: new Date(),
        },
      ];

      query.mockResolvedValue({ rows: mockEnquiries });

      const response = await request(app)
        .get('/api/admin/enquiries')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEnquiries);
      expect(query).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/admin/enquiries')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch enquiries');
    });
  });

  describe('GET /api/admin/students', () => {
    it('should return students list for admin', async () => {
      const mockStudents = [
        {
          id: 1,
          child_name: 'Alice',
          class_name: 'Nursery',
          age: 4,
          parent_name: 'Parent',
          phone: '1234567890',
          created_at: new Date(),
        },
      ];

      query.mockResolvedValue({ rows: mockStudents });

      const response = await request(app)
        .get('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStudents);
    });

    it('should handle database errors', async () => {
      query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch students');
    });
  });
});

