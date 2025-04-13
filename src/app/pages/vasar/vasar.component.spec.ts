import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VasarComponent } from './vasar.component';

describe('VasarComponent', () => {
  let component: VasarComponent;
  let fixture: ComponentFixture<VasarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VasarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VasarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
