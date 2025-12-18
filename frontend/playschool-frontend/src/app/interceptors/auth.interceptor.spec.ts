import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: typeof authInterceptor;
  let next: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    interceptor = authInterceptor;
    next = jasmine.createSpyObj('HttpHandler', ['handle']);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should add Authorization header if token exists', () => {
    localStorage.setItem('playschool_token', 'test-token');
    const request = new HttpRequest('GET', '/api/test');
    let capturedRequest: HttpRequest<any> | null = null;

    next.handle.and.callFake((req: HttpRequest<any>) => {
      capturedRequest = req;
      return of({} as any);
    });

    interceptor(request, next.handle);

    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest!.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('should not add Authorization header if no token', () => {
    const request = new HttpRequest('GET', '/api/test');
    let capturedRequest: HttpRequest<any> | null = null;

    next.handle.and.callFake((req: HttpRequest<any>) => {
      capturedRequest = req;
      return of({} as any);
    });

    interceptor(request, next.handle);

    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest!.headers.get('Authorization')).toBeNull();
  });

  it('should handle POST requests with token', () => {
    localStorage.setItem('playschool_token', 'test-token');
    const request = new HttpRequest('POST', '/api/test', { data: 'test' });
    let capturedRequest: HttpRequest<any> | null = null;

    next.handle.and.callFake((req: HttpRequest<any>) => {
      capturedRequest = req;
      return of({} as any);
    });

    interceptor(request, next.handle);

    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest!.headers.get('Authorization')).toBe('Bearer test-token');
  });
});

