import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";

interface UpdateTransactionData {
  amount?: number;
  type?: string;
  category?: string;
  description?: string;
  date?: Date;
}

export async function list(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const transactions = await getTransactions(req.userId);
    res.status(200).json({ transactions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ error: message });
  }
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { amount, type, category, description, date } = req.body;

    if (!amount || !type || !category || !date) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const transaction = await createTransaction(req.userId, {
      amount: parseFloat(amount),
      type,
      category,
      description: description || "",
      date: new Date(date),
    });

    res.status(201).json({ transaction });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ error: message });
  }
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const { amount, type, category, description, date } = req.body;

    const updateData: UpdateTransactionData = {};

    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (type !== undefined) updateData.type = type;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;

    if (date !== undefined) {
      const dateString = Array.isArray(date) ? date[0] : date;
      updateData.date = new Date(dateString);
    }

    const transaction = await updateTransaction(req.userId, id, updateData);

    res.status(200).json({ transaction });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ error: message });
  }
}
export async function remove(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const transaction = await deleteTransaction(req.userId, id);

    res.status(200).json({ transaction });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ error: message });
  }
}
