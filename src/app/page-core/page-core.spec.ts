import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCore } from './page-core';

describe('PageCore', () => {
  let component: PageCore;
  let fixture: ComponentFixture<PageCore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageCore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageCore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
