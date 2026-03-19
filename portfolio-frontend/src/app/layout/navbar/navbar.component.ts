import {
  Component,
  inject,
  signal,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { TickerComponent } from '../../shared/components/ticker/ticker.component';

// Each nav link maps to a section id in the HTML
interface NavLink {
  label:  string;
  target: string;  // matches the id on each section e.g. #hero
}

@Component({
  selector:    'app-navbar',
  standalone:  true,
  imports:     [CommonModule, TickerComponent],
  templateUrl: './navbar.component.html',
  styleUrls:   ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  themeService = inject(ThemeService);

  // Signal for mobile menu open/close state
  menuOpen = signal(false);

  // Signal for which section is currently in view
  activeSection = signal('hero');

  // Signal for whether the page has been scrolled (triggers glass effect)
  isScrolled = signal(false);

  // All the sections we want in the navbar
  navLinks: NavLink[] = [
    { label: 'Home',           target: 'hero'           },
    { label: 'Skills',         target: 'skills'         },
    { label: 'Projects',       target: 'projects'       },
    { label: 'Certifications', target: 'certifications' },
    { label: 'Education',      target: 'education'      },
    { label: 'Contact',        target: 'contact'        },
  ];

  // IntersectionObserver watches which section is on screen
  // Much more accurate than calculating scroll positions manually
  private observer!: IntersectionObserver;

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    // Always clean up observers to prevent memory leaks
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // HostListener listens to window scroll events
  // Automatically cleaned up when component is destroyed
  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 20);
  }

  scrollTo(target: string): void {
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close mobile menu after clicking a link
    this.menuOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  private setupIntersectionObserver(): void {
    // rootMargin: '-50% 0px' means a section becomes "active"
    // when its top half crosses the middle of the viewport
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px', threshold: 0 }
    );

    // Observe every section by its id
    this.navLinks.forEach(link => {
      const el = document.getElementById(link.target);
      if (el) this.observer.observe(el);
    });
  }

  openPalette(): void {
  window.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true })
  );
}
}
