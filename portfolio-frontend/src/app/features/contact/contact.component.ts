import {
  Component,
  inject,
  signal
} from '@angular/core';
import { CommonModule }     from '@angular/common';
import { FormsModule }      from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio.service';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { GlitchTextDirective } from "../../shared/directives/glitch-text.directive";

interface ContactForm {
  name:    string;
  email:   string;
  message: string;
}

interface FormErrors {
  name?:    string;
  email?:   string;
  message?: string;
}

@Component({
  selector:    'app-contact',
  standalone:  true,
  imports: [CommonModule, FormsModule, ScrollRevealDirective, GlitchTextDirective],
  templateUrl: './contact.component.html',
  styleUrls:   ['./contact.component.scss']
})
export class ContactComponent {

  private portfolioService = inject(PortfolioService);

  // Form data
  form: ContactForm = { name: '', email: '', message: '' };

  // UI states
  errors    = signal<FormErrors>({});
  isLoading = signal(false);
  submitted = signal(false);
  hasError  = signal(false);
  responseMessage = signal('');

  // Social links
  socials = [
    {
      label: 'GitHub',
      url:   'https://github.com/Nidhi8595',
      icon:  'github'
    },
    {
      label: 'LinkedIn',
      url:   'https://www.linkedin.com/in/neelakshi-2b3725321/',
      icon:  'linkedin'
    },
    {
      label: 'Email',
      url:   'mailto:neelakshikadyan@gmail.com',
      icon:  'email'
    },
    {
      label: 'LeetCode',
      url:   'https://leetcode.com/u/Neelakshi_123/',
      icon:  'leetcode'
    }
  ];

  // ── Validation ──────────────────────────────────────────────────────────────

  private validate(): boolean {
    const errs: FormErrors = {};

    if (!this.form.name.trim()) {
      errs.name = 'Name is required';
    } else if (this.form.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!this.form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      errs.email = 'Please enter a valid email';
    }

    if (!this.form.message.trim()) {
      errs.message = 'Message is required';
    } else if (this.form.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }

    this.errors.set(errs);
    return Object.keys(errs).length === 0;
  }

  // Clear a field's error when user starts typing
  clearError(field: keyof FormErrors): void {
    const current = this.errors();
    if (current[field]) {
      this.errors.set({ ...current, [field]: undefined });
    }
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (!this.validate()) return;

    this.isLoading.set(true);
    this.hasError.set(false);

    this.portfolioService.sendMessage({
      name:    this.form.name.trim(),
      email:   this.form.email.trim(),
      message: this.form.message.trim()
    }).subscribe(response => {
      this.isLoading.set(false);
      this.responseMessage.set(response.message);

      if (response.success) {
        this.submitted.set(true);
        // Reset form
        this.form = { name: '', email: '', message: '' };
        this.errors.set({});
      } else {
        this.hasError.set(true);
      }
    });
  }

  resetForm(): void {
    this.submitted.set(false);
    this.hasError.set(false);
    this.responseMessage.set('');
    this.form = { name: '', email: '', message: '' };
    this.errors.set({});
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
