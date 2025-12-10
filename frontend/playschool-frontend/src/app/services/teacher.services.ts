// src/app/services/teacher.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id: number;
  child_name: string;
  class_name: string;
  age: number | null;
  parent_name: string | null;
  phone: string;
  address: string | null;
  created_by_role: string;
  created_by_username: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class TeacherService {
  constructor(private http: HttpClient) {}

  getMyStudents(): Observable<Student[]> {
    return this.http.get<Student[]>('/api/teacher/students');
  }

  addStudent(payload: Partial<Student>): Observable<{ id: number }> {
    return this.http.post<{ id: number }>('/api/teacher/students', payload);
  }
}
