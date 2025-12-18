// Global test setup
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jwt';
process.env.JWT_EXPIRES_IN = '1h';
process.env.ADMIN_USERNAME = 'admin';
process.env.ADMIN_PASSWORD = 'admin123';
process.env.TEACHER_USERNAME = 'teacher';
process.env.TEACHER_PASSWORD = 'teacher123';

// Suppress console output during tests for clean results
global.console = {
  ...console,
  // Keep console.error and console.log silent during tests
  error: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
  // Keep info and debug for important messages if needed
  info: console.info,
  debug: console.debug,
};

