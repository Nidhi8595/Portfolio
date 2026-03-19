import {
  Component,
  signal,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector:   'app-sound-wave',
  standalone: true,
  imports:    [CommonModule],
  template: `
    <button
      class="wave-btn"
      (click)="toggle()"
      [title]="playing() ? 'Pause ambient sound' : 'Play ambient sound'"
    >
      <canvas #waveCanvas class="wave-canvas" width="80" height="32"></canvas>
      <span class="wave-label">{{ playing() ? 'pause' : 'ambient' }}</span>
    </button>
  `,
  styles: [`
    .wave-btn {
      display:         flex;
      align-items:     center;
      gap:             0.4rem;
      background:      rgba(124, 58, 237, 0.08);
      border:          1px solid rgba(124, 58, 237, 0.2);
      border-radius:   999px;
      padding:         0.3rem 0.8rem 0.3rem 0.5rem;
      cursor:          pointer;
      color:           var(--color-accent, #7c3aed);
      transition:      all 0.2s;
    }
    .wave-btn:hover {
      background: rgba(124, 58, 237, 0.14);
      transform:  scale(1.04);
    }
    .wave-canvas { display: block; }
    .wave-label  { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em; }
  `]
})
export class SoundWaveComponent implements AfterViewInit, OnDestroy {

  @ViewChild('waveCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  playing   = signal(false);
  private ctx!:    CanvasRenderingContext2D;
  private rafId!:  number;
  private audioCtx?: AudioContext;
  private gainNode?: GainNode;
  private osc?:     OscillatorNode;
  private t        = 0;

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.drawIdle();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.audioCtx?.close();
  }

  toggle(): void {
    this.playing.update(v => !v);
    if (this.playing()) {
      this.startAudio();
      this.animate();
    } else {
      this.stopAudio();
      cancelAnimationFrame(this.rafId);
      this.drawIdle();
    }
  }

  private startAudio(): void {
    this.audioCtx = new AudioContext();
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.05, this.audioCtx.currentTime + 1.5);

    this.osc = this.audioCtx.createOscillator();
    this.osc.type      = 'sine';
    this.osc.frequency.setValueAtTime(174.6, this.audioCtx.currentTime); // F3 — calm
    this.osc.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
    this.osc.start();
  }

  private stopAudio(): void {
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.5);
    }
    setTimeout(() => {
      this.osc?.stop();
      this.audioCtx?.close();
    }, 600);
  }

  private animate = (): void => {
    this.rafId = requestAnimationFrame(this.animate);
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.width, h = canvas.height;
    this.t += 0.08;

    this.ctx.clearRect(0, 0, w, h);
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#7c3aed';
    this.ctx.lineWidth   = 2;
    this.ctx.lineCap     = 'round';

    for (let x = 0; x < w; x++) {
      const amp = (h / 2 - 4) * (0.5 + 0.5 * Math.sin(x * 0.15));
      const y   = h / 2 + amp * Math.sin(x * 0.18 + this.t);
      x === 0 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
  }

  private drawIdle(): void {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.width, h = canvas.height;
    this.ctx.clearRect(0, 0, w, h);
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgba(124, 58, 237, 0.4)';
    this.ctx.lineWidth   = 2;

    // Flat idle bars
    const bars = 8;
    const gap  = w / bars;
    for (let i = 0; i < bars; i++) {
      const barH = 4 + Math.abs(Math.sin(i * 0.8)) * 10;
      const x    = i * gap + gap / 2;
      this.ctx.moveTo(x, h / 2 - barH / 2);
      this.ctx.lineTo(x, h / 2 + barH / 2);
    }
    this.ctx.stroke();
  }
}
