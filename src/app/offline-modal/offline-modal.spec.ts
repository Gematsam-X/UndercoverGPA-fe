import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OfflineModalComponent as OfflineModal } from "./offline-modal";

describe("OfflineModal", () => {
  let component: OfflineModal;
  let fixture: ComponentFixture<OfflineModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfflineModal],
    }).compileComponents();

    fixture = TestBed.createComponent(OfflineModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
