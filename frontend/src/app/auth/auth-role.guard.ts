import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;

  if (!authenticated) {
    const router = inject(Router);
    return router.parseUrl('/tickets');
  }

  const requiredRoles = route.data['roles'] as string[] | undefined;
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const hasRole = requiredRoles.some((role) => grantedRoles.realmRoles.includes(role));

  if (hasRole) { 
    return true;
  }

  const router = inject(Router);
  return router.parseUrl('/tickets');
};

export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);