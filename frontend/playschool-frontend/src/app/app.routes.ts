import { Routes } from '@angular/router';

import { HomeComponent } from './components/pages/home/home.component';
import { AboutComponent } from './components/pages/about/about.component';
import { ClassesComponent } from './components/pages/classes/classes.component';
import { FacilitiesComponent } from './components/pages/facilities/facilities.component';
import { AppointmentComponent } from './components/pages/appointment/appointment.component';
import { ContactComponent } from './components/pages/contact/contact.component';

import { LoginComponent } from './components/auth/login/login.component';
import { AdminEnquiriesComponent } from './components/pages/admin-enquiries/admin-enquiries.component';
import { AdminDashboardComponent } from './components/pages/admin-dashboard/admin-dashboard.component';
import { TeacherStudentsComponent } from './components/pages/teacher-students/teacher-students.component';

import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'facilities', component: FacilitiesComponent },
  { path: 'appointment', component: AppointmentComponent },
  { path: 'contact', component: ContactComponent },

  { path: 'login', component: LoginComponent },

  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'admin/enquiries',
    component: AdminEnquiriesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'teacher'] },
  },
  {
    path: 'teacher/students',
    component: TeacherStudentsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['teacher'] },
  },

  { path: '**', redirectTo: '' },
];
