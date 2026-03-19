import {
  Directive,
  ElementRef,
  HostListener
} from '@angular/core';

@Directive({
  selector:   '[appMagnetic]',
  standalone: true
})
export class MagneticDirective {

  constructor(private el: ElementRef) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const rect   = this.el.nativeElement.getBoundingClientRect();
    const x      = e.clientX - (rect.left + rect.width  / 2);
    const y      = e.clientY - (rect.top  + rect.height / 2);
    const pull   = 0.35; // strength of the magnetic pull

    this.el.nativeElement.style.transform  =
      `translate(${x * pull}px, ${y * pull}px)`;
    this.el.nativeElement.style.transition = 'transform 0.2s ease';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.transform  = 'translate(0, 0)';
    this.el.nativeElement.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  }
}
