import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Comment } from './comment.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/comments`;

  findByTicket(ticketId: string) {
    const params = new HttpParams().set('ticketId', ticketId);
    return this.http.get<Comment[]>(this.apiUrl, { params });
  }

  create(comment: Partial<Comment>) {
    return this.http.post<Comment>(this.apiUrl, comment);
  }
}