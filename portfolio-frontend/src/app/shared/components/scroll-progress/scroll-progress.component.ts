import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector:   'app-scroll-progress',
  standalone: true,
  imports:    [CommonModule],
  template: `
    <div class="progress-track">
      <div class="progress-bar" [style.width.%]="progress()"></div>
    </div>
  `,
  styles: [`
    .progress-track {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      z-index: 9999;
      background: transparent;
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #2479ad, #7c3aed, #2479ad);
      background-size: 200% 100%;
      animation: shimmer 2s linear infinite;
      transition: width 0.1s linear;
      border-radius: 0 2px 2px 0;
    }
    @keyframes shimmer {
      0%   { background-position: 100% 0; }
      100% { background-position: -100% 0; }
    }
  `]
})
export class ScrollProgressComponent {
  progress = signal(0);

  @HostListener('window:scroll')
  onScroll(): void {
    const doc    = document.documentElement;
    const scroll = doc.scrollTop  || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    this.progress.set(height > 0 ? (scroll / height) * 100 : 0);
  }
}
