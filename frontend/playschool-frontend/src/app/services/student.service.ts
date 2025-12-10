// src/app/services/student.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id?: number;
  child_name: string;
  class_name: string;
  age?: number | null;
  parent_name?: string | null;
  phone: string;
  address?: string | null;
  created_at?: string;
  created_by_username?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // Teacher: own students
  getTeacherStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/teacher/students`);
  }

  addStudentForTeacher(payload: Omit<Student, 'id' | 'created_at' | 'created_by_username'>): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/teacher/students`, payload);
  }

  // Admin: all students
  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/admin/students`);
  }
}
