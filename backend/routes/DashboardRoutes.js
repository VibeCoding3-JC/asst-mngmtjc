import express from "express";
import { getDashboardStats, getQuickStats } from "../controllers/DashboardController.js";
import { verifyToken, checkRole } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get full dashboard stats
router.get("/", checkRole(["admin", "staff"]), getDashboardStats);

// Get quick stats (for header widgets)
router.get("/quick", checkRole(["admin", "staff"]), getQuickStats);

export default router;
