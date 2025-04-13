import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSelectorComponent } from './ticket-selector.component';

describe('TicketSelectorComponent', () => {
  let component: TicketSelectorComponent;
  let fixture: ComponentFixture<TicketSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
