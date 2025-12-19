import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  onAuthClick() {
    if (this.isLoggedIn()) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/login']);
  }
}