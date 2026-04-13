import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { Ticket } from '../ticket.model'; 
import { TicketService } from '../ticket.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ticket-list',
  imports: [MatTableModule, MatChipsModule, RouterLink, DatePipe],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.scss',
})

export class TicketList implements OnInit {
  private ticketService = inject(TicketService);
  private cdr = inject(ChangeDetectorRef);

  tickets: Ticket[] = []; 
  filteredTickets: Ticket[] = []; 
  displayedColumns: string[] = ['title', 'status', 'priority', 'createdAt'];

  statusOptions = ['OPEN', 'IN_PROGRESS', 'BLOCKED', 'RESOLVED', 'CLOSED'];

  priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  activeStatusFilter: string | null = null; 
  activePriorityFilter: string | null = null;

  ngOnInit() {
    this.ticketService.findAll().subscribe((data) => {
      this.tickets = data;
      this.filteredTickets = data;
      this.cdr.markForCheck();
    });
  } 

  filterByStatus(status: string) {
    this.activeStatusFilter = this.activeStatusFilter === status ? null : status; 
    this.applyFilters();  
  } 

  filterByPriority(priority: string) {  
    this.activePriorityFilter = this.activePriorityFilter === priority ? null : priority; 
    this.applyFilters();  
  } 

  private applyFilters() {    
    this.filteredTickets = this.tickets.filter((t) => {  
      const statusMatch = !this.activeStatusFilter || t.status === this.activeStatusFilter;
      const priorityMatch = !this.activePriorityFilter || t.priority === this.activePriorityFilter;
      return statusMatch && priorityMatch;  
    });
  }   
}
