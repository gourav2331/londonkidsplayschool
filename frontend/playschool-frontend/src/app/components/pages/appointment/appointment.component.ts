import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EnquiryService } from '../../../services/enquiry.service';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
})
export class AppointmentComponent {
  submitSuccess: string | null = null;
  submitError: string | null = null;
  isSubmitting = false;

  constructor(private enquiryService: EnquiryService) {}

  onSubmit(form: NgForm) {
    this.submitSuccess = null;
    this.submitError = null;

    if (form.invalid) {
      this.submitError = 'Please fill in the required fields.';
      return;
    }

    const value = form.value;

    const payload = {
      parent_name: value.parentName,
      phone: value.phone,
      email: value.email || null,
      child_name: value.childName || null,
      child_age: value.childAge ? Number(value.childAge) : null,
      class_applied_for: value.classAppliedFor || null,
      message: value.message || null,
      source: 'appointment',
    };

    this.isSubmitting = true;

    this.enquiryService.submitEnquiry(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess =
          'Thank you! Your visit request has been received. We will contact you shortly.';
        form.resetForm();
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'Something went wrong. Please try again.';
      },
    });
  }
}
