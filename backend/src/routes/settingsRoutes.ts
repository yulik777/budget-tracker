import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, getSettings);
router.put("/", authMiddleware, updateSettings);

export default router;
