import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-header-aftr-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-header-aftr-login.component.html',
  styleUrls: ['./user-header-aftr-login.component.css'],
})
export class UserHeaderAftrLoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  role = computed(() => (this.auth.getRole() ?? 'unknown').toUpperCase());
  isOpen = false;

  // Placeholder till DB/user profile arrives
  profile = {
    name: 'London Kids Staff',
    mobile: '-',
  };

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  closeMenu() {
    this.isOpen = false;
  }

  onLogout() {
    this.auth.logout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}