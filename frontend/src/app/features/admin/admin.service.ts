import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface KeycloakUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  realmRoles: string[];
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/admin';

  getUsers(): Observable<KeycloakUser[]> {
    return this.http.get<KeycloakUser[]>(`${this.apiUrl}/users`);
  }
}