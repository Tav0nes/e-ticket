import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ticket } from './ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tickets';

  findAll() {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  findOne(id: string) {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  create(ticket: Partial<Ticket>) {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }
}
