import { Router } from "express";
import {
  list,
  create,
  update,
  remove,
} from "../controllers/transactionController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, list);
router.post("/", authMiddleware, create);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);

export default router;
