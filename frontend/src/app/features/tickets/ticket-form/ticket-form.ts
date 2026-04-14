import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TicketService } from '../ticket.service';
import { Ticket } from '../ticket.model';

@Component({
  selector: 'app-ticket-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.scss',
})
export class TicketForm {
  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService)
  private router = inject(Router);

  statusOptions = ['OPEN', 'IN_PROGRESS', 'BLOCKED', 'RESOLVED', 'CLOSED'];
  priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    status: ['OPEN', [Validators.required]],
    priority: ['MEDIUM', [Validators.required]],
    category: [''],
  });

  submit() {
    if (this.form.invalid) return;
    
    this.ticketService.create(this.form.getRawValue() as Partial<Ticket>).subscribe((created) => {
      this.router.navigate(['/tickets', created.id]);
    }); 
  }
}
