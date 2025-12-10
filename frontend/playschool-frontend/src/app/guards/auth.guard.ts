// src/app/guards/auth.guard.ts
import { Injectable, inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
class AuthGuardService {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = (next.data && next.data['roles']) as string[] | undefined;

    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    if (roles && roles.length && !this.auth.hasRole(roles)) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}

export const AuthGuard: CanActivateFn = (route, state) =>
  inject(AuthGuardService).canActivate(route, state);
