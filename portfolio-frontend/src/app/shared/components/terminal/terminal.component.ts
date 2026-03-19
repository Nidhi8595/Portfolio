import {
  Component,
  HostListener,
  signal,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TermLine {
  type: 'input' | 'output' | 'error' | 'success';
  content: string;
}

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="terminal-overlay" *ngIf="open()" (click)="closeIfOutside($event)">
      <div class="terminal-window" #termWindow>

        <!-- Title bar -->
        <div class="term-titlebar">
          <div class="term-dots">
            <span class="dot red"   (click)="close()"></span>
            <span class="dot amber"></span>
            <span class="dot green"></span>
          </div>
          <span class="term-title">neelakshi@portfolio ~ bash</span>
        </div>

        <!-- Output -->
        <div class="term-body" #body>
          <div
            class="term-line"
            [class]="line.type"
            *ngFor="let line of lines()"
            [innerHTML]="line.content"
          ></div>

          <!-- Input row -->
          <div class="term-input-row">
            <span class="prompt">neelakshi@portfolio:~$</span>
            <input
              #termInput
              class="term-input"
              [(ngModel)]="cmd"
              (keydown.enter)="execute()"
              (keydown.ArrowUp)="historyBack()"
              (keydown.Tab)="autocomplete($event)"
              placeholder="type 'help' to start"
              autocomplete="off"
              spellcheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .terminal-overlay {
      position:        fixed;
      inset:           0;
      background:      rgba(0,0,0,0.6);
      backdrop-filter: blur(6px);
      z-index:         9000;
      display:         flex;
      align-items:     flex-end;
      justify-content: center;
      padding-bottom:  2rem;
      animation:       fadein 0.2s ease;
    }
    @keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .terminal-window {
      width:         min(760px, 94vw);
      max-height:    55vh;
      background:    #0d1117;
      border-radius: 12px;
      overflow:      hidden;
      border:        1px solid #30363d;
      display:       flex;
      flex-direction: column;
      animation:     slideup 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow:    0 32px 80px rgba(0,0,0,0.6);
    }
    @keyframes slideup {
      from { transform: translateY(60px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    .term-titlebar {
      display:     flex;
      align-items: center;
      gap:         0.75rem;
      padding:     0.6rem 1rem;
      background:  #161b22;
      border-bottom: 1px solid #30363d;
      flex-shrink: 0;
    }
    .term-dots     { display: flex; gap: 6px; }
    .dot {
      width:         12px;
      height:        12px;
      border-radius: 50%;
      cursor:        pointer;
    }
    .dot.red   { background: #ff5f57; }
    .dot.amber { background: #febc2e; }
    .dot.green { background: #28c840; }
    .term-title {
      font-size:  0.78rem;
      color:      #8b949e;
      font-family: monospace;
      flex:       1;
      text-align: center;
    }
    .term-body {
      padding:     1rem;
      overflow-y:  auto;
      flex:        1;
      font-family: 'Courier New', monospace;
      font-size:   0.85rem;
      line-height: 1.7;
    }
    .term-line         { white-space: pre-wrap; margin-bottom: 2px; }
    .term-line.input   { color: #e6edf3; }
    .term-line.output  { color: #7ee787; }
    .term-line.success { color: #58a6ff; }
    .term-line.error   { color: #f85149; }
    .term-input-row {
      display:     flex;
      align-items: center;
      gap:         0.5rem;
      margin-top:  0.25rem;
    }
    .prompt {
      color:       #58a6ff;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .term-input {
      flex:        1;
      background:  transparent;
      border:      none;
      outline:     none;
      color:       #e6edf3;
      font-family: 'Courier New', monospace;
      font-size:   0.85rem;
      caret-color: #58a6ff;
    }
    .term-input::placeholder { color: #484f58; }
  `]
})
export class TerminalComponent implements AfterViewChecked {

  @ViewChild('body') bodyRef!: ElementRef;
  @ViewChild('termInput') inputRef!: ElementRef;
  @ViewChild('termWindow') winRef!: ElementRef;

  open = signal(false);
  lines = signal<TermLine[]>([]);
  cmd = '';

  private history: string[] = [];
  private histIdx = -1;

  private commands: Record<string, () => string[]> = {
    help: () => [
      '┌─────────────────────────────────────────┐',
      '│         Available commands               │',
      '├─────────────────────────────────────────┤',
      '│  whoami      → About Neelakshi           │',
      '│  skills      → Tech stack                │',
      '│  projects    → Featured projects         │',
      '│  contact     → How to reach me           │',
      '│  education   → Academic background       │',
      // '│  fun         → A fun fact                │',
      '│  clear       → Clear terminal            │',
      '│  exit        → Close terminal            │',
      '└─────────────────────────────────────────┘',
    ],
    whoami: () => [
      '',
      '  Neelakshi — Full Stack Developer',
      '  ─────────────────────────────────',
      '  Final-year CSE @ Gautam Buddha University',
      '  CGPA: 8.79 | LeetCode: 200+ problems',
      '  Loves: Angular, NestJS, clean architecture',
      '  Currently: Building things that matter 🚀',
      '',
    ],
    skills: () => [
      '',
      '  Languages   →  C++  JavaScript  Python  Java  C',
      '  Frontend    →  Angular  React  TypeScript  Tailwind',
      '  Backend     →  NestJS  Node.js  Express  Django',
      '  Databases   →  MongoDB  PostgreSQL  MySQL',
      '  Tools       →  Docker  GitHub  Firebase  Vercel AWS',
      '',
    ],
    projects: () => [
      '',
      '  ⬡ MarkSphere      → Full-stack bookmark manager',
      '    Stack: Angular + NestJS + PostgreSQL + Docker',
      '',
      '  ⬡ Netflix GPT     → AI movie recommendation clone',
      '    Stack: React + Node + Redux + Firebase',
      '',
      '  ⬡ Scalable Notes  → Notes app with REST API',
      '    Stack: React + Node + MongoDB',
      '',
      '  Run: open https://github.com/Nidhi8595',
      '',
    ],
    contact: () => [
      '',
      '  📧  neelakshikadyan@gmail.com',
      '  💼  linkedin.com/in/neelakshi-2b3725321',
      '  💻  github.com/Nidhi8595',
      '  🧩  leetcode.com/u/Neelakshi_123',
      '',
    ],
    education: () => [
      '',
      '  🎓 BTech CSE — Gautam Buddha University',
      '     2022–2026 | CGPA: 8.79',
      '',
      '  📚 Senior Secondary — DSR Modern School, Noida',
      '     CBSE 2022 | 92%',
      '',
      '  📖 High School — St. Mary\'s Convent Haldaur',
      '     ICSE 2020 | 90.2%',
      '',
    ],
    fun: () => [
      '',
      '  I once solved 50 LeetCode problems in a single',
      '  weekend fuelled entirely by iced coffee ☕',
      '  and competitive rage. Worth it? Absolutely.',
      '',
    ],
    clear: () => {
      this.lines.set([]);
      return [];
    },
    exit: () => {
      setTimeout(() => this.open.set(false), 300);
      return ['Goodbye! 👋'];
    },
  };

  @HostListener('window:keydown', ['$event'])
  onKey(e: Event): void {
    const ke = e as KeyboardEvent;
    if (ke.key === '`' || ke.key === '~') {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      this.toggle();
    }
    if (ke.key === 'Escape' && this.open()) this.close();
  }

  ngAfterViewChecked(): void {
    if (this.open() && this.bodyRef) {
      const el = this.bodyRef.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  toggle(): void {
    this.open.update(v => !v);
    if (this.open()) {
      this.lines.set([{
        type: 'success',
        content: 'Welcome to Neelakshi\'s portfolio terminal. Type <span style="color:#f0883e">help</span> to begin.'
      }]);
      setTimeout(() => this.inputRef?.nativeElement.focus(), 50);
    }
  }

  close(): void { this.open.set(false); }

  closeIfOutside(e: Event): void {
  if (e.target === e.currentTarget) this.close();
}

  execute(): void {
    const raw = this.cmd.trim().toLowerCase();
    if (!raw) return;

    this.history.unshift(raw);
    this.histIdx = -1;

    // Echo input
    this.lines.update(l => [...l, {
      type: 'input',
      content: `<span style="color:#58a6ff">neelakshi@portfolio:~$</span> ${raw}`
    }]);

    const handler = this.commands[raw];
    if (handler) {
      const output = handler();
      if (output.length) {
        this.lines.update(l => [
          ...l,
          ...output.map(o => ({ type: 'output' as const, content: o }))
        ]);
      }
    } else {
      this.lines.update(l => [...l, {
        type: 'error',
        content: `command not found: ${raw}. Type 'help' to see available commands.`
      }]);
    }

    this.cmd = '';
  }

  historyBack(): void {
    this.histIdx = Math.min(this.histIdx + 1, this.history.length - 1);
    this.cmd = this.history[this.histIdx] ?? '';
  }

  autocomplete(e: Event): void {
    e.preventDefault();
    const partial = this.cmd.toLowerCase();
    const match = Object.keys(this.commands).find(k => k.startsWith(partial));
    if (match) this.cmd = match;
  }
}
