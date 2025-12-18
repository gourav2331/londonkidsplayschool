import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EnquiryService } from './enquiry.service';

describe('EnquiryService', () => {
  let service: EnquiryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EnquiryService],
    });
    service = TestBed.inject(EnquiryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('submitEnquiry', () => {
    it('should submit enquiry successfully', (done) => {
      const enquiryData = {
        parent_name: 'John Doe',
        phone: '1234567890',
        email: 'john@example.com',
        message: 'Test message',
      };

      const mockResponse = {
        id: 1,
        ...enquiryData,
        source: 'contact',
        created_at: new Date().toISOString(),
      };

      service.submitEnquiry(enquiryData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne('/api/enquiries');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(enquiryData);
      req.flush(mockResponse);
    });

    it('should handle errors', (done) => {
      const enquiryData = {
        parent_name: 'John Doe',
        phone: '1234567890',
      };

      service.submitEnquiry(enquiryData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
          done();
        },
      });

      const req = httpMock.expectOne('/api/enquiries');
      req.flush(
        { error: 'parent_name and phone are required' },
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });
});

