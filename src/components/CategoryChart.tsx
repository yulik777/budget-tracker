import { Transaction } from "../lib/types";
import styles from "./CategoryChart.module.css";

type Props = {
  transactions: Transaction[];
  balance: { income: number; expense: number; net: number };
};

export default function CategoryChart({ transactions }: Props) {
  const expenses = transactions.filter((t) => t.type === "expense");

  const grouped = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const total = Object.values(grouped).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>Expenses by Category</h3>
        <span className={styles.subtitle}>Total: ${total.toFixed(2)}</span>
      </div>

      {sorted.length === 0 && (
        <div className={styles.empty}>No expense data for this period</div>
      )}

      <div className={styles.list}>
        {sorted.map(([cat, value]) => {
          const percent = total ? (value / total) * 100 : 0;
          return (
            <div key={cat} className={styles.item}>
              <div className={styles.topRow}>
                <span className={styles.category}>{cat}</span>
                <span className={styles.amount}>${value.toFixed(2)}</span>
              </div>
              <div className={styles.barBg}>
                <div
                  className={styles.barFill}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className={styles.percent}>{percent.toFixed(1)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
