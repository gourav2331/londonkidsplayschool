const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const teacherRoutes = require('../../src/routes/teacher.routes');
const { authRequired, requireRole } = require('../../src/middleware/auth.middleware');
const { query } = require('../../src/helpers/db.helper');

jest.mock('../../src/helpers/db.helper');

const app = express();
app.use(express.json());
app.use('/api/teacher', authRequired, requireRole(['teacher', 'admin']), teacherRoutes);

describe('Teacher Routes', () => {
  let teacherToken, adminToken;

  beforeEach(() => {
    teacherToken = jwt.sign(
      { sub: 'teacher', role: 'teacher' },
      process.env.JWT_SECRET
    );
    adminToken = jwt.sign(
      { sub: 'admin', role: 'admin' },
      process.env.JWT_SECRET
    );
    jest.clearAllMocks();
  });

  describe('GET /api/teacher/students', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/teacher/students');

      expect(response.status).toBe(401);
    });

    it('should return only teacher\'s students for teacher role', async () => {
      const mockStudents = [
        {
          id: 1,
          child_name: 'Alice',
          class_name: 'Nursery',
          created_by_username: 'teacher',
          created_by_role: 'teacher',
        },
      ];

      query.mockResolvedValue({ rows: mockStudents });

      const response = await request(app)
        .get('/api/teacher/students')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStudents);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE created_by_role = $1 AND created_by_username = $2'),
        ['teacher', 'teacher']
      );
    });

    it('should return all students for admin role', async () => {
      const mockStudents = [
        { id: 1, child_name: 'Alice', created_by_username: 'teacher' },
        { id: 2, child_name: 'Bob', created_by_username: 'admin' },
      ];

      query.mockResolvedValue({ rows: mockStudents });

      const response = await request(app)
        .get('/api/teacher/students')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStudents);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('FROM students'),
        []
      );
    });

    it('should handle database errors', async () => {
      query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/teacher/students')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch students');
    });
  });

  describe('POST /api/teacher/students', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/teacher/students')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({ child_name: 'Alice' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });

    it('should create student successfully', async () => {
      const studentData = {
        child_name: 'Alice',
        class_name: 'Nursery',
        age: 4,
        parent_name: 'Parent',
        phone: '1234567890',
        address: '123 Street',
      };

      query.mockResolvedValue({ rows: [{ id: 1 }] });

      const response = await request(app)
        .post('/api/teacher/students')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(studentData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 1);
      expect(query).toHaveBeenCalled();
    });

    it('should handle optional fields', async () => {
      const studentData = {
        child_name: 'Bob',
        class_name: 'Playgroup',
        phone: '9876543210',
      };

      query.mockResolvedValue({ rows: [{ id: 2 }] });

      const response = await request(app)
        .post('/api/teacher/students')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(studentData);

      expect(response.status).toBe(201);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO students'),
        expect.arrayContaining(['Bob', 'Playgroup', '9876543210', 'teacher', 'teacher'])
      );
    });

    it('should handle database errors', async () => {
      query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/teacher/students')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          child_name: 'Alice',
          class_name: 'Nursery',
          phone: '1234567890',
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to create student');
    });
  });
});

