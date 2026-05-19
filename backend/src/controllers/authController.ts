import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/authService";

/**
 * Helper function to safely extract error messages
 */
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function register(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const user = await registerUser(email, name, password);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: unknown) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Missing email or password" });
      return;
    }

    const result = await loginUser(email, password);

    res.status(200).json({
      token: result.token,
      user: result.user,
    });
  } catch (error: unknown) {
    res.status(401).json({ error: getErrorMessage(error) });
  }
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await getCurrentUser(req.userId);

    res.status(200).json({ user });
  } catch (error: unknown) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
}
