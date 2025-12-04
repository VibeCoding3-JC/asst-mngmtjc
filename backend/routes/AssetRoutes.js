import express from "express";
import { 
    getAssets, 
    getAssetById, 
    createAsset, 
    updateAsset, 
    deleteAsset,
    getAssetHistory,
    getAssetStats 
} from "../controllers/AssetController.js";
import { verifyToken, checkRole } from "../middleware/AuthMiddleware.js";
import { validateRequest } from "../middleware/ValidationMiddleware.js";
import { assetSchema, updateAssetSchema } from "../utils/Validators.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all assets
router.get("/", getAssets);

// Get asset statistics
router.get("/stats", checkRole(["admin", "staff"]), getAssetStats);

// Get asset by ID
router.get("/:id", getAssetById);

// Get asset history
router.get("/:id/history", getAssetHistory);

// Create asset (admin/staff)
router.post("/", checkRole(["admin", "staff"]), validateRequest(assetSchema), createAsset);

// Update asset (admin/staff)
router.put("/:id", checkRole(["admin", "staff"]), validateRequest(updateAssetSchema), updateAsset);

// Delete asset (admin only)
router.delete("/:id", checkRole(["admin"]), deleteAsset);

export default router;
