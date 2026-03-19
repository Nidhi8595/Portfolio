import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector:   'app-cursor-glow',
  standalone: true,
  imports:    [CommonModule],
  template: `
    <div
      class="cursor-glow"
      [style.left.px]="x()"
      [style.top.px]="y()"
      [class.dark]="themeService.isDark()"
    ></div>
  `,
  styles: [`
    .cursor-glow {
      position:       fixed;
      width:          400px;
      height:         400px;
      border-radius:  50%;
      pointer-events: none;
      z-index:        0;
      transform:      translate(-50%, -50%);
      background:     radial-gradient(
        circle,
        rgba(124, 58, 237, 0.06) 0%,
        transparent 70%
      );
      transition:     left 0.12s ease-out, top 0.12s ease-out;
      will-change:    left, top;
    }
    .cursor-glow.dark {
      background: radial-gradient(
        circle,
        rgba(124, 58, 237, 0.1) 0%,
        transparent 70%
      );
    }
    @media (max-width: 768px) {
      .cursor-glow { display: none; }
    }
  `]
})
export class CursorGlowComponent implements OnInit, OnDestroy {
  themeService = inject(ThemeService);

  x = signal(-400);
  y = signal(-400);

  private onMove = (e: MouseEvent) => {
    this.x.set(e.clientX);
    this.y.set(e.clientY);
  };

  ngOnInit():    void { window.addEventListener('mousemove', this.onMove); }
  ngOnDestroy(): void { window.removeEventListener('mousemove', this.onMove); }
}
