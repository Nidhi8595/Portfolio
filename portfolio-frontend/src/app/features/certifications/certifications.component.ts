import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule }                       from '@angular/common';
import { PortfolioService }                   from '../../core/services/portfolio.service';
import { ScrollRevealDirective }              from '../../shared/directives/scroll-reveal.directive';
import { Certification }                      from '../../models/certification.model';
import { SpotlightDirective } from '../../shared/directives/spotlight.directive';
import { GlitchTextDirective } from '../../shared/directives/glitch-text.directive';

@Component({
  selector:    'app-certifications',
  standalone:  true,
  imports:     [CommonModule, ScrollRevealDirective,SpotlightDirective,GlitchTextDirective],
  templateUrl: './certifications.component.html',
  styleUrls:   ['./certifications.component.scss']
})
export class CertificationsComponent implements OnInit {

  private portfolioService = inject(PortfolioService);

  certifications = signal<Certification[]>([]);
  isLoading      = signal(true);

  // Color per cert type — used for badge styling
  typeColors: Record<string, string> = {
    course:      'blue',
    simulation:  'purple',
    badge:       'amber',
    assessment:  'green',
    achievement: 'coral',
  };

  typeLabels: Record<string, string> = {
    course:      'Course',
    simulation:  'Job Simulation',
    badge:       'Badge',
    assessment:  'Skill Test',
    achievement: 'Achievement',
  };

  ngOnInit(): void {
    this.portfolioService.getCertifications().subscribe({
      next: data => {
        this.certifications.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getTypeColor(type: string): string {
    return this.typeColors[type] ?? 'gray';
  }

  getTypeLabel(type: string): string {
    return this.typeLabels[type] ?? type;
  }

  getImagePath(image: string): string {
    return `assets/images/${image}`;
  }
}
