import { Routes } from '@angular/router';
import { canActivateAuthRole } from './auth/auth-role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
  },
  { path: 'tickets',
    loadChildren: () => import('./features/tickets/tickets.routes').then(m => m.ticketsRoutes),
  },
  {
    path: 'admin',
    canActivate: [canActivateAuthRole],
    data: { roles: ['admin'] },
    loadComponent: () => import('./features/admin/admin-users/admin-users').then(m => m.AdminUsers),
  },
];