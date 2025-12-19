import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UserHeaderAftrLoginComponent } from './user-header-aftr-login.component';
import { AuthService } from '../../../services/auth.service';

describe('UserHeaderAftrLoginComponent', () => {
  const authMock = {
    getRole: () => 'admin',
    logout: jasmine.createSpy('logout'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHeaderAftrLoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authMock },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UserHeaderAftrLoginComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render role badge', () => {
    const fixture = TestBed.createComponent(UserHeaderAftrLoginComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('ADMIN');
  });

  it('should call logout on Logout click', () => {
    const fixture = TestBed.createComponent(UserHeaderAftrLoginComponent);
    fixture.detectChanges();

    const cmp = fixture.componentInstance;
    cmp.isOpen = true;
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.logout-btn') as HTMLButtonElement;
    btn.click();

    expect(authMock.logout).toHaveBeenCalled();
  });
});