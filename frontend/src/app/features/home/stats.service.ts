import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { StatsOverview } from "./stats.model";
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/stats`;

  getOverview(): Observable<StatsOverview> {
    return this.http.get<StatsOverview>(`${this.apiUrl}/overview`);
  }
}