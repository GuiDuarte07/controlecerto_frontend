import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const authToken = cookieService.get('BearerToken');
  if (authToken) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
