import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch }    from '@angular/common/http';
import { provideAnimationsAsync }          from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    // Just renamed from provideExperimentalZonelessChangeDetection
    // to provideZonelessChangeDetection in newer Angular versions
    provideZonelessChangeDetection(),

    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
  ]
};
