import { Routes } from '@angular/router';
import { canActivateAuthRole } from './auth/auth-role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
  },
  { path: 'ticket/new',
    canActivate: [canActivateAuthRole],
    data: { roles: ['reporter','engineer', 'admin'] },
    loadComponent: () => import('./features/tickets/ticket-form/ticket-form').then(m => m.TicketForm),
  },
  {
    path: 'tickets',
    loadChildren: () => import('./features/tickets/tickets.routes').then(m => m.ticketsRoutes),
  },
  {
    path: 'admin-panel',
    canActivate: [canActivateAuthRole],
    data: { roles: ['admin'] },
    loadComponent: () => import('./features/admin/admin-users/admin-users').then(m => m.AdminUsers),
  },
  {
    path: 'unassigned-tickets',
    loadComponent: () => import('./features/tickets/unassigned-tickets/unassigned-tickets').then(m => m.UnassignedTickets),
  },
  {
    path: 'search-archive',
    data: { title: 'Search Archive' },
    loadComponent: () => import('./shared/placeholder-page/placeholder-page').then(m => m.PlaceholderPage),
  },
  {
    path: 'changelog',
    data: { title: 'Changelog' },
    loadComponent: () => import('./shared/placeholder-page/placeholder-page').then(m => m.PlaceholderPage),
  },
  {
    path: 'faq',
    data: { title: 'FAQ' },
    loadComponent: () => import('./shared/placeholder-page/placeholder-page').then(m => m.PlaceholderPage),
  },
  {
    path: 'contact-us',
    data: { title: 'Contact Us' },
    loadComponent: () => import('./shared/placeholder-page/placeholder-page').then(m => m.PlaceholderPage),
  }
];