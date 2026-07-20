import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuditEntry } from "./audit-entry.model";
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/audit`;

  findByTicket(ticketId: string) {
    const params = new HttpParams().set('ticketId', ticketId);
    return this.http.get<AuditEntry[]>(this.apiUrl, { params });
  }
}