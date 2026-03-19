import {
  Component,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector:   'app-page-loader',
  standalone: true,
  imports:    [CommonModule],
  template: `
    <div class="loader-overlay" [class.hidden]="hidden()">
      <div class="loader-content">
        <div class="loader-name">
          <span class="bracket">&lt;</span>
          <span class="name-text">Neelakshi</span>
          <span class="bracket">/&gt;</span>
        </div>
        <div class="loader-bar">
          <div class="loader-fill" [style.width.%]="fillWidth()"></div>
        </div>
        <p class="loader-subtitle">Building something meaningful...</p>
      </div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position:        fixed;
      inset:           0;
      background:      var(--color-bg);
      z-index:         10000;
      display:         flex;
      align-items:     center;
      justify-content: center;
      transition:      opacity 0.6s ease, visibility 0.6s ease;
    }
    .loader-overlay.hidden {
      opacity:    0;
      visibility: hidden;
      pointer-events: none;
    }
    .loader-content { text-align: center; }
    .loader-name {
      font-size:     2.5rem;
      font-weight:   700;
      margin-bottom: 1.5rem;
      animation:     pulse-name 1.2s ease infinite;
    }
    .bracket       { color: #7c3aed; }
    .name-text     { color: var(--color-text); margin: 0 0.3rem; }
    .loader-bar {
      width:         200px;
      height:        3px;
      background:    var(--color-border);
      border-radius: 2px;
      margin:        0 auto 1rem;
      overflow:      hidden;
    }
    .loader-fill {
      height:     100%;
      background: linear-gradient(90deg, #2479ad, #7c3aed);
      transition: width 0.1s linear;
      border-radius: 2px;
    }
    .loader-subtitle {
      font-size: 0.85rem;
      color:     var(--color-text-muted);
      animation: fade-pulse 1.5s ease infinite;
    }
    @keyframes pulse-name {
      0%, 100% { opacity: 1;    }
      50%      { opacity: 0.7;  }
    }
    @keyframes fade-pulse {
      0%, 100% { opacity: 0.5; }
      50%      { opacity: 1;   }
    }
  `]
})
export class PageLoaderComponent implements OnInit {
  hidden    = signal(false);
  fillWidth = signal(0);

  ngOnInit(): void {
    // Animate fill bar from 0 to 100
    let w = 0;
    const interval = setInterval(() => {
      w += Math.random() * 18 + 5;
      if (w >= 100) {
        w = 100;
        clearInterval(interval);
        // Hide after brief pause at 100%
        setTimeout(() => this.hidden.set(true), 300);
      }
      this.fillWidth.set(Math.min(w, 100));
    }, 120);
  }
}
