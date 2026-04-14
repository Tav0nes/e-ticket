import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentTimeline } from './comment-timeline';

describe('CommentTimeline', () => {
  let component: CommentTimeline;
  let fixture: ComponentFixture<CommentTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentTimeline],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentTimeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
