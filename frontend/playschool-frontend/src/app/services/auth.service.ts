import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  role: 'admin' | 'teacher';
  username: string;
  // mobile?: string; // later when DB ready
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private readonly TOKEN_KEY = 'lk_auth_token';
  private readonly ROLE_KEY = 'lk_auth_role';
  private readonly USERNAME_KEY = 'lk_auth_username';
  private readonly MOBILE_KEY = 'lk_auth_mobile'; // placeholder for now

  login(username: string, password: string, role: 'admin' | 'teacher'): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { username, password, role }).pipe(
      tap((res) => {
        this.setSession(res.token, res.role, res.username);
      })
    );
  }

  private setSession(token: string, role: string, username: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ROLE_KEY, role);
    localStorage.setItem(this.USERNAME_KEY, username);

    // placeholder mobile until DB provides it
    if (!localStorage.getItem(this.MOBILE_KEY)) {
      localStorage.setItem(this.MOBILE_KEY, 'Not set');
    }
  }

  logout() {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.MOBILE_KEY);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.ROLE_KEY);
  }

  getUsername(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.USERNAME_KEY);
  }

  getMobile(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.MOBILE_KEY);
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