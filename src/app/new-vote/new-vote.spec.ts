import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVote } from './new-vote';

describe('NewVote', () => {
  let component: NewVote;
  let fixture: ComponentFixture<NewVote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewVote],
    }).compileComponents();

    fixture = TestBed.createComponent(NewVote);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
