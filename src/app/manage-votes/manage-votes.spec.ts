import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ManageVotesComponent as ManageVotes } from "./manage-votes";

describe("ManageVotes", () => {
  let component: ManageVotes;
  let fixture: ComponentFixture<ManageVotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageVotes],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageVotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
