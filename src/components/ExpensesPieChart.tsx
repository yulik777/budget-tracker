"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import styles from "./ExpensesPieChart.module.css";
import { Transaction } from "../lib/types";

type Props = {
  transactions: Transaction[];
};

const COLORS = [
  "#7c3aed",
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
];

export default function ExpensesPieChart({ transactions }: Props) {
  const expenses = transactions.filter((t) => t.type === "expense");

  const grouped = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));

  if (data.length === 0) {
    return <div className={styles.empty}>No expense data yet</div>;
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Expense distribution</h3>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              innerRadius={55}
              paddingAngle={3}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#0f0f28",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
                borderRadius: 10,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        {data.map((item, i) => (
          <div key={item.name} className={styles.legendItem}>
            <span
              className={styles.dot}
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className={styles.legendLabel}>{item.name}</span>
            <span className={styles.legendValue}>${item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
