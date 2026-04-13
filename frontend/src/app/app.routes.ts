import { Routes } from '@angular/router';
import { TicketList } from './features/tickets/ticket-list/ticket-list';

export const routes: Routes = [
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  { path: 'tickets', component: TicketList },
];
