import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';

@Directive({
  selector:   '[appTypewriter]',
  standalone: true
})
export class TypewriterDirective implements OnInit, OnDestroy {

  // Array of strings to cycle through
  @Input() appTypewriter: string[] = [];
  @Input() typeSpeed    = 80;   // ms per character
  @Input() deleteSpeed  = 40;   // ms per character delete
  @Input() pauseTime    = 2000; // ms to pause at full word

  private currentIndex  = 0;
  private currentText   = '';
  private isDeleting    = false;
  private timeoutId!:   ReturnType<typeof setTimeout>;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.appTypewriter.length > 0) {
      this.tick();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
  }

  private tick(): void {
    const fullText = this.appTypewriter[this.currentIndex];

    // Add or remove one character
    if (this.isDeleting) {
      this.currentText = fullText.substring(0, this.currentText.length - 1);
    } else {
      this.currentText = fullText.substring(0, this.currentText.length + 1);
    }

    // Update the DOM
    this.el.nativeElement.textContent = this.currentText;

    let delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.currentText === fullText) {
      // Finished typing — pause then start deleting
      delay = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === '') {
      // Finished deleting — move to next word
      this.isDeleting = false;
      this.currentIndex = (this.currentIndex + 1) % this.appTypewriter.length;
      delay = 400;
    }

    this.timeoutId = setTimeout(() => this.tick(), delay);
  }
}
