import {
  Component,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule }          from '@angular/common';
import { PortfolioService }      from '../../core/services/portfolio.service';
import { FilterService }         from '../../core/services/filter.service';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { Project }               from '../../models/projects.model';
import { TiltDirective } from '../../shared/directives/tilt.directive';
import { SpotlightDirective } from '../../shared/directives/spotlight.directive';
import { GlitchTextDirective } from '../../shared/directives/glitch-text.directive';
{SpotlightDirective}

@Component({
  selector:    'app-projects',
  standalone:  true,
  imports:     [CommonModule, ScrollRevealDirective, TiltDirective, SpotlightDirective,GlitchTextDirective],
  templateUrl: './projects.component.html',
  styleUrls:   ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  private portfolioService = inject(PortfolioService);
  filterService            = inject(FilterService);

  // Raw list from API — never mutated after load
  allProjects = signal<Project[]>([]);

  isLoading = signal(true);
  hasError  = signal(false);

  // computed() automatically recalculates whenever
  // allProjects or filterService.selectedSkill changes
  // No manual subscription needed
  filteredProjects = computed(() => {
    const skill    = this.filterService.selectedSkill();
    const projects = this.allProjects();

    if (!skill) return projects;

    return projects.filter(p =>
      p.skills.some(s =>
        s.toLowerCase().trim() === skill.toLowerCase().trim()
      )
    );
  });

  // Count how many projects match the current filter
  matchCount = computed(() => this.filteredProjects().length);

  ngOnInit(): void {
    this.portfolioService.getProjects().subscribe({
      next: data => {
        this.allProjects.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  // Returns the full path for a project image
  getImagePath(image: string): string {
    return `assets/images/${image}`;
  }

  // Checks if a skill badge should be highlighted
  // on a card (matches the active filter)
  isSkillActive(skill: string): boolean {
    const selected = this.filterService.selectedSkill();
    if (!selected) return false;
    return skill.toLowerCase().trim() === selected.toLowerCase().trim();
  }

  trackById(_: number, project: Project): number {
    return project.id;
  }
}
