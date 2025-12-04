import express from "express";
import { processQuery, getSuggestions, healthCheck } from "../controllers/ChatController.js";
import { verifyToken, checkRole } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Health check - public endpoint (no auth required)
router.get("/health", healthCheck);

// All routes below require authentication
router.use(verifyToken);

// Get query suggestions/examples
router.get("/suggestions", getSuggestions);

// Process natural language query (admin and staff only)
router.post("/query", checkRole(["admin", "staff"]), processQuery);

export default router;
