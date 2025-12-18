const jwt = require('jsonwebtoken');
const { authRequired, requireRole } = require('../../src/middleware/auth.middleware');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('authRequired', () => {
    it('should return 401 if no authorization header', () => {
      authRequired(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing Authorization token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
      req.headers.authorization = 'Bearer invalid-token';
      authRequired(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next() with valid token', () => {
      const token = jwt.sign({ sub: 'testuser', role: 'admin' }, process.env.JWT_SECRET);
      req.headers.authorization = `Bearer ${token}`;

      authRequired(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.sub).toBe('testuser');
      expect(req.user.role).toBe('admin');
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle token without Bearer prefix', () => {
      const token = jwt.sign({ sub: 'testuser', role: 'admin' }, process.env.JWT_SECRET);
      req.headers.authorization = token;

      authRequired(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    it('should return 401 if user is not authenticated', () => {
      const middleware = requireRole(['admin']);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthenticated' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow access if user has required role', () => {
      req.user = { sub: 'admin', role: 'admin' };
      const middleware = requireRole(['admin']);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access if user does not have required role', () => {
      req.user = { sub: 'teacher', role: 'teacher' };
      const middleware = requireRole(['admin']);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: insufficient role' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow access if roles array is empty', () => {
      req.user = { sub: 'user', role: 'any' };
      const middleware = requireRole([]);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow access if user role is in allowed roles array', () => {
      req.user = { sub: 'teacher', role: 'teacher' };
      const middleware = requireRole(['teacher', 'admin']);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

