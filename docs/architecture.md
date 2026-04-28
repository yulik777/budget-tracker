# Architecture Document

## Budget Tracker — BMAD Method v6

**Status:** Draft  
**Created:** 2026-04-22  
**Agent:** Architect Agent (BMAD)  
**Based on:** docs/prd.md

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    app/page.tsx                      │
│              (composition only, no logic)            │
└──────────┬──────────────────────────┬───────────────┘
           │                          │
    ┌──────▼──────┐            ┌──────▼──────┐
    │    hooks/   │            │ components/ │
    │  (logic)    │            │   (UI only) │
    └──────┬──────┘            └──────┬──────┘
           │                          │
    ┌──────▼──────┐            ┌──────▼──────┐
    │    lib/     │            │  globals.css │
    │ types/utils │            │ CSS variables│
    └─────────────┘            └─────────────┘
           │
    ┌──────▼──────┐
    │ localStorage│
    │  (browser)  │
    └─────────────┘
```

**Rule:** Data flows down. Logic stays in hooks. Components are dumb.

---

## 2. Layer Responsibilities

### Layer 1 — lib/ (pure functions, no React)

- `types.ts` — all TypeScript interfaces and constants
- `utils.ts` — formatCurrency, formatDate, exportToCSV

### Layer 2 — hooks/ (logic, no JSX)

- `useTransactions.ts` — CRUD + balance + localStorage sync
- `useFilters.ts` — filter state + derived filtered list
- `useTheme.ts` — dark/light toggle + localStorage sync

### Layer 3 — components/ (UI, no business logic)

- Receive data via props
- Call callbacks from props (onAdd, onDelete, onChange)
- No direct localStorage access
- No direct state management beyond local UI state (open/closed, hover)

### Layer 4 — app/page.tsx (composition)

- Imports hooks
- Passes data and callbacks to components
- Zero business logic
- Zero inline styles with logic

---

## 3. Component Tree

```
page.tsx
├── <Header>
│   └── <ThemeToggle />
├── <BalanceCards balance={balance} />
├── <Tabs>
│   ├── [transactions tab]
│   │   ├── <Filters filters={filters} onChange={setFilter} />
│   │   └── <TransactionList
│   │           transactions={filtered}
│   │           onDelete={deleteTransaction} />
│   └── [analytics tab]
│       └── <CategoryChart transactions={transactions} />
└── <AddTransactionForm
        open={showForm}
        onAdd={addTransaction}
        onClose={closeForm} />
```

---

## 4. Data Flow

```
User clicks "+ Add"
  → showForm = true
  → <AddTransactionForm> renders

User fills form + submits
  → onAdd(tx) called
  → addTransaction(tx) in useTransactions
  → setTransactions([newTx, ...prev])
  → useEffect fires → localStorage.setItem(...)
  → balance recalculates via useMemo
  → UI re-renders with new data
```

```
User opens app next day
  → useState initializer reads localStorage.getItem(...)
  → transactions restored from storage
  → balance calculated immediately
  → UI shows saved data
```

---

## 5. File Structure (final)

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── types.ts
│   └── utils.ts
├── hooks/
│   ├── useTransactions.ts
│   ├── useFilters.ts
│   └── useTheme.ts
└── components/
    ├── Header.tsx
    ├── BalanceCards.tsx
    ├── Filters.tsx
    ├── TransactionList.tsx
    ├── TransactionItem.tsx
    ├── AddTransactionForm.tsx
    ├── CategoryChart.tsx
    └── ThemeToggle.tsx
```

---

## 6. Key Technical Decisions

| Decision         | Choice                      | Reason                                  |
| ---------------- | --------------------------- | --------------------------------------- |
| State management | React hooks only            | No need for Redux/Zustand at this scale |
| Persistence      | localStorage                | No backend needed for MVP               |
| Styling          | CSS Modules + CSS variables | Scoped styles, easy dark mode           |
| Charts           | recharts                    | Simpler API than Chart.js for React     |
| Routing          | Single page (no routing)    | App is one screen                       |
| SSR              | Client components only      | localStorage is browser-only            |

---

## 7. CSS Architecture

```css
/* globals.css — CSS variables for theming */
:root {
  --bg-primary: #080818;
  --bg-secondary: #0f0f28;
  --bg-card: #12122a;
  --text-primary: #ffffff;
  --text-muted: #555555;
  --accent-purple: #a78bfa;
  --accent-blue: #60a5fa;
  --income: #4ade80;
  --expense: #f87171;
  --border: #1a1a3a;
  --font-display: "Playfair Display", serif;
  --font-body: "DM Sans", sans-serif;
}

[data-theme="light"] {
  --bg-primary: #f8f8ff;
  --bg-secondary: #ffffff;
  --bg-card: #f0f0fa;
  --text-primary: #0a0a1e;
  --text-muted: #888888;
  --border: #e0e0f0;
}
```

---

## 8. TypeScript Interfaces

```typescript
// lib/types.ts

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
}

export interface Balance {
  income: number;
  expense: number;
  net: number;
}

export interface Filters {
  type: TransactionType | "all";
  category: string;
  month: number | "all";
}

export const CATEGORIES: Record<TransactionType, string[]> = {
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

export const STORAGE_KEY = "budget-tracker-v1";
export const THEME_KEY = "budget-tracker-theme";
```

---

## 9. Hook Contracts

```typescript
// useTransactions.ts
function useTransactions(): {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  balance: Balance;
};

// useFilters.ts
function useFilters(transactions: Transaction[]): {
  filters: Filters;
  setFilter: (key: keyof Filters, value: string | number) => void;
  filtered: Transaction[];
  resetFilters: () => void;
};

// useTheme.ts
function useTheme(): {
  theme: "dark" | "light";
  toggleTheme: () => void;
};
```

---

## 10. Edge Cases to Handle

| Case                                | Solution                              |
| ----------------------------------- | ------------------------------------- |
| localStorage empty on first load    | use SEED_DATA as fallback             |
| localStorage corrupted/invalid JSON | try/catch → fallback to SEED_DATA     |
| Amount = 0 or negative              | form validation, show inline error    |
| No category selected                | form validation, show inline error    |
| Empty filtered list                 | show EmptyState component             |
| SSR — localStorage not available    | `typeof window !== "undefined"` check |
| Delete wrong transaction            | confirmation step before delete       |

---

## 11. Performance Notes

- `balance` → `useMemo` (recalculates only when transactions change)
- `filtered` → `useMemo` (recalculates only when filters or transactions change)
- `addTransaction` → `useCallback` (stable reference)
- `deleteTransaction` → `useCallback` (stable reference)
- No unnecessary re-renders — components receive only the props they need

---

## Next Step

→ **Scrum Master Agent** — create story files in `docs/stories/`  
Each story = one unit of work for the Dev Agent.

Stories to create:

1. `story-01-types-and-utils.md`
2. `story-02-use-transactions-hook.md`
3. `story-03-use-filters-hook.md`
4. `story-04-balance-cards.md`
5. `story-05-add-transaction-form.md`
6. `story-06-transaction-list.md`
7. `story-07-filters-component.md`
8. `story-08-category-chart.md`
9. `story-09-theme-toggle.md`
10. `story-10-page-composition.md`
