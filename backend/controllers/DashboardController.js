import { Op } from "sequelize";
import { Assets, Users, Transactions, Categories, Locations } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/ResponseFormatter.js";

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
    try {
        // Total counts
        const totalAssets = await Assets.count();
        const totalUsers = await Users.count({ where: { is_active: true } });
        const totalCategories = await Categories.count();
        const totalLocations = await Locations.count();

        // Assets by status
        const assetsByStatus = await Assets.findAll({
            attributes: [
                "status",
                [Assets.sequelize.fn("COUNT", Assets.sequelize.col("id")), "count"]
            ],
            group: ["status"],
            raw: true
        });

        // Format status counts
        const statusMap = {
            available: 0,
            in_use: 0,
            under_repair: 0,
            disposed: 0
        };
        assetsByStatus.forEach(item => {
            statusMap[item.status] = parseInt(item.count);
        });

        // Assets by category (top 5)
        const assetsByCategory = await Assets.findAll({
            attributes: [
                [Assets.sequelize.fn("COUNT", Assets.sequelize.col("Assets.id")), "count"]
            ],
            include: [{
                association: "category",
                attributes: ["uuid", "name"]
            }],
            group: ["category.id"],
            order: [[Assets.sequelize.fn("COUNT", Assets.sequelize.col("Assets.id")), "DESC"]],
            limit: 5,
            raw: true,
            nest: true
        });

        // Total asset value
        const totalValue = await Assets.sum("purchase_price") || 0;

        // Recent transactions (last 10)
        const recentTransactions = await Transactions.findAll({
            include: [
                { association: "asset", attributes: ["uuid", "asset_code", "name"] },
                { association: "employee", attributes: ["uuid", "name"] },
                { association: "admin", attributes: ["uuid", "name"] }
            ],
            order: [["transaction_date", "DESC"]],
            limit: 10
        });

        // Transaction summary (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const transactionSummary = await Transactions.findAll({
            attributes: [
                "action_type",
                [Transactions.sequelize.fn("COUNT", Transactions.sequelize.col("id")), "count"]
            ],
            where: {
                transaction_date: { [Op.gte]: thirtyDaysAgo }
            },
            group: ["action_type"],
            raw: true
        });

        // Recent checkout assets (in use) - using updated_at as proxy for activity
        const inUseAssets = await Assets.findAll({
            where: { status: "in_use" },
            include: [{
                association: "holder",
                attributes: ["uuid", "name", "email", "department"]
            }, {
                association: "category",
                attributes: ["uuid", "name"]
            }],
            order: [["updated_at", "DESC"]],
            limit: 5
        });

        // Monthly transaction trends (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrends = await Transactions.findAll({
            attributes: [
                [Transactions.sequelize.fn("YEAR", Transactions.sequelize.col("transaction_date")), "year"],
                [Transactions.sequelize.fn("MONTH", Transactions.sequelize.col("transaction_date")), "month"],
                [Transactions.sequelize.fn("COUNT", Transactions.sequelize.col("id")), "count"]
            ],
            where: {
                transaction_date: { [Op.gte]: sixMonthsAgo }
            },
            group: [
                Transactions.sequelize.fn("YEAR", Transactions.sequelize.col("transaction_date")),
                Transactions.sequelize.fn("MONTH", Transactions.sequelize.col("transaction_date"))
            ],
            order: [
                [Transactions.sequelize.fn("YEAR", Transactions.sequelize.col("transaction_date")), "ASC"],
                [Transactions.sequelize.fn("MONTH", Transactions.sequelize.col("transaction_date")), "ASC"]
            ],
            raw: true
        });

        // Warranty expiring soon (within 30 days)
        const today = new Date();
        const in30Days = new Date();
        in30Days.setDate(in30Days.getDate() + 30);

        const expiringWarranties = await Assets.findAll({
            where: {
                warranty_expiry: {
                    [Op.between]: [today, in30Days]
                },
                status: { [Op.ne]: "disposed" }
            },
            include: [
                { association: "category", attributes: ["uuid", "name"] }
            ],
            order: [["warranty_expiry", "ASC"]],
            limit: 5
        });

        res.json(successResponse({
            summary: {
                total_assets: totalAssets,
                total_users: totalUsers,
                total_categories: totalCategories,
                total_locations: totalLocations,
                total_value: totalValue
            },
            assets_by_status: statusMap,
            assets_by_category: assetsByCategory,
            recent_transactions: recentTransactions,
            transaction_summary: transactionSummary,
            in_use_assets: inUseAssets,
            monthly_trends: monthlyTrends,
            expiring_warranties: expiringWarranties
        }, "Dashboard data berhasil diambil"));

    } catch (error) {
        console.error("Get dashboard stats error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Get quick stats for header/widget
 */
export const getQuickStats = async (req, res) => {
    try {
        const totalAssets = await Assets.count();
        const availableAssets = await Assets.count({ where: { status: "available" } });
        const inUseAssets = await Assets.count({ where: { status: "in_use" } });
        const underRepair = await Assets.count({ where: { status: "under_repair" } });

        // Today's transactions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTransactions = await Transactions.count({
            where: {
                transaction_date: { [Op.gte]: today }
            }
        });

        res.json(successResponse({
            total_assets: totalAssets,
            available_assets: availableAssets,
            in_use_assets: inUseAssets,
            under_repair: underRepair,
            today_transactions: todayTransactions
        }, "Quick stats berhasil diambil"));

    } catch (error) {
        console.error("Get quick stats error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};
