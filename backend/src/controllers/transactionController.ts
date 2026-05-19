import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";

export async function list(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const transactions = await getTransactions(req.userId);
    res.status(200).json({ transactions });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
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
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { id } = req.params;
    const { amount, type, category, description, date } = req.body;

    const updateData: any = {};
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (type !== undefined) updateData.type = type;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);

    const transaction = await updateTransaction(req.userId, id, updateData);

    res.status(200).json({ transaction });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { id } = req.params;

    const transaction = await deleteTransaction(req.userId, id);

    res.status(200).json({ transaction });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
