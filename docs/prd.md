# Product Requirements Document (PRD)

## Budget Tracker — BMAD Method v6

**Status:** Draft  
**Created:** 2026-04-22  
**Agent:** PM Agent (BMAD)  
**Stack:** Next.js · TypeScript · React

---

## 1. Problem Statement

Users need a simple, fast way to track personal income and expenses, understand spending patterns, and maintain control over their finances — without complex banking apps or spreadsheets.

---

## 2. Goals

- Track every income and expense transaction
- Always know current balance at a glance
- Understand where money goes (by category)
- Data persists between sessions (localStorage)
- Works on both desktop and mobile

---

## 3. Users

**Primary user:** Individual person managing personal finances.  
No login required. Single-user app. Data stored locally in browser.

---

## 4. Features

### MVP (Must Have)

| #   | Feature            | Description                                                      |
| --- | ------------------ | ---------------------------------------------------------------- |
| 1   | Add Transaction    | Form: amount, type (income/expense), category, description, date |
| 2   | Delete Transaction | Remove with confirmation dialog                                  |
| 3   | Balance Display    | Show: Total Income / Total Expenses / Net Balance                |
| 4   | Transaction List   | Scrollable list, newest first                                    |
| 5   | Filters            | Filter by: type, category, month                                 |
| 6   | LocalStorage Sync  | Auto-save and load on every change                               |
| 7   | Form Validation    | Inline errors: amount > 0, category required                     |
| 8   | Empty State        | Friendly message when no transactions found                      |

### Phase 2 (Should Have)

| #   | Feature         | Description                                        |
| --- | --------------- | -------------------------------------------------- |
| 9   | Analytics Tab   | Bar charts: income vs expenses by category         |
| 10  | Savings Rate    | % of income saved, shown in analytics              |
| 11  | Monthly Summary | Average expense per transaction                    |
| 12  | Dark Mode       | Toggle dark/light theme, persisted in localStorage |

### Phase 3 (Nice to Have)

| #   | Feature           | Description                                 |
| --- | ----------------- | ------------------------------------------- |
| 13  | Export CSV        | Download all transactions as .csv file      |
| 14  | Currency Selector | USD / UAH / EUR                             |
| 15  | Budget Limits     | Set monthly limit per category, warn at 80% |

---

## 5. User Stories

```
As a user, I want to add a transaction
so that I can record my income or expense.

As a user, I want to see my current balance
so that I know how much money I have.

As a user, I want to filter transactions by month
so that I can review a specific period.

As a user, I want my data to persist
so that I don't lose it when I close the browser.

As a user, I want to see charts by category
so that I understand where my money goes.

As a user, I want to export my transactions
so that I can analyze them in Excel.

As a user, I want dark mode
so that the app is comfortable to use at night.
```

---

## 6. Technical Requirements

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** CSS-in-JS or CSS Modules (no Tailwind)
- **State:** React hooks only (no Redux/Zustand for MVP)
- **Persistence:** localStorage
- **Charts:** Chart.js or recharts
- **Fonts:** Google Fonts (Playfair Display + DM Sans)
- **Deployment:** Vercel

---

## 7. Data Model

```typescript
type TransactionType = "income" | "expense";

interface Transaction {
  id: string; // Date.now().toString()
  amount: number; // positive number
  type: TransactionType;
  category: string; // from predefined list
  description: string; // optional, free text
  date: string; // ISO format: "2026-04-22"
}

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investments", "Gift", "Other"],
  expense: [
    "Food",
    "Transport",
    "Housing",
    "Entertainment",
    "Health",
    "Clothing",
    "Other",
  ],
};
```

---

## 8. File Structure

```
budget-tracker/
├── src/
│   ├── app/
│   │   ├── layout.tsx        ← fonts, metadata
│   │   ├── page.tsx          ← composition only, no logic
│   │   └── globals.css       ← base styles, CSS variables
│   ├── lib/
│   │   ├── types.ts          ← Transaction type, CATEGORIES
│   │   └── utils.ts          ← formatCurrency, formatDate, exportCSV
│   ├── hooks/
│   │   ├── useTransactions.ts ← add, delete, balance, localStorage
│   │   └── useFilters.ts      ← filter state + filtered list
│   └── components/
│       ├── Balance.tsx              ← 3 stat cards
│       ├── AddTransactionForm.tsx   ← modal form + validation
│       ├── TransactionList.tsx      ← list + delete confirm
│       ├── Filters.tsx              ← type/category/month selects
│       ├── CategoryChart.tsx        ← analytics bars
│       └── ThemeToggle.tsx          ← dark/light switch
├── docs/
│   ├── prd.md               ← this file
│   ├── architecture.md      ← next: Architect Agent
│   └── stories/             ← next: Scrum Master Agent
└── _bmad/                   ← BMAD agents and workflows
```

---

## 9. Success Metrics

- User can add a transaction in under 10 seconds
- Balance updates instantly after every add/delete
- Data survives browser refresh (localStorage)
- App works on mobile (responsive)
- Build passes with zero TypeScript errors

---

## 10. Out of Scope (v1)

- User authentication / accounts
- Backend / database
- Multi-currency conversion
- Recurring transactions
- Bank account sync

---

## Next Step

→ **Architect Agent** — create `docs/architecture.md`  
Run: ask Claude to act as Architect Agent and review this PRD.
