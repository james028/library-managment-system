import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, AuthUser } from './auth.service';

// Wymagane role wpisujesz w konfiguracji trasy jako data: { roles: [...] } —
// zobacz app.routes.ts. To odpowiednik @Roles('librarian') z dekoratora w Nest,
// tylko że tu nie ma dekoratorów na klasie, więc metadane trasy pełnią tę samą rolę.
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as AuthUser['role'][] | undefined;
  const user = authService.user();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    router.navigate(['/forbidden']);
    return false;
  }

  return true;
};
