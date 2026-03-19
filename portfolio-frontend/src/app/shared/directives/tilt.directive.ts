import {
  Directive,
  ElementRef,
  HostListener,
  Input
} from '@angular/core';

@Directive({
  selector:   '[appTilt]',
  standalone: true
})
export class TiltDirective {

  @Input() tiltMax    = 8;   // max degrees of rotation
  @Input() tiltScale  = 1.02; // scale on hover

  constructor(private el: ElementRef) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const rect   = this.el.nativeElement.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotateX =  ((y - cy) / cy) * this.tiltMax * -1;
    const rotateY =  ((x - cx) / cx) * this.tiltMax;

    this.el.nativeElement.style.transform =
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${this.tiltScale})`;
    this.el.nativeElement.style.transition = 'transform 0.1s ease';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    this.el.nativeElement.style.transition = 'transform 0.5s ease';
  }
}
