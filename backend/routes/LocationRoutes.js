import express from "express";
import { 
    getLocations, 
    getAllLocations,
    getLocationById, 
    createLocation, 
    updateLocation, 
    deleteLocation,
    getLocationAssets 
} from "../controllers/LocationController.js";
import { verifyToken, checkRole } from "../middleware/AuthMiddleware.js";
import { validateRequest } from "../middleware/ValidationMiddleware.js";
import { locationSchema, updateLocationSchema } from "../utils/Validators.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all locations (paginated)
router.get("/", getLocations);

// Get all locations (for dropdowns)
router.get("/all", getAllLocations);

// Get location by ID
router.get("/:id", getLocationById);

// Get assets in location
router.get("/:id/assets", getLocationAssets);

// Create location (admin only)
router.post("/", checkRole(["admin"]), validateRequest(locationSchema), createLocation);

// Update location (admin only)
router.put("/:id", checkRole(["admin"]), validateRequest(updateLocationSchema), updateLocation);

// Delete location (admin only)
router.delete("/:id", checkRole(["admin"]), deleteLocation);

export default router;
