# Sindre Andersen | Software Engineer & AI-Assisted Developer

Welcome to my portfolio. This repository showcases my full-stack development work across two generations of the same projects — where I started academically, and where I am now with modern tooling and AI-assisted development.

Live portfolio: **[mista-ai.up.railway.app](https://mista-ai.up.railway.app/index.html)**

## 🔗 Contact & Links

- **GitHub**: [github.com/MistaKronos](https://github.com/MistaKronos)
- **LinkedIn**: [linkedin.com/in/sindre-steen-andersen-8b9ba8199](https://www.linkedin.com/in/sindre-steen-andersen-8b9ba8199/)
- **Email**: sindresteenandersen@gmail.com

---

## 📁 Structure

```
Personal-Projects/
├── index.html                              # Portfolio homepage (live at mista-ai.up.railway.app)
├── styles.css                              # Homepage styling
├── chat.js                                 # Claude API chat widget
│
├── Semester-Project/
│   ├── Classic/WebApplication/HTML/        # Original: vanilla JS + Bootstrap dashboard
│   └── Modern/                             # Rebuilt: Svelte + TypeScript (dist/ is live)
│
├── Exam-Project/
│   ├── Classic/                            # Original: Node.js / Express / MySQL / EJS
│   └── Modern/                             # Rebuilt: SvelteKit / Prisma / TypeScript
│
├── Alphabet speed/AlphabetGame/            # Typing speed game with localStorage leaderboard
└── testing/                                # QA & testing portfolio (Playwright, API testing)
```

---

## 🎯 What This Shows

### Two Versions of Every Project
Each major project exists in two forms:
- **Classic** — the original academic implementation, built without modern tooling or AI
- **Modern** — a complete rebuild with a modern stack, TypeScript, and AI-assisted development

This side-by-side comparison shows not just where I started, but how I work today.

### AI-Assisted Development
The modern rebuilds were developed using **Claude Code** (Anthropic's AI CLI). I directed the architecture, wrote requirements, reviewed all output, and shipped. This is my actual development workflow — AI as a collaborator, not a crutch.

The portfolio itself includes a **live Claude API integration** — a chat widget with a custom system prompt that answers questions about my work in real time.

---

## 💻 Tech Stack

### Classic Projects
- HTML5, CSS3, JavaScript (ES6+)
- Node.js / Express.js
- Sequelize ORM / MySQL
- EJS templating
- JWT authentication
- Bootstrap 5

### Modern Projects
- **Svelte / SvelteKit**
- **TypeScript**
- **Prisma ORM / SQLite**
- **Zod** (schema validation)
- **Vite**
- JWT (httpOnly cookies)

### AI & Tooling
- Claude API (Anthropic) — chat integration + development workflow
- Claude Code — AI-assisted CLI development
- Prompt engineering / system prompt design

### Testing & QA
- Playwright (E2E testing)
- Jest + Supertest (API testing)
- REST Client
- Test automation, regression testing, data validation

---

## 🚀 Running Projects Locally

### Portfolio (static)
```bash
# Open index.html directly in a browser, or serve it:
npx serve .
```

### Classic Exam Project (Node/Express + MySQL)
```bash
cd Exam-Project/Classic
npm install
npm start
# Visit http://localhost:3000/admin/login
```

### Modern Exam Project (SvelteKit)
```bash
cd Exam-Project/Modern
npm install
npx prisma db push
npx prisma db seed
npm run dev
# Visit http://localhost:5173
```

### Modern Semester Project (Svelte)
```bash
cd Semester-Project/Modern
npm install
npm run dev
```

---

## 🏆 Key Highlights

- **Full-Stack Development** — frontend through backend, REST APIs, database design
- **Modern Stack** — SvelteKit, TypeScript, Prisma, Zod, Vite
- **AI Integration** — live Claude API features, built with Claude Code
- **Quality Assurance** — automated testing, E2E and API coverage
- **Auth & Security** — JWT, httpOnly cookies, role-based access, bfcache protection
- **Continuous Learning** — from vanilla JS to modern full-stack in one repo

---

## 📝 Notes

- Classic Exam Project runs live at [mista-ai.up.railway.app/admin/login](https://mista-ai.up.railway.app/admin/login) — credentials: `admin@noroff.no` / `P@ssword2023`
- Modern Exam Project is hosted on Render (free tier — may take 30–60s to wake)
- Modern Semester Project dist is pre-built and served directly from the repo
- Alphabet Game uses only vanilla JS and browser localStorage — no dependencies

---

**Last updated**: May 2026
**Open to**: Software Engineer, QA Engineer, AI Engineer & AI-integrated developer roles
