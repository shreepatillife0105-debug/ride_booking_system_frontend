import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeconddriverComponent } from './seconddriver.component';

describe('SeconddriverComponent', () => {
  let component: SeconddriverComponent;
  let fixture: ComponentFixture<SeconddriverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeconddriverComponent]
    });
    fixture = TestBed.createComponent(SeconddriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
