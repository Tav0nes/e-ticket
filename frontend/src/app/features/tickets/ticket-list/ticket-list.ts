import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { Ticket } from '../ticket.model'; 
import { TicketService } from '../ticket.service';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HasRolesDirective } from 'keycloak-angular';
import { MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-ticket-list',
  imports: [MatTableModule, MatChipsModule, RouterLink, DatePipe, MatButtonModule, HasRolesDirective, MatSortModule],
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
  
  sortData(sort: Sort) {
    const data = [...this.filteredTickets];

    if (!sort.active || sort.direction === '') {
      this.filteredTickets = [...this.tickets];
      return;
    }

    const isAsc = sort.direction === 'asc';
    this.filteredTickets = data.sort((a, b) => {
      switch (sort.active) {  
        case 'title':
          return this.compare(a.title, b.title, isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        case 'priority':
          return this.compare(this.priorityOrder[a.priority], this.priorityOrder[b.priority], isAsc);
        case 'createdAt':
          return this.compare(a.createdAt, b.createdAt, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare (a: string | Date | number, b: string | Date | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private priorityOrder: Record<string, number> = {
    'LOW': 0,
    'MEDIUM': 1,
    'HIGH': 2,
    'CRITICAL': 3,
  };


  private applyFilters() {    
    this.filteredTickets = this.tickets.filter((t) => {  
      const statusMatch = !this.activeStatusFilter || t.status === this.activeStatusFilter;
      const priorityMatch = !this.activePriorityFilter || t.priority === this.activePriorityFilter;
      return statusMatch && priorityMatch;  
    });
  }   
}
