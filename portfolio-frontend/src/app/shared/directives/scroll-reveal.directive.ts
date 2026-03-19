import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';

@Directive({
  selector:   '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {

  // Delay in ms — lets us stagger multiple elements
  // Usage: <div appScrollReveal [revealDelay]="200">
  @Input() revealDelay = 0;

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const element = this.el.nativeElement as HTMLElement;

    // Set initial hidden state
    element.style.opacity    = '0';
    element.style.transform  = 'translateY(32px)';
    element.style.transition = `opacity 0.65s ease ${this.revealDelay}ms,
                                 transform 0.65s cubic-bezier(0.4,0,0.2,1) ${this.revealDelay}ms`;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity   = '1';
          element.style.transform = 'translateY(0)';
          // Stop observing once revealed — no need to re-animate
          this.observer.unobserve(element);
        }
      },
      { threshold: 0.15 }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
