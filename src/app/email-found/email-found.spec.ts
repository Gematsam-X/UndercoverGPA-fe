import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFound } from './email-found';

describe('EmailFound', () => {
  let component: EmailFound;
  let fixture: ComponentFixture<EmailFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailFound],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
