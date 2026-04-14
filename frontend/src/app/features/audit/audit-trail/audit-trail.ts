import { Component, inject, Input, OnInit, OnChanges, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuditEntry } from '../audit-entry.model';
import { AuditService } from '../audit.service';

@Component({
  selector: 'app-audit-trail',
  imports: [DatePipe, MatListModule, MatIconModule],
  templateUrl: './audit-trail.html',
  styleUrl: './audit-trail.scss',
})
export class AuditTrail implements OnInit, OnChanges {
  @Input({ required: true }) ticketId!: string;

  private auditService = inject(AuditService);
  private cdr = inject(ChangeDetectorRef);

  entries: AuditEntry[] = [];

  ngOnInit() {
    this.load();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ticketId'] && !changes['ticketId'].firstChange) {
      this.load();
    }
  }
  
  private load() {
    this.auditService.findByTicket(this.ticketId).subscribe((data) => {
      this.entries = data;
      this.cdr.markForCheck();
    });
  }

  describeAction(entry: AuditEntry): string {
    const from = entry.fromValue ?? '-';
    const to = entry.toValue ?? '-';
    switch (entry.action) {
      case 'STATUS_CHANGED':
        return `Status changed from ${from} to ${to}`;
      case 'ASSIGNEE_CHANGED':
        return `Assignee changed from ${from} to ${to}`;
      default:
        return `${entry.action}: ${from} → ${to}`;
    }
  }
}
