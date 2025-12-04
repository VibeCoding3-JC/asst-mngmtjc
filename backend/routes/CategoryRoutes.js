import express from "express";
import { 
    getCategories, 
    getAllCategories,
    getCategoryById, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from "../controllers/CategoryController.js";
import { verifyToken, checkRole } from "../middleware/AuthMiddleware.js";
import { validateRequest } from "../middleware/ValidationMiddleware.js";
import { categorySchema, updateCategorySchema } from "../utils/Validators.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all categories (paginated)
router.get("/", getCategories);

// Get all categories (for dropdowns)
router.get("/all", getAllCategories);

// Get category by ID
router.get("/:id", getCategoryById);

// Create category (admin only)
router.post("/", checkRole(["admin"]), validateRequest(categorySchema), createCategory);

// Update category (admin only)
router.put("/:id", checkRole(["admin"]), validateRequest(updateCategorySchema), updateCategory);

// Delete category (admin only)
router.delete("/:id", checkRole(["admin"]), deleteCategory);

export default router;
