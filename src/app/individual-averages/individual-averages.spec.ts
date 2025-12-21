import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualAverages } from './individual-averages';

describe('IndividualAverages', () => {
  let component: IndividualAverages;
  let fixture: ComponentFixture<IndividualAverages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualAverages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualAverages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
