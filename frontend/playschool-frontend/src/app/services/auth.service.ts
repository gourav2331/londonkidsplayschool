// src/app/services/auth.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  role: 'admin' | 'teacher';
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private readonly TOKEN_KEY = 'lk_auth_token';
  private readonly ROLE_KEY = 'lk_auth_role';

  login(username: string, password: string, role: 'admin' | 'teacher'): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { username, password, role }).pipe(
      tap((res) => {
        this.setSession(res.token, res.role);
      })
    );
  }

  private setSession(token: string, role: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ROLE_KEY, role);
  }

  logout() {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.ROLE_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(allowed: string[]): boolean {
    const role = this.getRole();
    if (!role) return false;
    return allowed.includes(role);
  }
}
