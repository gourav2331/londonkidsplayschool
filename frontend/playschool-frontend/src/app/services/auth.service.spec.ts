import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { AuthService, LoginResponse } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const platformId = 'browser';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('should login and store token and role', (done) => {
      const mockResponse: LoginResponse = {
        token: 'test-token',
        role: 'admin',
        username: 'admin',
      };

      service.login('admin', 'password', 'admin').subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(service.getToken()).toBe('test-token');
        expect(service.getRole()).toBe('admin');
        expect(service.isLoggedIn()).toBe(true);
        done();
      });

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        username: 'admin',
        password: 'password',
        role: 'admin',
      });
      req.flush(mockResponse);
    });

    it('should handle login errors', (done) => {
      service.login('admin', 'wrong', 'admin').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(service.isLoggedIn()).toBe(false);
          done();
        },
      });

      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should clear token and role from localStorage', () => {
      localStorage.setItem('lk_auth_token', 'test-token');
      localStorage.setItem('lk_auth_role', 'admin');

      service.logout();

      expect(service.getToken()).toBeNull();
      expect(service.getRole()).toBeNull();
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('lk_auth_token', 'test-token');
      expect(service.getToken()).toBe('test-token');
    });

    it('should return null if no token', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getRole', () => {
    it('should return role from localStorage', () => {
      localStorage.setItem('lk_auth_role', 'teacher');
      expect(service.getRole()).toBe('teacher');
    });

    it('should return null if no role', () => {
      expect(service.getRole()).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if token exists', () => {
      localStorage.setItem('lk_auth_token', 'test-token');
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false if no token', () => {
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true if user has required role', () => {
      localStorage.setItem('lk_auth_role', 'admin');
      expect(service.hasRole(['admin'])).toBe(true);
      expect(service.hasRole(['admin', 'teacher'])).toBe(true);
    });

    it('should return false if user does not have required role', () => {
      localStorage.setItem('lk_auth_role', 'teacher');
      expect(service.hasRole(['admin'])).toBe(false);
    });

    it('should return false if no role stored', () => {
      expect(service.hasRole(['admin'])).toBe(false);
    });
  });
});

