import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-async-state',
  imports: [
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './async-state.html',
  styleUrl: './async-state.scss',
})
export class AsyncState {
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() empty = false;
  @Input() emptyMessage = 'No data to display.';

  @Output() retry = new EventEmitter<void>();
}
