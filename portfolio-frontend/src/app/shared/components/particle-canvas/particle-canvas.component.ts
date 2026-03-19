import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  inject
} from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector:   'app-particle-canvas',
  standalone: true,
  template:   `<canvas #canvas class="particle-canvas"></canvas>`,
  styles: [`
    .particle-canvas {
      position:       fixed;
      top:            10;
      left:           0;
      width:          100vw;
      height:         100vh;
      pointer-events: none;
      z-index:        10;
      opacity:        0.35;
    }
  `]
})
export class ParticleCanvasComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private themeService = inject(ThemeService);
  private ctx!:         CanvasRenderingContext2D;
  private particles:    Particle[] = [];
  private mouse         = { x: -9999, y: -9999 };
  private rafId!:       number;
  private resizeObs!:   ResizeObserver;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx     = canvas.getContext('2d')!;
    this.resize();
    this.spawnParticles();
    this.loop();

    this.resizeObs = new ResizeObserver(() => {
      this.resize();
      this.spawnParticles();
    });
    this.resizeObs.observe(document.body);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.resizeObs?.disconnect();
  }

  @HostListener('window:mousemove', ['$event'])
  onMove(e: MouseEvent): void {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  @HostListener('window:mouseleave')
  onLeave(): void {
    this.mouse.x = -9999;
    this.mouse.y = -9999;
  }

  private resize(): void {
    const c    = this.canvasRef.nativeElement;
    c.width    = window.innerWidth;
    c.height   = window.innerHeight;
  }

  private spawnParticles(): void {
    const count       = Math.floor((window.innerWidth * window.innerHeight) / 14000);
    this.particles    = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      ));
    }
  }

  private loop = (): void => {
    this.rafId = requestAnimationFrame(this.loop);
    const isDark = this.themeService.isDark();
    const c      = this.canvasRef.nativeElement;

    this.ctx.clearRect(0, 0, c.width, c.height);

    const dotColor  = isDark ? '167, 139, 250' : '124, 58, 237';
    const lineColor = isDark ? '167, 139, 250' : '36, 121, 173';

    for (const p of this.particles) {
      p.update(this.mouse, c.width, c.height);

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${dotColor}, ${p.alpha})`;
      this.ctx.fill();

      // Draw connections to nearby particles
      for (const q of this.particles) {
        if (p === q) continue;
        const dx   = p.x - q.x;
        const dy   = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const max  = 130;
        if (dist < max) {
          const alpha = (1 - dist / max) * 0.25;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(q.x, q.y);
          this.ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
          this.ctx.lineWidth   = 0.9;
          this.ctx.stroke();
        }
      }

      // Draw mouse connections
      const mdx  = p.x - this.mouse.x;
      const mdy  = p.y - this.mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 180) {
        const alpha = (1 - mdist / 180) * 0.6;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.strokeStyle = `rgba(${dotColor}, ${alpha})`;
        this.ctx.lineWidth   = 1.2;
        this.ctx.stroke();
      }
    }
  }
}

class Particle {
  vx: number;
  vy: number;
  r:  number;
  alpha: number;

  constructor(public x: number, public y: number) {
    this.vx    = (Math.random() - 0.5) * 0.5;
    this.vy    = (Math.random() - 0.5) * 0.5;
    this.r     = Math.random() * 2 + 1;
    this.alpha = Math.random() * 0.5 + 0.3;
  }

  update(mouse: { x: number; y: number }, w: number, h: number): void {
    // Gentle mouse repulsion
    const dx   = this.x - mouse.x;
    const dy   = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      const force = (100 - dist) / 100;
      this.vx    += (dx / dist) * force * 0.4;
      this.vy    += (dy / dist) * force * 0.4;
    }

    // Dampen velocity
    this.vx *= 0.98;
    this.vy *= 0.98;

    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    if (this.x < 0)  this.x = w;
    if (this.x > w)  this.x = 0;
    if (this.y < 0)  this.y = h;
    if (this.y > h)  this.y = 0;
  }
}
