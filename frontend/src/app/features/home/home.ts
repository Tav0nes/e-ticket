import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import Keycloak from 'keycloak-js';
import { StatsService } from './stats.service';
import { StatsOverview } from './stats.model';
import { TicketService } from '../tickets/ticket.service';
import { Ticket } from '../tickets/ticket.model';

type StatusFilter = 'ALL' | Ticket['status'];

@Component({
  selector: 'app-home',
  imports: [
    MatCardModule, 
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    RouterLink,
    DatePipe,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'  
})

export class Home implements OnInit {
  private statsService = inject(StatsService);
  private ticketService = inject(TicketService);
  private keycloak = inject(Keycloak);

  readonly stats = signal<StatsOverview | null>(null);
  readonly tickets = signal<Ticket[]>([]);
  readonly statusFilter = signal<StatusFilter>('ALL');

  readonly statuses: StatusFilter[] = [
    'ALL', 'OPEN', 'IN_PROGRESS', 'BLOCKED', 'RESOLVED', 'CLOSED',
  ];
  readonly displayedColumns = ['title', 'status', 'priority', 'createdAt'];

  get currentUser(): string {
    return (this.keycloak.tokenParsed?.['preferred_username'] as string | undefined) ?? '';
  }

  readonly myTickets = computed(() => {
    const user = this.currentUser;
    const status = this.statusFilter();
    return this.tickets()
      .filter((t) => t.reporterId === user || t.assigneeId === user)
      .filter((t) => status === 'ALL' || t.status === status);
  });
  
  readonly kpis = computed(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      { label: 'Avg. Response Time', value: s.avgResponseTime.toFixed(2), unit: 'days', color: '#06b6d4' },
      { label: 'Avg. Resolution Time', value: s.avgResolutionTime.toFixed(2), unit: 'days', color: '#ef4444' },
      { label: 'Active Users', value: s.activeUsers.toString(), unit: 'Users', color: '#eab308' },
      { label: 'Tickets Created', value: s.ticketsCreated.toString(), unit: 'Created', color: '#1f2937' },
      { label: 'Tickets New/Open', value: s.ticketsNewOpen.toString(), unit: 'New/Open', color: '#22c55e' },
      { label: 'Tickets Closed', value: s.ticketsClosed.toString(), unit: 'Closed', color: '#16a34a' },
    ];
  });

  ngOnInit(): void {
    this.statsService.getOverview().subscribe((data) => this.stats.set(data));
    this.ticketService.findAll().subscribe((data) => this.tickets.set(data));
  }
}
