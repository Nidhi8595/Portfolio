import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  inject
} from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector:   'app-code-rain',
  standalone: true,
  template:   `<canvas #rain class="code-rain"></canvas>`,
  styles: [`
    .code-rain {
      position:       absolute;
      inset:          0;
      width:          100%;
      height:         100%;
      pointer-events: none;
      opacity:        0.3;
      z-index:        0;
    }
  `]
})

export class CodeRainComponent implements AfterViewInit, OnDestroy {

  @ViewChild('rain') canvasRef!: ElementRef<HTMLCanvasElement>;
  private themeService = inject(ThemeService);

  private ctx!:       CanvasRenderingContext2D;
  private drops:      number[] = [];
  private rafId!:     number;
  private cols        = 0;
  private fontSize    = 12;
  private frameCount  = 0;
  private frameSkip   = 6; // ← only draw every 6th frame — increase to slow further

  private chars = ['<div>', 'import', 'export', 'async', 'await', 'GET',
                   'https', 'localhost', 'POST', 'class', 'PUT', 'interface',
                   'DELETE', 'return', 'const', 'function', 'type', 'extends'];

  ngAfterViewInit(): void {
    const canvas  = this.canvasRef.nativeElement;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.ctx      = canvas.getContext('2d')!;
    this.cols     = Math.floor(canvas.width / (this.fontSize * 9));
    this.drops    = Array(this.cols).fill(1);
    this.animate();
  }

  ngOnDestroy(): void { cancelAnimationFrame(this.rafId); }

  private animate = (): void => {
    this.rafId = requestAnimationFrame(this.animate);
    this.frameCount++;

    // Only update canvas every N frames
    if (this.frameCount % this.frameSkip !== 0) return;

    const canvas = this.canvasRef.nativeElement;
    const isDark = this.themeService.isDark();

    this.ctx.fillStyle = isDark
      ? 'rgba(15, 17, 23, 0.08)'
      : 'rgba(244, 248, 251, 0.08)';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.ctx.fillStyle = isDark ? '#7c3aed' : '#2479ad';
    this.ctx.font      = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const word = this.chars[Math.floor(Math.random() * this.chars.length)];
      this.ctx.fillText(word, i * this.fontSize * 9, this.drops[i] * this.fontSize);

      if (this.drops[i] * this.fontSize > canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }
  }
}
