import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectingServer } from './connecting-server';

describe('ConnectingServer', () => {
  let component: ConnectingServer;
  let fixture: ComponentFixture<ConnectingServer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectingServer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectingServer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
