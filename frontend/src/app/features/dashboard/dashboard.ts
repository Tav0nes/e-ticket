import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { TicketService } from '../tickets/ticket.service';
import { Ticket } from '../tickets/ticket.model';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'  
})

export class Dashboard implements OnInit {
  private ticketService = inject(TicketService);  
  private cdr = inject(ChangeDetectorRef);

  tickets: Ticket[] = [];

  statusCounts: Record<string, number> = {};
  priorityCounts: Record<string, number> = {};
  totalCount: number = 0;

  statuses = ['OPEN', 'IN_PROGRESS', 'BLOCKED', 'RESOLVED', 'CLOSED'];
  priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  ngOnInit() {
    this.ticketService.findAll().subscribe((data) => {
      this.tickets = data;
      this.totalCount = data.length;
      this.statusCounts = this.countBy(data, 'status');
      this.priorityCounts = this.countBy(data, 'priority');
      this.cdr.markForCheck();
    });
  }

  private countBy(tickets: Ticket[], key: 'status' | 'priority'): Record<string, number> {
    return tickets.reduce((acc, ticket) => {
      const value = ticket[key];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}
