"use client";

import { useState } from "react";

import styles from "./TransactionList.module.css";
import { Transaction } from "../lib/types";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { formatMoney } from "@/lib/format";

type Props = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (id: string, updated: Partial<Transaction>) => void;
};

export default function TransactionList({
  transactions,
  onDelete,
  onEdit,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Transaction>>({});

  const startEdit = (t: Transaction) => {
    setEditingId(t.id);
    setEditData(t);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };
  const saveEdit = (id: string) => {
    if (!editData.amount || !editData.category) return;
    onEdit(id, editData);
    cancelEdit();
  };

  if (transactions.length === 0) {
    return <p className={styles.empty}>No transactions for this period</p>;
  }

  return (
    <div className={styles.wrapper}>
      {transactions.map((t) => {
        const isEditing = editingId === t.id;

        return (
          <div key={t.id} className={styles.item}>
            <div className={styles.left}>
              {isEditing ? (
                <>
                  <input
                    value={editData.description || ""}
                    onChange={(e) =>
                      setEditData((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    className={styles.input}
                    placeholder="Description"
                  />
                  <input
                    value={editData.amount || ""}
                    onChange={(e) =>
                      setEditData((p) => ({
                        ...p,
                        amount: Number(e.target.value),
                      }))
                    }
                    className={styles.input}
                    placeholder="Amount"
                    type="number"
                  />
                  <input
                    value={editData.category || ""}
                    onChange={(e) =>
                      setEditData((p) => ({ ...p, category: e.target.value }))
                    }
                    className={styles.input}
                    placeholder="Category"
                  />
                </>
              ) : (
                <>
                  <div className={styles.title}>
                    {t.description || t.category}
                  </div>
                  <div className={styles.meta}>
                    <span className={styles.badge}>{t.category}</span>
                    <span className={styles.dot}>•</span>
                    <span className={styles.type}>{t.type}</span>
                  </div>
                </>
              )}
            </div>

            <div className={styles.right}>
              <span
                className={
                  t.type === "income"
                    ? styles.amountIncome
                    : styles.amountExpense
                }
              >
                {t.type === "income" ? "+" : "−"}
                {formatMoney(t.amount)}
              </span>

              {isEditing ? (
                <>
                  <div className={styles.tooltipWrapper}>
                    <button
                      className={styles.saveBtn}
                      onClick={() => saveEdit(t.id)}
                    >
                      <Check size={16} />
                    </button>
                    <span className={styles.tooltip}>Save</span>
                  </div>
                  <div className={styles.tooltipWrapper}>
                    <button className={styles.cancelBtn} onClick={cancelEdit}>
                      <X size={16} />
                    </button>
                    <span className={styles.tooltip}>Cancel</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.tooltipWrapper}>
                    <button
                      onClick={() => startEdit(t)}
                      className={styles.editBtn}
                    >
                      <Pencil size={16} />
                    </button>
                    <span className={styles.tooltip}>Edit</span>
                  </div>
                  <div className={styles.tooltipWrapper}>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => onDelete(t.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                    <span className={styles.tooltip}>Delete</span>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
