// src/app/components/pages/contact/contact.component.ts

import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EnquiryService } from '../../../services/enquiry.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
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

    const payload = {
      parent_name: form.value.name,
      phone: form.value.phone,
      email: form.value.email || null,
      message: form.value.message || null,
      source: 'contact',
    };

    this.isSubmitting = true;

    this.enquiryService.submitEnquiry(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = 'Thank you! We have received your message.';
        form.resetForm();
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'Something went wrong. Please try again.';
      },
    });
  }
}
