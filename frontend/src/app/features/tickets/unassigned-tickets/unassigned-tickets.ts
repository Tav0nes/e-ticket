import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { TicketService } from "../ticket.service";
import { Ticket } from "../ticket.model";

type StatusFilter = 'ALL' | Ticket['status'];

@Component({
  selector: 'app-unassigned-tickets',
  imports: [
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    RouterLink,
    DatePipe,
  ],
  templateUrl: './unassigned-tickets.html',
  styleUrl: './unassigned-tickets.scss',
})

export class UnassignedTickets implements OnInit {
  private ticketService = inject(TicketService);

  readonly tickets = signal<Ticket[]>([]);
  readonly statusFilter = signal<StatusFilter>('ALL');

  readonly statuses: StatusFilter[] = [
    'ALL', 'OPEN', 'IN_PROGRESS', 'BLOCKED', 'RESOLVED', 'CLOSED',
  ];
  readonly displayedColumns = ['title', 'reporter', 'status', 'priority', 'createdAt'];

  readonly unassigned = computed(() => {
    const status = this.statusFilter();
    return this.tickets()
      .filter((t) => !t.assigneeId)
      .filter((t) => status === 'ALL' || t.status === status);
  });

  ngOnInit(): void {
    this.ticketService.findAll().subscribe((data) => this.tickets.set(data));
  }
}