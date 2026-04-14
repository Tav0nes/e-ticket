import { Routes } from '@angular/router';

export const ticketsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ticket-list/ticket-list').then(m => m.TicketList),
  },
  {
    path: 'new',
    loadComponent: () => import('./ticket-form/ticket-form').then(m => m.TicketForm),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./ticket-edit/ticket-edit').then(m => m.TicketEdit),
  },  
  {
    path: ':id',
    loadComponent: () => import('./ticket-detail/ticket-detail').then(m => m.TicketDetail),
  },
];