import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Student, StudentService } from '../../../services/student.service';

@Component({
  selector: 'app-teacher-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-students.component.html',
  styleUrls: ['./teacher-students.component.css'],
})
export class TeacherStudentsComponent implements OnInit {
  students: Student[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;

  // form model
  child_name = '';
  class_name = '';
  age: number | null = null;
  parent_name = '';
  phone = '';
  address = '';

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.loading = true;
    this.error = null;

    this.studentService.getTeacherStudents().subscribe({
      next: (data) => {
        this.loading = false;
        this.students = data || [];
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load students.';
      },
    });
  }

  onSubmit(form: NgForm) {
    this.error = null;
    this.success = null;

    if (form.invalid) {
      this.error = 'Please fill all required fields.';
      return;
    }

    const payload = {
      child_name: this.child_name,
      class_name: this.class_name,
      age: this.age,
      parent_name: this.parent_name,
      phone: this.phone,
      address: this.address,
    };

    this.studentService.addStudentForTeacher(payload).subscribe({
      next: (created) => {
        this.success = 'Student added successfully.';
        this.students.unshift(created);
        form.resetForm();
      },
      error: () => {
        this.error = 'Failed to add student.';
      },
    });
  }
}
