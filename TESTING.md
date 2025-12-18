# Testing Guide

This document provides an overview of the testing setup for the London Kids Play School project.

## Backend Tests

### Framework
- **Jest** - JavaScript testing framework
- **Supertest** - HTTP assertion library for testing Express routes

### Running Backend Tests

```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

### Test Coverage

Backend tests cover:
- **Middleware**: Authentication, authorization, role-based access control
- **Controllers**: Enquiry creation, validation, error handling
- **Routes**: Auth, admin, and teacher endpoints
- **Services**: Email and Telegram notifications
- **Helpers**: Database query execution

### Test Files Location
```
backend/
├── tests/
│   ├── setup.js                    # Test configuration
│   ├── middleware/
│   │   └── auth.middleware.test.js
│   ├── controllers/
│   │   └── enquiry.controller.test.js
│   ├── routes/
│   │   ├── auth.routes.test.js
│   │   ├── admin.routes.test.js
│   │   └── teacher.routes.test.js
│   ├── services/
│   │   └── notification.service.test.js
│   └── helpers/
│       └── db.helper.test.js
└── jest.config.js                   # Jest configuration
```

## Frontend Tests

### Framework
- **Jasmine** - JavaScript testing framework (built into Angular)
- **Karma** - Test runner
- **Angular Testing Utilities** - Component and service testing

### Running Frontend Tests

```bash
cd frontend/playschool-frontend
npm test                 # Run tests with Karma
```

### Test Coverage

Frontend tests cover:
- **Services**: Auth, enquiry, student services
- **Guards**: Route protection and role-based access
- **Interceptors**: HTTP request/response interceptors
- **Components**: Login component with form validation

### Test Files Location
```
frontend/playschool-frontend/src/app/
├── services/
│   ├── auth.service.spec.ts
│   ├── enquiry.service.spec.ts
│   └── student.service.spec.ts
├── guards/
│   └── auth.guard.spec.ts
├── interceptors/
│   └── auth.interceptor.spec.ts
└── components/
    └── auth/
        └── login/
            └── login.component.spec.ts
```

## Writing New Tests

### Backend Test Example

```javascript
describe('MyController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should handle request', async () => {
    // Test implementation
  });
});
```

### Frontend Test Example

```typescript
describe('MyService', () => {
  let service: MyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MyService],
    });
    service = TestBed.inject(MyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Mocking**: Mock external dependencies (database, HTTP, localStorage)
3. **Clear Names**: Use descriptive test names that explain what is being tested
4. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
5. **Coverage**: Aim for high coverage of critical business logic

## Continuous Integration

Tests should be run:
- Before committing code
- In CI/CD pipelines
- Before deploying to production

