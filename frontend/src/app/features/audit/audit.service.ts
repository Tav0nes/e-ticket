import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuditEntry } from "./audit-entry.model";

@Injectable({ providedIn: 'root' })
export class AuditService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/audit';

  findByTicket(ticketId: string) {
    const params = new HttpParams().set('ticketId', ticketId);
    return this.http.get<AuditEntry[]>(this.apiUrl, { params });
  }
}