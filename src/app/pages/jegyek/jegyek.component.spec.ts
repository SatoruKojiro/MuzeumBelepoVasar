import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JegyekComponent } from './jegyek.component';

describe('JegyekComponent', () => {
  let component: JegyekComponent;
  let fixture: ComponentFixture<JegyekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JegyekComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JegyekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
