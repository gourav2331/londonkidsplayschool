import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student, StudentService } from '../../../services/student.service';
import { HttpClient } from '@angular/common/http';

interface DashboardCounts {
  totalStudents: number;
  totalEnquiries: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchText = '';

  counts: DashboardCounts = {
    totalStudents: 0,
    totalEnquiries: 0,
  };

  loading = false;
  error: string | null = null;

  selectedStudent: Student | null = null;

  constructor(
    private studentService: StudentService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadEnquiryCount();
  }

  loadStudents() {
    this.loading = true;
    this.error = null;

    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.loading = false;
        this.students = data || [];
        this.filteredStudents = [...this.students];
        this.counts.totalStudents = this.students.length;
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load students.';
      },
    });
  }

  loadEnquiryCount() {
    this.http.get<any[]>('/api/admin/enquiries').subscribe({
      next: (enquiries) => {
        this.counts.totalEnquiries = enquiries?.length || 0;
      },
      error: () => {
        this.counts.totalEnquiries = 0;
      },
    });
  }

  onSearchChange(value: string) {
    const v = (value || '').toLowerCase().trim();
    this.searchText = v;
  
    if (!v) {
      this.filteredStudents = [...this.students];
      return;
    }
  
    this.filteredStudents = this.students.filter((s) => {
      return (
        (s.child_name || '').toLowerCase().includes(v) ||
        (s.parent_name || '').toLowerCase().includes(v) ||
        (s.class_name || '').toLowerCase().includes(v) ||
        (s.phone || '').toLowerCase().includes(v)
      );
    });
  }
  

  openStudentDetails(student: Student) {
    this.selectedStudent = student;
  }

  closeStudentDetails() {
    this.selectedStudent = null;
  }
}
