import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

type LoginRole = 'parent' | 'admin' | 'teacher';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgClass],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  activeRole: LoginRole = 'admin';

  username = '';
  password = '';

  error: string | null = null;
  loading = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  setRole(role: LoginRole) {
    this.activeRole = role;
    this.error = null;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm) {
    this.error = null;

    if (this.activeRole === 'parent') {
      this.error = 'Parent login will be available soon.';
      return;
    }

    if (form.invalid) return;

    const role = this.activeRole as 'admin' | 'teacher';
    this.loading = true;

    this.auth.login(this.username, this.password, role).subscribe({
      next: (res: any) => {
        this.loading = false;

        const token = res?.token;
        const roleFromApi = (res?.role as LoginRole) || role;

        if (token) {
          localStorage.setItem('playschool_token', token);
          localStorage.setItem('playschool_role', roleFromApi);
        }

        if (roleFromApi === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (roleFromApi === 'teacher') {
          this.router.navigate(['/teacher/students']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.error || 'Login failed. Please check credentials.';
      },
    });
  }
}
