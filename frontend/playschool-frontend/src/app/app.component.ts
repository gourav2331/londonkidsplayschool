// frontend/playschool-frontend/src/app/app.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/core/navbar/navbar.component';
import { FooterComponent } from './components/core/footer/footer.component';
import { UserHeaderAftrLoginComponent } from './components/core/user-header-aftr-login/user-header-aftr-login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // ✅ REQUIRED for *ngIf
    RouterOutlet,
    NavbarComponent,
    UserHeaderAftrLoginComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  auth = inject(AuthService);

  // Branding title (also used by tests sometimes)
  title = 'Tiny Roots Academy';
}