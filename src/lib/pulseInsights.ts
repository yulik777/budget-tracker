import { Transaction } from "./types";

export interface DailyPulse {
  todayBalance: number;
  weeklyTrend: "up" | "down" | "stable";
  dailyRecommendation: string;
  daysTracked: number;
  thisMonthExpense: number;
  thisMonthIncome: number;
}

export function getWeeklyTrend(
  transactions: Transaction[],
): "up" | "down" | "stable" {
  if (transactions.length === 0) return "stable";

  const today = new Date();
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);

  const thisWeekExpenses = transactions
    .filter((t) => {
      const d = new Date(t.date);
      return d >= thisWeekStart && d <= today && t.type === "expense";
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const lastWeekExpenses = transactions
    .filter((t) => {
      const d = new Date(t.date);
      return d >= lastWeekStart && d < thisWeekStart && t.type === "expense";
    })
    .reduce((sum, t) => sum + t.amount, 0);

  if (lastWeekExpenses === 0) {
    return thisWeekExpenses === 0 ? "stable" : "up";
  }

  const percentChange =
    (thisWeekExpenses - lastWeekExpenses) / lastWeekExpenses;

  if (percentChange > 0.1) return "up";
  if (percentChange < -0.1) return "down";
  return "stable";
}

export function getDaysTracked(
  transactions: Transaction[],
  month: number,
  year: number,
): number {
  const uniqueDays = new Set<string>();

  transactions.forEach((t) => {
    const d = new Date(t.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      uniqueDays.add(d.toDateString());
    }
  });

  return uniqueDays.size;
}

export function getDailyRecommendation(
  transactions: Transaction[],
  thisMonthExpense: number,
  thisMonthIncome: number,
): string {
  if (transactions.length === 0) {
    return "Add your first expense to start tracking your daily pulse.";
  }

  if (thisMonthExpense === 0 && thisMonthIncome > 0) {
    return "Nice start - record one expense to keep your month balanced.";
  }

  if (thisMonthIncome === 0 && thisMonthExpense > 0) {
    return "Record income or categorize your spending to better understand your cash flow.";
  }

  if (thisMonthExpense > thisMonthIncome * 1.2) {
    return "Your expenses are higher than income this month. Consider trimming one category.";
  }

  const expensesByCategory: Record<string, number> = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      expensesByCategory[t.category] =
        (expensesByCategory[t.category] || 0) + t.amount;
    }
  });

  const topCategory = Object.entries(expensesByCategory).sort(
    ([, a], [, b]) => b - a,
  )[0];

  if (topCategory) {
    const [category, amount] = topCategory;
    const categoryPercent =
      thisMonthExpense > 0 ? Math.round((amount / thisMonthExpense) * 100) : 0;

    if (categoryPercent > 40) {
      return `${category} is ${categoryPercent}% of your spending - try a smaller adjustment there.`;
    }

    return `You're tracking well. Keep an eye on ${category} this month.`;
  }

  return "Track one more transaction today to make your pulse summary stronger.";
}

export function calculateDailyPulse(
  transactions: Transaction[],
  filteredTransactions: Transaction[],
  selectedMonth: number,
  selectedYear: number,
): DailyPulse {
  const thisMonthExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const todayBalance = thisMonthIncome - thisMonthExpense;
  const weeklyTrend = getWeeklyTrend(transactions);
  const dailyRecommendation = getDailyRecommendation(
    transactions,
    thisMonthExpense,
    thisMonthIncome,
  );
  const daysTracked = getDaysTracked(transactions, selectedMonth, selectedYear);

  return {
    todayBalance,
    weeklyTrend,
    dailyRecommendation,
    daysTracked,
    thisMonthExpense,
    thisMonthIncome,
  };
}
