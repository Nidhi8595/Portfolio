import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule }                       from '@angular/common';
import { PortfolioService }                   from '../../core/services/portfolio.service';
import { ScrollRevealDirective }              from '../../shared/directives/scroll-reveal.directive';
import { Education }                          from '../../models/education.model';
import { GlitchTextDirective } from '../../shared/directives/glitch-text.directive';

@Component({
  selector:    'app-education',
  standalone:  true,
  imports:     [CommonModule, ScrollRevealDirective,GlitchTextDirective],
  templateUrl: './education.component.html',
  styleUrls:   ['./education.component.scss']
})
export class EducationComponent implements OnInit {

  private portfolioService = inject(PortfolioService);

  education = signal<Education[]>([]);
  isLoading = signal(true);

  // Grade icon based on score
  getGradeIcon(grade: string): string {
    if (grade.includes('CGPA')) return '🎓';
    const num = parseFloat(grade);
    if (num >= 90) return '🏆';
    if (num >= 80) return '⭐';
    return '📚';
  }

  ngOnInit(): void {
    this.portfolioService.getEducation().subscribe({
      next: data => {
        this.education.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
