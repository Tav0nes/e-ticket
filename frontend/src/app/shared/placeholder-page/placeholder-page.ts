import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-placeholder-page',
  imports: [MatCardModule, MatIconModule],
  template: `
    <mat-card class="placeholder">
      <mat-card-content>
        <mat-icon class="placeholder-icon">construction</mat-icon>
        <h2 class="placeholder-title">{{ title }}</h2>
        <p class="placeholder-body">Coming soon - wire up later in Sprint 6.</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .placeholder {
      max-width: 480px;
      margin: 80px auto;
      text-align: center;
    }
    .placeholder-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      opacity: 0.5;
      margin-bottom: 16px;
    }
    .placeholder-title {
      margin: 0 0 8px;
    }
    .placeholder-body {
      opacity: 0.7;
      margin: 0;
    }
  `,
})

export class PlaceholderPage {
  private route = inject(ActivatedRoute);

  readonly title = this.route.snapshot.data['title'] || 'Coming Soon';
}
