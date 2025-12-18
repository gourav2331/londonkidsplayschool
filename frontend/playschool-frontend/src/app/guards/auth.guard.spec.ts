import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'hasRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user is logged in and has required role', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.hasRole.and.returnValue(true);

    const route = {
      data: { roles: ['admin'] },
    } as any;
    const state = {} as any;

    const result = guard(route, state);

    expect(result).toBe(true);
    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(authService.hasRole).toHaveBeenCalledWith(['admin']);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login if user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);

    const route = {
      data: { roles: ['admin'] },
    } as any;
    const state = { url: '/admin/dashboard' } as any;

    const result = guard(route, state);

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/admin/dashboard' },
    });
  });

  it('should redirect to home if user does not have required role', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.hasRole.and.returnValue(false);

    const route = {
      data: { roles: ['admin'] },
    } as any;
    const state = {} as any;

    const result = guard(route, state);

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should allow access if no roles specified', () => {
    authService.isLoggedIn.and.returnValue(true);

    const route = {
      data: {},
    } as any;
    const state = {} as any;

    const result = guard(route, state);

    expect(result).toBe(true);
    expect(authService.hasRole).not.toHaveBeenCalled();
  });
});

