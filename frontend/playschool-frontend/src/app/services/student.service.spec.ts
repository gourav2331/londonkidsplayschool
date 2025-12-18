import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudentService],
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTeacherStudents', () => {
    it('should fetch teacher students', (done) => {
      const mockStudents = [
        {
          id: 1,
          child_name: 'Alice',
          class_name: 'Nursery',
          age: 4,
          phone: '1234567890',
        },
      ];

      service.getTeacherStudents().subscribe((students) => {
        expect(students).toEqual(mockStudents);
        done();
      });

      const req = httpMock.expectOne('/api/teacher/students');
      expect(req.request.method).toBe('GET');
      req.flush(mockStudents);
    });
  });

  describe('addStudentForTeacher', () => {
    it('should add student for teacher', (done) => {
      const studentData = {
        child_name: 'Bob',
        class_name: 'Playgroup',
        phone: '9876543210',
      };

      const mockResponse = { id: 2, ...studentData };

      service.addStudentForTeacher(studentData).subscribe((student) => {
        expect(student).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne('/api/teacher/students');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(studentData);
      req.flush(mockResponse);
    });
  });

  describe('getAllStudents', () => {
    it('should fetch all students for admin', (done) => {
      const mockStudents = [
        {
          id: 1,
          child_name: 'Alice',
          class_name: 'Nursery',
          phone: '1234567890',
        },
        {
          id: 2,
          child_name: 'Bob',
          class_name: 'Playgroup',
          phone: '9876543210',
        },
      ];

      service.getAllStudents().subscribe((students) => {
        expect(students).toEqual(mockStudents);
        done();
      });

      const req = httpMock.expectOne('/api/admin/students');
      expect(req.request.method).toBe('GET');
      req.flush(mockStudents);
    });
  });
});

