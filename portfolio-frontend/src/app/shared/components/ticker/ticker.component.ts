import {
  Component,
  OnInit,
  OnDestroy,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ticker-bar" >
      <span class="ticker-label">
        <span class="pulse-dot"></span>
        Currently exploring
      </span>
      <div class="ticker-track">
        <span
          class="ticker-item"
          [class.visible]="current() === i"
          *ngFor="let item of items; let i = index"
        >
          {{ item }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .ticker-bar {
      width:           100%;
      position:        fixed;
      background:      rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
      // border-bottom:   1px solid rgba(124, 58, 237, 0.15);
      padding:         0.3rem 2rem;
      display:         flex;
      align-items:     center;
      gap:             1rem;
      font-size:       0.8rem;
      height:          25px;
      overflow:        hidden;
      top:48px;
      z-index: 100;
    }
    :host-context(.dark){
      .ticker-bar {
        background: rgba(34, 34, 34, 0.3);
         backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
      }}

    .ticker-label {
      display:     flex;
      align-items: center;
      gap:         0.4rem;
      color:       var(--color-accent, #7c3aed);
      font-weight: 500;
      white-space: nowrap;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }
    .pulse-dot {
      width:         6px;
      height:        6px;
      border-radius: 50%;
      background:    #22c55e;
      animation:     pulse 2s ease infinite;
      display:       inline-block;
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0   rgba(34,197,94,0.4); }
      50%      { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
    }
    .ticker-track {
      position: relative;
      height:   1.2rem;
      flex:     1;
      overflow: hidden;
    }
    .ticker-item {
      position:   absolute;
      left:       0;
      top:        0;
      color:      var(--color-text, #222);
      font-weight: 400;
      opacity:    0;
      transform:  translateY(12px);
      transition: opacity 0.5s ease, transform 0.5s ease;
      white-space: nowrap;
    }
    .ticker-item.visible {
      opacity:   1;
      transform: translateY(0);
    }
  `]
})
export class TickerComponent implements OnInit, OnDestroy {

  items = [
    'AI-powered full-stack applications 🤖',
    'System design at scale 🏗️',
    'Responsive web design 🖥️',
    'Cloud-native architecture with AWS ☁️',
    'DevOps best practices with CI/CD pipelines 🔧',
    'Team work and agile methodologies 🤝',
    'Microservices with Docker & Kubernetes 🐳',
    'Performance optimization and caching 🚀',
    'Security best practices 🔒',
    'code quality and maintainability 🧹',
    'Continuous learning and growth 📚',
    'Core qualities: problem-solving, adaptability, and collaboration 🌟',
    'core working of a system, from the frontend to the backend and everything in between 🧩'
  ];

  current = signal(0);
  private id!: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.id = setInterval(() => {
      this.current.update(i => (i + 1) % this.items.length);
    }, 3000);
  }

  ngOnDestroy(): void { clearInterval(this.id); }
}
