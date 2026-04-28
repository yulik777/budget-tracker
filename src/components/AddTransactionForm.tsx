"use client";

import { useState } from "react";

import styles from "./AddTransactionForm.module.css";
import { CATEGORIES, Transaction } from "../lib/types";
import { X } from "lucide-react";

type Props = {
  onAdd: (tx: Omit<Transaction, "id">) => void;
  onClose: () => void;
};

export default function AddTransactionForm({ onAdd, onClose }: Props) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>(
    {},
  );

  const validate = () => {
    const newErrors: typeof errors = {};
    const num = Number(amount);
    if (!amount || isNaN(num) || num <= 0)
      newErrors.amount = "Enter valid amount";
    if (!category) newErrors.category = "Select category";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onAdd({
      amount: Number(amount),
      type,
      category,
      description,
      date: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Add transaction</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.fieldWrapper}>
            <span className={styles.label}>Type</span>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as "income" | "expense");
                setCategory("");
              }}
              className={styles.input}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className={styles.fieldWrapper}>
            <span className={styles.label}>Amount</span>
            <input
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((p) => ({ ...p, amount: "" }));
              }}
              placeholder="0.00"
              className={`${styles.input} ${errors.amount ? styles.inputError : ""}`}
            />
            {errors.amount && (
              <span className={styles.error}>{errors.amount}</span>
            )}
          </div>

          <div className={styles.fieldWrapper}>
            <span className={styles.label}>Category</span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors((p) => ({ ...p, category: "" }));
              }}
              className={`${styles.input} ${errors.category ? styles.inputError : ""}`}
            >
              <option value="">Select category</option>
              {CATEGORIES[type].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className={styles.error}>{errors.category}</span>
            )}
          </div>

          <div className={styles.fieldWrapper}>
            <span className={styles.label}>Description</span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional note"
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={handleSubmit} className={styles.primaryBtn}>
            Add transaction
          </button>
          <button onClick={onClose} className={styles.secondaryBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
