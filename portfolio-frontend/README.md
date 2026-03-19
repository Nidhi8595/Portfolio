# 🚀 Neelakshi's Developer Portfolio

A modern, full-stack developer portfolio built with **Angular 19**, **NestJS**, and **TailwindCSS v4** — featuring a live terminal easter egg, particle constellation, command palette, animated skills bento grid, and a fully reactive skill-to-project filter system.

---

## ✨ Live Demo

🌐 **Frontend:** https://portfolio-n00ocl1jn-neelakshis-projects.vercel.app
🔌 **Backend API:** https://portfolio-backend-yltt.onrender.com/api

---

## 🗂️ Project Structure
```
portfolio/
├── portfolio-frontend/     # Angular 19 application
│   ├── src/app/
│   │   ├── core/           # Services (PortfolioService, ThemeService, FilterService)
│   │   ├── features/       # Section components (hero, skills, projects, etc.)
│   │   ├── layout/         # Navbar component
│   │   └── shared/         # Reusable directives and components
│   └── src/environments/   # Dev and prod API URLs
│
└── portfolio-backend/      # NestJS REST API
    └── src/
        ├── modules/        # projects, skills, education, certifications, contact
        └── data/           # JSON content files
```

---

## 🛠️ Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | Angular 19, TypeScript, TailwindCSS v4, SCSS    |
| Backend   | NestJS, TypeScript, REST API                    |
| State     | Angular Signals                                 |
| Styling   | TailwindCSS v4, CSS custom properties           |
| Deploy    | Vercel (frontend) + Render (backend)            |

---

## ⚡ Features

- 🎨 **Bento Skills Grid** — asymmetric card layout with animated pill buttons
- 🔍 **Skill Filter** — click any skill to filter matching projects reactively
- 🖥️ **Terminal Easter Egg** — press `~` anywhere to open a bash-style terminal
- ⌘ **Command Palette** — press `Ctrl+K` / `⌘K` for instant navigation
- 🌌 **Particle Constellation** — interactive canvas that reacts to mouse movement
- 💫 **Glitch Text** — section titles scramble on scroll reveal
- 🌙 **Dark Mode** — signal-based, persists across sessions
- 📱 **Fully Responsive** — mobile, tablet, desktop
- ✉️ **Contact Form** — posts to NestJS backend with validation

---

## 🚀 Running Locally

### Prerequisites
```bash
node -v   # v18+ required
npm -v    # v9+ required
```

### 1. Clone the repository
```bash
git clone https://github.com/Nidhi8595/portfolio-frontend.git
git clone https://github.com/Nidhi8595/portfolio-backend.git
```

### 2. Start the NestJS backend
```bash
cd portfolio-backend
npm install
npm run start:dev
# API running at http://localhost:3000/api
```

### 3. Start the Angular frontend
```bash
cd portfolio-frontend
npm install
ng serve
# App running at http://localhost:4200
```

---

## 🔧 Updating Content

All portfolio content lives in JSON files in the backend. No code changes needed — just edit the JSON and push.

### Update Projects

Open `portfolio-backend/src/data/projects.json`:
```json
{
  "id": 6,
  "title": "Your New Project",
  "description": "One sentence describing what it does",
  "image": "YourProject.png",
  "liveUrl": "https://your-live-url.com",
  "githubUrl": "https://github.com/Nidhi8595/your-repo",
  "skills": ["Angular", "NestJS", "PostgreSQL"]
}
```

Then copy your project screenshot into `portfolio-frontend/src/assets/images/`.

### Update Skills

Open `portfolio-backend/src/data/skills.json`:
```json
{
  "category": "Frontend",
  "items": ["HTML", "CSS", "TypeScript", "React.js", "Angular", "Tailwind"]
}
```

To add a logo for a new skill, copy the `.png` into `portfolio-frontend/src/assets/logos/` and add the mapping in `skills.component.ts`:
```typescript
skillIcons: Record<string, string> = {
  'YourSkill': 'YourSkill.png',
  // ...
}
```

### Update Certifications

Open `portfolio-backend/src/data/certifications.json` and add a new entry:
```json
{
  "id": 11,
  "title": "Your Certificate Name",
  "issuer": "Issuing Organization",
  "image": "YourCert.png",
  "certificateUrl": "https://certificate-link.com",
  "badgeUrl": null,
  "type": "course"
}
```

Valid types: `course` · `simulation` · `badge` · `assessment` · `achievement`

### Update Education

Open `portfolio-backend/src/data/education.json` and add or edit entries following the existing pattern.

### Update Terminal Commands

Open `portfolio-frontend/src/app/shared/components/terminal/terminal.component.ts` and find the `commands` object. Add a new command:
```typescript
private commands: Record<string, () => string[]> = {
  // ...existing commands...

  mycommand: () => [
    '',
    '  Your custom output here',
    '',
  ],
};
```

### Update the Ticker

Open `portfolio-frontend/src/app/shared/components/ticker/ticker.component.ts` and edit the `items` array:
```typescript
items = [
  'Your current learning topic 🎯',
  'Another thing you are exploring 🔭',
  // ...
];
```

### Update Contact Details

Open `portfolio-frontend/src/app/features/hero/hero.component.ts` for social links and `portfolio-frontend/src/app/features/contact/contact.component.ts` for the socials array.

---

## 📦 Deploying Updates

### Frontend (Vercel auto-deploys on push)
```bash
cd portfolio-frontend
git add .
git commit -m "content: update projects"
git push
# Vercel detects the push and redeploys automatically
```

### Backend (Render auto-deploys on push)
```bash
cd portfolio-backend
git add .
git commit -m "content: add new certification"
git push
# Render detects the push and redeploys automatically
```

---

## 🌐 Environment Configuration

### Development

`portfolio-frontend/src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Production

`portfolio-frontend/src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://portfolio-backend-yltt.onrender.com/api'
};
```

---

## 🔑 Hidden Features (Easter Eggs)

| Trigger | What happens |
|---|---|
| Press `~` anywhere | Opens a bash-style terminal with commands |
| Press `Ctrl+K` / `⌘K` | Opens searchable command palette |
| Type `help` in terminal | Lists all available commands |
| Type `fun` in terminal | Reveals a personal story |
| Hover project cards | 3D tilt + spotlight glow effect |
| Click any skill | Filters projects that use it |

---

## 📁 Adding New Sections

1. Create the component folder under `portfolio-frontend/src/app/features/`
2. Add the corresponding module + service + controller + JSON in the backend
3. Register the component in `app.component.ts` imports and `app.component.html`
4. Add a nav link entry in `navbar.component.ts` `navLinks` array
5. Add a dot entry in `section-nav.component.ts` `dots` array
6. Add a command in `command-palette.component.ts` `commands` array

---

## 📄 License

MIT — free to use as inspiration. Please don't deploy it as-is claiming it as your own portfolio.

---

Built with 💜 by **Neelakshi** — CSE undergrad, full-stack developer, terminal enthusiast.
