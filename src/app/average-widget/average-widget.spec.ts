import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AverageWidget } from "./average-widget";

describe("AverageWidget", () => {
  let component: AverageWidget;
  let fixture: ComponentFixture<AverageWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AverageWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(AverageWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
