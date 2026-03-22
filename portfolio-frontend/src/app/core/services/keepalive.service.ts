import { inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient }            from '@angular/common/http';
import { environment }           from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class KeepaliveService implements OnDestroy {

  private interval!: ReturnType<typeof setInterval>;
  private http      = inject(HttpClient);

  constructor() {
    // Ping the API every 14 minutes to prevent spin-down
    this.interval = setInterval(() => {
      this.http.get(`${environment.apiUrl}/projects`).subscribe();
    }, 14 * 60 * 1000);
  }

  ngOnDestroy(): void { clearInterval(this.interval); }
}
