import { TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../services/auth.service';
import { Router, provideRouter } from '@angular/router';

describe('NavbarComponent', () => {
  let authMock: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authMock = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn', 'logout']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('shows Login when user is not logged in', () => {
    authMock.isLoggedIn.and.returnValue(false);

    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Login');
  });

  it('shows Logout when user is logged in', () => {
    authMock.isLoggedIn.and.returnValue(true);

    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Logout');
  });

  it('clicking Login navigates to /login', () => {
    authMock.isLoggedIn.and.returnValue(false);

    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button.btn.btn-primary') as HTMLButtonElement;
    btn.click();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(authMock.logout).not.toHaveBeenCalled();
  });

  it('clicking Logout logs out and navigates to /login', () => {
    authMock.isLoggedIn.and.returnValue(true);

    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button.btn.btn-primary') as HTMLButtonElement;
    btn.click();

    expect(authMock.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});