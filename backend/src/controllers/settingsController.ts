import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  getUserSettings,
  updateUserSettings,
} from "../services/settingsService";

export async function getSettings(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const settings = await getUserSettings(req.userId);

    res.status(200).json({ settings });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateSettings(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { currency } = req.body;

    if (!currency) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const settings = await updateUserSettings(req.userId, { currency });

    res.status(200).json({ settings });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
