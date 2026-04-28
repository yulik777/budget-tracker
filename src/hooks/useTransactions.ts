"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Transaction } from "../lib/types";

const STORAGE_KEY = "budget-v1";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const saved = localStorage.getItem(STORAGE_KEY);

    setTransactions(saved ? JSON.parse(saved) : []);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions, hydrated]);

  const now = useMemo(() => new Date(), []);

  const [selectedMonth, setSelectedMonth] = useState(() => now.getMonth());
  const [selectedYear, setSelectedYear] = useState(() => now.getFullYear());

  const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...tx, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const editTransaction = useCallback(
    (id: string, data: Partial<Transaction>) => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
      );
    },
    [],
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const balance = useMemo(() => {
    let income = 0;
    let expense = 0;

    for (const t of filteredTransactions) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }

    return {
      income,
      expense,
      net: income - expense,
    };
  }, [filteredTransactions]);

  return {
    hydrated,
    transactions,
    filteredTransactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
    balance,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
  };
}
