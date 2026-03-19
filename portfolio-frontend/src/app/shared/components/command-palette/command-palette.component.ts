import {
  Component,
  HostListener,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';

interface Command {
  label:    string;
  icon:     string;
  action:   () => void;
  keywords: string[];
}

@Component({
  selector:   'app-command-palette',
  standalone: true,
  imports:    [CommonModule, FormsModule],
  template: `
    <!-- Backdrop -->
    <div
      class="palette-backdrop"
      *ngIf="open()"
      (click)="close()"
    ></div>

    <!-- Palette -->
    <div class="palette-modal" *ngIf="open()">
      <div class="palette-search-wrapper">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          #searchInput
          class="palette-input"
          [(ngModel)]="query"
          placeholder="Search sections, actions..."
          (keydown)="onKeydown($event)"
          autofocus
        />
        <kbd class="esc-key">ESC</kbd>
      </div>

      <div class="palette-results">
        <div
          class="palette-item"
          *ngFor="let cmd of filtered(); let i = index"
          [class.selected]="selectedIndex() === i"
          (click)="execute(cmd)"
          (mouseenter)="selectedIndex.set(i)"
        >
          <span class="cmd-icon">{{ cmd.icon }}</span>
          <span class="cmd-label">{{ cmd.label }}</span>
        </div>
        <div class="palette-empty" *ngIf="filtered().length === 0">
          No results for "{{ query }}"
        </div>
      </div>

      <div class="palette-footer">
        <span><kbd>↑↓</kbd> navigate</span>
        <span><kbd>↵</kbd> select</span>
        <span><kbd>ESC</kbd> close</span>
      </div>
    </div>
  `,
  styles: [`
    .palette-backdrop {
      position: fixed;
      inset:    0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px);
      z-index:  8000;
    }
    .palette-modal {
      position:      fixed;
      top:           20%;
      left:          50%;
      transform:     translateX(-50%);
      width:         min(560px, 90vw);
      background:    var(--color-card-bg);
      border:        1px solid var(--color-border);
      border-radius: 16px;
      z-index:       8001;
      overflow:      hidden;
      box-shadow:    0 32px 64px rgba(0,0,0,0.25);
      animation:     pop-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes pop-in {
      from { opacity: 0; transform: translateX(-50%) scale(0.93); }
      to   { opacity: 1; transform: translateX(-50%) scale(1);    }
    }
    .palette-search-wrapper {
      display:     flex;
      align-items: center;
      gap:         0.75rem;
      padding:     1rem 1.2rem;
      border-bottom: 1px solid var(--color-border);
    }
    .search-icon { color: var(--color-text-muted); flex-shrink: 0; }
    .palette-input {
      flex:        1;
      background:  transparent;
      border:      none;
      outline:     none;
      font-size:   1rem;
      color:       var(--color-text);
      font-family: inherit;
    }
    .palette-input::placeholder { color: var(--color-text-muted); }
    .esc-key {
      font-size:     0.7rem;
      padding:       0.2rem 0.5rem;
      background:    var(--color-border);
      border-radius: 4px;
      color:         var(--color-text-muted);
    }
    .palette-results { max-height: 320px; overflow-y: auto; padding: 0.5rem; }
    .palette-item {
      display:       flex;
      align-items:   center;
      gap:           0.75rem;
      padding:       0.7rem 1rem;
      border-radius: 8px;
      cursor:        pointer;
      transition:    background 0.15s;
    }
    .palette-item.selected { background: rgba(124,58,237,0.08); }
    .cmd-icon  { font-size: 1.1rem; width: 24px; text-align: center; }
    .cmd-label { font-size: 0.92rem; font-weight: 500; color: var(--color-text); }
    .palette-empty { padding: 2rem; text-align: center; color: var(--color-text-muted); font-size: 0.88rem; }
    .palette-footer {
      display:     flex;
      gap:         1.5rem;
      padding:     0.6rem 1.2rem;
      border-top:  1px solid var(--color-border);
      font-size:   0.72rem;
      color:       var(--color-text-muted);
    }
    kbd {
      padding:       0.1rem 0.4rem;
      background:    var(--color-border);
      border-radius: 4px;
      font-family:   monospace;
      font-size:     0.7rem;
    }
  `]
})
export class CommandPaletteComponent {

  open          = signal(false);
  query         = '';
  selectedIndex = signal(0);

  private commands: Command[] = [
    { label: 'Go to Home',            icon: '🏠', keywords: ['home','hero'],          action: () => this.scrollTo('hero')           },
    { label: 'Go to Skills',          icon: '⚡', keywords: ['skills','tech'],         action: () => this.scrollTo('skills')         },
    { label: 'Go to Projects',        icon: '🚀', keywords: ['projects','work'],       action: () => this.scrollTo('projects')       },
    { label: 'Go to Certifications',  icon: '🏆', keywords: ['certs','certificates'],  action: () => this.scrollTo('certifications') },
    { label: 'Go to Education',       icon: '🎓', keywords: ['education','study'],     action: () => this.scrollTo('education')      },
    { label: 'Go to Contact',         icon: '✉️', keywords: ['contact','email'],       action: () => this.scrollTo('contact')        },
    { label: 'Open GitHub',           icon: '💻', keywords: ['github','code','repo'],  action: () => window.open('https://github.com/Nidhi8595','_blank') },
    { label: 'Open LinkedIn',         icon: '💼', keywords: ['linkedin','job'],        action: () => window.open('https://www.linkedin.com/in/neelakshi-2b3725321/','_blank') },
    { label: 'Send Email',            icon: '📧', keywords: ['email','mail'],          action: () => window.open('mailto:neelakshikadyan@gmail.com') },
    { label: 'View LeetCode Profile', icon: '🧩', keywords: ['leetcode','dsa','algo'], action: () => window.open('https://leetcode.com/u/Neelakshi_123/','_blank') },
  ];

  filtered = computed(() => {
    const q = this.query.toLowerCase().trim();
    if (!q) return this.commands;
    return this.commands.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.keywords.some(k => k.includes(q))
    );
  });

  @HostListener('window:keydown', ['$event'])
  onGlobalKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.open.update(v => !v);
      this.query = '';
      this.selectedIndex.set(0);
    }
    if (e.key === 'Escape') this.close();
  }

  onKeydown(e: KeyboardEvent): void {
    const max = this.filtered().length - 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex.update(i => Math.min(i + 1, max));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex.update(i => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter') {
      const cmd = this.filtered()[this.selectedIndex()];
      if (cmd) this.execute(cmd);
    }
  }

  execute(cmd: Command): void {
    cmd.action();
    this.close();
  }

  close(): void {
    this.open.set(false);
    this.query = '';
  }

  private scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
