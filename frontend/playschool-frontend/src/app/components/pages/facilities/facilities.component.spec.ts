import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FacilitiesComponent } from './facilities.component';

describe('FacilitiesComponent', () => {
  let component: FacilitiesComponent;
  let fixture: ComponentFixture<FacilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilitiesComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
