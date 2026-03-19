import { Component, signal } from '@angular/core';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { HeroComponent } from './features/hero/hero.component';
import { SkillsComponent } from './features/skills/skills.component';
import { ProjectsComponent }     from './features/projects/projects.component';
import { CertificationsComponent } from './features/certifications/certifications.component';
import { EducationComponent } from './features/education/education.component';
import { ContactComponent } from './features/contact/contact.component';
import { ScrollProgressComponent }  from './shared/components/scroll-progress/scroll-progress.component';
import { CursorGlowComponent }      from './shared/components/cursor-glow/cursor-glow.component';
import { SectionNavComponent }      from './shared/components/section-nav/section-nav.component';
import { PageLoaderComponent }      from './shared/components/page-loader/page-loader.component';
import { CommandPaletteComponent }  from './shared/components/command-palette/command-palette.component';
import { ParticleCanvasComponent } from './shared/components/particle-canvas/particle-canvas.component';
import { TerminalComponent }       from './shared/components/terminal/terminal.component';
import { TickerComponent }         from './shared/components/ticker/ticker.component';
@Component({
  selector: 'app-root',
  imports: [NavbarComponent, HeroComponent,SkillsComponent, ProjectsComponent, CertificationsComponent, EducationComponent, ContactComponent, ScrollProgressComponent, CursorGlowComponent, SectionNavComponent, PageLoaderComponent, CommandPaletteComponent, ParticleCanvasComponent, TerminalComponent, TickerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio-frontend');
}
