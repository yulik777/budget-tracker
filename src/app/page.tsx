"use client";

import { useState } from "react";

import styles from "./page.module.css";
import { useTransactions } from "@/hooks/useTransactions";
import TransactionList from "@/components/TransactionList";
import CategoryChart from "@/components/CategoryChart";
import ExpensesPieChart from "@/components/ExpensesPieChart";
import AddTransactionForm from "@/components/AddTransactionForm";
import { Plus } from "lucide-react";
import { formatMoney } from "@/lib/format";

export default function HomePage() {
  const {
    filteredTransactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
    balance,
    hydrated,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
  } = useTransactions();

  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"transactions" | "analytics">(
    "transactions",
  );

  if (!hydrated) {
    return (
      <main className={styles.main}>
        <div className={styles.skeletonHeader} />

        <div className={styles.balanceGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>

        <div className={styles.skeletonFilters} />

        <div className={styles.skeletonTabs}>
          <div className={styles.skeletonTab} />
          <div className={styles.skeletonTab} />
        </div>

        <div className={styles.skeletonList}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeletonItem} />
          ))}
        </div>
      </main>
    );
  }

  const balanceCards = [
    {
      label: "Balance",
      value: balance.net,
      color: balance.net >= 0 ? "#3e8ad6" : "#f87171",
    },
    { label: "Income", value: balance.income, color: "#4ade9e" },
    { label: "Expenses", value: balance.expense, color: "#f87171" },
  ];

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.appTitle}>Budget Tracker</h1>
            <p className={styles.appSubtitle}>BMAD · Next.js · TypeScript</p>
          </div>
          <button className={styles.addBtn} onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Add transaction
          </button>
        </div>
      </header>

      <div className={styles.balanceGrid}>
        {balanceCards.map(({ label, value, color }) => (
          <div
            key={label}
            className={styles.card}
            style={{ border: `1px solid ${color}33` }}
          >
            <div className={styles.cardLabel}>{label}</div>
            <div className={styles.cardValue} style={{ color }}>
              {hydrated ? formatMoney(value) : "—"}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.filtersRow}>
        <select
          className={styles.select}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("en", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tabsWrapper}>
        <div className={styles.tabList}>
          {(["transactions", "analytics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.tabPanel}>
          {activeTab === "transactions" && (
            <TransactionList
              transactions={filteredTransactions}
              onDelete={deleteTransaction}
              onEdit={editTransaction}
            />
          )}
          {activeTab === "analytics" && (
            <div className={styles.analyticsPanel}>
              <CategoryChart
                transactions={filteredTransactions}
                balance={balance}
              />
              <ExpensesPieChart transactions={filteredTransactions} />
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <AddTransactionForm
          onAdd={addTransaction}
          onClose={() => setShowForm(false)}
        />
      )}
    </main>
  );
}
