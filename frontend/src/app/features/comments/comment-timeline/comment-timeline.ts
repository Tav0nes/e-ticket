import { Component, inject, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Comment } from '../comment.model';
import { CommentService } from '../comment.service';


@Component({
  selector: 'app-comment-timeline',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './comment-timeline.html',
  styleUrl: './comment-timeline.scss',
})
export class CommentTimeline implements OnInit {
  @Input({ required: true }) ticketId!: string;

  private fb = inject(FormBuilder);
  private commentService = inject(CommentService)
  private cdr = inject(ChangeDetectorRef);

  comments: Comment[] = []

  form = this.fb.nonNullable.group({
    body: ['', [Validators.required, Validators.minLength(1)]],
  });

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentService.findByTicket(this.ticketId).subscribe((data) => {
      this.comments = data;
      this.cdr.markForCheck();
    });
  }

  submit() {
    if (this.form.invalid) return;
    const payload: Partial<Comment> = {
      ticketId: this.ticketId,
      authorId: 'gustavo', // TODO: get from auth
      body: this.form.getRawValue().body,
    };
    this.commentService.create(payload).subscribe(() => {
      this.form.reset({ body: '' });
      this.loadComments();
    });
  }
}
