import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ticket } from './ticket.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tickets`;

  findAll() {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  findOne(id: string) {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  create(ticket: Partial<Ticket>) {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  update(id: string, ticket: Partial<Ticket>) {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}`, ticket);
  }
}
