import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // signal() is Angular's modern reactive primitive
  // When isDark changes, anything that reads it automatically updates
  isDark = signal<boolean>(this.getInitialTheme());

  constructor() {
    // effect() runs whenever isDark changes
    // It keeps the DOM class and localStorage in sync automatically
    effect(() => {
      const dark = this.isDark();

      // Tailwind v4 dark mode reads the 'dark' class on <html>
      document.documentElement.classList.toggle('dark', dark);

      // Persist preference so it survives page refresh
      localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this.isDark.update(current => !current);
  }

  private getInitialTheme(): boolean {
    // 1. Check localStorage for a saved preference
    const saved = localStorage.getItem('portfolio-theme');
    if (saved) return saved === 'dark';

    // 2. Fall back to the OS-level preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
