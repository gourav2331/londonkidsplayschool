// src/app/services/admin-enquiry.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

export interface Enquiry {
  id: number;
  parent_name: string;
  phone: string;
  email: string | null;
  child_name: string | null;
  child_age: number | null;
  class_applied_for: string | null;
  source: string;
  created_at: string;
  message: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AdminEnquiryService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  getEnquiries(): Observable<Enquiry[]> {
    const token = this.auth.getToken();
    const headers: HttpHeaders = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.get<Enquiry[]>('/api/admin/enquiries', { headers });
  }
}
