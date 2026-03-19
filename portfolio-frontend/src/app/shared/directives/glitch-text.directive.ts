import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  Input
} from '@angular/core';

@Directive({
  selector:   '[appGlitchText]',
  standalone: true
})
export class GlitchTextDirective implements OnInit, OnDestroy {

  @Input() appGlitchText = '';
  private observer!: IntersectionObserver;
  private chars      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      this.observer.disconnect();
      this.animate();
    }, { threshold: 0.5 });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }

  private animate(): void {
    const original = this.appGlitchText || this.el.nativeElement.textContent;
    const len      = original.length;
    let   iteration = 0;
    const total     = len * 3;

    const interval = setInterval(() => {
      this.el.nativeElement.textContent = original
        .split('')
        .map((_: string, i: number) => {
          if (i < Math.floor(iteration / 3)) return original[i];
          return this.chars[Math.floor(Math.random() * this.chars.length)];
        })
        .join('');

      if (iteration >= total) {
        clearInterval(interval);
        this.el.nativeElement.textContent = original;
      }
      iteration++;
    }, 40);
  }
}
