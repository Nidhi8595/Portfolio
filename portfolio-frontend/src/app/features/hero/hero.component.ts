import { Component }                  from '@angular/core';
import { CommonModule }               from '@angular/common';
import { ScrollRevealDirective }      from '../../shared/directives/scroll-reveal.directive';
import { TypewriterDirective }        from '../../shared/directives/typewriter.directive';
import { MagneticDirective } from '../../shared/directives/magnetic.directive';
import { CountUpDirective } from '../../shared/directives/count-up.directive';
import { CodeRainComponent } from '../../shared/components/code-rain/code-rain.component';
import { SoundWaveComponent } from '../../shared/components/sound-wave/sound-wave.component';

@Component({
  selector:    'app-hero',
  standalone:  true,
  imports:     [CommonModule, ScrollRevealDirective, TypewriterDirective, MagneticDirective, CountUpDirective, CodeRainComponent, SoundWaveComponent],
  templateUrl: './hero.component.html',
  styleUrls:   ['./hero.component.scss']
})
export class HeroComponent {
  stats = [
  { value: 17,  suffix: '+', label: 'Projects Built'   },
  { value: 500, suffix: '+', label: 'LeetCode Problems' },
  { value: 8,   suffix: '.79', label: 'CGPA'           },
  { value: 10,  suffix: '+', label: 'Certifications'   },
];

  // The typewriter cycles through these strings
  roles = [
    'Full-Stack Developer',
    'MERN Stack Developer',
    'React Developer',
    'Angular Enthusiast',
    'NestJS Developer',
    'DSA Problem Solver',
    'Tech Explorer',
  ];

  // Tech badges shown below the description
  techBadges = [
    'Angular', 'NestJS', 'React', 'TypeScript','JavaScript',
    'Node.js', 'MongoDB', 'PostgreSQL', 'AWS'
  ];

  scrollToProjects(): void {
    document.getElementById('projects')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollDown(): void {
    document.getElementById('skills')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
