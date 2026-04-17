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
import { SkillCategory }         from '../../models/skill.model';
import { GlitchTextDirective } from '../../shared/directives/glitch-text.directive';

@Component({
  selector:    'app-skills',
  standalone:  true,
  imports:     [CommonModule, ScrollRevealDirective,GlitchTextDirective],
  templateUrl: './skills.component.html',
  styleUrls:   ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  private portfolioService = inject(PortfolioService);
  filterService            = inject(FilterService);

  // Raw data from API
  skillCategories = signal<SkillCategory[]>([]);

  // Loading and error states
  isLoading = signal(true);
  hasError  = signal(false);

  // Skill icon mapping — maps skill names to logo filenames
  // Add more as needed
  skillIcons: Record<string, string> = {
    'C++':            'C++.png',
    'JavaScript':     'Javascript.png',
    'C':              'C.png',
    'Java':           'Java.png',
    'Python':         'Python.png',
    'HTML':           'HTML.png',
    'CSS':            'CSS.png',
    'TypeScript':     'TS.png',
    'React.js':       'React.png',
    'Redux.js':       'Redux.png',
    'Tailwind':       'Tailwind.png',
    'Node.js':        'Node.png',
    'Express.js':     'Express.png',
    'NestJS':         'Nest.png',
    'Django':         'Django.png',
    'MongoDB':        'Mongo.png',
    'MySQL':          'mysq.png',
    'PostgreSQL':     'Post.png',
    'GitHub':         'Github.png',
    'Firebase':       'Firebase.png',
    'Render':         'Render.png',
    'Vercel':         'Vercel.png',
    'Docker':         'Docker.png',
    'APIs':           'API.png',
    'Authentication': 'Auth.png',
    'OOPs':           'Oop.png',
    'Data Structures':'dsa.png',
    'Cloud Basics':   'Cloud.png',
    'Cybersec Basics':'Cybersec.png',
    'Design Thinking':'Design.png',
    'PrismaORM':      'Prisma.png',
    'Testing':        'Testing.png',
    'Deployment':     'Frontend.png',
    'Angular.js':        'Angular.png',
    'AWS':            'AWS.png',
    'ClaudeAI':       'Claude.png',
    'Git':'Github.png',
    'Canva':'Canva.png',
    'VS Code':'VSCode.png',
    'Postman':'Postman.png',
    'Insomnia':'Insomnia.png',
    'Github Pages':'Github.png',
    'GraphQL':'graphql.png',
    'Next.js':'nextjs.png'
  };

  // Category icon mapping for section headers
  categoryIcons: Record<string, string> = {
    'Languages':        '⌨️',
    'Frontend':         '🎨',
    'Backend':          '⚙️',
    'Databases':        '🗄️',
    'Tools & Platforms':'🛠️',
    'Other Concepts':   '💡',
  };

  ngOnInit(): void {
    this.portfolioService.getSkills().subscribe({
      next: data => {
        this.skillCategories.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  getIcon(skill: string): string {
    return this.skillIcons[skill]
      ? `assets/logos/${this.skillIcons[skill]}`
      : '';
  }

  getCategoryIcon(category: string): string {
    return this.categoryIcons[category] ?? '📌';
  }

  isActive(skill: string): boolean {
    return this.filterService.selectedSkill() === skill;
  }

  onSkillClick(skill: string): void {
    this.filterService.selectSkill(skill);

    // Scroll to projects section so user sees the filter result
    if (this.filterService.selectedSkill() !== null) {
      setTimeout(() => {
        document.getElementById('projects')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }
}
