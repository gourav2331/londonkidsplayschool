// src/app/services/enquiry.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnquiryService {
  // IMPORTANT: relative URL so it works behind Nginx/Docker
  private baseUrl = '/api/enquiries';

  constructor(private http: HttpClient) {}

  submitEnquiry(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
}
