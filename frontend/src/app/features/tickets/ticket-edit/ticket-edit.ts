import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TicketService } from '../ticket.service';
import { Ticket } from '../ticket.model';

@Component({
  selector: 'app-ticket-edit',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './ticket-edit.html',
  styleUrl: './ticket-edit.scss',
})
export class TicketEdit implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute)
  private ticketService = inject(TicketService)
  private router = inject(Router)
  private cdr = inject(ChangeDetectorRef);

  ticketId!: string;
  statusOptions = ['OPEN', 'IN_PROGRESS', 'BLOCKED', 'RESOLVED', 'CLOSED'];
  priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    status: ['OPEN', [Validators.required]],
    priority: ['MEDIUM', [Validators.required]],
    category: [''],
    assigneeId: [''],
  });

  ngOnInit() {
    this.ticketId = this.route.snapshot.paramMap.get('id')!;
    this.ticketService.findOne(this.ticketId).subscribe((ticket) => {
      this.form.patchValue({
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category ?? '',
        assigneeId: ticket.assigneeId ?? '',
      });
      this.cdr.markForCheck();
    });
  }

  submit() {
    if (this.form.invalid) return;
    
    this.ticketService.update(this.ticketId, this.form.getRawValue() as Partial<Ticket>).subscribe(() => {
      this.router.navigate(['/tickets', this.ticketId]);
    });
  }
}
