# Backend Tests

This directory contains unit tests for the backend API.

## Setup

Install dependencies:
```bash
cd backend
npm install
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Test Structure

- `middleware/` - Authentication and authorization middleware tests
- `controllers/` - Controller logic tests
- `routes/` - API route tests
- `services/` - Service layer tests (notifications, etc.)
- `helpers/` - Database helper tests

## Test Coverage

Tests cover:
- ✅ Authentication middleware (JWT validation, role-based access)
- ✅ Enquiry controller (creation, validation, error handling)
- ✅ Auth routes (login for admin/teacher)
- ✅ Admin routes (enquiries, students - protected)
- ✅ Teacher routes (students CRUD - role-based filtering)
- ✅ Notification service (email, Telegram)
- ✅ Database helpers (query execution, connection pooling)

## Environment Variables

Tests use a test configuration defined in `setup.js`. The following environment variables are set for testing:
- `JWT_SECRET` - Test JWT secret
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` - Test admin credentials
- `TEACHER_USERNAME` / `TEACHER_PASSWORD` - Test teacher credentials

