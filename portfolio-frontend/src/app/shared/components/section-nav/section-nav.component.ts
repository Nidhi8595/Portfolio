import {
  Component,
  OnInit,
  OnDestroy,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface NavDot {
  id:    string;
  label: string;
}

@Component({
  selector:   'app-section-nav',
  standalone: true,
  imports:    [CommonModule],
  template: `
    <nav class="section-nav" aria-label="Section navigation">
      <div
        class="nav-dot-wrapper"
        *ngFor="let dot of dots"
        (click)="scrollTo(dot.id)"
        [title]="dot.label"
      >
        <span class="dot-label">{{ dot.label }}</span>
        <div
          class="nav-dot"
          [class.active]="active() === dot.id"
        ></div>
      </div>
    </nav>
  `,
  styles: [`
    .section-nav {
      position:       fixed;
      right:          1.5rem;
      top:            50%;
      transform:      translateY(-50%);
      z-index:        500;
      display:        flex;
      flex-direction: column;
      gap:            0.75rem;
      align-items:    flex-end;
    }
    .nav-dot-wrapper {
      display:     flex;
      align-items: center;
      gap:         0.5rem;
      cursor:      pointer;
    }
    .dot-label {
      font-size:      0.7rem;
      font-weight:    600;
      letter-spacing: 0.06em;
      color:          var(--color-text-muted);
      opacity:        0;
      transform:      translateX(8px);
      transition:     opacity 0.2s, transform 0.2s;
      white-space:    nowrap;
    }
    .nav-dot-wrapper:hover .dot-label { opacity: 1; transform: translateX(0); }
    .nav-dot {
      width:         8px;
      height:        8px;
      border-radius: 50%;
      border:        2px solid var(--color-accent);
      background:    transparent;
      transition:    all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nav-dot.active {
      background:    var(--color-accent);
      width:         10px;
      height:        10px;
      box-shadow:    0 0 0 3px rgba(124, 58, 237, 0.2);
    }
    @media (max-width: 1024px) { .section-nav { display: none; } }
  `]
})
export class SectionNavComponent implements OnInit, OnDestroy {

  dots: NavDot[] = [
    { id: 'hero',           label: 'Home'           },
    { id: 'skills',         label: 'Skills'         },
    { id: 'projects',       label: 'Projects'       },
    { id: 'certifications', label: 'Certifications' },
    { id: 'education',      label: 'Education'      },
    { id: 'contact',        label: 'Contact'        },
  ];

  active = signal('hero');

  private observer!: IntersectionObserver;

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) this.active.set(e.target.id);
        });
      },
      { rootMargin: '-50% 0px', threshold: 0 }
    );
    this.dots.forEach(d => {
      const el = document.getElementById(d.id);
      if (el) this.observer.observe(el);
    });
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
