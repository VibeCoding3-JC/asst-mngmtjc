import express from "express";
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead
} from "../controllers/NotificationController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get notifications
router.get("/", getNotifications);

// Get unread count
router.get("/unread-count", getUnreadCount);

// Mark single notification as read
router.patch("/:uuid/read", markAsRead);

// Mark all as read
router.patch("/read-all", markAllAsRead);

// Delete single notification
router.delete("/:uuid", deleteNotification);

// Delete all read notifications
router.delete("/clear-read", deleteAllRead);

export default router;
