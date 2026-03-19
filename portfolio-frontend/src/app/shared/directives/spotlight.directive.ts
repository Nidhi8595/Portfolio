import {
  Directive,
  ElementRef,
  HostListener
} from '@angular/core';

@Directive({
  selector:   '[appSpotlight]',
  standalone: true
})
export class SpotlightDirective {

  constructor(private el: ElementRef) {
    // Set up the card to accept the gradient overlay
    this.el.nativeElement.style.position = 'relative';
    this.el.nativeElement.style.overflow = 'hidden';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;

    this.el.nativeElement.style.background = `
      radial-gradient(
        600px circle at ${x}px ${y}px,
        rgba(124, 58, 237, 0.06),
        transparent 40%
      ),
      var(--color-card-bg)
    `;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.background = 'var(--color-card-bg)';
  }
}
