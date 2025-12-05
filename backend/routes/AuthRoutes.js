import express from "express";
import {
    register,
    login,
    logout,
    refreshToken,
    getMe,
    updateProfile,
    changePassword
} from "../controllers/AuthController.js";
import { verifyToken, checkRole } from "../middleware/AuthMiddleware.js";
import { validateBody } from "../middleware/ValidationMiddleware.js";
import { userSchemas } from "../utils/Validators.js";

const router = express.Router();

// Public routes
router.post("/login", validateBody(userSchemas.login), login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

// Protected routes
router.get("/me", verifyToken, getMe);
router.put("/profile", verifyToken, updateProfile);
router.put("/change-password", verifyToken, changePassword);

// Admin only routes
router.post("/register", verifyToken, checkRole("admin"), validateBody(userSchemas.register), register);

export default router;
