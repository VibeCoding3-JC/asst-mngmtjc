import express from "express";
import { 
    getUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser,
    getUserAssets 
} from "../controllers/UserController.js";
import { verifyToken, checkRole } from "../middleware/AuthMiddleware.js";
import { validateRequest } from "../middleware/ValidationMiddleware.js";
import { userSchema, updateUserSchema } from "../utils/Validators.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all users (admin/staff)
router.get("/", checkRole(["admin", "staff"]), getUsers);

// Get user by ID
router.get("/:id", checkRole(["admin", "staff"]), getUserById);

// Get user's assets
router.get("/:id/assets", checkRole(["admin", "staff"]), getUserAssets);

// Create user (admin only)
router.post("/", checkRole(["admin"]), validateRequest(userSchema), createUser);

// Update user (admin only)
router.put("/:id", checkRole(["admin"]), validateRequest(updateUserSchema), updateUser);

// Delete/deactivate user (admin only)
router.delete("/:id", checkRole(["admin"]), deleteUser);

export default router;
