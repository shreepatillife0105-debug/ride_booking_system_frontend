import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondcustomerComponent } from './secondcustomer.component';

describe('SecondcustomerComponent', () => {
  let component: SecondcustomerComponent;
  let fixture: ComponentFixture<SecondcustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecondcustomerComponent]
    });
    fixture = TestBed.createComponent(SecondcustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
