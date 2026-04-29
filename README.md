# Budget Tracker

> Personal finance tracker built with **Next.js + TypeScript** using the **BMAD methodology** (Breakdown → Make → Analyze → Deploy).

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![BMAD](https://img.shields.io/badge/BMAD-v6.3-a78bfa?style=flat-square)

---

## Features

- ➕ **Add transactions** — income and expenses with category, description, and date
- ✏️ **Edit & delete** — inline editing with confirmation
- 📊 **Balance dashboard** — live net balance, total income, total expenses
- 🔍 **Filter by month & year** — view any period instantly
- 📈 **Analytics tab** — expenses by category with bar charts
- 🥧 **Pie chart** — expense distribution powered by Recharts
- 💾 **Persistent storage** — data saved in `localStorage`, survives refresh

---

## Tech Stack

| Layer       | Technology                   |
| ----------- | ---------------------------- |
| Framework   | Next.js 15 (App Router)      |
| Language    | TypeScript (strict)          |
| UI          | React 19                     |
| Styling     | CSS Modules                  |
| Charts      | Recharts                     |
| Storage     | localStorage                 |
| Methodology | BMAD v6.3                    |
| Fonts       | Playfair Display + DM Sans   |
| Deploy      | Vercel                       |
| Icons       | lucide-react                 |
| Testing     | Jest + React Testing Library |

---

## BMAD Methodology

This project was built using the **BMAD** (Breakdown → Make → Analyze → Deploy) AI-driven development framework.

```
B — Breakdown   Split project into isolated units (types, hooks, components, pages)
M — Make        Build each unit with focused AI prompts
A — Analyze     Review architecture, UX edge cases, and refactor
D — Deploy      Ship to Vercel with CI/CD
```

Key decisions from the Analyze phase:

- Extracted all business logic into `useTransactions` hook — components stay pure UI
- Used `ClientOnly` wrapper to solve Next.js SSR + localStorage hydration mismatch
- Separated CSS into `.module.css` files per component — no inline styles

---

## 📁 Project Structure

```
budget-tracker/
├── public/
├── src/
│   ├── app/             ← Next.js App Router
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── components/
│   ├── hooks/
│   └── lib/
│       └── types.ts
│       └── date.ts
├── docs/
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

```bash
node -v   # v18 or higher required
```

### Install & Run

```bash
# Clone the repo
git clone https://github.com/yulik777/budget-tracker.git
cd budget-tracker

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## Deploy

This project is optimized for **Vercel**:
Live demo: https://budget-tracker-dun-six.vercel.app

```bash
npx vercel        # first deploy
npx vercel --prod # production
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deploys on every push.

---

## Testing

This project includes unit tests written with **Jest** and **React Testing Library**.

- Component testing for UI behavior
- Hook testing for business logic (`useTransactions`)
- Validation and form behavior coverage
- Utility function tests (formatting, date helpers)

Run tests:

```bash
npm run test
```

---

## Architecture Decisions

### Why CSS Modules over Tailwind?

CSS Modules keep styles scoped to each component and make the codebase easier to read without class name clutter. No build-time compiler needed.

### Why localStorage over a database?

This is a personal finance tool — single user, no auth needed. localStorage gives instant persistence with zero backend complexity.

### Why `ClientOnly` wrapper?

Next.js renders components on the server first. Since `localStorage` doesn't exist on the server, reading it causes a hydration mismatch. `ClientOnly` renders a placeholder on the server and the real content after mount on the client.

### Why one hook for everything?

`useTransactions` owns all transaction logic: add, edit, delete, filter, balance calculation, and storage sync. Components receive data via props and call callbacks — they contain zero business logic. This makes testing and refactoring trivial.

---

## Docs

| Document                                       | Description                                               |
| ---------------------------------------------- | --------------------------------------------------------- |
| [`docs/prd.md`](docs/prd.md)                   | Product Requirements — features, user stories, data model |
| [`docs/architecture.md`](docs/architecture.md) | Technical architecture — layers, data flow, edge cases    |

---

## 👩‍💻 Author

Built by **YuliiaSkabytska** as a BMAD methodology learning project.

```

```
