import express from "express";
import { 
    getTransactions, 
    getTransactionById, 
    checkoutAsset, 
    checkinAsset, 
    transferAsset,
    repairAsset,
    completeRepair,
    disposeAsset 
} from "../controllers/TransactionController.js";
import { verifyToken, checkRole } from "../middleware/AuthMiddleware.js";
import { validateRequest } from "../middleware/ValidationMiddleware.js";
import { 
    checkoutSchema, 
    checkinSchema, 
    transferSchema,
    repairSchema,
    disposeSchema 
} from "../utils/Validators.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all transactions
router.get("/", checkRole(["admin", "staff"]), getTransactions);

// Get transaction by ID
router.get("/:id", checkRole(["admin", "staff"]), getTransactionById);

// Checkout asset (assign to user)
router.post("/checkout", checkRole(["admin", "staff"]), validateRequest(checkoutSchema), checkoutAsset);

// Checkin asset (return from user)
router.post("/checkin", checkRole(["admin", "staff"]), validateRequest(checkinSchema), checkinAsset);

// Transfer asset between locations
router.post("/transfer", checkRole(["admin", "staff"]), validateRequest(transferSchema), transferAsset);

// Send asset for repair
router.post("/repair", checkRole(["admin", "staff"]), validateRequest(repairSchema), repairAsset);

// Complete repair
router.post("/repair/complete", checkRole(["admin", "staff"]), completeRepair);

// Dispose asset (admin only)
router.post("/dispose", checkRole(["admin"]), validateRequest(disposeSchema), disposeAsset);

export default router;
