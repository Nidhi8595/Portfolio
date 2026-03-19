import {
  Directive,
  ElementRef,
  OnInit
} from '@angular/core';

@Directive({
  selector:   '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnInit {

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const target = parseInt(this.el.nativeElement.getAttribute('data-target') || '0');

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      this.animateCount(target);
    }, { threshold: 0.5 });

    observer.observe(this.el.nativeElement);
  }

  private animateCount(target: number): void {
    const duration = 1800;
    const start    = performance.now();

    const step = (now: number) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);

      this.el.nativeElement.textContent = current.toString();

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}
