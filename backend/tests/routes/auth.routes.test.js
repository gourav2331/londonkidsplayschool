const request = require('supertest');
const express = require('express');
const authRoutes = require('../../src/routes/auth.routes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /api/auth/login', () => {
    it('should return 400 if username is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password', role: 'admin' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('username, password and role are required');
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', role: 'admin' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('username, password and role are required');
    });

    it('should return 400 if role is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'admin123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('username, password and role are required');
    });

    it('should return 401 for invalid admin credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrong', role: 'admin' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return 401 for invalid teacher credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'teacher', password: 'wrong', role: 'teacher' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return 400 for unsupported role', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'user', password: 'pass', role: 'parent' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Unsupported role');
    });

    it('should return token for valid admin credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: process.env.ADMIN_USERNAME,
          password: process.env.ADMIN_PASSWORD,
          role: 'admin',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.role).toBe('admin');
      expect(response.body.username).toBe(process.env.ADMIN_USERNAME);
    });

    it('should return token for valid teacher credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: process.env.TEACHER_USERNAME,
          password: process.env.TEACHER_PASSWORD,
          role: 'teacher',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.role).toBe('teacher');
      expect(response.body.username).toBe(process.env.TEACHER_USERNAME);
    });
  });
});

