import { Op } from "sequelize";
import { Transactions, Assets, Users, Locations } from "../models/index.js";
import { successResponse, errorResponse, paginationMeta } from "../utils/ResponseFormatter.js";

/**
 * Get all transactions with pagination and filters
 */
export const getTransactions = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            type = "",
            asset = "",
            startDate = "",
            endDate = ""
        } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = {};

        // Type filter
        if (type) {
            whereClause.action_type = type;
        }

        // Date range filter
        if (startDate || endDate) {
            whereClause.transaction_date = {};
            if (startDate) {
                whereClause.transaction_date[Op.gte] = new Date(startDate);
            }
            if (endDate) {
                whereClause.transaction_date[Op.lte] = new Date(endDate);
            }
        }

        const includeOptions = [
            { 
                association: "asset", 
                attributes: ["uuid", "asset_code", "name"],
                include: [
                    { association: "location", attributes: ["uuid", "name"] },
                    { association: "holder", attributes: ["uuid", "name", "department"] }
                ],
                ...(asset && { where: { uuid: asset } })
            },
            { association: "employee", attributes: ["uuid", "name", "department"] },
            { association: "admin", attributes: ["uuid", "name"] }
        ];

        const { count, rows } = await Transactions.findAndCountAll({
            where: whereClause,
            include: includeOptions,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["transaction_date", "DESC"]],
            distinct: true
        });

        res.json(
            successResponse(
                rows,
                "Data transaksi berhasil diambil",
                paginationMeta(page, limit, count)
            )
        );

    } catch (error) {
        console.error("Get transactions error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Get transaction by ID
 */
export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transactions.findOne({
            where: { uuid: req.params.id },
            include: [
                { 
                    association: "asset", 
                    attributes: ["uuid", "asset_code", "name", "status"],
                    include: [
                        { association: "location", attributes: ["uuid", "name"] }
                    ]
                },
                { association: "employee", attributes: ["uuid", "name", "email", "department"] },
                { association: "admin", attributes: ["uuid", "name", "email"] }
            ]
        });

        if (!transaction) {
            return res.status(404).json(
                errorResponse("Transaksi tidak ditemukan", "TRANSACTION_NOT_FOUND")
            );
        }

        res.json(successResponse(transaction, "Data transaksi berhasil diambil"));

    } catch (error) {
        console.error("Get transaction by id error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Checkout asset (assign to user)
 */
export const checkoutAsset = async (req, res) => {
    try {
        const { asset_uuid, user_uuid, expected_return_date, notes } = req.body;

        // Get asset
        const asset = await Assets.findOne({ 
            where: { uuid: asset_uuid },
            include: [{ association: "location" }]
        });
        if (!asset) {
            return res.status(404).json(
                errorResponse("Aset tidak ditemukan", "ASSET_NOT_FOUND")
            );
        }

        // Check asset availability
        if (asset.status !== "available") {
            return res.status(400).json(
                errorResponse(`Aset tidak tersedia (status: ${asset.status})`, "ASSET_NOT_AVAILABLE")
            );
        }

        // Get user
        const user = await Users.findOne({ where: { uuid: user_uuid } });
        if (!user) {
            return res.status(404).json(
                errorResponse("User tidak ditemukan", "USER_NOT_FOUND")
            );
        }

        // Create transaction
        const transaction = await Transactions.create({
            asset_id: asset.id,
            action_type: "checkout",
            user_id: user.id,
            transaction_date: new Date(),
            notes: expected_return_date ? `Expected return: ${expected_return_date}. ${notes || ""}` : notes,
            admin_id: req.userId // From auth middleware
        });

        // Update asset status
        await Assets.update({
            status: "assigned",
            current_holder_id: user.id
        }, { where: { id: asset.id } });

        // Fetch complete transaction
        const newTransaction = await Transactions.findOne({
            where: { id: transaction.id },
            include: [
                { 
                    association: "asset", 
                    attributes: ["uuid", "asset_code", "name"],
                    include: [{ association: "location", attributes: ["uuid", "name"] }]
                },
                { association: "employee", attributes: ["uuid", "name", "department"] },
                { association: "admin", attributes: ["uuid", "name"] }
            ]
        });

        res.status(201).json(
            successResponse(newTransaction, "Aset berhasil dipinjamkan")
        );

    } catch (error) {
        console.error("Checkout asset error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Checkin asset (return from user)
 */
export const checkinAsset = async (req, res) => {
    try {
        const { asset_uuid, location_uuid, condition_notes, notes } = req.body;

        // Get asset
        const asset = await Assets.findOne({ 
            where: { uuid: asset_uuid },
            include: [{ association: "holder" }]
        });
        if (!asset) {
            return res.status(404).json(
                errorResponse("Aset tidak ditemukan", "ASSET_NOT_FOUND")
            );
        }

        // Check asset is in use
        if (asset.status !== "assigned") {
            return res.status(400).json(
                errorResponse("Aset tidak sedang dipinjam", "ASSET_NOT_IN_USE")
            );
        }

        // Get return location
        const location = await Locations.findOne({ where: { uuid: location_uuid } });
        if (!location) {
            return res.status(404).json(
                errorResponse("Lokasi tidak ditemukan", "LOCATION_NOT_FOUND")
            );
        }

        // Create transaction
        const transaction = await Transactions.create({
            asset_id: asset.id,
            action_type: "checkin",
            user_id: asset.current_holder_id,
            transaction_date: new Date(),
            notes: notes ? `${notes}. Kondisi: ${condition_notes || "Baik"}` : `Kondisi: ${condition_notes || "Baik"}`,
            admin_id: req.userId
        });

        // Update asset
        await Assets.update({
            status: "available",
            current_holder_id: null,
            location_id: location.id
        }, { where: { id: asset.id } });

        // Fetch complete transaction
        const newTransaction = await Transactions.findOne({
            where: { id: transaction.id },
            include: [
                { 
                    association: "asset", 
                    attributes: ["uuid", "asset_code", "name"],
                    include: [{ association: "location", attributes: ["uuid", "name"] }]
                },
                { association: "employee", attributes: ["uuid", "name", "department"] },
                { association: "admin", attributes: ["uuid", "name"] }
            ]
        });

        res.status(201).json(
            successResponse(newTransaction, "Aset berhasil dikembalikan")
        );

    } catch (error) {
        console.error("Checkin asset error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Transfer asset (move between locations)
 */
export const transferAsset = async (req, res) => {
    try {
        const { asset_uuid, to_location_uuid, notes } = req.body;

        // Get asset
        const asset = await Assets.findOne({ 
            where: { uuid: asset_uuid },
            include: [{ association: "location" }]
        });
        if (!asset) {
            return res.status(404).json(
                errorResponse("Aset tidak ditemukan", "ASSET_NOT_FOUND")
            );
        }

        // Check asset is available
        if (asset.status === "assigned") {
            return res.status(400).json(
                errorResponse("Aset sedang dipinjam, kembalikan terlebih dahulu", "ASSET_IN_USE")
            );
        }

        // Get destination location
        const toLocation = await Locations.findOne({ where: { uuid: to_location_uuid } });
        if (!toLocation) {
            return res.status(404).json(
                errorResponse("Lokasi tujuan tidak ditemukan", "LOCATION_NOT_FOUND")
            );
        }

        // Create transaction
        const transaction = await Transactions.create({
            asset_id: asset.id,
            action_type: "transfer",
            transaction_date: new Date(),
            notes: `Transfer from ${asset.location?.name || 'Unknown'} to ${toLocation.name}. ${notes || ""}`,
            admin_id: req.userId
        });

        // Update asset location
        await Assets.update({
            location_id: toLocation.id
        }, { where: { id: asset.id } });

        // Fetch complete transaction
        const newTransaction = await Transactions.findOne({
            where: { id: transaction.id },
            include: [
                { 
                    association: "asset", 
                    attributes: ["uuid", "asset_code", "name"],
                    include: [{ association: "location", attributes: ["uuid", "name"] }]
                },
                { association: "admin", attributes: ["uuid", "name"] }
            ]
        });

        res.status(201).json(
            successResponse(newTransaction, "Aset berhasil dipindahkan")
        );

    } catch (error) {
        console.error("Transfer asset error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Send asset for repair
 */
export const repairAsset = async (req, res) => {
    try {
        const { asset_uuid, repair_vendor, estimated_cost, estimated_return_date, notes } = req.body;

        // Get asset
        const asset = await Assets.findOne({ 
            where: { uuid: asset_uuid },
            include: [{ association: "location" }]
        });
        if (!asset) {
            return res.status(404).json(
                errorResponse("Aset tidak ditemukan", "ASSET_NOT_FOUND")
            );
        }

        // Check asset is not already under repair
        if (asset.status === "repair") {
            return res.status(400).json(
                errorResponse("Aset sudah dalam status perbaikan", "ASSET_UNDER_REPAIR")
            );
        }

        // If in use, return first
        if (asset.status === "assigned") {
            return res.status(400).json(
                errorResponse("Aset sedang dipinjam, kembalikan terlebih dahulu", "ASSET_IN_USE")
            );
        }

        // Create transaction
        const transaction = await Transactions.create({
            asset_id: asset.id,
            action_type: "repair",
            transaction_date: new Date(),
            notes: `Vendor: ${repair_vendor || "N/A"}. Estimasi biaya: ${estimated_cost || "N/A"}. Est. return: ${estimated_return_date || "N/A"}. ${notes || ""}`,
            admin_id: req.userId
        });

        // Update asset status
        await Assets.update({
            status: "repair"
        }, { where: { id: asset.id } });

        // Fetch complete transaction
        const newTransaction = await Transactions.findOne({
            where: { id: transaction.id },
            include: [
                { 
                    association: "asset", 
                    attributes: ["uuid", "asset_code", "name"],
                    include: [{ association: "location", attributes: ["uuid", "name"] }]
                },
                { association: "admin", attributes: ["uuid", "name"] }
            ]
        });

        res.status(201).json(
            successResponse(newTransaction, "Aset dikirim untuk perbaikan")
        );

    } catch (error) {
        console.error("Repair asset error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Complete repair and return asset
 */
export const completeRepair = async (req, res) => {
    try {
        const { asset_uuid, location_uuid, repair_cost, notes } = req.body;

        // Get asset
        const asset = await Assets.findOne({ where: { uuid: asset_uuid } });
        if (!asset) {
            return res.status(404).json(
                errorResponse("Aset tidak ditemukan", "ASSET_NOT_FOUND")
            );
        }

        // Check asset is under repair
        if (asset.status !== "repair") {
            return res.status(400).json(
                errorResponse("Aset tidak dalam status perbaikan", "ASSET_NOT_UNDER_REPAIR")
            );
        }

        // Get location
        const location = await Locations.findOne({ where: { uuid: location_uuid } });
        if (!location) {
            return res.status(404).json(
                errorResponse("Lokasi tidak ditemukan", "LOCATION_NOT_FOUND")
            );
        }

        // Create transaction
        const transaction = await Transactions.create({
            asset_id: asset.id,
            action_type: "repair_complete",
            transaction_date: new Date(),
            notes: `Biaya perbaikan: Rp ${repair_cost || 0}. ${notes || ""}`,
            admin_id: req.userId
        });

        // Update asset
        await Assets.update({
            status: "available",
            location_id: location.id
        }, { where: { id: asset.id } });

        // Fetch complete transaction
        const newTransaction = await Transactions.findOne({
            where: { id: transaction.id },
            include: [
                { 
                    association: "asset", 
                    attributes: ["uuid", "asset_code", "name"],
                    include: [{ association: "location", attributes: ["uuid", "name"] }]
                },
                { association: "admin", attributes: ["uuid", "name"] }
            ]
        });

        res.status(201).json(
            successResponse(newTransaction, "Perbaikan selesai, aset dikembalikan")
        );

    } catch (error) {
        console.error("Complete repair error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};

/**
 * Dispose asset
 */
export const disposeAsset = async (req, res) => {
    try {
        const { asset_uuid, disposal_reason, disposal_value, notes } = req.body;

        // Get asset
        const asset = await Assets.findOne({ 
            where: { uuid: asset_uuid },
            include: [{ association: "location" }]
        });
        if (!asset) {
            return res.status(404).json(
                errorResponse("Aset tidak ditemukan", "ASSET_NOT_FOUND")
            );
        }

        // Cannot dispose if in use
        if (asset.status === "assigned") {
            return res.status(400).json(
                errorResponse("Aset sedang dipinjam, kembalikan terlebih dahulu", "ASSET_IN_USE")
            );
        }

        // Create transaction
        const transaction = await Transactions.create({
            asset_id: asset.id,
            action_type: "dispose",
            transaction_date: new Date(),
            notes: `Alasan: ${disposal_reason || "N/A"}. Nilai disposal: Rp ${disposal_value || 0}. ${notes || ""}`,
            admin_id: req.userId
        });

        // Update asset status
        await Assets.update({
            status: "retired"
        }, { where: { id: asset.id } });

        // Fetch complete transaction
        const newTransaction = await Transactions.findOne({
            where: { id: transaction.id },
            include: [
                { 
                    association: "asset", 
                    attributes: ["uuid", "asset_code", "name"],
                    include: [{ association: "location", attributes: ["uuid", "name"] }]
                },
                { association: "admin", attributes: ["uuid", "name"] }
            ]
        });

        res.status(201).json(
            successResponse(newTransaction, "Aset berhasil di-dispose")
        );

    } catch (error) {
        console.error("Dispose asset error:", error);
        res.status(500).json(
            errorResponse("Terjadi kesalahan server", "SERVER_ERROR")
        );
    }
};
