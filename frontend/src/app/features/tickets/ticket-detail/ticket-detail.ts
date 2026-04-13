import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { Ticket } from '../ticket.model';
import { TicketService } from '../ticket.service';

@Component({
  selector: 'app-ticket-detail',
  imports: [MatCardModule, MatChipsModule, MatButtonModule, RouterLink, DatePipe],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.scss',
})
export class TicketDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private ticketService = inject(TicketService)
  private cdr = inject(ChangeDetectorRef);

  ticket?: Ticket;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.ticketService.findOne(id).subscribe((data) => {
      this.ticket = data;
      this.cdr.markForCheck();
    });
  }
}
