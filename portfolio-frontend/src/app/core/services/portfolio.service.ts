import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { Observable, catchError, of }          from 'rxjs';
import { environment }        from '../../../environments/environment';
import { Project }            from '../../models/projects.model';
import { SkillCategory }      from '../../models/skill.model';
import { Education }          from '../../models/education.model';
import { Certification } from '../../models/certification.model';

// Add this interface above the class
export interface ContactPayload {
  name:    string;
  email:   string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

@Injectable({
  // providedIn: 'root' means this service is a singleton
  // Angular creates exactly one instance shared across the whole app
  providedIn: 'root'
})
export class PortfolioService {

  // Modern Angular uses inject() instead of constructor injection
  // Both work — inject() is cleaner for services
  private http   = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // ── Projects ──────────────────────────────────────────────────────────────

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`).pipe(
      // If the API is down, return an empty array instead of crashing
      catchError(err => {
        console.error('Failed to load projects:', err);
        return of([]);
      })
    );
  }

  getProject(id: number): Observable<Project | null> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${id}`).pipe(
      catchError(err => {
        console.error(`Failed to load project ${id}:`, err);
        return of(null);
      })
    );
  }

  // ── Skills ────────────────────────────────────────────────────────────────

  getSkills(): Observable<SkillCategory[]> {
    return this.http.get<SkillCategory[]>(`${this.apiUrl}/skills`).pipe(
      catchError(err => {
        console.error('Failed to load skills:', err);
        return of([]);
      })
    );
  }

  // ── Education ─────────────────────────────────────────────────────────────

  getEducation(): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.apiUrl}/education`).pipe(
      catchError(err => {
        console.error('Failed to load education:', err);
        return of([]);
      })
    );
  }

  getCertifications(): Observable<Certification[]> {
  return this.http.get<Certification[]>(`${this.apiUrl}/certifications`).pipe(
    catchError(err => {
      console.error('Failed to load certifications:', err);
      return of([]);
    })
  );
}
// ── Contact ───────────────────────────────────────────────────────────────────

sendMessage(payload: {
  name: string;
  email: string;
  message: string
}): Observable<{ success: boolean; message: string }> {

  return this.http.post<{ success: boolean; message: string }>(
    `${this.apiUrl}/contact`,
    payload
  ).pipe(
    catchError(err => {
      console.error('Failed to send message:', err);

      // Handle network error (server down, CORS, etc.)
      if (err.status === 0) {
        return of({
          success: false,
          message: 'Cannot reach server. Please email me directly at neelakshikadyan@gmail.com'
        });
      }

      // Handle server error
      return of({
        success: false,
        message: 'Something went wrong. Please try again.'
      });
    })
  );
}
wakeServer(): Observable<any> {
  return this.http.get(`${this.apiUrl}/health`).pipe(
    catchError(() => of(null)) // silently ignore errors
  );
}



}
