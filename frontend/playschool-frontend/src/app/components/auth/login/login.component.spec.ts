import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set active role', () => {
    component.setRole('teacher');
    expect(component.activeRole).toBe('teacher');
    expect(component.error).toBeNull();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBe(false);
    component.toggleShowPassword();
    expect(component.showPassword).toBe(true);
    component.toggleShowPassword();
    expect(component.showPassword).toBe(false);
  });

  it('should show error for parent role', () => {
    component.activeRole = 'parent';
    const form = { invalid: false } as any;

    component.onSubmit(form);

    expect(component.error).toBe('Parent login will be available soon.');
  });

  it('should not submit if form is invalid', () => {
    component.activeRole = 'admin';
    const form = { invalid: true } as any;

    component.onSubmit(form);

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should login successfully as admin and navigate to dashboard', () => {
    component.activeRole = 'admin';
    component.username = 'admin';
    component.password = 'password';
    const form = { invalid: false } as any;

    authService.login.and.returnValue(
      of({ token: 'test-token', role: 'admin', username: 'admin' })
    );

    component.onSubmit(form);

    expect(authService.login).toHaveBeenCalledWith('admin', 'password', 'admin');
    expect(component.loading).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should login successfully as teacher and navigate to students', () => {
    component.activeRole = 'teacher';
    component.username = 'teacher';
    component.password = 'password';
    const form = { invalid: false } as any;

    authService.login.and.returnValue(
      of({ token: 'test-token', role: 'teacher', username: 'teacher' })
    );

    component.onSubmit(form);

    expect(authService.login).toHaveBeenCalledWith('teacher', 'password', 'teacher');
    expect(router.navigate).toHaveBeenCalledWith(['/teacher/students']);
  });

  it('should handle login error', () => {
    component.activeRole = 'admin';
    component.username = 'admin';
    component.password = 'wrong';
    const form = { invalid: false } as any;

    authService.login.and.returnValue(
      throwError(() => ({ error: { error: 'Invalid credentials' } }))
    );

    component.onSubmit(form);

    expect(component.loading).toBe(false);
    expect(component.error).toBe('Invalid credentials');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
