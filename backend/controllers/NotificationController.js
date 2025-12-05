import { Notifications, Users, Assets, Transactions } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/ResponseFormatter.js";
import { Op } from "sequelize";

/**
 * Get all notifications for current user
 */
export const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, unread_only = false } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {
            user_id: req.userId
        };

        if (unread_only === "true") {
            whereClause.is_read = false;
        }

        const { count, rows: notifications } = await Notifications.findAndCountAll({
            where: whereClause,
            order: [["created_at", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset),
            attributes: [
                "uuid", "type", "title", "message", 
                "reference_type", "reference_uuid", 
                "is_read", "read_at", "created_at"
            ]
        });

        res.json(successResponse({
            notifications,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                total_pages: Math.ceil(count / limit)
            }
        }, "Notifikasi berhasil diambil"));

    } catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notifications.count({
            where: {
                user_id: req.userId,
                is_read: false
            }
        });

        res.json(successResponse({ unread_count: count }, "Jumlah notifikasi belum dibaca"));

    } catch (error) {
        console.error("Get unread count error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notifications.findOne({
            where: {
                uuid: req.params.uuid,
                user_id: req.userId
            }
        });

        if (!notification) {
            return res.status(404).json(
                errorResponse("Notifikasi tidak ditemukan", "NOT_FOUND")
            );
        }

        await notification.update({
            is_read: true,
            read_at: new Date()
        });

        res.json(successResponse(null, "Notifikasi ditandai sudah dibaca"));

    } catch (error) {
        console.error("Mark as read error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res) => {
    try {
        await Notifications.update(
            {
                is_read: true,
                read_at: new Date()
            },
            {
                where: {
                    user_id: req.userId,
                    is_read: false
                }
            }
        );

        res.json(successResponse(null, "Semua notifikasi ditandai sudah dibaca"));

    } catch (error) {
        console.error("Mark all as read error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notifications.findOne({
            where: {
                uuid: req.params.uuid,
                user_id: req.userId
            }
        });

        if (!notification) {
            return res.status(404).json(
                errorResponse("Notifikasi tidak ditemukan", "NOT_FOUND")
            );
        }

        await notification.destroy();

        res.json(successResponse(null, "Notifikasi berhasil dihapus"));

    } catch (error) {
        console.error("Delete notification error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Delete all read notifications
 */
export const deleteAllRead = async (req, res) => {
    try {
        const deleted = await Notifications.destroy({
            where: {
                user_id: req.userId,
                is_read: true
            }
        });

        res.json(successResponse(
            { deleted_count: deleted }, 
            `${deleted} notifikasi yang sudah dibaca berhasil dihapus`
        ));

    } catch (error) {
        console.error("Delete all read error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

// ========================================
// NOTIFICATION HELPER FUNCTIONS
// ========================================

/**
 * Create a notification
 * @param {Object} data - Notification data
 * @param {number} data.userId - Target user ID
 * @param {string} data.type - Notification type
 * @param {string} data.title - Notification title
 * @param {string} data.message - Notification message
 * @param {string} data.referenceType - Reference type (asset, transaction, etc)
 * @param {number} data.referenceId - Reference ID
 * @param {string} data.referenceUuid - Reference UUID
 */
export const createNotification = async (data) => {
    try {
        const notification = await Notifications.create({
            user_id: data.userId,
            type: data.type || "system",
            title: data.title,
            message: data.message,
            reference_type: data.referenceType || null,
            reference_id: data.referenceId || null,
            reference_uuid: data.referenceUuid || null
        });
        return notification;
    } catch (error) {
        console.error("Create notification error:", error);
        return null;
    }
};

/**
 * Send notification to multiple users
 * @param {Array<number>} userIds - Array of user IDs
 * @param {Object} notificationData - Notification data without userId
 */
export const sendNotificationToUsers = async (userIds, notificationData) => {
    try {
        const notifications = userIds.map(userId => ({
            user_id: userId,
            type: notificationData.type || "system",
            title: notificationData.title,
            message: notificationData.message,
            reference_type: notificationData.referenceType || null,
            reference_id: notificationData.referenceId || null,
            reference_uuid: notificationData.referenceUuid || null
        }));

        await Notifications.bulkCreate(notifications);
        return true;
    } catch (error) {
        console.error("Send notification to users error:", error);
        return false;
    }
};

/**
 * Send notification to all admins
 * @param {Object} notificationData - Notification data
 */
export const notifyAdmins = async (notificationData) => {
    try {
        const admins = await Users.findAll({
            where: { role: "admin", is_active: true },
            attributes: ["id"]
        });

        const adminIds = admins.map(admin => admin.id);
        if (adminIds.length > 0) {
            await sendNotificationToUsers(adminIds, notificationData);
        }
        return true;
    } catch (error) {
        console.error("Notify admins error:", error);
        return false;
    }
};

/**
 * Send notification to all staff and admins
 * @param {Object} notificationData - Notification data
 */
export const notifyStaffAndAdmins = async (notificationData) => {
    try {
        const users = await Users.findAll({
            where: { 
                role: { [Op.in]: ["admin", "staff"] }, 
                is_active: true 
            },
            attributes: ["id"]
        });

        const userIds = users.map(user => user.id);
        if (userIds.length > 0) {
            await sendNotificationToUsers(userIds, notificationData);
        }
        return true;
    } catch (error) {
        console.error("Notify staff and admins error:", error);
        return false;
    }
};
