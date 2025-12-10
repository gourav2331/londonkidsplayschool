import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEnquiriesComponent } from './admin-enquiries.component';

describe('AdminEnquiriesComponent', () => {
  let component: AdminEnquiriesComponent;
  let fixture: ComponentFixture<AdminEnquiriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEnquiriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
