import { Routes } from '@angular/router';
import { canActivateAuthRole } from '../../auth/auth-role.guard';

export const ticketsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ticket-list/ticket-list').then(m => m.TicketList),
  },
  {
    path: 'new',
    canActivate: [canActivateAuthRole],
    data: { roles: ['reporter', 'engineer', 'admin'] },
    loadComponent: () => import('./ticket-form/ticket-form').then(m => m.TicketForm),
  },
  {
    path: ':id/edit',
    canActivate: [canActivateAuthRole],
    data: { roles: ['engineer', 'admin'] },
    loadComponent: () => import('./ticket-edit/ticket-edit').then(m => m.TicketEdit),
  },  
  {
    path: ':id',
    loadComponent: () => import('./ticket-detail/ticket-detail').then(m => m.TicketDetail),
  },
];