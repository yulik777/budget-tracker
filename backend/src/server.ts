import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import { errorMiddleware } from "./middleware/auth";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/settings", settingsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling
app.use(errorMiddleware);

// Start server
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✓ Database connected");

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log("\nAvailable endpoints:");
      console.log("  POST   /auth/register");
      console.log("  POST   /auth/login");
      console.log("  GET    /auth/me");
      console.log("  GET    /transactions");
      console.log("  POST   /transactions");
      console.log("  PUT    /transactions/:id");
      console.log("  DELETE /transactions/:id");
      console.log("  GET    /settings");
      console.log("  PUT    /settings");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
